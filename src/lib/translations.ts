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
 * Prefija la ruta con el idioma, p.ej. tPath('/blog','es') → '/es/blog'
 */
export function tPath(path: string, lang: keyof typeof allLocales): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${clean}`;
}
