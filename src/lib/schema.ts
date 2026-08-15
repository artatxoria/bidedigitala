// src/lib/schema.ts
// Helpers para construir objetos JSON-LD (schema.org) reutilizados desde varias páginas.

const SITE = 'https://www.bidedigitala.eus';
const LOGO_URL = `${SITE}/images/BideDigitala.png`;

// Datos de la Organización sin '@context': para incrustar como nodo anidado
// (p.ej. 'publisher'/'provider') sin repetir el @context del documento raíz.
const organizationData = {
  '@type': 'Organization',
  name: 'BideDigitala',
  legalName: 'BideDigitala, S.L.',
  url: `${SITE}/`,
  logo: LOGO_URL,
  image: LOGO_URL,
  email: 'info@bidedigitala.eus',
  telephone: '+34 685 756 143',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Aulesti',
    addressRegion: 'Bizkaia',
    addressCountry: 'ES',
  },
  sameAs: ['https://www.linkedin.com/in/juancarlosbeaskoetxea/'],
};

/**
 * Organización BideDigitala como documento JSON-LD independiente. Se incluye
 * en todas las páginas (BaseLayout) para dar una identidad consistente al
 * sitio ante buscadores y motores generativos.
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    ...organizationData,
  };
}

interface BlogPostingInput {
  title: string;
  description: string;
  pubDate: Date;
  author: string;
  lang: 'es' | 'eu';
  url: string; // URL absoluta del post
}

/**
 * Artículo de blog (BlogPosting). `publisher` reutiliza la Organización para
 * no duplicar los mismos datos de contacto/identidad en cada post.
 */
export function buildBlogPostingSchema(post: BlogPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.pubDate.toISOString(),
    inLanguage: post.lang,
    mainEntityOfPage: post.url,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: organizationData,
  };
}

interface CourseInput {
  name: string;
  description: string;
  lang: 'es' | 'eu';
  /** URL absoluta de la ficha propia del curso, si existe. */
  url?: string;
}

/**
 * Ficha de curso (Course), campos conservadores para evitar datos
 * estructurados inválidos (sin mapear duración/modalidad a formatos ISO).
 */
export function buildCourseSchema(course: CourseInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    inLanguage: course.lang,
    provider: organizationData,
    ...(course.url ? { url: course.url } : {}),
  };
}
