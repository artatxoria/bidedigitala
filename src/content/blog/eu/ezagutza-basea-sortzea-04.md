---
title: "Ezagutzaren Orkestratzailea Python bidez (IV): ezagutza-base adimendunaren eraikuntza"
description: "Laugarren entrega: Python bidezko Orkestratzailea, iturri anitzetatik ezagutza modu modularrean erauzteko eta antolatzeko sistema."
pubDate: "2025-09-12"
lang: "eu"
summary: "Orkestratzaile modular bat sortzen dugu: dokumentuak, webguneak eta beste iturriak prozesatzeko plugin-sistema baten antzera diseinatua."
author: "Juan Carlos Beaskoetxea"
tags:
  - RAG
  - Ezagutza-basea
  - Python
  - Automatizazioa
  - software librea
tkey: "base-conocimiento-04"
---

# Ezagutzaren Orkestratzailea Python bidez (4. zatia)

Ongi etorri berriro gure ezagutza-base adimendunaren eraikuntzari buruzko seriera!  
Aurreko kapituluetan oinarriak jarri genituen. Orain, funtsezko galdera: **nola elikatu sistema informazio-iturri askotatik modu antolatuan, eskalagarriki eta automatikoki?**

👉 Erantzuna: **Erauzi-Orkestratzailea**.  
Artikulu honetan Python kodean murgilduko gara, gure datu-sarrera prozesuaren garun operatiboa, **plugin-sistema baten antzera diseinatua**: iturri bakoitza (fitxategi lokalak, webguneak…) modulu independentea da, eta script nagusiak aurkitu eta exekutatu dezake.

---

## 🎶 Arkitektura: zuzendari bat eta bere musikariak

Analogia batekin ikus dezagun:

- **Orkestra-zuzendaria (main.py):** script nagusia da. Ez du instrumenturik jotzen, baina badaki nork jotzen duen, noiz hasi eta nola gidatu sinfonia.  
- **Partitura Nagusia (base.py):** musikari guztiek bete behar duten kontratua. Araudia eta hizkuntza komun bat ezartzen du.  
- **Musikari espezializatuak (archivos_locales.py, elhacker_scraper.py …):** bakoitza bere instrumentuan aditua. Batak PDF-ak irakurtzen ditu, besteak webak arakatzen… guztiak partitura beraren arabera.

---

## 1. Partitura Nagusia: base.py

Sistema modular orok kontratu bat behar du. Hemen, **ProcesadorFuente klase abstraktuak (ABC)** rol hori betetzen du. Ez da zuzenean erabil daiteke, baina behartzen du edozein prozesador metodo giltzarri batzuk inplementatzera.

Hiru elementu nagusi definitzen ditu:

- `__init__`: sarrera eta irteera bideak hasieratzen ditu.  
- `procesar()`: metodo abstraktua, prozesadore bakoitzak bete behar duena.  
- `guardar_conocimiento()`: JSON batean testua eta metadatuak gordetzeko metodo komun bat.  

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

## 2. Orkestra-zuzendaria: main.py 🎼

Hau da sarrera-puntua. Bere eginkizunak:

- **Prozesadoreak aurkitu** → `procesador/fuentes` karpetan bilatu eta `ProcesadorFuente`-tik heredatzen duten klaseak detektatu.  
- **Instanziatu eta exekutatu** → bakoitza sortu eta bere `procesar()` metodoa deitu.  

👉 Abantaila nagusia: **escalagarritasuna**. Bihar YouTube-rako extractor bat sortzen badugu, modulu berria gehitu eta kitto, `main.py` aldatu gabe.

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
## 3. Musikarien jarduna: prozesadoreak

📂 **Artxibozain Lokala** (`archivos_locales.py`)

`documentos_nuevos` karpeta arakatzen du eta ezagutzen dituen fitxategiak (PDF, DOCX, ODT, TXT, MD) prozesatzen ditu.  
Mapa batekin (`.pdf → funtzioa`, `.docx → funtzioa` …) erauzten du edukia eta `guardar_conocimiento()` bidez gordetzen du.

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

### 🌐 Web Arakatzailea (`elhacker_scraper.py`)

`elhacker.info` webguneko manualen direktorioa arakatzen du modu errekurtsiboan, **PDF-ak deskargatu**, testua atera eta **JSON** formatuan gordez.

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

## ✅ Ondorioa eta hurrengo pausoak

Sistema hau **indartsua, modularra eta hedagarria** da.  
`main.py` exekutatzean, gure zuzendariak musikari guztiak lanean jartzen ditu eta `textos_extraidos` karpeta **JSON garbiekin** betetzen da.

👉 Hurrengo artikuluan **urrats erabakigarria** emango dugu: JSON horiek **ChromaDB bektore-datu-basean** indexatuko ditugu, eta orduan hasiko da gure ezagutza **benetan bizitzen**.
