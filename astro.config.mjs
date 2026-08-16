// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import astroI18next from 'astro-i18next';
import { readdirSync, readFileSync } from 'node:fs';

// Mapa url -> fecha de publicación (lastmod del sitemap), leído directamente
// del frontmatter de los posts de blog. No usamos astro:content aquí (no
// está disponible en este contexto de configuración) ni una dependencia
// nueva tipo gray-matter: basta una extracción ligera por regex de
// 'pubDate:' — el mismo campo que ya valida el schema de la colección
// (src/content/config.ts). Solo posts de blog; el resto de páginas quedan
// sin lastmod explícito (aceptable).
function readBlogLastmods() {
  const map = new Map();
  const blogDir = new URL('./src/content/blog/', import.meta.url);
  for (const lang of ['es', 'eu']) {
    const dir = new URL(`${lang}/`, blogDir);
    let files;
    try {
      files = readdirSync(dir);
    } catch {
      continue;
    }
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const raw = readFileSync(new URL(file, dir), 'utf-8');
      const match = raw.match(/^pubDate:\s*"?([\d-]+)"?/m);
      if (!match) continue;
      const slug = file.replace(/\.md$/, '').toLowerCase();
      const url = `https://www.bidedigitala.eus/${lang}/${slug}/`;
      map.set(url, new Date(match[1]));
    }
  }
  return map;
}

const blogLastmods = readBlogLastmods();

// La mayoría de posts de blog repiten su título como primer '# Título' del
// cuerpo Markdown (arrastre del formato original en el que se escribieron),
// duplicando el <h1> que ya pinta la plantilla desde el frontmatter (ver
// src/pages/[lang]/[slug].astro:92) — dos <h1> reales por página. Este
// plugin remark quita el primer nodo del árbol si es un heading de
// profundidad 1, sin tocar ningún archivo de contenido ni afectar a posts
// que no repitan el título (no-op en ese caso).
function remarkStripLeadingH1() {
  return (tree) => {
    const first = tree.children[0];
    if (first && first.type === 'heading' && first.depth === 1) {
      tree.children.shift();
    }
  };
}

export default defineConfig({
  site: 'https://www.bidedigitala.eus',
  output: 'server', // habilita SSR/APIs (necesario por /api/contact)
  adapter: node({ mode: 'standalone' }), // servidor Node autocontenido en dist/
  // El sitio ya se sirve (y el sitemap ya declara) todas las rutas con barra
  // final; esto lo hace explícito para que Astro.url.pathname sea consistente
  // en todas partes (canonical, hreflang, comparaciones de ruta en BaseLayout).
  trailingSlash: 'always',
  integrations: [
    astroI18next(),
    mdx(),
    sitemap({
      // Excluye páginas privadas (admin), endpoints de API, y /about (redirect
      // 301 a /es/sobre-nosotros/, no debe listarse como URL indexable).
      filter: (page) =>
        !page.includes('/admin/') &&
        !page.includes('/api/') &&
        page !== 'https://www.bidedigitala.eus/about/',
      serialize(item) {
        const lastmod = blogLastmods.get(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],

  // --- 👇 Añade esto ---
  markdown: {
    remarkPlugins: [remarkStripLeadingH1],
    remarkRehype: { allowDangerousHtml: true },
    rehypePlugins: [],
  },
});

