// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import astroI18next from 'astro-i18next';

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
    }),
  ],

  // --- 👇 Añade esto ---
  markdown: {
    remarkRehype: { allowDangerousHtml: true },
    rehypePlugins: [],
  },
});

