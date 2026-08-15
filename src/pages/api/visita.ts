// src/pages/api/visita.ts
// Registra una vista de página. Solo se llama desde el cliente si el
// visitante ha aceptado el aviso de cookies (ver public/assets/js/visitas.js).
// Gestiona las cookies propias bd_vid (visitante, 1 año) y bd_sid (sesión,
// 30 min) — ambas HttpOnly, nunca leídas por JS, nunca de terceros.
export const prerender = false;

import { z } from "zod";
import { randomUUID } from "node:crypto";
import { pool, isDbConfigured } from "../../lib/db";
import { VISITOR_COOKIE, SESSION_COOKIE, VISITOR_MAX_AGE, SESSION_MAX_AGE, parseCookies, extractHost } from "../../lib/analytics";

const TrackSchema = z.object({
  pageViewId: z.string().uuid(),
  path: z.string().min(1).max(500),
  referrer: z.string().max(2000).optional().default(""),
});

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = TrackSchema.safeParse(body);
    if (!parsed.success) return json({ ok: false }, 400);

    if (!isDbConfigured()) return json({ ok: true }); // no-op silencioso, no rompe la navegación

    const cookies = parseCookies(request.headers.get("cookie"));
    const visitorId = cookies[VISITOR_COOKIE] || randomUUID();
    const sessionId = cookies[SESSION_COOKIE] || randomUUID();
    const referrerHost = extractHost(parsed.data.referrer);

    await pool!.query(
      `INSERT INTO pageviews (page_view_id, visitor_id, session_id, path, referrer)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (page_view_id) DO NOTHING`,
      [parsed.data.pageViewId, visitorId, sessionId, parsed.data.path, referrerHost]
    );

    const res = json({ ok: true });
    // Cookie de visitante: solo se fija si no existía. Cookie de sesión: se
    // renueva en cada hit (expiración deslizante de 30 min de inactividad).
    if (!cookies[VISITOR_COOKIE]) {
      res.headers.append("set-cookie", `${VISITOR_COOKIE}=${visitorId}; Path=/; Max-Age=${VISITOR_MAX_AGE}; SameSite=Lax; HttpOnly`);
    }
    res.headers.append("set-cookie", `${SESSION_COOKIE}=${sessionId}; Path=/; Max-Age=${SESSION_MAX_AGE}; SameSite=Lax; HttpOnly`);
    return res;
  } catch (e) {
    console.error("[visita] error:", e);
    return json({ ok: false }, 500);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
