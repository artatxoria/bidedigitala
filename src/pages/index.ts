// src/pages/index.ts
// Redirige la raíz del dominio al idioma por defecto del .eus (euskera).
// 307 (no 301): es negociación de idioma, no un cambio permanente de URL.
//
// Antes era index.astro con un `export async function get()`: Astro solo
// reconoce como endpoint (isEndpoint() en su propio código) los archivos
// que NO tienen extensión de página (.astro, .md, .mdx...); un .astro
// siempre se renderiza como página, así que ese `get()` nunca se llegó a
// ejecutar — la raíz servía 200 + meta-refresh en vez de un redirect de
// verdad. Como .ts, el redirect ahora sí lo emite el servidor.
export const prerender = false;

export async function GET() {
  return new Response(null, {
    status: 307,
    headers: { Location: '/eu/' },
  });
}
