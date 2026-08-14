// src/middleware.ts
// Protege /admin/* con Basic Auth (usuario/contraseña compartidos por el
// equipo comercial, vía ADMIN_USER/ADMIN_PASSWORD). Es la primera zona
// autenticada del sitio — no se toca ninguna otra ruta.

import { defineMiddleware } from "astro:middleware";
import { timingSafeEqual, createHash } from "node:crypto";

const ADMIN_USER = process.env.ADMIN_USER ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

console.log(`[admin auth cfg] configurado=${ADMIN_USER && ADMIN_PASSWORD ? "sí" : "no"}`);
if (!ADMIN_USER || !ADMIN_PASSWORD) {
  console.error("[admin auth] Config incompleta. Requiere ADMIN_USER y ADMIN_PASSWORD en el entorno.");
}

/** Compara dos strings en tiempo constante (evita timing attacks), sin exigir igual longitud. */
function timingSafeEqualStr(a: string, b: string): boolean {
  const ah = createHash("sha256").update(a).digest();
  const bh = createHash("sha256").update(b).digest();
  return timingSafeEqual(ah, bh);
}

function unauthorized(): Response {
  return new Response("Autenticación requerida.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Bidedigitala Admin", charset="UTF-8"' },
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith("/admin")) {
    return next();
  }

  // Sin credenciales configuradas no dejamos pasar a nadie (fail-closed).
  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    return unauthorized();
  }

  const authHeader = context.request.headers.get("authorization") || "";
  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return unauthorized();
  }

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const sepIndex = decoded.indexOf(":");
  const user = sepIndex >= 0 ? decoded.slice(0, sepIndex) : decoded;
  const pass = sepIndex >= 0 ? decoded.slice(sepIndex + 1) : "";

  if (!timingSafeEqualStr(user, ADMIN_USER) || !timingSafeEqualStr(pass, ADMIN_PASSWORD)) {
    return unauthorized();
  }

  return next();
});
