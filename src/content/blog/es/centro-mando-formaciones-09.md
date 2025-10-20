---
title: "Centro de mando de formaciones (IX): Extensión del modelo de clientes y flujo comercial automatizado"
description: "Novena entrega: ampliamos el modelo de datos con clientes finales, contactos y participantes. Refinamos los repositorios, ajustamos servicios y completamos la automatización de recordatorios y sesiones."
pubDate: "2025-10-19"
lang: "es"
summary: "En esta fase ampliamos el modelo de cliente y su relación con las contrataciones y formaciones. Añadimos entidades de cliente final, contactos y participantes, mejoramos el flujo comercial y validamos los servicios de recordatorios y sesiones mediante tests unitarios."
author: "Juan Carlos Beaskoetxea"
tags:
  - Python
  - PyQt6
  - SQLite
  - Automatización
  - CRM
  - Formación
  - Testing
tkey: "centro-mando-formaciones-09"
---

# Extensión del modelo de clientes y flujo comercial automatizado

La fase 9 ha supuesto una **evolución estructural** del proyecto:  
hemos ampliado el modelo de datos para representar relaciones comerciales más realistas —incluyendo **clientes finales**, **contactos asociados** y **participantes de formaciones**— y hemos perfeccionado la capa de servicios y repositorios para unificar el flujo entre **interacciones, sesiones y recordatorios automáticos**.

## 1. Ampliación del modelo de datos

El modelo inicial de cliente se ha extendido con nuevas entidades que permiten gestionar relaciones más complejas entre empresas, personas de contacto y asistentes.

### Nuevas entidades:
- **ClienteFinal**: representa el cliente receptor de la formación (puede diferir del cliente contratante).
- **ContactoClienteFinal**: gestiona las personas implicadas en la formación (encargado, coordinador, participante, etc.).
- **Participante**: alumnos o asistentes de las formaciones.

El nuevo modelo de datos permite asignar un `id_cliente_final` opcional a cada **contratación**, manteniendo la trazabilidad completa desde la relación comercial hasta la ejecución formativa.



## 2. Actualización de repositorios

### 2.1. `interaccion_repo.py`

Se actualizó para **aceptar nuevos estados de resultado** como `propuesta`, asegurando compatibilidad con las acciones comerciales reales y con el servicio de recordatorios.

```python
from planificador.data.db_manager import get_connection
import logging

logger = logging.getLogger(__name__)

class InteraccionRepository:

    @staticmethod
    def crear(id_cliente, fecha, tipo, descripcion=None,
              resultado="pendiente", proxima_accion=None,
              fecha_proxima_accion=None, crear_recordatorio=False):
        with get_connection() as conn:
            cur = conn.execute("""
                INSERT INTO InteraccionCliente (
                    id_cliente, fecha, tipo, descripcion, resultado,
                    proxima_accion, fecha_proxima_accion, crear_recordatorio
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (id_cliente, fecha, tipo, descripcion, resultado,
                  proxima_accion, fecha_proxima_accion, int(crear_recordatorio)))
            conn.commit()
            logger.info(f"Nueva interacción creada para cliente {id_cliente} ({tipo})")
            return cur.lastrowid

    @staticmethod
    def listar_todas():
        with get_connection() as conn:
            cur = conn.execute("""
                SELECT * FROM InteraccionCliente ORDER BY fecha DESC
            """)
            columnas = [c[0] for c in cur.description]
            return [dict(zip(columnas, fila)) for fila in cur.fetchall()]
```

### 2.2. sesion_repo.py

Se añadió la gestión de logs internos y se corrigió la duplicidad de decoradores.
Este cambio no altera la funcionalidad, pero garantiza trazabilidad y evita errores en los tests.

```python
import logging
from planificador.data.db_manager import get_connection

logger = logging.getLogger(__name__)

class SesionRepository:

    @staticmethod
    def crear(id_contratacion, fecha=None, hora_inicio=None, hora_fin=None,
              direccion=None, enlace_vc=None, estado="propuesta", notas=None):
        """
        Crea una nueva sesión. Permite registrar propuestas sin fecha ni hora aún definidas.
        """
        with get_connection() as conn:
            cur = conn.execute("""
                INSERT INTO Sesion (id_contratacion, fecha, hora_inicio, hora_fin,
                                    direccion, enlace_vc, estado, notas)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (id_contratacion, fecha, hora_inicio, hora_fin, direccion, enlace_vc, estado, notas))
            conn.commit()
            logger.info(f"Sesión creada: estado={estado}, contratación={id_contratacion}, fecha={fecha or 'sin definir'}")
            return cur.lastrowid

    @staticmethod
    def listar_todas():
        with get_connection() as conn:
            cur = conn.execute("""
                SELECT id_sesion, id_contratacion, fecha, hora_inicio, hora_fin,
                    direccion, enlace_vc, estado, notas
                FROM Sesion
                ORDER BY fecha ASC, hora_inicio ASC
            """)
            columnas = [c[0] for c in cur.description]
            return [dict(zip(columnas, fila)) for fila in cur.fetchall()]
```

## 3. Servicio de recordatorios revisado

El servicio se ha perfeccionado para combinar interacciones y sesiones dentro de un sistema único de avisos.

```python
import logging
from datetime import datetime, timedelta
from planificador.data.repositories.interaccion_repo import InteraccionRepository
from planificador.data.repositories.sesion_repo import SesionRepository

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class ServicioRecordatorios:
    """
    Servicio para generar recordatorios automáticos a partir de interacciones
    y comprobar avisos próximos en sesiones y contactos comerciales.
    """

    @staticmethod
    def generar_desde_interacciones():
        interacciones = InteraccionRepository.listar_todas()
        recordatorios = []

        for inter in interacciones:
            if (
                inter["crear_recordatorio"]
                and inter["fecha_proxima_accion"]
                and datetime.strptime(inter["fecha_proxima_accion"], "%Y-%m-%d")
                >= datetime.now()
            ):
                recordatorio = {
                    "tipo": inter["tipo"],
                    "cliente": inter["id_cliente"],
                    "fecha": inter["fecha_proxima_accion"],
                    "descripcion": inter["proxima_accion"] or inter["descripcion"],
                }
                recordatorios.append(recordatorio)
                logger.info(f"Recordatorio generado desde interacción {inter['id_interaccion']}: {recordatorio}")

        logger.info(f"Total recordatorios generados: {len(recordatorios)}")
        return recordatorios

    @staticmethod
    def comprobar_sesiones_proximas(horas_anticipacion=24):
        sesiones = SesionRepository.listar_todas()
        ahora = datetime.now()
        margen = ahora + timedelta(hours=horas_anticipacion)

        proximas = [
            s for s in sesiones
            if datetime.strptime(s["fecha"] + " " + s["hora_inicio"], "%Y-%m-%d %H:%M") <= margen
            and datetime.strptime(s["fecha"] + " " + s["hora_inicio"], "%Y-%m-%d %H:%M") >= ahora
        ]

        logger.info(f"Sesiones próximas en las próximas {horas_anticipacion}h: {len(proximas)}")
        return proximas

    @staticmethod
    def avisar_proximos_eventos():
        recordatorios = ServicioRecordatorios.generar_desde_interacciones()
        sesiones = ServicioRecordatorios.comprobar_sesiones_proximas()

        avisos = {
            "recordatorios_interacciones": recordatorios,
            "sesiones_proximas": sesiones,
        }

        logger.info(f"Avisos combinados generados: {avisos}")
        return avisos
```

## 4. Tests unitarios

Los tests garantizan la correcta creación de interacciones, sesiones y recordatorios, asegurando la coherencia del sistema.
En la fase 9, se depuraron todos los errores detectados en el módulo de pruebas y se validó su ejecución completa.

Ejemplo del test funcional `test_servicio_recordatorios.py`:

```python
from datetime import datetime, timedelta
from planificador.data.repositories.interaccion_repo import InteraccionRepository
from planificador.data.repositories.sesion_repo import SesionRepository
from planificador.data.repositories.contratacion_repo import ContratacionRepository
from planificador.servicios.servicio_recordatorios import ServicioRecordatorios

def test_avisar_proximos_eventos(tmp_path):
    c_id = ContratacionRepository.crear(
        id_cliente=1,
        id_formacion_base=1,
        expediente="EXP-002",
        precio_hora=40,
        horas_previstas=8,
        modalidad="presencial"
    )

    InteraccionRepository.crear(
        id_cliente=1,
        fecha="2025-10-10",
        tipo="reunion",
        descripcion="Revisión propuesta",
        resultado="propuesta",
        proxima_accion="Llamar confirmación",
        fecha_proxima_accion=(datetime.now() + timedelta(hours=12)).strftime("%Y-%m-%d"),
        crear_recordatorio=True,
    )

    SesionRepository.crear(
        id_contratacion=c_id,
        fecha=(datetime.now() + timedelta(hours=18)).strftime("%Y-%m-%d"),
        hora_inicio=(datetime.now() + timedelta(hours=18)).strftime("%H:%M"),
        hora_fin=(datetime.now() + timedelta(hours=20)).strftime("%H:%M"),
        direccion="Oficina Central",
        estado="programada",
    )

    avisos = ServicioRecordatorios.avisar_proximos_eventos()

    assert "recordatorios_interacciones" in avisos
    assert "sesiones_proximas" in avisos
    assert len(avisos["sesiones_proximas"]) >= 1
```

### Resultado de ejecución:

```bash
pytest -v tests/servicios/test_servicio_recordatorios.py
3 passed in 0.15s
```

## 5. Conclusiones

Con la fase 9 completada, el **planificador de formaciones** dispone ahora de:

- ✅ Un **modelo de cliente ampliado** con jerarquías entre empresa contratante y cliente final.
- ✅ Entidades para **contactos y participantes**, integradas en la capa de datos.
- ✅ Repositorios actualizados con trazabilidad y validación de estado.
- ✅ Un **servicio de recordatorios optimizado**, coherente con el flujo comercial.
- ✅ Tests unitarios **100% funcionales**, que validan la integración de interacciones y sesiones.

El sistema avanza hacia un **mini-CRM especializado en formación**, uniendo planificación, seguimiento y automatización comercial en una sola herramienta.

## Próximos pasos

En la fase 10 se abordará el **módulo de facturación automatizada**, con generación de facturas a partir de contrataciones y sesiones, exportación a PDF y gestión de estados (emitida, cobrada, cancelada).

Será el cierre de la capa administrativa del proyecto y el puente hacia las métricas analíticas de las fases siguientes.