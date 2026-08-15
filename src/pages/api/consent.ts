// src/pages/api/consent.ts
// Guarda la decisión de cookies del visitante (bd_consent=accepted|rejected)
// mediante una navegación normal — sin depender de JavaScript ni de que un
// listener de clic se ejecute. El banner (src/components/CookieBanner.astro)
// envía un <form method="POST"> real a este endpoint; el enlace "Gestionar
// cookies" del footer usa el GET para borrar la decisión guardada.
// Patrón Post/Redirect/Get, igual que /admin/leads.
export const prerender = false;

import type { APIRoute } from "astro";

const CONSENT_COOKIE = "bd_consent";
const CONSENT_MAX_AGE = 365 * 24 * 60 * 60; // 1 año, en segundos

/** Solo permite volver a una ruta relativa interna — evita un open redirect. */
function safeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) return "/";
  return raw;
}

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData().catch(() => null);
  const decision = form?.get("decision") === "accepted" ? "accepted" : "rejected";
  const redirectTo = safeRedirect(String(form?.get("redirect") || ""));

  const headers = new Headers({ Location: redirectTo });
  headers.append("Set-Cookie", `${CONSENT_COOKIE}=${decision}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax`);
  return new Response(null, { status: 303, headers });
};

export const GET: APIRoute = async ({ url }) => {
  // Usado por el enlace "Gestionar cookies": borra la decisión guardada para
  // que el banner vuelva a aparecer en la página a la que se regresa.
  const redirectTo = safeRedirect(url.searchParams.get("redirect"));
  const headers = new Headers({ Location: redirectTo });
  headers.append("Set-Cookie", `${CONSENT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`);
  return new Response(null, { status: 303, headers });
};
