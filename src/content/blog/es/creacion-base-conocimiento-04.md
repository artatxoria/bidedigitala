---
title: "Construyendo un Cerebro Digital (Parte 4): El Orquestador de Conocimiento con Python"
description: "Cuarta entrega: diseño modular en Python para orquestar la extracción de conocimiento desde múltiples fuentes con un sistema de plugins."
pubDate: "2025-09-12"
lang: "es"
summary: "Creamos un Orquestador de Extracción en Python: arquitectura tipo plugin, clase base común, procesadores para archivos locales y scraping web, y un main que los descubre y ejecuta."
author: "Juan Carlos Beaskoetxea"
categories:
  - Base de conocimiento
  - Castellano
tags:
  - RAG
  - Base de conocimiento
  - Python
  - Automatización
  - Extracción
  - Web scraping
  - Ollama
  - ChromaDB
  - FAISS
tkey: "base-conocimiento-04"
---

# Construyendo un Cerebro Digital (Parte 4): El Orquestador de Conocimiento con Python

¡Bienvenido de nuevo a nuestra serie sobre la creación de una base de conocimiento inteligente!  
En los capítulos anteriores asentamos los cimientos del proyecto. Ahora llega un punto clave: **¿cómo alimentar el sistema con información de múltiples fuentes** de forma organizada, escalable y automática?

**La respuesta: un Orquestador de Extracción.**  
En este artículo nos sumergimos en el código Python que actúa como el **cerebro operativo de la ingesta de datos**, con un **diseño modular** al estilo de un sistema de **plugins**: cada fuente (documentos locales, páginas web, etc.) es un módulo independiente que el script principal puede descubrir y ejecutar.

---

## 🎶 La Arquitectura: un director y sus músicos

Para comprenderlo, usemos una analogía:

- **El Director de Orquesta (`main.py`)**: es el script principal. No toca ningún instrumento, pero sabe quiénes son los músicos, cuándo darles la entrada y cómo dirigir la sinfonía.  
- **La Partitura Maestra (`base.py`)**: un contrato común que todos los músicos deben respetar. Define qué se espera de cada uno y asegura que todos hablen el mismo idioma.  
- **Los Músicos Especializados (`archivos_locales.py`, `elhacker_scraper.py` …)**: cada uno domina su instrumento. Uno lee PDFs, otro navega webs… todos bajo la misma partitura.

Veamos cómo se traduce esta metáfora en código.

---

## 1. La Partitura Maestra: `base.py`

Todo sistema modular necesita un contrato. En nuestro caso, la clase `ProcesadorFuente` actúa como **Clase Base Abstracta (ABC)**: no puede usarse directamente, pero obliga a que cualquier procesador implemente los métodos clave.

**Define tres elementos principales:**

- `__init__`: inicializa las rutas de entrada y salida.  
- `procesar()`: método abstracto que todo procesador debe implementar.  
- `guardar_conocimiento()`: utilidad común para almacenar los resultados en JSON con texto extraído y metadatos.

```python
# procesador/fuentes/base.py

from abc import ABC, abstractmethod
import json

class ProcesadorFuente(ABC):
    """
    Clase base abstracta para todos los procesadores de fuentes de datos.
    Define la estructura y métodos que cada procesador debe implementar.
    """

    def __init__(self, ruta_entrada_local, ruta_salida):
        """
        Inicializa el procesador con las rutas necesarias.
        """
        self.ruta_entrada_local = ruta_entrada_local
        self.ruta_salida = ruta_salida

    @abstractmethod
    def procesar(self):
        """Método principal que orquesta la extracción para esta fuente."""
        pass

    def guardar_conocimiento(self, nombre_archivo_salida, texto_extraido, metadatos):
        """Guarda el texto extraído y sus metadatos en un archivo JSON."""
        if not texto_extraido or not texto_extraido.strip():
            print(f"    -> Advertencia: No se encontró texto para guardar en '{nombre_archivo_salida}'. Se omite.")
            return

        ruta_completa_salida = self.ruta_salida / f"{nombre_archivo_salida}.json"
        contenido = {"texto": texto_extraido, "metadatos": metadatos}
        
        try:
            with open(ruta_completa_salida, 'w', encoding='utf-8') as archivo_json:
                json.dump(contenido, archivo_json, ensure_ascii=False, indent=4)
            print(f"    -> Conocimiento guardado en '{ruta_completa_salida.name}'")
        except Exception as e:
            print(f"    !!! ERROR al guardar el archivo JSON '{ruta_completa_salida.name}': {e}")
```

## 2. El Director de Orquesta: `main.py` 🎼

Este es el punto de entrada. Su misión:

- **Descubrir procesadores** → escanea la carpeta `procesador/fuentes` en busca de clases que hereden de `ProcesadorFuente`.  
- **Instanciar y ejecutar** → crea cada procesador y lanza su método `procesar()`.  

La gran ventaja es la **escalabilidad**: si mañana añadimos un extractor de YouTube, basta con crear el módulo en `fuentes` y `main.py` podrá usarlo **sin cambios**.

```python
# main.py

import importlib
import pkgutil
from pathlib import Path
from procesador.fuentes.base import ProcesadorFuente # Importamos la plantilla

# --- CONFIGURACIÓN GLOBAL ---
RUTA_BASE = Path(__file__).parent
RUTA_ENTRADA_LOCAL = RUTA_BASE / "documentos_nuevos"
RUTA_SALIDA_TEXTOS = RUTA_BASE / "textos_extraidos"

class Orquestador:
    """
    Clase principal que descubre, carga y ejecuta todos los procesadores de fuentes de datos.
    """

    def __init__(self, ruta_entrada_local, ruta_salida):
        """Inicializa el orquestador con las rutas necesarias."""
        self.ruta_entrada_local = ruta_entrada_local
        self.ruta_salida = ruta_salida
        #self.procesadores = self._descubrir_procesadores()
        #Momentaneamente solo quiero procesar spri
        self.procesadores = self._procesar_spri()

    def _procesar_spri(self):
        """
        Modificación para el tratamiento único de spri.
        """
        print("--- Investigando sitio de Spri... ---")
        procesadores_instanciados = []
        ruta_paquete = Path(__file__).parent / "procesador" / "fuentes"
        nombre_modulo = 'spri_scraper'
        modulo = importlib.import_module(f"procesador.fuentes.{nombre_modulo}")
        for atributo in dir(modulo):
            clase = getattr(modulo, atributo)
            if isinstance(clase, type) and issubclass(clase, ProcesadorFuente) and clase is not ProcesadorFuente:
                print(f" -> Procesador '{clase.__name__}' encontrado y cargado.")
                # Pasamos las rutas al crear la instancia
                procesadores_instanciados.append(clase(self.ruta_entrada_local, self.ruta_salida))
        return procesadores_instanciados
   
    def _descubrir_procesadores(self):
        """
        Descubre e instancia todas las clases que heredan de ProcesadorFuente
        en el paquete 'procesador.fuentes'.
        """
        print("--- Descubriendo procesadores de fuentes de datos... ---")
        procesadores_instanciados = []
        ruta_paquete = Path(__file__).parent / "procesador" / "fuentes"
        
        for (_, nombre_modulo, _) in pkgutil.iter_modules([str(ruta_paquete)]):
            if nombre_modulo != "base": # No queremos importar la plantilla base
                modulo = importlib.import_module(f"procesador.fuentes.{nombre_modulo}")
                for atributo in dir(modulo):
                    clase = getattr(modulo, atributo)
                    if isinstance(clase, type) and issubclass(clase, ProcesadorFuente) and clase is not ProcesadorFuente:
                        print(f" -> Procesador '{clase.__name__}' encontrado y cargado.")
                        # Pasamos las rutas al crear la instancia
                        procesadores_instanciados.append(clase(self.ruta_entrada_local, self.ruta_salida))
                        
        return procesadores_instanciados

    def ejecutar_extraccion(self):
        """
        Ejecuta el método 'procesar' de todos los procesadores descubiertos.
        """
        print("\n--- Iniciando Proceso de Extracción de Documentos ---")
        self.ruta_entrada_local.mkdir(exist_ok=True)
        self.ruta_salida.mkdir(exist_ok=True)

        if not self.procesadores:
            print("!!! Advertencia: No se encontraron procesadores para ejecutar.")
            return

        for procesador in self.procesadores:
            try:
                print(f"\n--- Ejecutando procesador: {type(procesador).__name__} ---")
                procesador.procesar()
            except Exception as e:
                print(f"!!! ERROR ejecutando el procesador {type(procesador).__name__}: {e}")
        
        print("\n--- Proceso de extracción finalizado. ---")

def principal():
    """
    Función principal que crea y ejecuta el orquestador.
    """
    orquestador = Orquestador(
        ruta_entrada_local=RUTA_ENTRADA_LOCAL,
        ruta_salida=RUTA_SALIDA_TEXTOS
    )
    orquestador.ejecutar_extraccion()

if __name__ == "__main__":
    principal()

```
## 3. Los Músicos en Acción: los procesadores  

### 📂 El Archivista Local (`archivos_locales.py`)

Este procesador inspecciona la carpeta `documentos_nuevos` y extrae el texto de archivos reconocidos (**PDF, DOCX, ODT, TXT, MD**).  
Usa un diccionario para mapear extensiones a la función adecuada y, tras procesar, guarda resultados con `guardar_conocimiento()`.

```python
# procesador/fuentes/archivos_locales.py

from .base import ProcesadorFuente
from datetime import datetime
import fitz  # PyMuPDF
import docx
from odf import text, teletype
from odf.opendocument import load

class ProcesadorArchivosLocales(ProcesadorFuente):
    """
    Procesador especializado en extraer texto de archivos locales
    (PDF, DOCX, ODT, TXT, MD).
    """

    def _extraer_texto_pdf(self, ruta_archivo):
        """Extrae texto de un archivo PDF."""
        try:
            with fitz.open(ruta_archivo) as documento:
                return "".join(pagina.get_text("text") for pagina in documento)
        except Exception as e:
            print(f"    !!! ERROR extrayendo de PDF '{ruta_archivo.name}': {e}")
            return ""

    def _extraer_texto_docx(self, ruta_archivo):
        """Extrae texto de un archivo DOCX, incluyendo tablas."""
        try:
            documento = docx.Document(ruta_archivo)
            texto_completo = [p.text for p in documento.paragraphs]
            for tabla in documento.tables:
                for fila in tabla.rows:
                    for celda in fila.cells:
                        texto_completo.append(celda.text)
            return "\n".join(texto_completo)
        except Exception as e:
            print(f"    !!! ERROR extrayendo de DOCX '{ruta_archivo.name}': {e}")
            return ""

    def _extraer_texto_odt(self, ruta_archivo):
        """Extrae texto de un archivo ODT."""
        try:
            doc = load(ruta_archivo)
            elementos_texto = doc.getElementsByType(text.P)
            return "\n".join(teletype.extractText(elem) for elem in elementos_texto)
        except Exception as e:
            print(f"    !!! ERROR extrayendo de ODT '{ruta_archivo.name}': {e}")
            return ""

    def _extraer_texto_plano(self, ruta_archivo):
        """Lee el contenido de un archivo de texto plano (TXT, MD)."""
        try:
            with open(ruta_archivo, "r", encoding="utf-8", errors='ignore') as archivo:
                return archivo.read()
        except Exception as e:
            print(f"    !!! ERROR extrayendo de texto plano '{ruta_archivo.name}': {e}")
            return ""

    def procesar(self):
        """
        Implementación del método abstracto. Orquesta la extracción de todos
        los archivos en la carpeta de entrada local.
        """
        print("Iniciando procesamiento de archivos locales...")
        
        # Mapeo de extensiones a funciones de extracción
        extractores = {
            ".pdf": self._extraer_texto_pdf,
            ".docx": self._extraer_texto_docx,
            ".odt": self._extraer_texto_odt,
            ".txt": self._extraer_texto_plano,
            ".md": self._extraer_texto_plano,
        }

        for extension, funcion_extractora in extractores.items():
            print(f"\n -> Buscando archivos '{extension}'...")
            archivos_encontrados = list(self.ruta_entrada_local.glob(f"*{extension}"))
            
            if not archivos_encontrados:
                print(f"    No se encontraron archivos '{extension}'.")
                continue

            for ruta_archivo in archivos_encontrados:
                print(f"  -> Procesando: {ruta_archivo.name}")
                texto = funcion_extractora(ruta_archivo)
                
                if texto:
                    metadatos = {
                        "fuente": "Archivo Local",
                        "nombre_original": ruta_archivo.name,
                        "fecha_extraccion": datetime.now().isoformat(),
                        "tipo_documento": extension.replace('.', '').upper()
                    }
                    nombre_salida = ruta_archivo.stem # Nombre del archivo sin extensión
                    self.guardar_conocimiento(nombre_salida, texto, metadatos)

```
### 🌐 El Explorador Web (`elhacker_scraper.py`)

Este procesador realiza **web scraping** sobre el directorio de manuales de [elhacker.info](https://elhacker.info/manuales/).  
Explora recursivamente, localiza PDFs, los descarga, extrae su texto y los guarda como **JSON**.

```python
# procesador/fuentes/elhacker_scraper.py

from .base import ProcesadorFuente
from datetime import datetime
from urllib.parse import urljoin, unquote
from pathlib import Path
import requests
from bs4 import BeautifulSoup
import fitz  # PyMuPDF
import time

class ProcesadorElHacker(ProcesadorFuente):
    """
    Procesador especializado en extraer PDFs de los directorios
    abiertos de elhacker.info de forma recursiva.
    NO aplica filtro de antigüedad.
    """
    URL_BASE = "https://elhacker.info/manuales/"

    def __init__(self, ruta_entrada_local, ruta_salida):
        """Inicializa el procesador llamando al constructor de la clase base."""
        super().__init__(ruta_entrada_local, ruta_salida)
        self.urls_procesadas = set() # Para evitar procesar el mismo PDF dos veces en una ejecución

    def _extraer_categoria_de_url(self, url_directorio):
        """Intenta extraer una categoría legible de la URL del directorio."""
        try:
            # Quitamos la URL base y decodificamos caracteres como %20
            ruta_relativa = url_directorio.replace(self.URL_BASE, '')
            categoria_decodificada = unquote(ruta_relativa).strip('/')
            # Reemplazamos separadores por espacios y ponemos en formato de título
            return categoria_decodificada.replace('/', ' - ').replace('_', ' ').title()
        except:
            return "General"

    def _recorrer_y_procesar_directorio(self, url_directorio):
        """
        Método recursivo que explora un directorio, procesa sus PDFs y
        se llama a sí mismo para explorar subdirectorios.
        """
        print(f"\n -> Explorando directorio: {url_directorio}")
        categoria = self._extraer_categoria_de_url(url_directorio)

        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            respuesta = requests.get(url_directorio, headers=headers, timeout=20)
            respuesta.raise_for_status()
            sopa = BeautifulSoup(respuesta.content, 'html.parser')

            enlaces_pdf = []
            enlaces_directorios = []

            for enlace in sopa.find_all('a', href=True):
                href = enlace['href']
                # Ignoramos enlaces que no son directorios o PDFs
                if '?' in href or href.startswith('/') or href.startswith('http'):
                    continue

                if href.lower().endswith('.pdf'):
                    enlaces_pdf.append(href)
                elif href.endswith('/'):
                    enlaces_directorios.append(href)
            
            print(f"    Se encontraron {len(enlaces_pdf)} PDFs y {len(enlaces_directorios)} subdirectorios en la categoría '{categoria}'.")

            # 1. Procesamos los PDFs encontrados en este nivel
            for enlace_pdf in enlaces_pdf:
                url_pdf_completa = urljoin(url_directorio, enlace_pdf)
                if url_pdf_completa in self.urls_procesadas:
                    continue
                
                self.urls_procesadas.add(url_pdf_completa)
                nombre_archivo_original = Path(unquote(enlace_pdf)).name
                
                try:
                    print(f"      -> Descargando y procesando: {nombre_archivo_original}")
                    pdf_respuesta = requests.get(url_pdf_completa, headers=headers, timeout=60) # Timeout más largo para PDFs
                    pdf_respuesta.raise_for_status()

                    with fitz.open(stream=pdf_respuesta.content, filetype="pdf") as documento:
                        texto = "".join(pagina.get_text("text") for pagina in documento)
                    
                    metadatos = {
                        "fuente": "ElHacker.info",
                        "url_original": url_pdf_completa,
                        "nombre_original": nombre_archivo_original,
                        "categoria": categoria,
                        "fecha_extraccion": datetime.now().isoformat(),
                        "tipo_documento": "PDF"
                    }

                    nombre_salida = f"elhacker_{Path(nombre_archivo_original).stem}"
                    self.guardar_conocimiento(nombre_salida, texto, metadatos)
                    time.sleep(1)

                except Exception as e:
                    print(f"      !!! ERROR al procesar el PDF '{nombre_archivo_original}': {e}")
            
            # 2. Llamada recursiva para los subdirectorios
            for enlace_dir in enlaces_directorios:
                url_subdir_completa = urljoin(url_directorio, enlace_dir)
                self._recorrer_y_procesar_directorio(url_subdir_completa)

        except requests.exceptions.RequestException as e:
            print(f"    !!! ERROR al acceder al directorio '{url_directorio}': {e}")


    def procesar(self):
        """
        Implementación del método abstracto. Inicia el rastreo recursivo
        desde la URL base de los manuales.
        """
        print("Iniciando procesamiento de la fuente ElHacker.info (sin filtro de fecha)...")
        self._recorrer_y_procesar_directorio(self.URL_BASE)
```

## ✅ Conclusión y próximos pasos

Hemos creado un sistema de extracción de conocimiento **robusto, modular y extensible**.  
Al ejecutar `main.py`, nuestro **director de orquesta** pone a trabajar a todos los músicos y la carpeta `textos_extraidos` se llena de **JSON limpios y estructurados**.

👉 En la próxima entrega iremos más allá: **indexaremos esos JSON en la base vectorial ChromaDB**, y será entonces cuando nuestro conocimiento comience a cobrar **verdadera vida**.
