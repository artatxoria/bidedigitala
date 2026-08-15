// src/lib/hreflang.ts
import { getCollection } from 'astro:content';

export type Lang = 'es' | 'eu';

export interface AlternateLink {
  href: string;
  /** false cuando no hay traducción real confirmada y el link es un fallback (p.ej. al índice del blog). */
  matched: boolean;
}

export type AlternateLinks = Record<Lang, AlternateLink>;

const ROUTE_RE = /^\/(es|eu)(?:\/(blog|catalogo))?(?:\/([^/]+))?\/?$/;
const otherLang = (lang: Lang): Lang => (lang === 'es' ? 'eu' : 'es');
const baseSlug = (slug: string) => slug.split('/').pop()!;

/**
 * Calcula la URL equivalente en cada idioma (es/eu) para una ruta dada,
 * emparejando posts de blog por su campo `tkey`. Única fuente de verdad
 * reutilizada tanto por el selector visual de idioma (CambioIdioma.astro)
 * como por las etiquetas hreflang del <head> (BaseLayout.astro), para no
 * duplicar la consulta a la colección de blog ni la lógica de emparejado.
 */
export async function getAlternateLinks(
  pathname: string,
  currentLang: Lang
): Promise<AlternateLinks> {
  const match = pathname.match(ROUTE_RE);

  if (!match) {
    // Ruta fuera del patrón esperado: prefijo simple, best-effort.
    return {
      es: { href: `/es${pathname}`, matched: true },
      eu: { href: `/eu${pathname}`, matched: true },
    };
  }

  const section = match[2] || ''; // "blog", "catalogo" o ""
  const maybeSlug = match[3] || ''; // último segmento, si lo hay
  const strippedPath = pathname.replace(/^\/(es|eu)/, '');

  const links: AlternateLinks = {
    es: { href: `/es${strippedPath}`, matched: true },
    eu: { href: `/eu${strippedPath}`, matched: true },
  };

  if (!maybeSlug) {
    // Página estática sin slug (home, catálogo, servicios...): swap de prefijo directo.
    return links;
  }

  if (section === 'catalogo') {
    // Ficha de curso: mismo slug en ambos idiomas (ver src/pages/[lang]/catalogo/[curso].astro),
    // swap de prefijo directo, sin consultar la colección de blog.
    return links;
  }

  const all = await getCollection('blog');
  const current = all.find(
    (e) => e.data.lang === currentLang && baseSlug(e.slug) === maybeSlug
  );

  if (!current) {
    // Slug que no corresponde a ningún post conocido: mantener swap simple.
    return links;
  }

  const other = otherLang(currentLang);
  links[currentLang] = { href: `/${currentLang}/${baseSlug(current.slug)}`, matched: true };

  const tkey = current.data.tkey;
  if (tkey) {
    const alt = all.find((e) => e.data.lang === other && e.data.tkey === tkey);
    links[other] = alt
      ? { href: `/${other}/${baseSlug(alt.slug)}`, matched: true }
      : { href: `/${other}/blog`, matched: false };
  } else {
    // Sin tkey: solo tenemos una suposición ingenua (mismo basename en el otro idioma),
    // no una traducción confirmada — no se debe declarar como hreflang real.
    links[other] = {
      href: section === 'blog' ? `/${other}/blog/${maybeSlug}` : `/${other}/${maybeSlug}`,
      matched: false,
    };
  }

  return links;
}
