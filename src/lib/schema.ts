// src/lib/schema.ts
// Helpers para construir objetos JSON-LD (schema.org) reutilizados desde varias páginas.

const SITE = 'https://www.bidedigitala.eus';
const LOGO_URL = `${SITE}/images/BideDigitala.png`;

// Datos de la Organización sin '@context': para incrustar como nodo anidado
// (p.ej. 'publisher'/'provider') sin repetir el @context del documento raíz.
// Exportado para que otras páginas con JSON-LD ad-hoc (p.ej. diseinu-zerbitzua)
// lo reutilicen en vez de mantener su propia copia divergente.
export const organizationData = {
  '@type': 'Organization',
  name: 'BideDigitala',
  legalName: 'BideDigitala, S.L.',
  url: `${SITE}/`,
  logo: LOGO_URL,
  image: LOGO_URL,
  email: 'info@bidedigitala.eus',
  telephone: '+34 685 756 143',
  // Año de fundación confirmado por el usuario (ver /sobre-nosotros y memoria del proyecto).
  foundingDate: '2022',
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
  /** URL absoluta de la página del autor (p.ej. /sobre-nosotros), si existe. */
  authorUrl?: string;
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
      ...(post.authorUrl ? { url: post.authorUrl } : {}),
    },
    publisher: organizationData,
  };
}

interface PersonInput {
  name: string;
  /** URL absoluta de la página del sitio que representa a esta persona. */
  url?: string;
  /** Perfiles externos (LinkedIn, etc.). */
  sameAs?: string[];
  jobTitle?: string;
}

/**
 * Persona (fundador/autor). Documento JSON-LD independiente, pensado para
 * /sobre-nosotros — señal E-E-A-T (Experience/Expertise/Authoritativeness/
 * Trustworthiness) que buscadores y motores generativos usan para atribuir
 * el contenido del sitio a alguien identificable, no solo a la marca.
 */
export function buildPersonSchema(person: PersonInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    ...(person.url ? { url: person.url } : {}),
    ...(person.sameAs ? { sameAs: person.sameAs } : {}),
    ...(person.jobTitle ? { jobTitle: person.jobTitle } : {}),
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

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * FAQPage a partir de contenido ya visible en la página (sin preguntas
 * inventadas). Desde 2023 Google restringe su rich result a sitios
 * gubernamentales/de salud, así que esto no busca aparecer en el SERP de
 * Google — se implementa por valor GEO: los motores generativos (ChatGPT,
 * Perplexity, etc.) sí consumen FAQPage para responder preguntas sobre
 * el servicio directamente.
 */
export function buildFAQPageSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
