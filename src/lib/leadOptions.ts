// src/lib/leadOptions.ts
// Valores canónicos de los <select> "Servicio" y "Presupuesto" del formulario
// de contacto. Única fuente de verdad, usada por:
//  - el schema de validación (src/pages/api/contact.ts)
//  - las opciones del <select> (src/pages/[lang]/index.astro), cuyas
//    etiquetas se resuelven contra common.json vía
//    t(lang, `cta.servicio.${value}`) / t(lang, `cta.presupuesto.${value}`)
//  - las etiquetas en castellano usadas en el email interno de aviso de lead
//    (src/pages/api/contact.ts) y en el panel /admin/leads

export const SERVICIO_VALUES = [
  "formacion",
  "diseno-web",
  "creacion-aplicaciones",
  "consultoria-informatica",
  "automatizacion-procesos",
] as const;

export const PRESUPUESTO_VALUES = [
  "menos-1000",
  "1000-3000",
  "3000-10000",
  "10000-30000",
  "mas-30000",
  "no-se",
] as const;

export const TAMANO_VALUES = ["1-10", "11-50", "51-100", "100+"] as const;

export type ServicioValue = (typeof SERVICIO_VALUES)[number];
export type PresupuestoValue = (typeof PRESUPUESTO_VALUES)[number];
export type TamanoValue = (typeof TAMANO_VALUES)[number];

/** Etiquetas en castellano para el email interno y el panel de administración (no i18n del sitio público). */
export const SERVICIO_LABELS_ES: Record<ServicioValue, string> = {
  "formacion": "Formación",
  "diseno-web": "Diseño Web",
  "creacion-aplicaciones": "Creación de Aplicaciones",
  "consultoria-informatica": "Consultoría Informática",
  "automatizacion-procesos": "Automatización de Procesos",
};

export const PRESUPUESTO_LABELS_ES: Record<PresupuestoValue, string> = {
  "menos-1000": "Menos de 1.000 €",
  "1000-3000": "1.000 € – 3.000 €",
  "3000-10000": "3.000 € – 10.000 €",
  "10000-30000": "10.000 € – 30.000 €",
  "mas-30000": "Más de 30.000 €",
  "no-se": "Aún no lo sé",
};
