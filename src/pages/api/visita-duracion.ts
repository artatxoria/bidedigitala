// src/pages/api/visita-duracion.ts
// Recibe la duración de una vista de página, enviada vía navigator.sendBeacon()
// al abandonar la página (visibilitychange/pagehide) — por eso el body llega
// como texto plano, no necesariamente con content-type application/json.
export const prerender = false;

import { z } from "zod";
import { pool, isDbConfigured } from "../../lib/db";

const DurationSchema = z.object({
  pageViewId: z.string().uuid(),
  durationMs: z.number().int().min(0).max(6 * 60 * 60 * 1000), // tope de 6h, valores absurdos se ignoran
});

export async function POST({ request }: { request: Request }) {
  try {
    const raw = await request.text();
    const parsed = DurationSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return json({ ok: false }, 400);
    if (!isDbConfigured()) return json({ ok: true });

    await pool!.query(
      `UPDATE pageviews SET duration_ms = $1 WHERE page_view_id = $2 AND duration_ms IS NULL`,
      [parsed.data.durationMs, parsed.data.pageViewId]
    );
    return json({ ok: true });
  } catch (e) {
    console.error("[visita-duracion] error:", e);
    return json({ ok: false }, 500);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
