---
title: "Construyendo un Cerebro Digital (Parte 5): La Memoria Vectorial con ChromaDB"
description: "Quinta entrega: indexamos los JSON extraídos en una base vectorial con ChromaDB y embeddings locales con Ollama para dotar al sistema de memoria semántica."
pubDate: "2025-09-19"
lang: "es"
summary: "Implementamos la memoria vectorial del sistema: indexación en ChromaDB, embeddings generados con Ollama y un script sincronizador que convierte texto plano en conocimiento vivo consultable."
author: "Juan Carlos Beaskoetxea"
tags:
  - RAG
  - Base de conocimiento
  - Python
  - ChromaDB
  - Ollama
  - Embeddings
  - Vector DB
  - Automatización
tkey: "base-conocimiento-05"
---

# Construyendo un Cerebro Digital (Parte 5): La Memoria Vectorial con ChromaDB

En la última entrega dejamos a nuestro **Orquestador** creando `.json` rebosantes de conocimiento.  
Pero una montaña de notas sin una forma rápida e inteligente de consultarlas es como una biblioteca sin catálogo.

👉 Toca darle **memoria de largo plazo** a nuestro sistema.

---

## 📚 Del texto plano al conocimiento vivo

Hoy convertimos archivos en **conocimiento semántico accionable** con dos piezas:

- **ChromaDB 🧠**: base de datos vectorial que no guarda texto, sino significado.  
- **Modelo de embeddings (vía Ollama en local)**: traduce texto a vectores.  

El protagonista es el script `indexar_contenido.py`, nuestro **bibliotecario digital** que lee, entiende y cataloga.

---

## 📚 ¿Por qué una base de datos vectorial?

Imagina preguntarle al bibliotecario:

> “Dame libros sobre ética de la IA”

Y que te traiga todo lo relevante, aunque no contenga esas palabras exactas.  
Eso hace **ChromaDB**: busca por **proximidad semántica**, no por keywords.  
Para lograrlo, guardamos **embeddings**: vectores que capturan el significado.

---

## ⚙️ Instalación exprés

Sin servidores raros. Solo:

```bash
pip install chromadb
```

ChromaDB guardará datos en tu carpeta chroma_db.
Todo autocontenido y bajo tu control.


---

## 🧑‍🏫 El bibliotecario: `indexar_contenido.py`

Este script mantiene la memoria al día:

- Conecta con ChromaDB.  
- Compara `.json` locales con lo ya indexado.  
- Elimina lo obsoleto.  
- Añade lo nuevo creando embeddings.  

A continuación, el **código completo**:

```python
# indexar_contenido.py
# ------------------------------------------------------------
# Sincroniza JSONs de conocimiento con ChromaDB (vector DB),
# generando embeddings locales con Ollama.
# ------------------------------------------------------------

from pathlib import Path
from typing import Dict, List, Set
import json
import chromadb
import ollama

# --- CONFIGURACIÓN GLOBAL ---
RUTA_BASE_PROYECTO = Path(__file__).parent
RUTA_CONOCIMIENTO_EXTRAIDO = RUTA_BASE_PROYECTO / "textos_extraidos"
RUTA_BASE_DE_DATOS = str(RUTA_BASE_PROYECTO / "chroma_db")
MODELO_EMBEDDINGS = "mxbai-embed-large"
NOMBRE_COLECCION_DB = "documentacion_general"

# Opciones de chunking (aprox. por caracteres)
CHUNK_MAX_CHARS = 1000     # tamaño máximo de cada fragmento
CHUNK_MIN_CHARS = 200      # intentamos evitar chunks ultracortos
BATCH_EMBEDDINGS = 100     # tamaño del lote para add/embeddings


class SincronizadorConocimiento:
    """
    Gestiona la sincronización entre los archivos JSON de conocimiento
    y la base de datos vectorial ChromaDB, incluyendo sus metadatos.
    """

    def __init__(self, ruta_conocimiento: Path, ruta_db: str,
                 nombre_coleccion: str, modelo_embeddings: str) -> None:
        self.ruta_conocimiento = ruta_conocimiento
        self.modelo_embeddings = modelo_embeddings

        try:
            cliente = chromadb.PersistentClient(path=ruta_db)
            self.coleccion = cliente.get_or_create_collection(name=nombre_coleccion)
            print(f"Conexión con ChromaDB establecida. Colección: '{nombre_coleccion}'")
        except Exception as e:
            print(f"!!! ERROR al conectar con ChromaDB: {e}")
            raise

    # ----------------- Utilidades de inventario -----------------

    def obtener_archivos_locales(self) -> Set[str]:
        """Devuelve el conjunto de nombres de archivo .json existentes en la carpeta de conocimiento extraído."""
        if not self.ruta_conocimiento.exists():
            print(f"Carpeta '{self.ruta_conocimiento}' no existe. Creando...")
            self.ruta_conocimiento.mkdir(parents=True, exist_ok=True)
        return {p.name for p in self.ruta_conocimiento.glob("*.json")}

    def obtener_fuentes_en_db(self) -> Dict[str, List[str]]:
        """Devuelve un diccionario: nombre_archivo_json -> [ids_chunk_en_db]."""
        fuentes: Dict[str, List[str]] = {}
        total = self.coleccion.count()
        if total == 0:
            return fuentes

        offset = 0
        page_size = 500
        while offset < total:
            batch = self.coleccion.get(
                include=["metadatas", "ids"],
                limit=page_size,
                offset=offset
            )
            ids = batch.get("ids", []) or []
            metas = batch.get("metadatas", []) or []

            for id_, meta in zip(ids, metas):
                nombre = (meta or {}).get("nombre_archivo_json")
                if nombre:
                    fuentes.setdefault(nombre, []).append(id_)
            offset += len(ids)
        return fuentes

    def _eliminar_documento_de_db(self, nombre_fuente_json: str, ids: List[str]) -> None:
        """Elimina de la colección todos los chunks asociados a una fuente."""
        try:
            print(f" -> Eliminando documento obsoleto '{nombre_fuente_json}' ({len(ids)} chunks)")
            self.coleccion.delete(ids=ids)
        except Exception as e:
            print(f"    !!! ERROR eliminando '{nombre_fuente_json}': {e}")

    # ----------------- Chunking y Embeddings -----------------

    def _trocear_texto(self, texto: str) -> List[str]:
        """Divide el texto por párrafos y los reagrupa para aproximarse a CHUNK_MAX_CHARS."""
        paras = [p.strip() for p in texto.split("\n\n") if p.strip()]
        if not paras:
            return []

        chunks: List[str] = []
        actual = ""

        for p in paras:
            if not actual:
                actual = p
                continue

            if len(actual) + 2 + len(p) <= CHUNK_MAX_CHARS:
                actual += "\n\n" + p
            else:
                if len(actual) < CHUNK_MIN_CHARS and len(p) < CHUNK_MAX_CHARS:
                    actual += "\n\n" + p
                else:
                    chunks.append(actual)
                    actual = p

        if actual:
            chunks.append(actual)

        return chunks

    def _generar_embeddings(self, fragmentos: List[str]) -> List[List[float]]:
        """Llama a Ollama para generar un embedding por fragmento."""
        embeddings = []
        for frag in fragmentos:
            emb = ollama.embeddings(model=self.modelo_embeddings, prompt=frag)["embedding"]
            embeddings.append(emb)
        return embeddings

    def _indexar_archivo(self, ruta_archivo_json: Path) -> None:
        """Lee un archivo JSON, lo trocea, vectoriza y añade a la base de datos."""
        nombre_fuente_json = ruta_archivo_json.name
        print(f"\n -> Indexando nuevo documento: {nombre_fuente_json}")

        try:
            with open(ruta_archivo_json, "r", encoding="utf-8") as f:
                datos = json.load(f)

            texto = datos.get("texto", "") or ""
            metadatos_originales = datos.get("metadatos", {}) or {}
            metadatos_originales["nombre_archivo_json"] = nombre_fuente_json

            if not texto.strip():
                print("    -> Documento sin texto. Omitiendo.")
                return

            fragmentos = self._trocear_texto(texto)
            print(f"    -> Documento dividido en {len(fragmentos)} fragmentos.")

            for i in range(0, len(fragmentos), BATCH_EMBEDDINGS):
                lote = fragmentos[i : i + BATCH_EMBEDDINGS]
                ids = [f"{nombre_fuente_json}_{i + j}" for j in range(len(lote))]

                print(f"      -> Generando embeddings para lote {i // BATCH_EMBEDDINGS + 1}...")
                embeddings = self._generar_embeddings(lote)

                self.coleccion.add(
                    ids=ids,
                    embeddings=embeddings,
                    documents=lote,
                    metadatas=[metadatos_originales] * len(lote),
                )

            print(f"    -> Contenido de '{nombre_fuente_json}' añadido a la base de datos.")

        except Exception as e:
            print(f"    !!! ERROR al procesar '{nombre_fuente_json}': {e}")

    def sincronizar(self) -> None:
        """
        Orquesta el proceso completo de sincronización:
        - Elimina de DB fuentes que ya no existen localmente.
        - Indexa nuevos JSONs detectados.
        """
        print("\n--- Iniciando proceso de sincronización de conocimiento ---")
        archivos_locales_set = self.obtener_archivos_locales()
        fuentes_en_db_dict = self.obtener_fuentes_en_db()

        fuentes_a_eliminar = set(fuentes_en_db_dict.keys()) - archivos_locales_set
        for nombre_fuente_json in fuentes_a_eliminar:
            self._eliminar_documento_de_db(nombre_fuente_json, fuentes_en_db_dict[nombre_fuente_json])

        archivos_a_indexar = archivos_locales_set - set(fuentes_en_db_dict.keys())
        for nombre_fuente_json in archivos_a_indexar:
            self._indexar_archivo(self.ruta_conocimiento / nombre_fuente_json)

        print("\n--- Sincronización finalizada. ---")
        print(f"Total de fragmentos (chunks) en la colección: {self.coleccion.count()}")


def ejecutar_sincronizacion() -> None:
    """Función principal que instancia y ejecuta el sincronizador."""
    try:
        sincronizador = SincronizadorConocimiento(
            ruta_conocimiento=RUTA_CONOCIMIENTO_EXTRAIDO,
            ruta_db=RUTA_BASE_DE_DATOS,
            nombre_coleccion=NOMBRE_COLECCION_DB,
            modelo_embeddings=MODELO_EMBEDDINGS,
        )
        sincronizador.sincronizar()
    except Exception as e:
        print(f"\nHa ocurrido un error crítico durante la inicialización: {e}")


if __name__ == "__main__":
    ejecutar_sincronizacion()

```

## 🔍 El proceso (en cristiano)

- **Chunking** → Los LLMs tienen ventana limitada. Partimos por párrafos y reagrupamos hasta ~1000 caracteres para mantener coherencia sin “romper” ideas.  
- **Embeddings** → Con `mxbai-embed-large` (vía Ollama en local) convertimos cada fragmento en un vector: su **huella semántica**.  
- **Almacenamiento** → Insertamos en **ChromaDB** cada chunk con:  
  - ID único  
  - Embedding  
  - Texto original  
  - Metadatos (archivo de origen, fechas, etc.)  

---

## 🚀 Conclusión

Al ejecutar:

```bash
python3 indexar_contenido.py
```


Tu **bibliotecario digital** se pone manos a la obra.  
Lo que era una carpeta de textos ahora es **memoria viva por conceptos**.

---

La mesa está servida:  
✅ **Información extraída** y  
✅ **Memoria vectorial**  

👉 Siguiente parada: **Ollama y los modelos que harán de cerebro conversacional para hablar con tus documentos. 🔥**
