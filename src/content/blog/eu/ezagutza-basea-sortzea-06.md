---
title: "Ezagutzaren Orkestratzailea Python bidez (Azken atala): Txata Ollama eta Streamlit-ekin"
description: "Azken atala: Ollama zerbitzaria instalatu eta LLM batzuk deskargatu genituen gure dokumentuekin txateatu ahal izateko."
pubDate: "2025-09-19"
lang: "eu"
summary: "Ollama zerbitzaria eta beharrezko LLM modeloak instalatuko ditugu, eta web-txat bat sortuko dugu streamlit bidez."
author: "Juan Carlos Beaskoetxea"
categories:
  - Ezagutzea basea
  - Euskera
tags:
  - RAG
  - Ezagutza-basea
  - Python
  - Automatizazioa
  - ChromaDB
  - Ollama
  - Embeddings
tkey: "base-conocimiento-06"
---

# Garun Digitala Eraikitzen (Azken Zatia): Txata Ollama eta Streamlit-ekin

🎉 Ongi etorri serie honetako azken atalera!

Bidaia luzea izan da: lehenik ezagutza atera genuen, gero oroimen semantikoa gehitu genion, eta orain iritsi gara unerik desiratuenera… **gure dokumentuekin hitz egitera**.

Gaur instalatuko dugu gure IAren **garuna** eta ireki egingo dugu zurekin konektatzen duen **elkarrizketa-leihoa**:

1. ⚙️ **Ollama instalatzea** – azken belaunaldiko hizkuntza-ereduak zure ordenagailuan bertan exekutatzeko motorra.

2. 🧠 **Ereduak deskargatzea** – erantzunak ulertu eta sortzen dituzten “garunak”.

💬 Txat-interfazea Streamlit-ekin – gure ezagutzarekin zuzenean hitz egiteko kontrol-gunea.

## 1. Motorra instalatzea: Ollama ⚙️

IArekin hitz egin aurretik, norbaitek engranajeak mugitu behar ditu. Horretarako dago **Ollama**, LLM-ak tokian bertan exekutatzeko lana izugarri errazten duen tresna.

Instalazioa Linux sisteman (Debian/Ubuntu) sinplea bezain azkarra da:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Komando honek instalazio-script ofiziala deskargatu eta exekutatzen du, Ollama atzeko planoko zerbitzu gisa martxan jarriz. Horrek esan nahi du Ollama beti prest egongo dela gure script-etatik jasotzeko, terminal leiho bat irekita eduki gabe.

## 2. Garunak instalatzea: hizkuntza-ereduak 🧠

Motorra martxan dagoenean, garunak behar ditugu. Proiektu honetan hainbat eredu erabili ditugu, bakoitza bere espezialitatearekin:

- **Indexatzailea** – `mxbai-embed-large`: testua bektoreetan (embedding) bihurtzen du.

- **Elkarrizketariak (LLM-ak)** – benetan gurekin hitz egiten dutenak.

Terminalean komando bakar batekin instalatzen dira:

```bash
# Embedding-ak sortzeko eredua (funtsezkoa indexatzailearentzat)
ollama pull mxbai-embed-large

# Eredu azkar eta eraginkorra, hasteko bikaina
ollama pull mistral

# Pixka bat sendoagoa den alternatiba
ollama pull llama3:8b

# RAG eta arrazoiketa aurreraturako bikaina
ollama pull command-r
```

Komando bakoitzak eredua deskargatzen du eta berehala erabiltzeko prest uzten du.

## 3. Ezagutzarako leihoa: Streamlit-ekin Txata 💬

Eta hemen dator magia: `consultar_documentos.py`.

Script honek **Streamlit** erabiltzen du aplikazio web bat sortzeko, non:

1. Zure galdera idazten duzu.

2. **ChromaDB-n** bilatzen ditu dokumentu garrantzitsuen zatiak.

3. Zure galdera + testuinguru horiek LLM-ari bidaltzen dizkio.

4. Erantzuna denbora errealean bistaratzen du.

Beste modu batean esanda: hau da gure RAG sistemaren kontrol-dorre nagusia.

**Kode osoa**: `consultar_documentos.py`

Hona hemen eguneratuta eta zure proiektuan gordetzeko prest 👇

```python
# consultar_documentos.py
# ------------------------------------------------------------
# Txat interfazea zure ezagutza-basearekin hitz egiteko
# ChromaDB + Ollama + Streamlit erabiliz
# ------------------------------------------------------------

import ollama
import chromadb
import streamlit as st
from pathlib import Path

# --- KONFIGURAZIOA ---
RUTA_BASE_PROYECTO = Path(__file__).parent
RUTA_CHROMA_DB = str(RUTA_BASE_PROYECTO / "chroma_db")
COLECCION_CHROMA = 'documentacion_general'
MODELO_EMBEDDINGS = 'mxbai-embed-large'

class SistemaRAG:
    """Retrieval-Augmented Generation (RAG) sistemaren logika guztia kapsulatzen du."""
    def __init__(self, ruta_db, nombre_coleccion, modelo_embeddings):
        self.modelo_embeddings = modelo_embeddings
        try:
            cliente_db = chromadb.PersistentClient(path=ruta_db)
            self.coleccion = cliente_db.get_or_create_collection(name=nombre_coleccion)
            st.sidebar.success("✅ Ezagutza-basearekin konexioa ezarri da.")
        except Exception as e:
            st.error(f"Errorea ChromaDB-rekin konektatzean: {e}")
            st.stop()

    def buscar_contexto(self, consulta, n_resultados=10):
        """Bektorial datu-basean zati garrantzitsuenak bilatzen ditu."""
        try:
            resultados = self.coleccion.query(
                query_embeddings=ollama.embeddings(
                    model=self.modelo_embeddings,
                    prompt=consulta
                )["embedding"],
                n_results=n_resultados
            )
            return resultados['documents'][0], resultados['metadatas'][0]
        except Exception as e:
            st.error(f"Errorea testuingurua bilatzean: {e}")
            return [], []

    def generar_respuesta(self, consulta, contexto, modelo_llm, prompt_sistema, historial_chat):
        """Erantzuna sortzen du LLM baten bidez, testuinguru + historiotik abiatuta."""
        try:
            contexto_formateado = "\n---\n".join(contexto)
            mensajes_ollama = [{'role': 'system', 'content': prompt_sistema}]
            
            for msg in historial_chat:
                contenido = msg['content'].split('#### Fuentes Consultadas:')[0].strip()
                mensajes_ollama.append({'role': msg['role'], 'content': contenido})

            prompt_final = f"""
            Erabili soilik ondorengo testuingurua erabiltzailearen azken galderari erantzuteko.
            Erantzunik ez badago, esan: "Ez daukat nahikoa informazio nire dokumentuetan."
            
            Testuingurua:
            ---
            {contexto_formateado}
            ---
            
            Galdera: {consulta}
            """
            mensajes_ollama.append({'role': 'user', 'content': prompt_final})

            flujo = ollama.chat(model=modelo_llm, messages=mensajes_ollama, stream=True)
            yield from (chunk['message']['content'] for chunk in flujo)

        except Exception as e:
            st.error(f"Errorea {modelo_llm}-rekin erantzuna sortzean: {e}")
            yield ""

def configurar_interfaz():
    """Erabiltzaile-interfazea Streamlit-en bidez marrazten du."""
    st.set_page_config(page_title="Dokumentazio Laguntzailea", layout="wide")
    st.title("💬 Dokumentazio Laguntzaile Adimenduna")

    with st.sidebar:
        st.header("⚙️ Konfigurazioa")
        modelo_llm = st.selectbox("Aukeratu eredua:", ('command-r','mistral','llama3:8b'))
        MODOS = {
            "Laguntzaile Orokorra": "Testuinguru emanduan soilik oinarrituz erantzun.",
            "Ikastaro Sortzailea": "Erantzuna egituratu: Helburuak, Teoria, Adibideak, Ariketak.",
            "LinkedIn Idazlea": "Idatzi post baten zirriborroa emoji egokiekin eta azken galdera batekin."
        }
        modo = st.selectbox("Lan modua:", list(MODOS.keys()))
        prompt_sistema = MODOS[modo]
        if st.button("🗑️ Txata garbitu"):
            st.session_state.mensajes = []
            st.rerun()
    return modelo_llm, prompt_sistema

def principal():
    modelo_llm, prompt_sistema = configurar_interfaz()
    sistema = SistemaRAG(ruta_db=RUTA_CHROMA_DB, nombre_coleccion=COLECCION_CHROMA, modelo_embeddings=MODELO_EMBEDDINGS)

    if "mensajes" not in st.session_state:
        st.session_state.mensajes = []

    for mensaje in st.session_state.mensajes:
        with st.chat_message(mensaje["role"]):
            st.markdown(mensaje["content"])

    if pregunta := st.chat_input("Zer galdetu edo sortu nahi duzu?"):
        st.session_state.mensajes.append({"role":"user","content":pregunta})
        with st.chat_message("assistant"):
            with st.spinner("💭 Pentsatzen..."):
                contexto, metas = sistema.buscar_contexto(pregunta)
                if not contexto:
                    respuesta = "Ez da informazio garrantzitsurik aurkitu dokumentuetan."
                    st.write(respuesta)
                else:
                    flujo = sistema.generar_respuesta(pregunta, contexto, modelo_llm, prompt_sistema, st.session_state.mensajes[:-1])
                    respuesta = st.write_stream(flujo)
                    fuentes = sorted({m['fuente'] for m in metas})
                    st.markdown("#### 📂 Kontsultatutako iturriak:\n" + "\n".join(f"- `{f}`" for f in fuentes))
        st.session_state.mensajes.append({"role":"assistant","content":respuesta})
        st.rerun()

if __name__ == "__main__":
    principal()
```

#### Baina ¿zelan erabiltzen da hau?

Azken script hori exekutatu eta web-txata irekitzeko behar den komandoa honako hau da:

```bash
# Python ingurune birtuala aktibatzen dugu
source entorno_rag/bin/activate
# Web zerbitzaria sortu eta adierazten digun ip zabaltzen dugu
streamlit run consultar_documentos.py
```


## 🎯 Seriearen ondorioa: zure bigarren garuna bizirik dago

Sistema bat sortu dugu, gai dena:

- ✅ Fitxategi eta webetatik ezagutza ateratzeko.
- ✅ Ezagutza hori modu semantikoan ChromaDB-n gordetzeko.
- ✅ Gurekin arrazoitzeko eta hitz egiteko, tokiko LLM-ak erabiliz.

Eta dena **zure ordenagailuan, zure kontrol osopean**.

Baina hau ez da amaiera: hau hasiera besterik ez da.

Hurrengo urratsa izango da “bigarren garun” hau **IA agente autonomo bihurtzea**: helburu konplexuak jasotzeko, erabakiak hartzeko eta zure script-ak erabiliz zereginak modu automatikoan burutzeko gai izango den sistema.

Irudika ezazu esatea:
*"Bilatu Python-en azken eskuliburuak ElHacker-en eta egin laburpen bat berrikuntzez"*,
eta sistemak prozesu osoa bere kabuz orkestratzea.

🔥 Horixe da hurrengo muga: **benetako automatizazio adimenduna**.

🙌 Eskerrik asko bidaia honetan lagun izateagatik.
Proiektu bat baino gehiago eraiki dugu: **IA pertsonal eta lokalaren etorkizunerako oinarri sendo bat**.