// src/lib/postgresLeadStore.ts
// Implementación de LeadStore (ver src/lib/leadStore.ts) usando la base de
// datos PostgreSQL dedicada del usuario (ver db/schema.sql para el esquema,
// que debe aplicarse una vez antes del primer arranque).

import { pool } from "./db";
import type { LeadStore, LeadRecord, ScoreResult } from "./leadStore";

function assertConfigured() {
  if (!pool) throw new Error("PostgreSQL no configurado (faltan POSTGRES_URL/USER/PASSWORD/DB)");
}

export const postgresLeadStore: LeadStore = {
  async createLead(lead: LeadRecord) {
    assertConfigured();
    const { rows } = await pool!.query<{ lead_id: string }>(
      `INSERT INTO leads
        (lead_id, nombre, empresa, email, telefono, sitio_web, servicio, presupuesto, tamano, mensaje, lang, source, marketing)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING lead_id`,
      [
        lead.leadId,
        lead.nombre,
        lead.empresa,
        lead.email,
        lead.telefono,
        lead.sitioWeb || null,
        lead.servicio,
        lead.presupuesto,
        lead.tamano || null,
        lead.mensaje || null,
        lead.lang,
        lead.source || null,
        lead.marketing,
      ]
    );
    // El id externo del LeadStore es el propio lead_id (uuid) generado en
    // contact.ts — no hace falta ida y vuelta con un id autoincremental.
    return rows[0].lead_id;
  },

  async updateLeadScore(externalId: string, score: ScoreResult) {
    assertConfigured();
    await pool!.query(
      `UPDATE leads
          SET score = $1, priority = $2, resumen_ia = $3, criterios_ia = $4, updated_at = now()
        WHERE lead_id = $5`,
      [score.score, score.priority, score.resumen, JSON.stringify(score.criteria), externalId]
    );
  },
};
