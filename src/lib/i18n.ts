// src/lib/i18n.ts
import i18next from 'i18next';

/**
 * Prefija la ruta interna con el idioma actual o el que se le pase.
 * @param path Ruta absoluta o relativa (p.ej. '/blog' o 'blog')
 * @param lang   Código de idioma (p.ej. 'es', 'eu')
 */
export function localizePath(path: string, lang?: string): string {
  // Usa el idioma de i18next si no se especifica
  const locale = lang ?? i18next.language;
  // Asegura que empieza con '/'
  const clean = path.startsWith('/') ? path : `/${path}`;
  // Prefijo de idioma y ruta limpia
  return `/${locale}${clean}`;
}
