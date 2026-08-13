// src/pages/api/contact.ts
export const prerender = false; // requiere runtime

import { z } from "zod";
import nodemailer from "nodemailer";
import { mkdir, appendFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { SERVICIO_VALUES, PRESUPUESTO_VALUES, SERVICIO_LABELS_ES, PRESUPUESTO_LABELS_ES } from "../../lib/leadOptions";
import { getLeadStore } from "../../lib/leadStore";
import type { LeadRecord, ScoreResult } from "../../lib/leadStore";
import { scrapeWebsite, scoreLeadWithGemini } from "../../lib/leadScoring";
import type { ScrapedSite } from "../../lib/leadScoring";

// ====== ENV (runtime) ======
const smtpHost   = process.env.SMTP_HOST ?? "";
const smtpPort   = Number(process.env.SMTP_PORT ?? "587");
const smtpSecure = (process.env.SMTP_SECURE ?? "false") === "true"; // true: 465
const smtpUser   = process.env.SMTP_USER;
const smtpPass   = process.env.SMTP_PASS;
const smtpFrom   = process.env.SMTP_FROM ?? "";
const smtpTo     = process.env.SMTP_TO ?? "";

const dataDir    = process.env.DATA_DIR || "./data";
const leadsFile  = process.env.LEADS_FILE || "leads.jsonl";
const leadsPath  = path.join(dataDir, leadsFile);

const leadStore = getLeadStore();

// Diagnóstico en logs (sin credenciales)
console.log(
  `[SMTP cfg] host=${smtpHost || "(vacío)"} port=${smtpPort} secure=${smtpSecure} auth=${smtpUser && smtpPass ? "sí" : "no"}`
);

// Falla rápido si falta lo básico
if (!smtpHost || !smtpFrom || !smtpTo) {
  console.error("[SMTP] Config incompleta. Requiere SMTP_HOST, SMTP_FROM y SMTP_TO en el entorno.");
}

// ====== Transport SMTP ======
const transporter = nodemailer.createTransport({
  host: smtpHost || undefined,           // si vacío, evita caer en localhost
  port: smtpPort,
  secure: smtpSecure,                    // 465: true; 587: false (STARTTLS)
  auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
  // tls: { rejectUnauthorized: false }, // descomenta SOLO si tu MTA usa cert autofirmado
});

// Verificación opcional (no bloquea)
transporter.verify()
  .then(() => console.log("[SMTP] OK"))
  .catch((e: unknown) => console.error("[SMTP] Error al verificar transporte:", e));

// ====== Schema de validación ======
const FormSchema = z.object({
  nombre: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(7, "Teléfono inválido"),
  empresa: z.string().min(2, "Empresa requerida"),
  sitioWeb: z.string().optional().default(""), // opcional; se acepta laxo, scrapeWebsite valida/normaliza de verdad
  servicio: z.enum(SERVICIO_VALUES),
  presupuesto: z.enum(PRESUPUESTO_VALUES),
  tamano: z.string().optional().default(""), // nº de trabajadores, opcional
  mensaje: z.string().optional().default(""),
  website: z.string().optional().default(""), // honeypot (no confundir con sitioWeb)
  marketing: z.string().optional(),           // "yes" si marcado
  consent: z.union([z.literal("on"), z.literal("yes"), z.literal("true")]),
  lang: z.enum(["es", "eu"]).optional(),
  source: z.string().optional(),
});

// ====== Persistencia (JSONL) ======
async function saveLead(record: unknown) {
  try {
    await mkdir(dataDir, { recursive: true });
    const line = JSON.stringify({ ...(record as object), ts: new Date().toISOString() }) + "\n";
    await appendFile(leadsPath, line, "utf8");
  } catch (e) {
    console.error("[leads] persist error:", e);
  }
}

// ====== Handlers ======
export async function GET() {
  return json({ ok: true, method: "GET", hint: "El endpoint está vivo ✅" });
}

export async function POST({ request }: { request: Request }) {
  try {
    const form = await request.formData();
    const raw = Object.fromEntries(form.entries());

    // Honeypot
    if (typeof raw.website === "string" && raw.website.trim() !== "") {
      return json({ ok: true, spam: true });
    }

    const parsed = FormSchema.safeParse(raw);
    if (!parsed.success) {
      return json({ ok: false, errors: parsed.error.flatten() }, 400);
    }
    const data = parsed.data;

    const ua   = request.headers.get("user-agent") || "";
    const ref  = request.headers.get("referer") || "";
    const lang = data.lang || "es";
    const source = data.source || ref || "";
    const leadId = randomUUID();

    const leadRecord: LeadRecord = {
      leadId,
      nombre: data.nombre,
      empresa: data.empresa,
      email: data.email,
      telefono: data.telefono,
      sitioWeb: data.sitioWeb || "",
      servicio: data.servicio,
      presupuesto: data.presupuesto,
      tamano: data.tamano || "",
      mensaje: data.mensaje || "",
      lang,
      source,
      marketing: !!data.marketing,
    };

    // 1) Guarda el lead ANTES de cualquier llamada externa (no perdemos nada si algo falla).
    await saveLead({ status: "received", ...leadRecord, consent: true, ua });

    // 2) Crea el registro en Airtable (rápido, se espera antes de responder para
    //    tener el id externo y poder correlacionar la actualización del score).
    let airtableId: string | null = null;
    try {
      airtableId = await leadStore.createLead(leadRecord);
    } catch (e) {
      console.error("[airtable] create error:", e);
      await saveLead({ status: "airtable_create_error", leadId, error: String(e) });
    }

    // 3) Scoring (scraping + Gemini) en segundo plano: no bloquea la respuesta.
    //    adapter Node standalone = proceso de larga duración, la promesa sigue
    //    ejecutándose tras el `return` de más abajo. Siempre con .catch() para
    //    no dejar un unhandledRejection suelto.
    scoreLeadInBackground({ leadId, leadRecord, airtableId }).catch((e) =>
      console.error("[scoring] uncaught:", e)
    );

    // 4) Email interno: también best-effort en segundo plano. La respuesta al
    //    prospecto ya no depende de que el SMTP funcione (ver leads.jsonl para
    //    el estado real: sent / mailer_error).
    sendLeadEmail({ leadId, data: leadRecord }).catch((e) => console.error("[email] uncaught:", e));

    return json({ ok: true, leadId });
  } catch (err) {
    console.error("[contact] fatal:", err);
    return json({ ok: false, error: "Server error" }, 500);
  }
}

// ====== Scoring en segundo plano ======
async function scoreLeadInBackground({
  leadId,
  leadRecord,
  airtableId,
}: {
  leadId: string;
  leadRecord: LeadRecord;
  airtableId: string | null;
}) {
  let scraped: ScrapedSite | null = null;
  if (leadRecord.sitioWeb) {
    scraped = await scrapeWebsite(leadRecord.sitioWeb);
  }

  const score: ScoreResult = await scoreLeadWithGemini(leadRecord, scraped);

  await saveLead({ status: "scored", leadId, ...score });

  if (airtableId) {
    try {
      await leadStore.updateLeadScore(airtableId, score);
    } catch (e) {
      console.error("[airtable] update error:", e);
      await saveLead({ status: "airtable_update_error", leadId, error: String(e) });
    }
  }
}

// ====== Email interno (best-effort, en segundo plano) ======
async function sendLeadEmail({ leadId, data }: { leadId: string; data: LeadRecord }) {
  const servicioLabel = SERVICIO_LABELS_ES[data.servicio as keyof typeof SERVICIO_LABELS_ES] || data.servicio;
  const presupuestoLabel =
    PRESUPUESTO_LABELS_ES[data.presupuesto as keyof typeof PRESUPUESTO_LABELS_ES] || data.presupuesto;

  const subject =
    data.lang === "eu"
      ? `Kontaktua: ${data.nombre} · ${data.empresa}`
      : `Nuevo contacto: ${data.nombre} · ${data.empresa}`;

  const text = `
Nombre:      ${data.nombre}
Email:       ${data.email}
Teléfono:    ${data.telefono}
Empresa:     ${data.empresa}
Sitio web:   ${data.sitioWeb || "-"}
Servicio:    ${servicioLabel}
Presupuesto: ${presupuestoLabel}
Tamaño:      ${data.tamano || "no indicado"}
Marketing:   ${data.marketing ? "sí" : "no"}
Idioma:      ${data.lang}
Origen:      ${data.source || "-"}
Lead ID:     ${leadId}

Mensaje:
${data.mensaje || "(sin mensaje)"}
`.trim();

  const html = `
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto;line-height:1.6;color:#111">
    <h2 style="margin:0 0 .5rem">${data.lang === "eu" ? "Kontaktu berria" : "Nuevo contacto"}</h2>
    <table style="border-collapse:collapse;width:100%;max-width:640px">
      <tbody>
        ${row("Nombre", escapeHtml(data.nombre))}
        ${row("Email", `<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`)}
        ${row("Teléfono", escapeHtml(data.telefono))}
        ${row("Empresa", escapeHtml(data.empresa))}
        ${row("Sitio web", data.sitioWeb ? `<a href="${escapeHtml(data.sitioWeb)}">${escapeHtml(data.sitioWeb)}</a>` : "-")}
        ${row("Servicio", escapeHtml(servicioLabel))}
        ${row("Presupuesto", escapeHtml(presupuestoLabel))}
        ${row("Tamaño", escapeHtml(data.tamano || "no indicado"))}
        ${row("Marketing", data.marketing ? "Sí" : "No")}
        ${row("Idioma", data.lang.toUpperCase())}
        ${row("Origen", escapeHtml(data.source || "-"))}
        ${row("Lead ID", escapeHtml(leadId))}
        ${row("Mensaje", escapeHtml(data.mensaje || "(sin mensaje)"))}
      </tbody>
    </table>
  </div>
`.trim();

  try {
    await transporter.sendMail({ from: smtpFrom, to: smtpTo, replyTo: data.email, subject, text, html });
    await saveLead({ status: "sent", leadId, email_to: smtpTo, nombre: data.nombre, email: data.email, empresa: data.empresa, lang: data.lang });
  } catch (mailErr) {
    console.error("[contact] mailer error:", mailErr);
    await saveLead({ status: "mailer_error", leadId, error: String(mailErr), nombre: data.nombre, email: data.email, empresa: data.empresa, lang: data.lang });
  }
}

// ====== Helpers ======
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
function row(label: string, val: string) {
  return `
  <tr>
    <td style="padding:.5rem .75rem;border-bottom:1px solid #e5e7eb;color:#374151;width:160px"><strong>${label}</strong></td>
    <td style="padding:.5rem .75rem;border-bottom:1px solid #e5e7eb;color:#111">${val}</td>
  </tr>`;
}
function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
