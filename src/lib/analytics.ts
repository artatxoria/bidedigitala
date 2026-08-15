// src/lib/analytics.ts
// Constantes y helpers compartidos por los endpoints de tracking
// (visita.ts, visita-duracion.ts) y el panel /admin/visitas.

export const VISITOR_COOKIE = "bd_vid";
export const SESSION_COOKIE = "bd_sid";
export const VISITOR_MAX_AGE = 365 * 24 * 60 * 60; // 1 año, en segundos
export const SESSION_MAX_AGE = 30 * 60; // 30 min, en segundos

export function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const val = part.slice(eq + 1).trim();
    if (key) out[key] = decodeURIComponent(val);
  }
  return out;
}

/**
 * Reduce un referrer a solo su host (p.ej. "https://www.google.com/search?q=..."
 * → "google.com"). Evita guardar URLs completas que puedan llevar parámetros
 * sensibles, y agrupa mejor por origen. Devuelve null si no hay referrer o
 * es del propio sitio (no interesa como "origen del tráfico").
 */
export function extractHost(rawReferrer: string, ownHosts: string[] = ["bidedigitala.eus", "www.bidedigitala.eus"]): string | null {
  if (!rawReferrer) return null;
  try {
    const u = new URL(rawReferrer);
    const host = u.hostname.replace(/^www\./, "");
    if (ownHosts.some((h) => h.replace(/^www\./, "") === host)) return null; // navegación interna, no es "origen externo"
    return host;
  } catch {
    return null;
  }
}
