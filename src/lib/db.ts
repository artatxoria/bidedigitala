// src/lib/db.ts
// Pool de conexión a PostgreSQL, compartido por postgresLeadStore.ts (escritura
// desde el formulario) y el panel /admin/leads (lectura/filtros/cambio de
// estado). Un único Pool a nivel de módulo: el adapter Node standalone es un
// proceso de larga duración, así que se crea una vez y se reutiliza entre
// requests (igual que el transporter de nodemailer en contact.ts).

import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL ?? "";

console.log(`[db cfg] configurado=${connectionString ? "sí" : "no"}`);
if (!connectionString) {
  console.error("[db] Config incompleta. Requiere DATABASE_URL en el entorno.");
}

export const pool = connectionString ? new Pool({ connectionString }) : null;

pool?.on("error", (err: Error) => {
  // Errores en clientes ociosos del pool (p.ej. conexión cortada por el servidor);
  // no deben tumbar el proceso.
  console.error("[db] error inesperado en el pool:", err);
});

/** true si hay DATABASE_URL configurada; los llamantes deben comprobarlo antes de usar `pool`. */
export function isDbConfigured(): boolean {
  return pool !== null;
}
