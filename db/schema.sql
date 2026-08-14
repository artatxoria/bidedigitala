-- db/schema.sql
-- Esquema de la base de datos de Bidedigitala: leads (formulario inteligente)
-- y pageviews (analítica propia de visitas, panel /admin/visitas).
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
-- Variables resultantes en .env (ver .env.example):
--   POSTGRES_HOST=localhost   (o la IP/host de tu VPS si te conectas en remoto)
--   POSTGRES_PORT=5432
--   POSTGRES_USER=bidedigitala_leads_app
--   POSTGRES_PASSWORD=cambia-esto
--   POSTGRES_DB=bidedigitala_leads

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

-- ============================================================================
-- Analítica de visitas propia (panel /admin/visitas). Solo se registra tras
-- consentimiento explícito vía el banner de cookies (src/components/CookieBanner.astro
-- + public/assets/js/analytics.js) — cookies propias bd_vid (visitante,
-- 1 año) y bd_sid (sesión, 30 min), nunca de terceros.
CREATE TABLE IF NOT EXISTS pageviews (
  id            BIGSERIAL PRIMARY KEY,
  page_view_id  UUID NOT NULL UNIQUE, -- generado en el cliente; correlaciona el update de duración
  visitor_id    UUID NOT NULL,
  session_id    UUID NOT NULL,
  path          TEXT NOT NULL,
  referrer      TEXT, -- solo el host (ver src/pages/api/track.ts), nunca la URL completa

  -- Rellenado en un segundo request (sendBeacon al salir de la página);
  -- NULL si el navegador se cerró sin disparar el evento.
  duration_ms   INTEGER,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pageviews_created_at ON pageviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pageviews_path       ON pageviews (path);
CREATE INDEX IF NOT EXISTS idx_pageviews_visitor     ON pageviews (visitor_id);
