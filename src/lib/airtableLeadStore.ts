// src/lib/airtableLeadStore.ts
// Implementación de LeadStore (ver src/lib/leadStore.ts) usando Airtable
// como base de datos de leads para el equipo comercial. La tabla se crea
// manualmente en la UI de Airtable con el esquema documentado en el plan
// (columnas: Lead ID, Nombre, Empresa, Email, Teléfono, Sitio Web, Servicio,
// Presupuesto, Tamaño Empresa, Mensaje, Idioma, Página de Origen,
// Marketing OK, Score, Prioridad, Resumen IA, Criterios IA (JSON), Estado).

import Airtable from "airtable";
import type { LeadStore, LeadRecord, ScoreResult } from "./leadStore";
import { SERVICIO_LABELS_ES, PRESUPUESTO_LABELS_ES } from "./leadOptions";

const apiKey = process.env.AIRTABLE_API_KEY ?? "";
const baseId = process.env.AIRTABLE_BASE_ID ?? "";
const tableName = process.env.AIRTABLE_TABLE_NAME || "Leads";

// Diagnóstico en logs (sin credenciales), mismo patrón que el resto del proyecto.
console.log(`[airtable cfg] base=${baseId || "(vacío)"} tabla=${tableName} auth=${apiKey ? "sí" : "no"}`);
if (!apiKey || !baseId) {
  console.error("[airtable] Config incompleta. Requiere AIRTABLE_API_KEY y AIRTABLE_BASE_ID en el entorno.");
}

const base = apiKey && baseId ? new Airtable({ apiKey }).base(baseId) : null;

const PRIORIDAD_LABELS: Record<ScoreResult["priority"], string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

function leadToFields(lead: LeadRecord) {
  return {
    "Lead ID": lead.leadId,
    "Nombre": lead.nombre,
    "Empresa": lead.empresa,
    "Email": lead.email,
    "Teléfono": lead.telefono,
    "Sitio Web": lead.sitioWeb || undefined,
    "Servicio": SERVICIO_LABELS_ES[lead.servicio as keyof typeof SERVICIO_LABELS_ES] || lead.servicio,
    "Presupuesto": PRESUPUESTO_LABELS_ES[lead.presupuesto as keyof typeof PRESUPUESTO_LABELS_ES] || lead.presupuesto,
    "Tamaño Empresa": lead.tamano || undefined,
    "Mensaje": lead.mensaje || undefined,
    "Idioma": lead.lang.toUpperCase(),
    "Página de Origen": lead.source || undefined,
    "Marketing OK": lead.marketing,
    "Estado": "Nuevo",
  };
}

export const airtableLeadStore: LeadStore = {
  async createLead(lead: LeadRecord) {
    if (!base) throw new Error("Airtable no configurado (faltan AIRTABLE_API_KEY/AIRTABLE_BASE_ID)");
    const table = base(tableName);
    const record = await table.create(leadToFields(lead));
    return record.id;
  },

  async updateLeadScore(externalId: string, score: ScoreResult) {
    if (!base) throw new Error("Airtable no configurado (faltan AIRTABLE_API_KEY/AIRTABLE_BASE_ID)");
    const table = base(tableName);
    await table.update(externalId, {
      "Score": score.score,
      "Prioridad": PRIORIDAD_LABELS[score.priority] || score.priority,
      "Resumen IA": score.resumen,
      "Criterios IA (JSON)": JSON.stringify(score.criteria),
      "Estado": "Cualificado",
    });
  },
};
