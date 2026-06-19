# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing/blog site for **Bidedigitala** (https://www.bidedigitala.eus), a Basque company offering training courses, data/AI services, and custom software. Built with **Astro 5 in SSR mode** (`@astrojs/node` standalone adapter) and bilingual: Spanish (`es`, default) and Basque (`eu`, the `.eus` domain default). UI text is in Spanish/Basque — match that language in user-facing strings and code comments.

## Commands

```sh
npm run dev      # dev server at localhost:4321
npm run build    # SSR build to ./dist/ (server entry at dist/server/entry.mjs)
npm run preview  # preview the build
npm start        # run the built SSR server: node ./dist/server/entry.mjs
npm run astro check   # type-check (tsconfig extends astro/tsconfigs/strict)
```

There is **no test suite and no linter** configured. Verify changes with `npm run build` + `npm run astro check`.

Deploy is via `Dockerfile.app` (multi-stage Node 20 alpine, serves on `PORT=8080`).

## Architecture

### SSR vs. static
`output: 'server'` is set globally to enable the contact API, but **most pages opt back into static generation** with `export const prerender = true`. Only `src/pages/api/contact.ts` is runtime (`export const prerender = false`). When adding a page, decide explicitly: prerender unless it needs request-time data.

### Routing & i18n
- Locales are defined in `astro-i18next.config.mjs` (`['es', 'eu']`, default `es`). Supported langs are also hardcoded as `const supported = ['es','eu']` in pages — keep both in sync.
- `src/pages/[lang]/` holds all localized pages. Each uses `getStaticPaths()` returning `[{params:{lang:'es'}},{params:{lang:'eu'}}]` and validates `Astro.params.lang` against `supported`, redirecting to `/es/` if invalid.
- Root `src/pages/index.astro` redirects to `/eu/` (307 + meta-refresh).

### Translations — two parallel systems (important)
1. **JSON dictionaries** in `src/locales/{es,eu}/common.json`, accessed via `t(lang, 'dotted.key')` from `src/lib/translations.ts`. Returns the key itself if missing (no error). This is the primary system for page chrome/UI. **Both `common.json` files must have matching key structures** — the `eu` file's shape is the canonical type.
2. **astro-i18next + i18next** with `localizePath()` in `src/lib/i18n.ts`, used in some components. `src/lib/translations.ts` also exports `tPath(path, lang)` → `/lang/path`. Prefer `t()`/`tPath()` for new page code; both coexist.

Navigation structure lives in `src/lib/navItems.ts` as a `NavItem[]` tree (translation `key` + `path` + optional `children`), consumed by the `Navegacion*` components.

### Content (blog)
- Collection `blog` defined in `src/content/config.ts` (Zod schema: `title`, `description`, `pubDate` (coerced Date), `lang`, `summary`, `author`, optional `categories`/`tags`/`tkey`).
- Markdown files live in `src/content/blog/{es,eu}/`. The slug includes the subdir; pages strip it with `entry.slug.split('/').pop()`.
- **ES/EU post pairing**: `tkey` frontmatter links translations of the same article. **Language is encoded both in the `lang` field and as a category** (`es`/`eu`/`Castellano`/`Euskera`/...) — `src/pages/[lang]/[slug].astro` filters these out via an `excludedCategories` list when computing related posts.

### Contact form / leads (`src/pages/api/contact.ts`)
- Validates form data with Zod, includes a `website` honeypot field for spam.
- **Persists every lead to JSONL first** (`DATA_DIR/LEADS_FILE`, default `./data/leads.jsonl`) before attempting email, so leads survive SMTP failures. Each lead gets a `status` (`received` → `sent` | `mailer_error`).
- Sends via nodemailer SMTP. All config is runtime env: `SMTP_HOST/PORT/SECURE/USER/PASS/FROM/TO`. Bilingual email subject/body driven by the `lang` field. `resend` is a dependency but the active path uses nodemailer.

## Conventions & gotchas

- `.env` holds SMTP + data-dir config (gitignored values; keys are SMTP_* and DATA_DIR/LEADS_FILE).
- The repo contains many **`.bak`, `.astro_`, and `catalogo.astro.bak`-style backup files** — these are not active routes. Ignore them; don't edit them expecting effects.
- Course content is one component per course under `src/components/cursos/` (e.g. `Excel_I.astro`, `Python.astro`); the catalog page composes these.
- `markdown.remarkRehype.allowDangerousHtml: true` is enabled in `astro.config.mjs` — raw HTML in blog Markdown is rendered.
- `data/leads.jsonl` is committed test data; real deploys write leads to the configured `DATA_DIR` volume.
