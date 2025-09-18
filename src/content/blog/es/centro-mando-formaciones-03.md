---
title: "Centro de mando de formaciones (III): inicio de la implementación, estructura y control de versiones"
description: "Tercera entrega: cómo crear la estructura inicial del proyecto en Python, configurar el entorno virtual, definir la configuración base y establecer control de versiones con Git y GitHub."
pubDate: "2025-09-22"
lang: "es"
summary: "Tras definir los objetivos y diseñar la arquitectura, llega el momento de ensuciarnos las manos con código. En este artículo iniciamos la implementación del planificador de formaciones: estructura modular, entorno virtual, dependencias, configuración y control de versiones."
author: "Juan Carlos Beaskoetxea"
tags:
  - Formación
  - Productividad
  - Automatización
  - PyQt
  - Python
  - Agenda visual
  - Software a medida
tkey: "centro-mando-formaciones-03"
---

# Inicio de la implementación: estructura, entorno y control de versiones

Tras definir los **objetivos del proyecto** (Post I) y diseñar la **arquitectura y el modelo de datos** (Post II), ha llegado el momento de **ensuciarnos las manos con código**.  
En este artículo damos el primer paso en la implementación práctica de nuestro planificador de formaciones.

El camino será largo, pero esta **Fase 1** sienta los cimientos técnicos del proyecto.

---

## Fase 1: Preparativos

La Fase 1 se compone de cuatro tareas principales:

1. Crear la estructura inicial del proyecto.  
2. Configurar el entorno virtual y las dependencias mínimas.  
3. Definir el archivo de configuración inicial.  
4. Iniciar el repositorio Git y publicarlo en GitHub.  

Vamos con cada paso, uno a uno.

---

## 1. Estructura inicial del proyecto

Creamos una carpeta raíz `Planificador/` y dentro organizamos el código en módulos, respetando la **arquitectura modular por capas**:

```bash
Planificador/
├─ planificador/
│ ├─ init.py
│ ├─ main.py
│ ├─ app.py
│ ├─ common/
│ │ ├─ init.py
│ │ ├─ tipos.py
│ │ └─ utils.py
│ ├─ data/
│ │ ├─ init.py
│ │ ├─ db_manager.py
│ │ └─ repositories/
│ │ └─ init.py
│ ├─ domain/
│ │ ├─ init.py
│ │ └─ models/
│ │ └─ init.py
│ ├─ services/
│ │ └─ init.py
│ └─ ui/
│ ├─ init.py
│ ├─ views/
│ │ └─ init.py
│ └─ widgets/
│ └─ init.py
└─ tests/
├─ init.py
└─ test_sanity.py
```

Esto nos asegura **modularidad y mantenibilidad** desde el primer día.

El archivo `__main__.py` permite ejecutar el paquete con:

```python
python -m planificador
```

Contenido mínimo de __main__.py:

```python

def main():
    print("Planificador: estructura inicial creada. Próximo paso: entorno y dependencias.")


if __name__ == "__main__":
    main()
```
## 2. Entorno virtual y dependencias mínimas

Creamos un **entorno virtual** para mantener el proyecto aislado:

```bash
python3 -m venv entorno_planificador
source entorno_planificador/bin/activate
```

Actualizamos pip:

```bash
pip install --upgrade pip
```
### Dependencias iniciales

Instalamos las librerías mínimas:

```bash
pip install PyQt5 reportlab icalendar pytest
```

- **PyQt5** → interfaz gráfica.  
- **reportlab** → generación de PDF.  
- **icalendar** → exportación/importación de calendarios.  
- **pytest** → framework de pruebas.  

Guardamos el listado en `requirements.txt`:

```bash
pip freeze > requirements.txt
```

## 3. Archivo de configuración inicial

Creamos un `config.json` en la raíz para centralizar parámetros básicos:

```json
{
  "app": {
    "nombre": "Planificador de Formaciones",
    "version": "0.1.0",
    "idioma": "es-ES"
  },
  "base_datos": {
    "archivo": "planificador.db",
    "backup_dir": "backups"
  },
  "calendario": {
    "zona_horaria": "Europe/Madrid",
    "margen_desplazamiento_min": 60
  },
  "ui": {
    "tema": "claro",
    "fuente": "Arial",
    "tamaño_fuente": 10
  },
  "notificaciones": {
    "email": false,
    "servidor_smtp": "",
    "puerto": 587,
    "usuario": "",
    "password": ""
  }
}
```
Y un módulo `planificador/common/config.py` que lo carga:

```python
import json
from pathlib import Path

CONFIG_PATH = Path(__file__).resolve().parents[2] / "config.json"


def cargar_config():
    """Carga y devuelve el diccionario de configuración desde config.json."""
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


if __name__ == "__main__":
    config = cargar_config()
    print("Configuración cargada:", config["app"]["nombre"])
```

### Prueba rápida

```bash
python planificador/common/config.py
```

#### Salida esperada

```yaml
Configuración cargada: Planificador de Formaciones
```

## 4. Control de versiones con Git y GitHub

Inicializamos el repositorio en local:

```bash
git init
git branch -m main
```

Creamos un .gitignore básico:

```bash
# Entorno virtual
entorno_planificador/

# Cachés de Python
__pycache__/
*.pyc

# Base de datos y copias
*.db
backups/

# Archivos de sistema
.DS_Store
Thumbs.db
```

Primer commit:

```bash
git add .
git commit -m "Estructura inicial del proyecto Planificador"
```

Creamos el repositorio en GitHub y lo vinculamos (ejemplo con SSH):

```bash
git remote add origin git@github.com:tu_usuario/Planificador.git
git push -u origin main
```

Con esto ya tenemos el proyecto publicado y versionado.

## Conclusión

En esta primera fase hemos completado los **cimientos técnicos del proyecto**:

- ✅ Estructura modular en Python.  
- ✅ Entorno virtual y dependencias iniciales.  
- ✅ Configuración centralizada en `config.json`.  
- ✅ Control de versiones con Git y GitHub.  

---

## Próximos pasos

A partir de aquí comienza la **Fase 2**, dedicada a la **capa de datos**:

1. Diseñar el script SQL con todas las tablas.  
2. Implementar el gestor de base de datos (`db_manager.py`).  
3. Construir los primeros repositorios para interactuar con **SQLite**.  

👉 En el próximo artículo veremos el **diseño físico de la base de datos** y escribiremos el primer código para empezar a almacenar información real de clientes, formaciones y sesiones.


