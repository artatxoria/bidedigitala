---
title: "Centro de mando de formaciones (VIII): Automatismos, recordatorios y experiencia integrada"
description: "Octava entrega: cerramos la integración funcional del planificador de formaciones. Añadimos recordatorios automáticos, formularios vinculados y automatismos entre calendario, sesiones e interacciones."
pubDate: "2025-10-15"
lang: "es"
summary: "En esta octava entrega culminamos la integración funcional del planificador de formaciones. Los módulos de recordatorios, interacciones y sesiones ya trabajan de forma automática y sincronizada. Incorporamos además la vista de Recordatorios, con notificaciones y avisos locales."
author: "Juan Carlos Beaskoetxea"
categories:
  - Gestión de Formaciones
  - Castellano
tags:
  - PyQt6
  - Python
  - Automatización
  - Recordatorios
  - Calendario
  - CRM
  - UX
tkey: "centro-mando-formaciones-08"
---

# Automatismos, recordatorios y experiencia integrada

Esta fase 8 representa el **cierre funcional del desarrollo**:  
hemos conectado todas las piezas — *datos, lógica de negocio y UI* — para que el sistema funcione como un **centro de mando de formaciones totalmente operativo**.

El planificador ahora **genera recordatorios automáticos**, **sincroniza sesiones con interacciones** y muestra todo en una nueva **vista de Recordatorios** integrada en la interfaz principal.

---

## 1. Servicio de recordatorios automáticos (`servicio_recordatorios.py`)

El servicio centraliza la lógica de generación, comprobación y aviso de recordatorios.  
Se apoya en las interacciones comerciales y las sesiones programadas.

```python
from datetime import datetime, timedelta
from planificador.data.repositories.interaccion_repo import InteraccionRepository
from planificador.data.repositories.sesion_repo import SesionRepository
from planificador.data.repositories.recordatorio_repo import RecordatorioRepository
from planificador.common.registro import get_logger

log = get_logger(__name__)

class ServicioRecordatorios:
    """
    Gestiona la creación y verificación de recordatorios automáticos
    a partir de interacciones y sesiones planificadas.
    """

    @staticmethod
    def generar_desde_interacciones():
        interacciones = InteraccionRepository.listar_todas()
        nuevos = []
        for inter in interacciones:
            if not inter.get("crear_recordatorio"):
                continue
            fecha_accion = inter.get("fecha_proxima_accion")
            if not fecha_accion:
                continue

            recordatorio = {
                "tipo": inter["tipo"],
                "cliente": inter["id_cliente"],
                "fecha": fecha_accion,
                "descripcion": inter.get("proxima_accion", ""),
            }
            RecordatorioRepository.crear(recordatorio)
            nuevos.append(recordatorio)
            log.info(f"Recordatorio generado desde interacción {inter['id_interaccion']}: {recordatorio}")

        log.info(f"Total recordatorios generados: {len(nuevos)}")
        return nuevos

    @staticmethod
    def comprobar_sesiones_proximas(horas_anticipacion=24):
        """
        Devuelve lista de sesiones próximas dentro del rango de anticipación (horas).
        """
        sesiones = SesionRepository.listar_todas()
        proximas = []
        ahora = datetime.now()
        for ses in sesiones:
            fecha_sesion = datetime.strptime(
                f"{ses['fecha']} {ses['hora_inicio']}", "%Y-%m-%d %H:%M"
            )
            diff = fecha_sesion - ahora
            if timedelta(0) <= diff <= timedelta(hours=horas_anticipacion):
                proximas.append(ses)
        return proximas

    @staticmethod
    def avisar_proximos_eventos():
        """
        Combina interacciones y sesiones próximas en una lista de avisos.
        """
        avisos = []
        interacciones = InteraccionRepository.listar_todas()
        sesiones = ServicioRecordatorios.comprobar_sesiones_proximas()

        for i in interacciones:
            if i.get("fecha_proxima_accion") == datetime.now().strftime("%Y-%m-%d"):
                avisos.append({
                    "tipo": "interacción",
                    "cliente": i["id_cliente"],
                    "descripcion": i.get("proxima_accion", ""),
                    "fecha": i["fecha_proxima_accion"]
                })

        for s in sesiones:
            avisos.append({
                "tipo": "sesión",
                "cliente": s["id_contratacion"],
                "descripcion": f"Sesión próxima ({s['fecha']} {s['hora_inicio']})",
                "fecha": s["fecha"]
            })

        log.info(f"Generados {len(avisos)} avisos combinados.")
        return avisos
```

## 2. Repositorio de recordatorios (recordatorio_repo.py)

Un nuevo repositorio en `planificador/data/repositories/` dedicado a almacenar los recordatorios generados.

```python
from planificador.data.db_manager import get_connection
from planificador.common.registro import get_logger

log = get_logger(__name__)

class RecordatorioRepository:
    """
    Repositorio CRUD para los recordatorios automáticos.
    """

    @staticmethod
    def crear(recordatorio):
        with get_connection() as conn:
            conn.execute("""
                INSERT INTO Recordatorio (tipo, cliente, fecha, descripcion)
                VALUES (?, ?, ?, ?)
            """, (recordatorio["tipo"], recordatorio["cliente"],
                  recordatorio["fecha"], recordatorio["descripcion"]))
            conn.commit()

    @staticmethod
    def listar_todos():
        with get_connection() as conn:
            cur = conn.execute("""
                SELECT id, tipo, cliente, fecha, descripcion
                FROM Recordatorio
                ORDER BY fecha ASC
            """)
            return [dict(row) for row in cur.fetchall()]
```

## 3. Vista de recordatorios (vista_recordatorios.py)

Un módulo completamente nuevo en la capa UI, integrado como una pestaña adicional en la interfaz principal.

```python
from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QTableWidget, QTableWidgetItem,
    QPushButton, QHBoxLayout, QMessageBox
)
from planificador.common.registro import get_logger

log = get_logger(__name__)

try:
    from planificador.data.repositories.recordatorio_repo import RecordatorioRepository
    from planificador.servicios.servicio_recordatorios import ServicioRecordatorios
except Exception:
    RecordatorioRepository = None
    ServicioRecordatorios = None
    log.warning("Repositorios o servicios no disponibles en vista_recordatorios.")

class VistaRecordatorios(QWidget):
    """
    Vista para consultar y generar recordatorios automáticos.
    """

    def __init__(self, parent=None):
        super().__init__(parent)

        layout = QVBoxLayout()
        self.setLayout(layout)

        titulo = QLabel("Recordatorios automáticos")
        titulo.setStyleSheet("font-size: 18px; font-weight: bold; margin-bottom: 8px;")
        layout.addWidget(titulo)

        self.tabla = QTableWidget()
        self.tabla.setColumnCount(4)
        self.tabla.setHorizontalHeaderLabels(["Tipo", "Cliente", "Fecha", "Descripción"])
        layout.addWidget(self.tabla)

        botones = QHBoxLayout()
        self.btn_recargar = QPushButton("Recargar")
        self.btn_generar = QPushButton("Generar desde interacciones")
        botones.addWidget(self.btn_recargar)
        botones.addWidget(self.btn_generar)
        layout.addLayout(botones)

        self.btn_recargar.clicked.connect(self.cargar_recordatorios)
        self.btn_generar.clicked.connect(self.generar_desde_interacciones)

        self.cargar_recordatorios()

    def cargar_recordatorios(self):
        self.tabla.setRowCount(0)
        if not RecordatorioRepository:
            QMessageBox.warning(self, "Error", "Repositorio no disponible.")
            return

        try:
            datos = RecordatorioRepository.listar_todos()
            if not datos:
                log.info("No hay recordatorios disponibles.")
                return
            self.tabla.setRowCount(len(datos))
            for i, rec in enumerate(datos):
                self.tabla.setItem(i, 0, QTableWidgetItem(str(rec.get("tipo", ""))))
                self.tabla.setItem(i, 1, QTableWidgetItem(str(rec.get("cliente", ""))))
                self.tabla.setItem(i, 2, QTableWidgetItem(str(rec.get("fecha", ""))))
                self.tabla.setItem(i, 3, QTableWidgetItem(str(rec.get("descripcion", ""))[:100]))
        except Exception as e:
            log.error(f"Error al cargar recordatorios: {e}")
            QMessageBox.warning(self, "Error", f"No se pudieron cargar recordatorios: {e}")

    def generar_desde_interacciones(self):
        if not ServicioRecordatorios:
            QMessageBox.warning(self, "Error", "Servicio no disponible.")
            return
        try:
            nuevos = ServicioRecordatorios.generar_desde_interacciones()
            QMessageBox.information(self, "Recordatorios", f"Generados {len(nuevos)} nuevos recordatorios.")
            self.cargar_recordatorios()
        except Exception as e:
            log.error(f"Error generando recordatorios: {e}")
            QMessageBox.warning(self, "Error", f"No se pudieron generar recordatorios: {e}")
```

## 4. Integración en la interfaz principal (main_window.py)

El módulo `main_window.py` se amplía con una pestaña adicional para **Recordatorios**, consolidando todas las funciones en un solo entorno.

```python
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QListWidget,
    QStackedWidget, QStatusBar, QMessageBox
)
from PyQt6.QtGui import QAction
import sys

from planificador.ui.vistas.vista_clientes import VistaClientes
from planificador.ui.vistas.vista_calendario import VistaCalendario
from planificador.ui.vistas.vista_formaciones import VistaFormaciones
from planificador.ui.vistas.vista_interacciones import VistaInteracciones
from planificador.ui.vistas.vista_configuracion import VistaConfiguracion
from planificador.ui.vistas.vista_recordatorios import VistaRecordatorios

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Planificador de Formaciones")
        self.resize(1200, 800)

        contenedor = QWidget()
        layout = QHBoxLayout(contenedor)

        self.menu_lateral = QListWidget()
        self.menu_lateral.addItems([
            "Clientes", "Calendario", "Formaciones", "Interacciones", "Recordatorios", "Configuración"
        ])
        self.menu_lateral.setMaximumWidth(200)
        self.menu_lateral.currentRowChanged.connect(self._cambiar_vista)

        self.vistas = QStackedWidget()
        self.vistas.addWidget(VistaClientes())
        self.vistas.addWidget(VistaCalendario())
        self.vistas.addWidget(VistaFormaciones())
        self.vistas.addWidget(VistaInteracciones())
        self.vistas.addWidget(VistaRecordatorios())
        self.vistas.addWidget(VistaConfiguracion())

        layout.addWidget(self.menu_lateral)
        layout.addWidget(self.vistas, 1)
        self.setCentralWidget(contenedor)
        self.setStatusBar(QStatusBar())

    def _cambiar_vista(self, indice):
        self.vistas.setCurrentIndex(indice)

def main():
    app = QApplication(sys.argv)
    ventana = MainWindow()
    ventana.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
```

## Resultado final

Con esta integración, el planificador de formaciones ya:

- ✅ Genera **recordatorios automáticos** desde interacciones y sesiones.
- ✅ Muestra avisos en una **vista dedicada** dentro de la interfaz.
- ✅ Permite gestionar próximas acciones y avisos desde un solo lugar.
- ✅ Mantiene coherencia total entre **interacciones, sesiones y contrataciones**.
- ✅ Mejora la experiencia de usuario con un flujo más natural y visual.

## Próximos pasos

En la siguiente entrega cerraremos el ciclo con la **publicación del ejecutable** y la **documentación técnica completa** del proyecto.

El planificador ya no es solo una agenda, sino un **centro de mando inteligente** que conecta todos los procesos de formación y relación con clientes.