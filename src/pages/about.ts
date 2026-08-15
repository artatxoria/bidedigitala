// src/pages/about.ts
// Redirect permanente: /about era la página boilerplate del starter de
// Astro ("About Me" con Lorem Ipsum), sin enlazar desde ningún sitio pero
// indexada. La sustituye /[lang]/sobre-nosotros. Se mantiene este redirect
// (301, no 404) porque la URL /about ya estaba indexada.
//
// Antes era about.astro con un `export async function get()`: Astro solo
// reconoce como endpoint (isEndpoint() en su propio código) los archivos
// que NO tienen extensión de página (.astro, .md, .mdx...); un .astro
// siempre se renderiza como página, así que ese `get()` nunca se llegó a
// ejecutar — la URL real servía 200 + meta-refresh en vez de un 301 de
// verdad. Como .ts, el redirect ahora sí lo emite el servidor.
export const prerender = false;

export async function GET() {
  return new Response(null, {
    status: 301,
    headers: { Location: '/es/sobre-nosotros/' },
  });
}
