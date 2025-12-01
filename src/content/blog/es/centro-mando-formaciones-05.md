---
title: "Centro de mando de formaciones (V):Clases de dominio y trazabilidad con logging"
description: "Quinta entrega: dotamos de inteligencia a nuestro planificador. Implementamos las clases de dominio, integramos validaciones y un sistema de logging que registra toda la actividad del proyecto."
pubDate: "2025-10-11"
lang: "es"
summary: "En esta quinta entrega damos un paso clave en la evolución de nuestro planificador de formaciones: construimos las clases de dominio, incorporamos validaciones y añadimos un sistema de logging robusto que registra cada acción, éxito o error de manera centralizada."
author: "Juan Carlos Beaskoetxea"
categories:
  - Gestión de Formaciones
  - Castellano
tags:
  - Formación
  - Productividad
  - Automatización
  - PyQt
  - Python
  - Agenda visual
  - Logging
  - Software a medida
tkey: "centro-mando-formaciones-05"
---

# Clases de dominio y trazabilidad con logging

En la entrega anterior construimos la **capa de datos**: el esqueleto que almacena toda la información del planificador.  
En esta quinta entrega damos un paso más: implementamos la **capa de dominio**, es decir, las clases que representan las entidades principales del sistema y que encapsulan las reglas de negocio y validación.  

Además, integramos un sistema de **logging centralizado**, que nos permite registrar todo lo que ocurre en la aplicación: creación de objetos, validaciones, errores, advertencias y cálculos internos. Este registro será clave para depurar, auditar y comprender el comportamiento del sistema cuando crezca.

## Capa de dominio: el corazón del sistema

Cada clase del dominio representa una entidad funcional de nuestro planificador:

- **Cliente** → empresa o persona que contrata formaciones.  
- **Tema** → catálogo de temáticas formativas.  
- **FormacionBase** → definición genérica de una formación (por ejemplo, “Excel Básico”).  
- **Contratacion** → instancia específica de una formación impartida a un cliente.  
- **Sesion** → una sesión concreta dentro de una contratación.  
- **Adjunto** → documentos asociados (contratos, guiones, temarios).  
- **InteraccionCliente** → registro de contactos, negociaciones y seguimiento comercial (mini-CRM).

Cada clase se valida a sí misma al instanciarse y, si detecta datos incoherentes, lanza excepciones que quedan registradas automáticamente en el log.


## Integración del sistema de logging

Hemos diseñado un módulo común `planificador/common/registro.py` que centraliza la configuración del logging para toda la aplicación.

Ejemplo simplificado de configuración:

```python
import logging
from pathlib import Path

def configurar_registro(archivo=None, nivel_texto="INFO", forzar=False):
    archivo = archivo or Path(__file__).resolve().parents[2] / "planificador.log"
    nivel = getattr(logging, nivel_texto.upper(), logging.INFO)

    logging.basicConfig(
        level=nivel,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        handlers=[logging.FileHandler(archivo, encoding="utf-8"), logging.StreamHandler()],
        force=forzar
    )

def get_logger(nombre):
    return logging.getLogger(nombre)
```

Gracias a este sistema, cualquier clase puede registrar eventos mediante:

```python
from planificador.common.registro import get_logger
log = get_logger(__name__)
```

### Ejemplo: clase Cliente

```python
from datetime import datetime
from planificador.common.registro import get_logger

log = get_logger(__name__)

class Cliente:
    def __init__(self, empresa, cif, persona_contacto=None, telefono=None,
                 email=None, direccion=None, notas=None, color_hex="#377eb8", id_cliente=None):
        self.id_cliente = id_cliente
        self.empresa = empresa
        self.cif = cif
        self.persona_contacto = persona_contacto
        self.telefono = telefono
        self.email = email
        self.direccion = direccion
        self.notas = notas
        self.color_hex = color_hex
        self.created_at = datetime.now().isoformat()

        self._validar()
        log.info(f"Cliente creado: {self.empresa} ({self.cif}), id={self.id_cliente or 'pendiente'}")

    def _validar(self):
        if not self.empresa:
            log.error("Error al crear Cliente: falta 'empresa'")
            raise ValueError("El campo 'empresa' es obligatorio")
        if not self.cif:
            log.error("Error al crear Cliente: falta 'cif'")
            raise ValueError("El campo 'cif' es obligatorio")
```

Este patrón se repite en todas las clases del dominio, garantizando trazabilidad y consistencia.

### Pruebas de logging

Para asegurar la calidad del sistema, hemos creado tests unitarios específicos para cada clase del dominio.

Ejemplo: `tests/dominio/test_logging_cliente.py`

```python
import pytest
from planificador.dominio.modelos.cliente import Cliente
from planificador.common.registro import configurar_registro

@pytest.fixture(autouse=True)
def setup_logging(tmp_path):
    log_file = tmp_path / "cliente.log"
    configurar_registro(archivo=log_file, nivel_texto="DEBUG", forzar=True)
    return log_file

def test_logging_cliente_ok(setup_logging):
    log_file = setup_logging
    Cliente(empresa="Empresa Demo", cif="B12345678", email="test@demo.com")
    contenido = log_file.read_text(encoding="utf-8")
    assert "Cliente" in contenido
    assert "creado" in contenido
```

Cada clase del dominio tiene su propio conjunto de pruebas de logging (Cliente, Tema, FormacionBase, Contratacion, Sesion, Adjunto, InteraccionCliente).

### Pruebas de integración

Además de las pruebas unitarias, hemos desarrollado dos tests de integración:

#### 1. Flujo completo (sin errores)

Simula el recorrido natural de la aplicación:

1. Crear un cliente
2. Registrar un tema
3. Crear una formación base
4. Contratarla
5. Programar una sesión
6. Asociar un adjunto
7. Registrar una interacción comercial

El test valida que el log contiene todos los pasos:

```python
Copiar código
assert "Cliente" in contenido
assert "Tema" in contenido
assert "FormacionBase" in contenido
assert "Contratacion" in contenido or "Contratación" in contenido
assert "Sesion" in contenido or "Sesión" in contenido
assert "Adjunto" in contenido
assert "Interaccion" in contenido
```

#### 2. Flujo con errores

Comprueba que el sistema registra adecuadamente los fallos más comunes:

- Cliente sin empresa.
- Sesión con horas inválidas.
- Adjunto sin ruta.
- Interacción con tipo no permitido.

El test confirma que los errores quedan reflejados en el log con los niveles apropiados (ERROR y WARNING).

## Un registro que cuenta historias

Con esta fase hemos completado la **capa de dominio**, dotando al sistema de:

- Validaciones consistentes en todas las clases.
- Trazabilidad total mediante logging centralizado.
- Tests unitarios y de integración para validar comportamientos correctos y errores.

El **log del planificador** ya es capaz de contar la historia completa de cada acción: desde que un cliente se da de alta hasta que se registra una interacción comercial o un error de validación.

## Próximos pasos

En la siguiente entrega abordaremos la **capa de servicios**: exportaciones, sincronización con Google Calendar y backups automáticos.
Será el siguiente paso para convertir este planificador en una herramienta completa y profesional.

## 🧭 Resumen de la Fase 3:

- Se implementaron las clases de dominio (Cliente, Tema, FormacionBase, Contratacion, Sesion, Adjunto, InteraccionCliente).
- Se añadió un sistema de logging centralizado.
- Se validaron los datos con excepciones controladas.
- Se crearon pruebas unitarias e integraciones completas (flujos correctos y con errores).

El proyecto alcanza así un nuevo nivel de robustez y trazabilidad.