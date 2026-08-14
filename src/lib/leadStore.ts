// src/lib/leadStore.ts
// Abstracción de persistencia de leads. Hoy la implementa postgresLeadStore.ts
// (ver db/schema.sql) — el formulario usó Airtable en una primera versión;
// esta interfaz existe precisamente para poder cambiar de proveedor sin tocar
// src/pages/api/contact.ts. getLeadStore() es el único punto a cambiar.

export type Prioridad = "alta" | "media" | "baja";

export interface LeadRecord {
  leadId: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  sitioWeb: string;
  servicio: string;
  presupuesto: string;
  tamano: string;
  mensaje: string;
  lang: "es" | "eu";
  source: string;
  marketing: boolean;
}

export interface ScoreResult {
  score: number;
  priority: Prioridad;
  criteria: Record<string, unknown>;
  resumen: string;
}

export interface LeadStore {
  /** Crea el registro inicial (sin score todavía) y devuelve su id externo. */
  createLead(lead: LeadRecord): Promise<string>;
  /** Actualiza un registro existente con el resultado del scoring. */
  updateLeadScore(externalId: string, score: ScoreResult): Promise<void>;
}

import { postgresLeadStore } from "./postgresLeadStore";

export function getLeadStore(): LeadStore {
  return postgresLeadStore;
}
