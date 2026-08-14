-- db/schema.sql
-- Esquema de la base de datos de leads (formulario inteligente de Bidedigitala).
--
-- Pensado para ejecutarse UNA VEZ contra una base de datos dedicada (recomendado:
-- bidedigitala_leads), no contra una base compartida con otras aplicaciones.
--
-- Setup recomendado (ajusta usuario/contraseña/host a tu VPS):
--
--   createdb -O bidedigitala_leads_app bidedigitala_leads
--   psql bidedigitala_leads -f db/schema.sql
--
-- O, si prefieres crear el rol también desde SQL:
--
--   CREATE ROLE bidedigitala_leads_app WITH LOGIN PASSWORD 'cambia-esto';
--   CREATE DATABASE bidedigitala_leads OWNER bidedigitala_leads_app;
--   \c bidedigitala_leads
--   -- (pega aquí el resto de este archivo)
--
-- DATABASE_URL resultante (ver .env.example):
--   postgres://bidedigitala_leads_app:cambia-esto@localhost:5432/bidedigitala_leads

CREATE TABLE IF NOT EXISTS leads (
  id            BIGSERIAL PRIMARY KEY,
  lead_id       UUID NOT NULL UNIQUE,
  nombre        TEXT NOT NULL,
  empresa       TEXT NOT NULL,
  email         TEXT NOT NULL,
  telefono      TEXT NOT NULL,
  sitio_web     TEXT,
  servicio      TEXT NOT NULL,
  presupuesto   TEXT NOT NULL,
  tamano        TEXT,
  mensaje       TEXT,
  lang          TEXT NOT NULL,
  source        TEXT,
  marketing     BOOLEAN NOT NULL DEFAULT false,

  -- Rellenados de forma asíncrona por el scoring (scrapeWebsite + Gemini);
  -- NULL hasta que el scoring termina.
  score         INTEGER,
  priority      TEXT,
  resumen_ia    TEXT,
  criterios_ia  JSONB,

  -- Workflow comercial, editable desde el panel /admin/leads. Independiente
  -- del scoring automático de arriba.
  estado        TEXT NOT NULL DEFAULT 'nuevo'
                  CHECK (estado IN ('nuevo', 'contactado', 'cualificado', 'ganado', 'descartado')),

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_estado     ON leads (estado);
CREATE INDEX IF NOT EXISTS idx_leads_priority   ON leads (priority);
CREATE INDEX IF NOT EXISTS idx_leads_servicio   ON leads (servicio);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
