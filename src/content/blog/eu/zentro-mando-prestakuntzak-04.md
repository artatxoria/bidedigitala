---
title: "Prestakuntzen kontrol-gunea (III): inplementazioaren hasiera, egitura eta bertsioen kontrola"
description: "Laugarren atala: funtsezko atal batera sartzen gara: datuen geruza."
pubDate: "2025-09-25"
lang: "eu"
summary: "Aurreko artikuluetan proiektuaren helburuak zehaztu genituen, arkitektura diseinatu genuen eta lehen urratsak eman genituen inplementazioan. Laugarren artikulu honetan, funtsezko atal batera sartzen gara: datuen geruza. Hau da, gure formakuntza-planifikatzailearen informazioa gordetzea, kontsultatzea eta kudeatzea ahalbidetuko duen zatia."
author: "Juan Carlos Beaskoetxea"
tags:
  - Prestakuntza
  - Produktibitatea
  - Automatizazioa
  - PyQt
  - Python
  - Agenda bisuala
  - Neurrira egindako softwarea
tkey: "centro-mando-formaciones-04"
---

# Datuen geruzaren inplementazioa: egitura, biltegiak eta probak

Aurreko artikuluetan proiektuaren helburuak zehaztu genituen, arkitektura diseinatu genuen eta lehen urratsak eman genituen inplementazioan. Laugarren artikulu honetan, funtsezko atal batera sartzen gara: **datuen geruza**. Hau da, gure formakuntza-planifikatzailearen informazioa gordetzea, kontsultatzea eta kudeatzea ahalbidetuko duen zatia.

## Datu-basearen diseinu fisikoa

**SQLite** aukeratu dugu motor gisa, bere erraztasunagatik eta Python-ekin duen bateragarritasun zuzenagatik. Eskemak aurreko fasean aztertu genituen entitate guztiak biltzen ditu:

- Bezeroa (Cliente) → enpresen eta kontaktuaren arduradunen informazioa.
- Gaia (Tema) → prestakuntza-gaien katalogoa.
- Oinarrizko Formazioa (FormacionBase) → prestakuntza orokorrak (adib. “Excel Oinarrizkoa”).
- Bezeroaren Kontratazioa (ContratacionClienteFormacion) → bezero batek kontratatutako ikastaro bakoitza.
- Saioa (Sesion) → kontratazio bakoitzeko saio zehatzak.
- Eranskina (Adjunto) → fitxategiak (kontratuak, apunteak...).
- Bezeroaren Interakzioa (InteraccionCliente) → harreman komertzialen historia (mini-CRM).

Eskema osoa *planificador/data/schema.sql* fitxategian dago. Hona hemen zati bat:

```sql
CREATE TABLE IF NOT EXISTS Cliente (
  id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
  empresa TEXT NOT NULL,
  persona_contacto TEXT,
  telefono TEXT,
  email TEXT,
  direccion TEXT,
  cif TEXT,
  notas TEXT,
  color_hex TEXT DEFAULT '#377eb8',
  UNIQUE (cif)
);

CREATE TABLE IF NOT EXISTS InteraccionCliente (
  id_interaccion INTEGER PRIMARY KEY AUTOINCREMENT,
  id_cliente INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('llamada','email','reunion','mensaje','otro')),
  descripcion TEXT,
  resultado TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (resultado IN ('pendiente','negociacion','aceptado','rechazado','sin_respuesta')),
  proxima_accion TEXT,
  fecha_proxima_accion TEXT,
  crear_recordatorio INTEGER NOT NULL DEFAULT 0 CHECK (crear_recordatorio IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
    ON UPDATE CASCADE ON DELETE CASCADE
);
```

## Datu-basearen kudeatzailea (db_manager.py)

SQLite erabilera zentralizatzeko, **konexioen kudeatzaile bat** sortu dugu:

```python
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[2] / "planificador.db"
SCHEMA_PATH = Path(__file__).resolve().parents[1] / "data" / "schema.sql"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db(force: bool = False):
    if force and DB_PATH.exists():
        DB_PATH.unlink()
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("PRAGMA foreign_keys = ON;")
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            conn.executescript(f.read())
        conn.commit()
```

Modulu honi esker, datu-basea **berrezarri** eta **konexio seguruak** ireki ditzakegu.

## CRUD biltegiak

Modelo bakoitzak bere biltegia dauka *planificador/data/repositories/* karpetan. Biltegi hauek CRUD eragiketak (**sortu, irakurri, eguneratu, ezabatu**) kapsulatzen dituzte, datu-atzipena negozio-logikatik bereiziz.

Adibidea: **Bezeroaren biltegia** (*cliente_repo.py*):

```python
from planificador.data.db_manager import get_connection

class ClienteRepository:

    @staticmethod
    def crear(empresa, cif, persona_contacto=None, telefono=None, email=None,
              direccion=None, notas=None, color_hex="#377eb8"):
        with get_connection() as conn:
            cur = conn.execute("""
                INSERT INTO Cliente (empresa, persona_contacto, telefono, email, direccion, cif, notas, color_hex)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (empresa, persona_contacto, telefono, email, direccion, cif, notas, color_hex))
            conn.commit()
            return cur.lastrowid
```

Era berean, biltegiak sortu ditugu **Gaia, Oinarrizko Formazioa, Kontratazioa, Saioa, Eranskina eta Bezeroaren Interakzioa** entitateentzat.

## Pytest bidezko unitate-probak

Funtzionamendua bermatzeko, **unitate-probak** sortu ditugu pytest erabiliz. Hauek CRUD funtzioak modu isolatuan balioztatzen dituzte.

Adibidea: *ClienteRepository*-ren proba (*tests/test_cliente_repo.py*):

```python
import pytest
from planificador.data.db_manager import init_db
from planificador.data.repositories.cliente_repo import ClienteRepository

@pytest.fixture(autouse=True)
def setup_db():
    init_db(force=True)

def test_crud_cliente():
    cliente_id = ClienteRepository.crear("Empresa Demo", "B12345678")
    cliente = ClienteRepository.obtener_por_id(cliente_id)
    assert cliente["empresa"] == "Empresa Demo"
```

## Integrazio-proba

Gainera, **integrazio-proba** bat sortu dugu, negozio-fluxu osoa jarraituz:

1. Bezero bat sortu.
2. Gaia erregistratu.
3. Oinarrizko formakuntza sortu.
4. Bezero horrek kontratatu.
5. Saio bat programatu.
6. Interakzio komertzial bat erregistratu.
7. Eranskin bat gehitu.

Horrela, sistemako entitate guztiak batera funtzionatzen dutela egiaztatzen da.

## Ondorioa

Fase honetan gure planifikatzailearen **datuen geruza** amaitu dugu:

- SQLite datu-base sendoa.
- Konexio-kudeatzaile zentralizatua.
- Entitate guztietarako CRUD biltegiak.
- Pytest bidezko unitate- eta integrazio-probak.

Proiektuak orain **oinarri sendoa** dauka, eta horren gainean eraikiko ditugu negozio-logika eta erabiltzaile-interfazea hurrengo faseetan.

👉 Hurrengo artikuluan **domeinu-geruza** landuko dugu: objektu orientatutako klaseak sortuz (bezeroak, formakuntzak, kontratazioak, saioak eta interakzioak), eta lehen negozio-logika txertatuz.