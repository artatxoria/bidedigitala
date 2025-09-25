---
title: "Implementación de la capa de datos: estructura, repositorios y pruebas"
description: "Cuarta entrega: entramos en un terreno clave: la capa de datos, es decir, todo lo que tiene que ver con almacenar, consultar y mantener la información de nuestro planificador de formaciones."
pubDate: "2025-09-25"
lang: "es"
summary: "En los posts anteriores definimos los objetivos del proyecto, diseñamos la arquitectura y dimos los primeros pasos de implementación. En este cuarto artículo entramos en un terreno clave: la capa de datos, es decir, todo lo que tiene que ver con almacenar, consultar y mantener la información de nuestro planificador de formaciones."
author: "Juan Carlos Beaskoetxea"
tags:
  - Formación
  - Productividad
  - Automatización
  - PyQt
  - Python
  - Agenda visual
  - Software a medida
tkey: "centro-mando-formaciones-04"
---

# Implementación de la capa de datos: estructura, repositorios y pruebas

En los posts anteriores definimos los objetivos del proyecto, diseñamos la arquitectura y dimos los primeros pasos de implementación. En este cuarto artículo entramos en un terreno clave: la **capa de datos**, es decir, todo lo que tiene que ver con almacenar, consultar y mantener la información de nuestro planificador de formaciones.

## Diseño físico de la base de datos

Hemos elegido **SQLite** como motor por su sencillez y su integración nativa con Python. El esquema contempla todas las entidades que definimos en la fase de análisis:

- Cliente → información de las empresas y personas de contacto.
- Tema → catálogo de temáticas formativas.
- FormacionBase → catálogo de formaciones generales (ej. “Excel Básico”).
- ContratacionClienteFormacion → cada curso contratado por un cliente concreto.
- Sesion → sesiones individuales de cada contratación.
- Adjunto → ficheros asociados (contratos, guiones, etc.).
- InteraccionCliente → histórico de interacciones comerciales (mini-CRM).

El esquema completo se encuentra en planificador/data/schema.sql. Un fragmento de ejemplo:

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

## Gestor de base de datos (*db_manager.py*)

Para trabajar con SQLite de manera centralizada, hemos creado un **gestor de conexiones**:

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

Este módulo nos permite inicializar la base de datos y obtener conexiones seguras para trabajar con claves foráneas.

## Repositorios CRUD

Cada entidad del modelo de datos tiene su propio repositorio en planificador/data/repositories/. Estos repositorios encapsulan las operaciones CRUD (**crear, leer, actualizar, borrar**), manteniendo la lógica de acceso a datos separada de la lógica de negocio.

Ejemplo: repositorio de **Cliente** (*cliente_repo.py*):

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

    @staticmethod
    def obtener_por_id(id_cliente):
        with get_connection() as conn:
            return conn.execute("SELECT * FROM Cliente WHERE id_cliente=?", (id_cliente,)).fetchone()

    @staticmethod
    def listar():
        with get_connection() as conn:
            return conn.execute("SELECT * FROM Cliente ORDER BY empresa").fetchall()

    @staticmethod
    def actualizar(id_cliente, **campos):
        if not campos:
            return
        sets = ", ".join(f"{k}=?" for k in campos)
        valores = list(campos.values()) + [id_cliente]
        with get_connection() as conn:
            conn.execute(f"UPDATE Cliente SET {sets} WHERE id_cliente=?", valores)
            conn.commit()

    @staticmethod
    def borrar(id_cliente):
        with get_connection() as conn:
            conn.execute("DELETE FROM Cliente WHERE id_cliente=?", (id_cliente,))
            conn.commit()
```

De igual forma hemos implementado repositorios para **Tema, FormacionBase, ContratacionClienteFormacion, Sesion, Adjunto e InteraccionCliente**.

## Pruebas unitarias con Pytest

Para garantizar que todo funciona, hemos creado **tests unitarios** que validan las operaciones básicas de cada repositorio.

Ejemplo: prueba para *ClienteRepository* (*tests/test_cliente_repo.py*):

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

    ClienteRepository.actualizar(cliente_id, empresa="Empresa Modificada")
    cliente = ClienteRepository.obtener_por_id(cliente_id)
    assert cliente["empresa"] == "Empresa Modificada"

    ClienteRepository.borrar(cliente_id)
    assert ClienteRepository.obtener_por_id(cliente_id) is None
```

## Prueba de integración

Además, hemos preparado un **test de integración** que recorre todo el flujo de negocio:

1. Crear un cliente.
2. Registrar un tema.
3. Crear una formación base.
4. Contratarla para ese cliente.
5. Programar una sesión.
6. Registrar una interacción comercial.
7. Asociar un adjunto.

El test valida que todos los repositorios funcionan juntos y que la base de datos mantiene la integridad.

## Conclusión

Con esta fase hemos completado la **capa de datos** de nuestro planificador:

- Base de datos SQLite con esquema sólido.
- Gestor de conexiones centralizado.
- Repositorios CRUD para todas las entidades.
- Tests unitarios y de integración que validan la implementación.

El proyecto ahora cuenta con un **pilar estable** sobre el que construiremos la lógica de negocio y la interfaz de usuario en las siguientes fases.

👉 En el próximo post abordaremos la **capa de dominio**, definiendo clases orientadas a objetos que representen clientes, formaciones, contrataciones, sesiones e interacciones, y añadiendo la primera lógica de negocio real.