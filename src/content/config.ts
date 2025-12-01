import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  // Opcional: personaliza cómo se genera el slug (si lo necesitas)
  // slug: ({ id, defaultSlug }) => defaultSlug,
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(), // <- importante, convierte "YYYY-MM-DD" a Date
    // ❌ NO pongas "slug" aquí: Astro no lo expone en data
    lang: z.enum(['es', 'eu']),
    summary: z.string(),
    author: z.string(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    tkey: z.string().optional(), // clave de emparejado ES/EU
  }),
});

export const collections = { blog };
