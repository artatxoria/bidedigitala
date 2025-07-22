// src/pages/admin.ts
import type { APIRoute } from 'astro';

// Redirigimos /admin   → /admin/index.html
export const GET: APIRoute = () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/admin/index.html',
    },
  });
};

// Astro también necesita manejar la petición con slash (/admin/)
export const HEAD: APIRoute = GET;
