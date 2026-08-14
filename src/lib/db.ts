// src/lib/db.ts
// Pool de conexión a PostgreSQL, compartido por postgresLeadStore.ts (escritura
// desde el formulario) y el panel /admin/leads (lectura/filtros/cambio de
// estado). Un único Pool a nivel de módulo: el adapter Node standalone es un
// proceso de larga duración, así que se crea una vez y se reutiliza entre
// requests (igual que el transporter de nodemailer en contact.ts).

import { Pool } from "pg";

// Campos discretos (no una única connection string) — mismo patrón que las
// variables POSTGRES_* de la imagen oficial de Postgres, para encajar con
// cómo ya está aprovisionado el resto de la infraestructura del usuario.
const pgHost     = process.env.POSTGRES_HOST ?? "";
const pgPort     = Number(process.env.POSTGRES_PORT ?? "5432");
const pgUser     = process.env.POSTGRES_USER ?? "";
const pgPassword = process.env.POSTGRES_PASSWORD ?? "";
const pgDatabase = process.env.POSTGRES_DB ?? "";
const pgSsl      = (process.env.POSTGRES_SSL ?? "false") === "true";

const configured = !!(pgHost && pgUser && pgPassword && pgDatabase);

console.log(
  `[db cfg] host=${pgHost || "(vacío)"} port=${pgPort} db=${pgDatabase || "(vacío)"} ssl=${pgSsl} auth=${pgUser && pgPassword ? "sí" : "no"}`
);
if (!configured) {
  console.error("[db] Config incompleta. Requiere POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD y POSTGRES_DB en el entorno.");
}

export const pool = configured
  ? new Pool({
      host: pgHost,
      port: pgPort,
      user: pgUser,
      password: pgPassword,
      database: pgDatabase,
      ssl: pgSsl ? { rejectUnauthorized: false } : undefined,
    })
  : null;

pool?.on("error", (err: Error) => {
  // Errores en clientes ociosos del pool (p.ej. conexión cortada por el servidor);
  // no deben tumbar el proceso.
  console.error("[db] error inesperado en el pool:", err);
});

/** true si la conexión a Postgres está configurada; los llamantes deben comprobarlo antes de usar `pool`. */
export function isDbConfigured(): boolean {
  return pool !== null;
}
