---
title: "Centro de mando de formaciones (VI):Servicios de exportación, sincronización y copias de seguridad"
description: "Sexta entrega del proyecto Planificador: en esta fase desarrollamos los servicios transversales que amplían la funcionalidad del sistema — exportación de datos, sincronización con Google Calendar y sistema de copias de seguridad automáticas."
pubDate: "2025-10-13"
lang: "es"
summary: "El proyecto Planificador alcanza un punto de madurez importante con la implementación de servicios que garantizan la interoperabilidad, la seguridad de la información y la trazabilidad. En esta sexta entrega abordamos la exportación, sincronización y los backups automáticos."
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
  - Copias de seguridad
  - Exportación
  - Sincronización
tkey: "centro-mando-formaciones-06"
---

# Servicios de exportación, sincronización y copias de seguridad

Nuestro **planificador de formaciones** continúa creciendo y, con esta sexta entrega, alcanzamos un nivel de madurez técnica clave:  
hemos desarrollado los **servicios transversales** que garantizan la integridad de los datos, la interoperabilidad con otros sistemas y la seguridad de la información.

Estos servicios no forman parte del núcleo de datos ni de la lógica de negocio, pero son **imprescindibles** para un entorno real de trabajo.

---

## 1️⃣ Servicio de exportación

El primero de los servicios implementados ha sido el **módulo de exportación**, cuyo objetivo es permitir al usuario sacar información del sistema en distintos formatos estándar.

Este módulo, `exportacion_servicio.py`, ofrece tres funcionalidades principales:

- **Exportación a CSV** → para hojas de cálculo y análisis de datos.  
- **Exportación a iCal (.ics)** → para calendarios externos.  
- **Exportación a PDF** → para informes rápidos.

Su estructura mantiene la coherencia con el resto del proyecto: clases estáticas, manejo de errores y **logging centralizado**.

```python
from planificador.data.db_manager import get_connection
import csv, logging
from pathlib import Path

class ServicioExportacion:

    @staticmethod
    def exportar_csv(nombre_tabla: str, ruta_destino: Path) -> Path:
        with get_connection() as conn:
            cursor = conn.execute(f"SELECT * FROM {nombre_tabla}")
            columnas = [d[0] for d in cursor.description]
            registros = cursor.fetchall()
        with open(ruta_destino, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(columnas)
            writer.writerows([tuple(r) for r in registros])
        return ruta_destino
```

### 🔍 Resultado

El método genera archivos CSV legibles, con encabezados automáticos y codificación UTF-8, dejando constancia de la operación en el log exportacion.log.

## 2️⃣ Servicio de sincronización (Google Calendar simulado)

El segundo módulo, `sincronizacion_servicio.py`, prepara el terreno para la integración con **Google Calendar**.
Aunque en esta fase la sincronización es **simulada**, la arquitectura ya está diseñada para admitir tokens OAuth y operaciones reales de API en el futuro.

Cuenta con tres métodos clave:

- exportar_a_google_calendar(sesiones): Simula la exportación de eventos desde el planificador.
- importar_desde_google_calendar(): Devuelve una lista de eventos simulados para pruebas.
- verificar_credenciales(): Comprueba la disponibilidad de credenciales (modo simulado).

Gracias al logging, el sistema deja rastro de todas las operaciones de sincronización, con registros de tipo *INFO* y *ERROR* según el resultado.

## 3️⃣ Servicio de copias de seguridad

Por último, el módulo `backup_servicio.py` introduce una funcionalidad esencial: las **copias de seguridad automáticas** del archivo principal de la base de datos (`planificador.db`).

Este servicio permite:

- Crear un backup con fecha y hora en el nombre.
- Mantener solo las últimas n copias (rotación automática).
- Restaurar una copia anterior en caso de error o pérdida de datos.

```python
import shutil
from pathlib import Path
from datetime import datetime

class ServicioBackup:

    @staticmethod
    def realizar_backup(db_path: Path, carpeta_destino: Path, max_copias: int = 5) -> Path:
        carpeta_destino.mkdir(parents=True, exist_ok=True)
        fecha = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = carpeta_destino / f"planificador_backup_{fecha}.db"
        shutil.copy2(db_path, backup_path)
        return backup_path
```

Cada acción queda reflejada en el archivo `backup.log`, donde se registran tanto la creación como la eliminación de copias antiguas y las restauraciones realizadas.

## 4️⃣ Pruebas unitarias y de integración

Como en todas las fases anteriores, la validación del código ha sido prioritaria.
Se han creado pruebas específicas para cada servicio dentro de `tests/servicios/`:

- test_exportacion_csv.py
- test_sincronizacion_servicio.py
- test_backup_servicio.py

Estas pruebas verifican que:

- Los archivos CSV se crean correctamente.
- La simulación de sincronización produce los eventos esperados.
- Los backups se generan, rotan y restauran sin errores.

Los tests han pasado **100% exitosos**, confirmando la estabilidad de los módulos.

## 5️⃣ Conclusiones de la fase

Con esta entrega el proyecto Planificador incorpora:

- ✅ Exportación de datos en tres formatos (CSV, iCal, PDF).
- ✅ Simulación de sincronización con Google Calendar.
- ✅ Sistema completo de backups con rotación.
- ✅ Registro detallado de cada operación en logs específicos.
- ✅ Pruebas automáticas de todos los servicios.

El sistema ya puede **proteger, compartir y conservar su información**, convirtiéndose en una herramienta robusta, preparada para el siguiente gran paso: la interfaz gráfica.

📅 En la próxima entrega entraremos en la **capa de interfaz (UI)**, donde daremos forma visual al calendario, las fichas de clientes y el flujo de trabajo diario.

🧩 **Seguimos avanzando, paso a paso, hacia un planificador visual, potente y totalmente personalizable.**