---
title: "Garun Digitala Eraikitzen (5. zatia): Oroimen Bektoriala ChromaDB-rekin"
description: "Bosgarren entrega: ChromaDB eta embeddings erabiliz, JSON fitxategiak memoria bektorial bizian bihurtzen ditugu Python bidez."
pubDate: "2025-09-15"
lang: "eu"
summary: "JSON fitxategiak ChromaDB bidez indexatzen ditugu; embedding lokalekin (Ollama) ezagutza semantiko bizia sortuz."
author: "Juan Carlos Beaskoetxea"
tags:
  - RAG
  - Ezagutza-basea
  - Python
  - Automatizazioa
  - ChromaDB
  - Ollama
  - Embeddings
tkey: "ezagutza-basea-05"
---

# Garun Digitala Eraikitzen (5. zatia): Oroimen Bektoriala ChromaDB-rekin

Aurreko atalean gure **“Orkeslatzailea”** `.json` fitxategiak sortzen ari zen, ezagutza pilatuz.  
Baina, egia esan: **apunte solteak edukitzea baina hauek azkar eta modu adimentsuan kontsultatzeko aukerarik ez edukitzea**, katalogorik gabeko liburutegi bat edukitzea bezalakoa da.

👉 Gure sistemari **epe luzeko oroimena** emateko unea iritsi da.

---

## Testu lautik ezagutzara

Gaurkoan fitxategiak bihurtuko ditugu **ezagutza semantiko aktibo** bi pieza erabiliz:

- **ChromaDB 🧠**: testua ez, **esanahia gordetzen duen datu-base bektoriala**.  
- **Embedding modelo bat (Ollama bidez lokalki)**: hitzak bektore bihurtzen ditu.  

Protagonista: `indexar_contenido.py` script-a, gure **liburuzain digitala**, irakurtzen, ulertzen eta katalogatzen duena.

---

## 📚 Zergatik datu-base bektorial bat?

Pentsa liburutegian zaudela eta galdetzen duzula:

> “Ekar iezadazu adimen artifizialaren etikaz hitz egiten duten liburu guztiak”

Eta liburuzainak ez dizula bakarrik hitz horiek izenburuan dituzten liburuak ekartzen, baizik eta kontzeptu horren inguruko guztiak.

Horixe egiten du **ChromaDB-k**: ez du hitzez hitzeko bila, baizik eta **esanahiaren hurbiltasunez**.  
Horretarako ez dugu testua gordetzen, baizik eta haren **embedding bektoreak**.

---

## ⚙️ Instalazio azkarra

Ez dago zerbitzari konplexurik. Python-en pakete soil bat da:

```bash
pip install chromadb
```

Datuak `chroma_db` karpetan gordeko dira. Guztia **autokontainatua** eta zure kontrolpean.

---

## 🧑‍🏫 Liburuzaina: `indexar_contenido.py`

Script honek beti eguneratuta mantentzen du memoria:

- **ChromaDB-ra konektatzen da.**  
- **`.json` fitxategiak eta datu-basean dagoena alderatzen ditu.**  
- **Zaharkitutakoa ezabatzen du.**  
- **Berria txertatzen du embedding bihurtuta.**

Hona hemen kode osoa:


```python

# indexar_contenido.py
# ------------------------------------------------------------
# JSON fitxategiak ChromaDB-rekin sinkronizatzen ditu,
# embedding-ak sortuz Ollama erabilita (lokalean).
# ------------------------------------------------------------

from pathlib import Path
from typing import Dict, List, Set
import json
import chromadb
import ollama

# --- KONFIGURAZIO GLOBALA ---
RUTA_BASE_PROYECTO = Path(__file__).parent
RUTA_CONOCIMIENTO_EXTRAIDO = RUTA_BASE_PROYECTO / "textos_extraidos"
RUTA_BASE_DE_DATOS = str(RUTA_BASE_PROYECTO / "chroma_db")
MODELO_EMBEDDINGS = "mxbai-embed-large"
NOMBRE_COLECCION_DB = "documentacion_general"

CHUNK_MAX_CHARS = 1000
CHUNK_MIN_CHARS = 200
BATCH_EMBEDDINGS = 100


class SincronizadorConocimiento:
    """
    JSON fitxategiak eta ChromaDB datu-base bektoriala sinkronizatzen ditu,
    metadatuak barne.
    """

    def __init__(self, ruta_conocimiento: Path, ruta_db: str,
                 nombre_coleccion: str, modelo_embeddings: str) -> None:
        self.ruta_conocimiento = ruta_conocimiento
        self.modelo_embeddings = modelo_embeddings

        try:
            cliente = chromadb.PersistentClient(path=ruta_db)
            self.coleccion = cliente.get_or_create_collection(name=nombre_coleccion)
            print(f"ChromaDB-rekin konexioa ezarrita. Bilduma: '{nombre_coleccion}'")
        except Exception as e:
            print(f"!!! ERROREA ChromaDB-rekin konektatzean: {e}")
            raise

    def obtener_archivos_locales(self) -> Set[str]:
        if not self.ruta_conocimiento.exists():
            print(f"'{self.ruta_conocimiento}' karpeta ez dago. Sortzen...")
            self.ruta_conocimiento.mkdir(parents=True, exist_ok=True)
        return {p.name for p in self.ruta_conocimiento.glob('*.json')}

    def obtener_fuentes_en_db(self) -> Dict[str, List[str]]:
        iturriak: Dict[str, List[str]] = {}
        total = self.coleccion.count()
        if total == 0:
            return iturriak

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
                izena = (meta or {}).get("nombre_archivo_json")
                if izena:
                    iturriak.setdefault(izena, []).append(id_)
            offset += len(ids)
        return iturriak

    def _eliminar_documento_de_db(self, izena: str, ids: List[str]) -> None:
        try:
            print(f" -> Dokumentu zaharkitua ezabatzen: '{izena}' ({len(ids)} chunk)")
            self.coleccion.delete(ids=ids)
        except Exception as e:
            print(f"    !!! ERROREA ezabatzean '{izena}': {e}")

    def _trocear_texto(self, texto: str) -> List[str]:
        parrafoak = [p.strip() for p in texto.split("\n\n") if p.strip()]
        if not parrafoak:
            return []

        chunks: List[str] = []
        aktuala = ""

        for p in parrafoak:
            if not aktuala:
                aktuala = p
                continue

            if len(aktuala) + 2 + len(p) <= CHUNK_MAX_CHARS:
                aktuala += "\n\n" + p
            else:
                if len(aktuala) < CHUNK_MIN_CHARS and len(p) < CHUNK_MAX_CHARS:
                    aktuala += "\n\n" + p
                else:
                    chunks.append(aktuala)
                    aktuala = p

        if aktuala:
            chunks.append(aktuala)

        return chunks

    def _generar_embeddings(self, fragmentos: List[str]) -> List[List[float]]:
        embeddings = []
        for frag in fragmentos:
            emb = ollama.embeddings(model=self.modelo_embeddings, prompt=frag)["embedding"]
            embeddings.append(emb)
        return embeddings

    def _indexar_archivo(self, ruta_archivo_json: Path) -> None:
        izena = ruta_archivo_json.name
        print(f"\n -> Dokumentu berria indexatzen: {izena}")

        try:
            with open(ruta_archivo_json, "r", encoding="utf-8") as f:
                datos = json.load(f)

            texto = datos.get("texto", "") or ""
            metadatuak = datos.get("metadatos", {}) or {}
            metadatuak["nombre_archivo_json"] = izena

            if not texto.strip():
                print("    -> Testurik gabea. Saltatzen.")
                return

            fragmentos = self._trocear_texto(texto)
            print(f"    -> Dokumentua {len(fragmentos)} zatitan banatuta.")

            for i in range(0, len(fragmentos), BATCH_EMBEDDINGS):
                lote = fragmentos[i : i + BATCH_EMBEDDINGS]
                ids = [f"{izena}_{i + j}" for j in range(len(lote))]

                print(f"      -> Embedding-ak sortzen lote {i // BATCH_EMBEDDINGS + 1}...")
                embeddings = self._generar_embeddings(lote)

                self.coleccion.add(
                    ids=ids,
                    embeddings=embeddings,
                    documents=lote,
                    metadatas=[metadatuak] * len(lote),
                )

            print(f"    -> '{izena}' edukia datu-basean gehituta.")

        except Exception as e:
            print(f"    !!! ERROREA '{izena}' prozesatzean: {e}")

    def sincronizar(self) -> None:
        print("\n--- Ezagutzaren sinkronizazioa hasten ---")
        lokalak = self.obtener_archivos_locales()
        db_iturrak = self.obtener_fuentes_en_db()

        zaharkituak = set(db_iturrak.keys()) - lokalak
        for izena in zaharkituak:
            self._eliminar_documento_de_db(izena, db_iturrak[izena])

        berriak = lokalak - set(db_iturrak.keys())
        for izena in berriak:
            self._indexar_archivo(self.ruta_conocimiento / izena)

        print("\n--- Sinkronizazioa amaituta ---")
        print(f"Bilduman chunk kopurua guztira: {self.coleccion.count()}")


def ejecutar_sincronizacion() -> None:
    try:
        sync = SincronizadorConocimiento(
            ruta_conocimiento=RUTA_CONOCIMIENTO_EXTRAIDO,
            ruta_db=RUTA_BASE_DE_DATOS,
            nombre_coleccion=NOMBRE_COLECCION_DB,
            modelo_embeddings=MODELO_EMBEDDINGS,
        )
        sync.sincronizar()
    except Exception as e:
        print(f"\nErrore kritikoa hasieratzean: {e}")


if __name__ == "__main__":
    ejecutar_sincronizacion()
```

## 🔍 Prozesua (labur-labur)

- **Chunking** → testua paragrafoetan zatitu eta ~1000 karaktereko zatiak sortzen dira.  
- **Embeddings** → Ollama + `mxbai-embed-large` erabiliz, fragmentu bakoitza bektore bihurtzen da.  
- **Biltegiratzea** → ChromaDB-n gordetzen dira: **ID, embedding, testua eta metadatuak**.  

---

## 🚀 Ondorioa

Exekutatzen dugunean:

```bash
python3 indexar_contenido.py
```

gure liburuzain digitala lanean hasten da.
Testu solteak zirenak orain bihurtzen dira kontzeptu bidez antolatutako **oroimen bizi**.

✅ **Ezagutza atera dugu**
✅ **Oroimen bektoriala eraiki dugu**

👉 Hurrengoan: **Ollama** instalatu eta hizkuntza-modeloak gehituko ditugu, gure sistemaren garun elkarrizketatzailea bihurtuz.

Bai, **dokumentuekin hitz egingo dugu** 🔥