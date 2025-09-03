// src/pages/api/contact.ts
export const prerender = false; // requiere runtime

import { z } from "zod";
import nodemailer from "nodemailer";
import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";

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
  .catch((e) => console.error("[SMTP] Error al verificar transporte:", e));

// ====== Schema de validación ======
const FormSchema = z.object({
  nombre: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(7, "Teléfono inválido"),
  empresa: z.string().min(2, "Empresa requerida"),
  tamano: z.string().min(1, "Selecciona un tamaño"),
  mensaje: z.string().optional().default(""),
  website: z.string().optional().default(""), // honeypot
  marketing: z.string().optional(),           // "yes" si marcado
  consent: z.union([z.literal("on"), z.literal("yes"), z.literal("true")]),
  lang: z.enum(["es", "eu"]).optional(),
  source: z.string().optional(),
});

// ====== Persistencia (JSONL) ======
async function saveLead(record: unknown) {
  try {
    await mkdir(dataDir, { recursive: true });
    const line = JSON.stringify({ ...record, ts: new Date().toISOString() }) + "\n";
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

    // Guarda el lead ANTES del mail (no perdemos nada si el SMTP falla)
    await saveLead({
      status: "received",
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

    // Componer email
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

    // Enviar email
    try {
      await transporter.sendMail({
        from: smtpFrom,
        to: smtpTo,
        replyTo: data.email,
        subject,
        text,
        html,
      });

      await saveLead({
        status: "sent",
        email_to: smtpTo,
        nombre: data.nombre,
        email: data.email,
        empresa: data.empresa,
        lang,
      });

      return json({ ok: true });
    } catch (mailErr) {
      console.error("[contact] mailer error:", mailErr);
      await saveLead({
        status: "mailer_error",
        error: String(mailErr),
        nombre: data.nombre,
        email: data.email,
        empresa: data.empresa,
        lang,
      });
      return json({ ok: false, error: "Mailer error" }, 500);
    }
  } catch (err) {
    console.error("[contact] fatal:", err);
    return json({ ok: false, error: "Server error" }, 500);
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
