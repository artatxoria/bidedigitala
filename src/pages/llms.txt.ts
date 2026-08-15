import { getCollection } from 'astro:content';

const SITE = 'https://www.bidedigitala.eus';

export async function GET() {
  const posts = (await getCollection('blog')).sort(
    (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  const recentEs = posts.filter((p) => p.data.lang === 'es').slice(0, 15);
  const recentEu = posts.filter((p) => p.data.lang === 'eu').slice(0, 15);

  const postLink = (post: (typeof posts)[number]) => {
    const slug = post.slug.split('/').pop();
    return `- [${post.data.title}](${SITE}/${post.data.lang}/${slug}/): ${post.data.summary}`;
  };

  const body = `# BideDigitala

> Formación bonificada, diseño web, desarrollo de aplicaciones, consultoría informática y automatización de procesos para PYMES de Euskadi. Equipo bilingüe (es/eu) con sede en Aulesti, Bizkaia.

## Servicios
- [Diseño web y GEO](${SITE}/es/diseinu-zerbitzua/): Diseño de sitios web y optimización para buscadores e IA generativa.
- [Creación de aplicaciones](${SITE}/es/creacion-aplicaciones/): Desarrollo de software y aplicaciones a medida.
- [Consultoría informática](${SITE}/es/consultoria-informatica/): Diagnóstico tecnológico y acompañamiento en la elección de herramientas.
- [Automatización de procesos](${SITE}/es/automatizacion-procesos/): Automatización de tareas repetitivas y flujos de trabajo.
- [Catálogo de formación bonificada](${SITE}/es/catalogo/): Cursos de análisis de datos, inteligencia artificial, automatización y programación.
- [Formación en IA para centros educativos](${SITE}/es/ia-centros-educativos/): Formación práctica en IA generativa para profesorado.

## Blog (es)
${recentEs.map(postLink).join('\n')}

## Bloga (eu)
${recentEu.map(postLink).join('\n')}

## Idiomas
Contenido disponible en español (/es/) y euskera (/eu/). Listado completo del blog en ${SITE}/es/blog/ y ${SITE}/eu/blog/.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
