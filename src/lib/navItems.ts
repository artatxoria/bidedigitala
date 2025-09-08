import type { Lang } from './i18n'; 

export interface NavItem {
  key: string; // clave de traducción
  path?: string; // ruta directa (opcional si hay subitems)
  children?: NavItem[]; // subitems para menú desplegable
}

export const mainNav: NavItem[] = [
  { key: 'nav.home',      path: '/' },
  { key: 'nav.blog',      path: '/blog' },
  { key: 'nav.privacy',   path: '/privacidad' },
  {
    key: 'nav.catalogo',
    children: [
      { key: 'nav.categoria1', path: '/catalogo/categoria1' },
      { key: 'nav.categoria2', path: '/catalogo/categoria2' },
      { key: 'nav.categoria3', path: '/catalogo/categoria3' },
    ]
  },
  // añade aquí nuevas páginas: p.ej. { key: 'nav.contact', path: '/contacto' }
];
