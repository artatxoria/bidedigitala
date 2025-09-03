// src/pages/api/contact.ts
export const prerender = false; // requiere runtime

import { z } from "zod";
import nodemailer from "nodemailer";
import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";

// ===== Entorno =====
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  SMTP_TO,
  DATA_DIR,
  LEADS_FILE,
} = process.env as Record<string, string | undefined>;

const LEADS_DIR = DATA_DIR || "./data";
const LEADS_PATH = path.join(LEADS_DIR, LEADS_FILE || "leads.jsonl");

// ===== Transport SMTP (STARTTLS en :587 con secure:false; TLS directo en :465 con secure:true) =====
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: (SMTP_SECURE ?? "false") === "true",
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  // Si tu cert es autosignado y falla el handshake, descomenta temporalmente:
  // tls: { rejectUnauthorized: false },
});

// Verificación opcional (útil en dev)
async function verifySmtp() {
  try {
    await transporter.verify();
    // console.log("[SMTP] OK");
  } catch (e) {
    console.error("[SMTP] Error al verificar transporte:", e);
  }
}
verifySmtp().catch(() => {});

// ===== Schema de validación =====
const FormSchema = z.object({
  nombre: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(7, "Teléfono inválido"),
  empresa: z.string().min(2, "Empresa requerida"),
  tamano: z.string().min(1, "Selecciona un tamaño"),
  mensaje: z.string().optional().default(""),
  // Anti-spam
  website: z.string().optional().default(""),
  // Flags
  marketing: z.string().optional(), // "yes" si marcado
  consent: z.union([z.literal("on"), z.literal("yes"), z.literal("true")]),
  // Metadatos
  lang: z.enum(["es", "eu"]).optional(),
  source: z.string().optional(),
});

// ===== Persistencia local (JSONL) =====
async function saveLead(record: unknown) {
  try {
    await mkdir(LEADS_DIR, { recursive: true });
    const line = JSON.stringify({ ...record, ts: new Date().toISOString() }) + "\n";
    await appendFile(LEADS_PATH, line, "utf8");
  } catch (e) {
    console.error("[leads] persist error:", e);
  }
}

// ===== Handlers =====
export async function GET() {
  return json({ ok: true, method: "GET", hint: "El endpoint está vivo ✅" });
}

export async function POST({ request }: { request: Request }) {
  try {
    const form = await request.formData();
    const raw = Object.fromEntries(form.entries());

    // Honeypot: si viene relleno, salimos silenciosamente
    if (typeof raw.website === "string" && raw.website.trim() !== "") {
      return json({ ok: true, spam: true });
    }

    const parsed = FormSchema.safeParse(raw);
    if (!parsed.success) {
      return json({ ok: false, errors: parsed.error.flatten() }, 400);
    }
    const data = parsed.data;

    const ua = request.headers.get("user-agent") || "";
    const ref = request.headers.get("referer") || "";
    const lang = data.lang || "es";

    // —— Email (asunto + texto + HTML) ——
    const subject =
      lang === "eu"
        ? `Kontaktua: ${data.nombre} · ${data.empresa}`
        : `Nuevo contacto: ${data.nombre} · ${data.empresa}`;

    const text = `
Nombre:   ${data.nombre}
Email:    ${data.email}
Teléfono: ${data.telefono}
Empresa:  ${data.empresa}
Tamaño:   ${data.tamano}
Marketing: ${data.marketing ? "sí" : "no"}
Idioma:   ${lang}
Origen:   ${data.source || ref || "-"}
UA:       ${ua}

Mensaje:
${data.mensaje || "(sin mensaje)"}
`.trim();

    const html = `
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto;line-height:1.6;color:#111">
    <h2 style="margin:0 0 .5rem">${lang === "eu" ? "Kontaktu berria" : "Nuevo contacto"}</h2>
    <table style="border-collapse:collapse;width:100%;max-width:640px">
      <tbody>
        ${row("Nombre", escapeHtml(data.nombre))}
        ${row("Email", `<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`)}
        ${row("Teléfono", escapeHtml(data.telefono))}
        ${row("Empresa", escapeHtml(data.empresa))}
        ${row("Tamaño", escapeHtml(data.tamano))}
        ${row("Marketing", data.marketing ? "Sí" : "No")}
        ${row("Idioma", lang.toUpperCase())}
        ${row("Origen", escapeHtml(data.source || ref || "-"))}
        ${row("User-Agent", escapeHtml(ua))}
        ${row("Mensaje", escapeHtml(data.mensaje || "(sin mensaje)"))}
      </tbody>
    </table>
  </div>
`.trim();

    // —— Enviar email ——
    await transporter.sendMail({
      from: SMTP_FROM,     // ej: "Bide Digitala <info@bidedigitala.eus>"
      to: SMTP_TO,         // ej: "juan@bidedigitala.eus"
      replyTo: data.email, // responder directo al usuario
      subject,
      text,
      html,
    });

    // —— Guardar lead en disco (JSONL) ——
    await saveLead({
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      empresa: data.empresa,
      tamano: data.tamano,
      mensaje: data.mensaje || "",
      marketing: !!data.marketing,
      consent: true,
      lang,
      source: data.source || ref || null,
      ua,
    });

    return json({ ok: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return json({ ok: false, error: "Mailer error" }, 500);
  }
}

// ===== Helpers =====
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
