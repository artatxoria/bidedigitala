---
title: "Ezagutza-base pertsonala (III): Zure burmuin digitala sortzen Python eta RAG erabiliz"
description: "Hirugarren atala: tokiko ezagutza-kudeaketa sistema bat diseinatu eta ezarri, pribatutasun osoarekin eta kosturik gabe."
pubDate: "2025-09-08"
lang: "eu"
summary: "Ikasi nola sortu zure burmuin digitala urratsez urrats Python, RAG eta tokiko teknologiak erabiliz (Ollama, ChromaDB...). Soluzio librea, indartsua eta pribatua."
author: "Juan Carlos Beaskoetxea"
tags:
  - RAG
  - IA lokala
  - Ezagutza-basea
  - Python
  - ChromaDB
  - Ollama
  - Software librea
tkey: "base-conocimiento-03"
---

# Zure Burmuin Digitala Sortu

Informazioaren aroan, dokumentu, artikulu, bideo eta esteka ugari metatzen ditugu. Ezagutza hori kudeatzea zeregin erraldoia bihur daiteke.

Zer moduz **"bigarren burmuin" digital bat** edukitzea? Zure dokumentazioa **gordetzen ez ezik, ulertu** eta **harekin hitz egin** ahal izateko laguntzaile bat?

---

## Proiektuaren Helburua

Sistema oso bat eraikiko dugu: **Ezagutza-base Adimenduna**, guztiz **lokalean exekutatua**, hurrengoak bermatzen dituena:

- 🔒 **Kontrol osoa**
- 🕵️ **Pribatutasun absolutua**
- 💸 **Kosturik gabe**

Hau da **Artisau Digitalaren bidea**: teknologia zure neurrira moldatzea, software librean oinarrituta eta hodeirik gabe.

---

## 🏗️ Sistemaren Arkitektura

### 📂 Karpeten Egitura

- `documentos_nuevos`: dokumentuak gehitzeko ataka.
- `textos_extraidos`: testu garbia `.json` modura gordetzen da.
- `procesador`: Python paketea, dokumentu mota bakoitzerako modulu espezializatuekin.
- `chroma_db`: bektore-datu basea.
- `entorno_rag`: Python ingurune birtuala.

---

## 🎬 Lan Fluxua: 3 Ekitaldi

### 🎼 1. Ekitaldia: Orkestratzailea (`main.py`)

Fitxategi berriak detektatzen ditu `documentos_nuevos` karpetan, testua ateratzen du eta `textos_extraidos` karpetan gordetzen du.

### 📚 2. Ekitaldia: Liburuzaina (`indexar_contenido.py`)

Testuak **embedding** bihurtzen ditu **Ollama** erabiliz eta **ChromaDB**-n gordetzen ditu, esanahi semantikoaren arabera antolatuta.

### 🧠 3. Ekitaldia: Jakintsua (`consultar_documentos.py`)

Tokiko web-interfaze batek galderak egiteko aukera ematen du, hizkera naturalaz. RAG ereduaren bidez:

1. **Retrieval**: ChromaDB-n pasarte garrantzitsuen bilaketa.
2. **Augmented Generation**: LLM lokalak testuinguruan oinarrituta erantzuten du.

---

## 🎯 Zergatik bide hau?

- ✅ **Pribatutasun osoa**: dena zure ordenagailuan gertatzen da.
- 💸 **Kosturik gabe**: software librea.
- 🔧 **Kontrol osoa**: zure beharren arabera moldagarria.
- 📴 **Offline funtzionamendua**: ez da konektibitatea behar.

---

## 🌱 Ondorioa

Sistema honek zure ezagutza **gordetzeaz gain, indartu** egiten du.

Laguntzaile pertsonal bat sortzeko aukera ematen dizu: pribatua, lokala eta zure dokumentazioa ulertzeko gai dena.

**Artisau baten burmuin digitala**, zure neurrira eraikia.

---

## 📚 Jarraipena...

Hurrengo atalean, **Python**-eko script-ak nola sortu ikusiko dugu, **Objektuetara Bideratutako Programazioa** erabiliz. Guztiaren **Orkestratzailea**rekin hasiko gara.
