// src/lib/translations.ts
import es from '../locales/es/common.json';
import eu from '../locales/eu/common.json';

type Translations = typeof eu;

const allLocales: Record<string, Translations> = { es, eu };

/**
 * Devuelve la traducción para la clave dada, o la propia clave si no existe.
 */
export function t(lang: keyof typeof allLocales, key: string): string {
  const obj = allLocales[lang];
  return key
    .split('.')
    .reduce<any>((o, segment) => (o ? o[segment] : undefined), obj)
    || key;
}

/**
 * Prefija la ruta con el idioma y añade la barra final, p.ej.
 * tPath('/blog','es') → '/es/blog/' — el sitio sirve (y el sitemap
 * declara) todas las rutas con barra final, ver trailingSlash en
 * astro.config.mjs. Un posible fragmento (#ancla) o query no se toca:
 * tPath('#contacto','es') → '/es/#contacto', nunca '/es/#contacto/'.
 */
export function tPath(path: string, lang: keyof typeof allLocales): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const splitIndex = clean.search(/[#?]/);
  const pathname = splitIndex === -1 ? clean : clean.slice(0, splitIndex);
  const suffix = splitIndex === -1 ? '' : clean.slice(splitIndex);
  const pathnameWithSlash = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return `/${lang}${pathnameWithSlash}${suffix}`;
}
