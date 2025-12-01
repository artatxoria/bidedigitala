---
title: "Centro de mando de formaciones (VII):Interfaz gráfica con PyQt6: estructura modular y vistas funcionales"
description: "Séptima entrega: construimos la interfaz gráfica del planificador de formaciones con PyQt6, integrando las vistas y los datos en una arquitectura modular, clara y escalable."
pubDate: "2025-10-13"
lang: "es"
summary: "En esta séptima entrega abordamos uno de los hitos más esperados del proyecto: la creación de la interfaz gráfica completa con PyQt6. La aplicación ya permite navegar entre secciones, consultar los datos y gestionar la información de clientes, formaciones e interacciones desde una estructura modular y profesional."
author: "Juan Carlos Beaskoetxea"
categories:
  - Gestión de Formaciones
  - Castellano
tags:
  - PyQt6
  - Python
  - Productividad
  - Software a medida
  - Planificación
  - Interfaz gráfica
  - Programación modular
tkey: "centro-mando-formaciones-07"
---

# Interfaz gráfica con PyQt6: estructura modular y vistas funcionales

Llegamos a una de las fases más visibles del proyecto: la **interfaz gráfica**.  
Después de definir las capas de datos, dominio y servicios, tocaba integrar toda esa lógica en una interfaz cómoda, clara y funcional.  

Hemos elegido **PyQt6** como base tecnológica, por su potencia, estabilidad y capacidad de generar interfaces profesionales con una estructura modular.


## Estructura de la interfaz

La interfaz está organizada de forma limpia dentro de `planificador/ui/`:
```bash
ui/
├── main_window.py
└── vistas/
├── vista_clientes.py
├── vista_calendario.py
├── vista_formaciones.py
├── vista_interacciones.py
└── vista_configuracion.py
```

Cada vista corresponde a una sección de la aplicación y se carga dinámicamente desde el panel lateral.  
El objetivo es mantener el código **separado por responsabilidad**, facilitando futuras ampliaciones (formularios, drag&drop, filtros, etc.).

## La ventana principal (`main_window.py`)

La clase principal gestiona la estructura general de la aplicación: un panel lateral con botones de navegación y un área central donde se muestran las vistas.

```python
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QLabel, QStackedWidget
from planificador.ui.vistas.vista_clientes import VistaClientes
from planificador.ui.vistas.vista_calendario import VistaCalendario
from planificador.ui.vistas.vista_formaciones import VistaFormaciones
from planificador.ui.vistas.vista_interacciones import VistaInteracciones
from planificador.ui.vistas.vista_configuracion import VistaConfiguracion

class MainWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Planificador de formaciones")
        self.resize(1100, 700)

        layout = QHBoxLayout()
        self.setLayout(layout)

        # Panel lateral
        sidebar = QVBoxLayout()
        layout.addLayout(sidebar)

        botones = [
            ("Clientes", VistaClientes),
            ("Calendario", VistaCalendario),
            ("Formaciones", VistaFormaciones),
            ("Interacciones", VistaInteracciones),
            ("Configuración", VistaConfiguracion)
        ]

        self.stack = QStackedWidget()
        layout.addWidget(self.stack)

        for nombre, clase_vista in botones:
            btn = QPushButton(nombre)
            btn.clicked.connect(lambda _, c=clase_vista: self._mostrar_vista(c))
            sidebar.addWidget(btn)
            self.stack.addWidget(clase_vista())

        sidebar.addStretch()

        self._mostrar_vista(VistaClientes)

    def _mostrar_vista(self, clase_vista):
        for i in range(self.stack.count()):
            if isinstance(self.stack.widget(i), clase_vista):
                self.stack.setCurrentIndex(i)
                break

if __name__ == "__main__":
    import sys
    app = QApplication(sys.argv)
    ventana = MainWindow()
    ventana.show()
    sys.exit(app.exec())
```

La estructura es **sencilla pero potente**: permite añadir nuevas vistas sin tocar la lógica general.

### Las vistas: modulares y funcionales

Cada vista se centra en un ámbito del proyecto.

Por ejemplo, la de **clientes** muestra los datos de empresas y contactos; la de **formaciones** lista el catálogo de cursos; la de **interacciones** actúa como un mini-CRM para el seguimiento comercial.

Todas las vistas comparten el mismo patrón:

- Cargan datos desde sus repositorios (`ClienteRepository`, `FormacionBaseRepository`, `InteraccionRepository`...).
- Muestran los registros en tablas o listas.
- Incluyen botones de acción para recargar o añadir nuevos elementos.
- Generan mensajes claros cuando los repositorios aún no están disponibles.

Ejemplo: `vista_calendario.py`

```python
from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel, QCalendarWidget, QListWidget, QPushButton
from PyQt6.QtCore import QDate
from planificador.data.repositories.sesion_repo import SesionRepository

class VistaCalendario(QWidget):
    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()
        self.setLayout(layout)

        titulo = QLabel("Calendario")
        layout.addWidget(titulo)

        self.calendario = QCalendarWidget()
        self.calendario.selectionChanged.connect(self.cargar_sesiones)
        layout.addWidget(self.calendario)

        self.lista_sesiones = QListWidget()
        layout.addWidget(self.lista_sesiones)

        self.btn_recargar = QPushButton("Recargar sesiones")
        layout.addWidget(self.btn_recargar)
        self.btn_recargar.clicked.connect(self.cargar_sesiones)

        self.cargar_sesiones()

    def cargar_sesiones(self):
        fecha = self.calendario.selectedDate().toString("yyyy-MM-dd")
        self.lista_sesiones.clear()
        sesiones = SesionRepository.listar_por_fecha(fecha)
        if not sesiones:
            self.lista_sesiones.addItem(f"No hay sesiones para {fecha}")
            return
        for s in sesiones:
            self.lista_sesiones.addItem(f"{s['hora_inicio']} - {s['hora_fin']} | {s['direccion']}")
```

### Integración con la base de datos

Todas las vistas están ya conectadas con los **repositorios CRUD** de la capa de datos.
Cuando se ejecuta la aplicación, PyQt6 consulta directamente SQLite a través de los métodos de cada repositorio.

Esto significa que los datos mostrados son **reales y actualizados** — no hay simulaciones ni valores estáticos.
El sistema muestra mensajes amigables cuando una tabla está vacía o un repositorio no está disponible.

### Configuración y utilidades

La vista de Configuración permite crear copias de seguridad y exportar listados CSV con un solo clic.
Gracias a los servicios creados en fases anteriores, estas funciones ya son plenamente operativas.

```python
self.btn_backup.clicked.connect(self._crear_backup)
self.btn_exportar_csv.clicked.connect(self._exportar_clientes_csv)
```

Detrás de estos botones se ejecutan funciones reales que:

- crean un archivo ZIP con la base de datos actual, y
- exportan datos de clientes a CSV.

## Resultados

La aplicación ya cuenta con una interfaz **completa y funcional**, desde la que se puede:

- ✅ Navegar entre secciones (Clientes, Calendario, Formaciones, Interacciones, Configuración).
- ✅ Visualizar y consultar datos reales almacenados en SQLite.
- ✅ Generar copias de seguridad y exportaciones.
- ✅ Registrar interacciones comerciales y preparar futuras acciones.
- ✅ Mantener una estructura modular y extensible para próximas mejoras.

## Próximos pasos

En la siguiente fase nos centraremos en **formularios interactivos, drag & drop, vistas semanales y diarias**, y **recordatorios automáticos**, completando así el flujo de trabajo de un planificador profesional de formaciones.

El proyecto Planificador sigue creciendo, y cada paso nos acerca más a una herramienta completa, útil y mantenible.

En la próxima entrega: **formularios y funcionalidades avanzadas**.