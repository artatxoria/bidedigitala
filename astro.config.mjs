// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import astroI18next from 'astro-i18next';


export default defineConfig({
  site: 'https://example.com',
  integrations: [
    mdx(),
    sitemap(),
    astroI18next({
      defaultLocale: 'es',
      locales: ['es', 'eu'],
      loadLocaleFrom: (lang, ns) =>
        import(`./src/locales/${lang}/${ns}.json`).then((m) => m.default),
    }),
  ],
});
