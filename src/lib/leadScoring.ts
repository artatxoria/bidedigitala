// src/lib/leadScoring.ts
// Scraping ligero de la web del prospecto + scoring de leads vía Gemini.
// Ambas funciones están diseñadas para fallar de forma silenciosa y segura:
// un lead nunca debe perderse ni quedar bloqueado por un fallo de scraping
// o del proveedor de IA — ver scoreLeadInBackground() en contact.ts.

import * as cheerio from "cheerio";
import dns from "node:dns/promises";
import net from "node:net";
import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import type { LeadRecord, ScoreResult } from "./leadStore";
import { SERVICIO_LABELS_ES, PRESUPUESTO_LABELS_ES } from "./leadOptions";

// ====== Scraping ======

export interface ScrapedSite {
  title: string;
  description: string;
  text: string;
}

const SCRAPE_TIMEOUT_MS_DEFAULT = Number(process.env.SCRAPE_TIMEOUT_MS ?? "6000");
const SCRAPE_MAX_BYTES = 700_000; // ~700KB, de sobra para home + meta
const SCRAPE_MAX_TEXT_CHARS = 4000;
const SCRAPE_MAX_REDIRECTS = 3;
const SCRAPE_USER_AGENT = "BideDigitalaLeadBot/1.0 (+https://www.bidedigitala.eus)";

/** Rangos privados/loopback/link-local — protección SSRF básica (no cubre DNS rebinding). */
function isDisallowedIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 127 || a === 10 || a === 0) return true; // loopback, 10.0.0.0/8, "this network"
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 169 && b === 254) return true; // link-local
    return false;
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "::") return true; // loopback / unspecified
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // fc00::/7 (unique local)
    if (lower.startsWith("fe80")) return true; // link-local
    return false;
  }
  return true; // formato desconocido: bloquear por precaución
}

async function assertPublicIp(url: URL): Promise<void> {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Esquema no permitido: ${url.protocol}`);
  }
  const { address } = await dns.lookup(url.hostname);
  if (isDisallowedIp(address)) {
    throw new Error(`Host no permitido (rango privado/local): ${url.hostname} → ${address}`);
  }
}

/** fetch con validación SSRF en cada salto de redirección (fetch normal solo valida el primero). */
async function fetchWithSsrfGuard(startUrl: URL, signal: AbortSignal): Promise<Response> {
  let current = startUrl;
  for (let hop = 0; hop <= SCRAPE_MAX_REDIRECTS; hop++) {
    await assertPublicIp(current);
    const res = await fetch(current, {
      signal,
      redirect: "manual",
      headers: { "user-agent": SCRAPE_USER_AGENT },
    });
    const isRedirect = res.status >= 300 && res.status < 400;
    const location = res.headers.get("location");
    if (isRedirect && location) {
      current = new URL(location, current);
      continue;
    }
    return res;
  }
  throw new Error("Demasiadas redirecciones");
}

/**
 * Scrapea la home de `rawUrl`: título, meta description y texto visible
 * truncado. Nunca lanza — cualquier fallo (URL inválida, timeout, sitio
 * caído, contenido no-HTML, host privado) devuelve `null`.
 */
export async function scrapeWebsite(
  rawUrl: string,
  opts: { timeoutMs?: number } = {}
): Promise<ScrapedSite | null> {
  const timeoutMs = opts.timeoutMs ?? SCRAPE_TIMEOUT_MS_DEFAULT;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let startUrl: URL;
    try {
      // Los prospectos suelen escribir "miempresa.com" sin esquema; new URL()
      // lo rechaza tal cual, así que asumimos https:// si no viene indicado.
      const candidate = /^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : `https://${rawUrl.trim()}`;
      startUrl = new URL(candidate);
    } catch {
      throw new Error(`URL inválida: ${rawUrl}`);
    }

    const res = await fetchWithSsrfGuard(startUrl, controller.signal);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      throw new Error(`Content-Type no soportado: ${contentType || "(vacío)"}`);
    }

    const html = await readBodyCapped(res, SCRAPE_MAX_BYTES);

    const $ = cheerio.load(html);
    const title = $("title").first().text().trim().slice(0, 200);
    const description = (
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      ""
    )
      .trim()
      .slice(0, 300);
    $("script, style, noscript, svg").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim().slice(0, SCRAPE_MAX_TEXT_CHARS);

    return { title, description, text };
  } catch (e) {
    console.warn("[scrape] fallo, continúo sin datos de la web:", e instanceof Error ? e.message : e);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Lee el body como texto, cortando la descarga si supera `maxBytes`. */
async function readBodyCapped(res: Response, maxBytes: number): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return await res.text();
  const decoder = new TextDecoder();
  let received = 0;
  let out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    out += decoder.decode(value, { stream: true });
    if (received >= maxBytes) {
      await reader.cancel().catch(() => {});
      break;
    }
  }
  return out;
}

// ====== Scoring con Gemini ======

const geminiApiKey = process.env.GEMINI_API_KEY ?? "";
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const geminiTimeoutMs = Number(process.env.GEMINI_TIMEOUT_MS ?? "15000");

console.log(`[gemini cfg] modelo=${geminiModel} auth=${geminiApiKey ? "sí" : "no"}`);
if (!geminiApiKey) {
  console.error("[gemini] Config incompleta. Requiere GEMINI_API_KEY en el entorno.");
}

const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

const GeminiScoreSchema = z.object({
  score: z.number().int().min(1).max(100),
  priority: z.enum(["alta", "media", "baja"]),
  criteria: z.object({
    esNegocioB2B: z.boolean(),
    presupuestoAlto: z.boolean(),
    empresaGrande: z.boolean(),
    madurezDigital: z.enum(["alta", "media", "baja", "desconocida"]),
    coherenciaSolicitud: z.boolean(),
    calidadContacto: z.enum(["alta", "media", "baja"]),
  }),
  resumen: z.string(),
});

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: "Puntuación de 1 (peor) a 100 (mejor lead posible)" },
    priority: { type: Type.STRING, enum: ["alta", "media", "baja"] },
    criteria: {
      type: Type.OBJECT,
      properties: {
        esNegocioB2B: { type: Type.BOOLEAN },
        presupuestoAlto: { type: Type.BOOLEAN },
        empresaGrande: { type: Type.BOOLEAN },
        madurezDigital: { type: Type.STRING, enum: ["alta", "media", "baja", "desconocida"] },
        coherenciaSolicitud: { type: Type.BOOLEAN },
        calidadContacto: { type: Type.STRING, enum: ["alta", "media", "baja"] },
      },
      required: [
        "esNegocioB2B",
        "presupuestoAlto",
        "empresaGrande",
        "madurezDigital",
        "coherenciaSolicitud",
        "calidadContacto",
      ],
    },
    resumen: { type: Type.STRING, description: "Máximo 2 frases, en castellano, para el equipo comercial" },
  },
  required: ["score", "priority", "criteria", "resumen"],
};

/** Score aplicado cuando el scoring no está disponible (sin credenciales, timeout, error de API o respuesta inválida) — nunca dejamos un lead sin prioridad utilizable. */
const FALLBACK_SCORE: ScoreResult = {
  score: 50,
  priority: "media",
  criteria: {},
  resumen: "Scoring automático no disponible; requiere revisión manual del equipo comercial.",
};

function buildPrompt(data: LeadRecord, scraped: ScrapedSite | null): string {
  const servicioLabel = SERVICIO_LABELS_ES[data.servicio as keyof typeof SERVICIO_LABELS_ES] || data.servicio;
  const presupuestoLabel =
    PRESUPUESTO_LABELS_ES[data.presupuesto as keyof typeof PRESUPUESTO_LABELS_ES] || data.presupuesto;

  return `
Eres un asistente de cualificación de leads (lead scoring) para BideDigitala, consultora vasca
especializada en: formación bonificada, diseño web, desarrollo de aplicaciones a medida,
consultoría informática y automatización de procesos.

Analiza los datos de este formulario de contacto y, si está disponible, el contenido extraído
de la web del prospecto. Devuelve EXCLUSIVAMENTE un JSON válido según el esquema indicado.

Datos del formulario:
- Nombre: ${data.nombre}
- Empresa: ${data.empresa}
- Email: ${data.email}
- Teléfono: ${data.telefono}
- Servicio solicitado: ${servicioLabel}
- Presupuesto indicado: ${presupuestoLabel}
- Tamaño de empresa: ${data.tamano || "no indicado"}
- Mensaje libre: ${data.mensaje || "(sin mensaje)"}
- URL de la web: ${data.sitioWeb || "(no proporcionada)"}

Contenido extraído de su web (puede estar vacío si no se ha podido acceder):
Título: ${scraped?.title || "(no disponible)"}
Meta descripción: ${scraped?.description || "(no disponible)"}
Extracto de texto visible: ${scraped?.text || "(no disponible)"}

Evalúa estos criterios:
1. esNegocioB2B: ¿representa una empresa/organización, no un particular?
2. presupuestoAlto: ¿presupuesto y/o tamaño sugieren capacidad de inversión relevante (más de 3.000€)?
3. empresaGrande: ¿hay señales de empresa mediana/grande?
4. madurezDigital: nivel de desarrollo de su presencia digital actual (alta/media/baja/desconocida).
5. coherenciaSolicitud: ¿lo que pide encaja con lo que su web sugiere que necesita?
6. calidadContacto: seriedad de los datos de contacto (email corporativo vs. genérico, detalle del
   mensaje) → alta/media/baja.

Calcula un score de 1 a 100 (100 = lead ideal) y deriva priority: "alta" si score es 75 o más,
"media" si está entre 40 y 74, "baja" si es menor de 40. Añade un resumen de máximo 2 frases,
en castellano, para el equipo comercial.
`.trim();
}

/**
 * Puntúa un lead con Gemini. Nunca lanza — cualquier fallo (sin credenciales,
 * timeout, error de API, respuesta que no valida contra el schema) devuelve
 * un score neutro de fallback para que el lead siempre tenga una prioridad
 * utilizable.
 */
export async function scoreLeadWithGemini(data: LeadRecord, scraped: ScrapedSite | null): Promise<ScoreResult> {
  if (!ai) {
    console.error("[gemini] cliente no configurado (falta GEMINI_API_KEY), aplico score neutro");
    return FALLBACK_SCORE;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), geminiTimeoutMs);
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: buildPrompt(data, scraped),
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        abortSignal: controller.signal,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Respuesta vacía de Gemini");

    const parsed = GeminiScoreSchema.safeParse(JSON.parse(text));
    if (!parsed.success) {
      console.error("[gemini] respuesta no válida contra el schema:", parsed.error.flatten());
      return FALLBACK_SCORE;
    }
    return parsed.data;
  } catch (e) {
    console.error("[gemini] fallo, aplico score neutro:", e instanceof Error ? e.message : e);
    return FALLBACK_SCORE;
  } finally {
    clearTimeout(timer);
  }
}
