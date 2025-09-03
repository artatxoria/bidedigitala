// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.bidedigitala.eus',
  output: 'server',                 // habilita SSR/APIs (necesario por /api/contact)
  adapter: node({ mode: 'standalone' }), // servidor Node autocontenido en dist/
  integrations: [
    mdx(),
    sitemap(),
  ],
});
