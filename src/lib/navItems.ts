import type { Lang } from './i18n'; 

export interface NavItem {
  key: string;      // clave para la traducción, p.ej. 'nav.blog'
  path: string;     // ruta SIN prefijo de idioma, p.ej. '/blog'
}

export const mainNav: NavItem[] = [
  { key: 'nav.home',      path: '/' },
  { key: 'nav.blog',      path: '/blog' },
  { key: 'nav.privacy',   path: '/privacidad' },
  { key: 'nav.catalogo',   path: '/catalogo' },
  // añade aquí nuevas páginas: p.ej. { key: 'nav.contact', path: '/contacto' }
];
