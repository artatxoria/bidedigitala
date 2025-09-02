---
title: "Ezagutza-base propioa sortzea"
description: "Nola antolatu dokumentazio-base bat RAG eta AI estrategiak erabiliz edukiak sortzea errazteko"
pubDate: "2025-09-01"
lang: "eu"
summary: "Hiru modu aztertzen ditugu 'bigarren garuna' eraikitzeko dokumentazio pertsonala eta profesionala antolatzeko: automatizazio bisualak, tokiko soluzioak edo SaaS espezializatuak erabilita."
author: "Juan Carlos Beaskoetxea"
tags: ["RAG", "Ezagutza-basea", "Automatizazioa", "Adimen Artifiziala", "Prestakuntza"]
---

## Ezagutza-base pertsonala

### Dokumentazioaren antolaketa

#### Testuingurua

Enpresa txikiei eta ertainei zuzendutako teknologiaren dibulgatzaile eta prestatzaile naizenez, une honetan ordenagailuan dokumentazio ugari daukat nire ikastaroetarako edukiak sortzeko erabiltzen dudana. Halaber, dokumentazio hori osatzen edo zabaltzen duten webguneko estekak ere bildu ditut.

Informazio hori guztia kudeatzea nahiko neketsua da, dokumentu bakoitza berrikusi eta edukiak garatzeko oharrak atera behar baititut.

Gainera, dokumentazio hau eta autoritatezko webguneetako estekak baliatu nahi ditut nire blogerako edo LinkedIn-erako mezuak sortzeko.

Badakit RAG (Retrieval-Augmented Generation) bezalako sistemek informazio hori eskuragarri izaten lagun diezadaketela, eta badirudi beste aukera batzuk ere badaudela.

---

## Ideia

Ideia da dokumentazio guztiarekin **bigarren garun** bat sortzea, edukiak sortzeko prozesua nabarmen bizkortzeko. RAG sistema bat izango litzateke, hain zuzen ere, behar dudanaren muina.

Gaur egun, hiru aukera aztertzen ditut:

- **Ikus-automatizazioaren bidea (Low-Code) 💡**
- **Artisauaren tailerra (Script bidezko kontrol osoa) ⚙️**
- **"Den-dena batean" soluzioa (Software espezializatua) 🚀**

---

### 💡 Ikus-automatizazioaren bidea (Low-Code)

Aukera hau lehendik dauden zerbitzuak konektatzean oinarritzen da, **n8n** edo **Zapier** bezalako ikus-automatizazio plataformen bidez.

#### Nola funtzionatuko luke fluxuak?

1. **Datuen sarrera**: Hodeiko karpeta bat (Drive, Dropbox). Dokumentu berriak fluxua aktibatzen du. Estekak Google Sheets orri batean kudeatzen dira.
2. **Prozesamendu automatikoa**:
   - Fitxategi edo URL berria detektatzen da.
   - Testua ateratzen da (dokumentutik edo webgunetik).
   - IA zerbitzu bati bidaltzen zaio **behin** bektoreak sortzeko eta bektore-datu-base batean gordetzeko (Pinecone, Supabase).
3. **Kontsulta**:
   - Aplikazio edo txat-interfaze bat erabiltzen da ezagutza-base hau kontsultatzeko GPT-4 moduko eredu baten bidez.

**Abantailak**:
- Inplementazio azkarra.
- Kode gutxi edo batere ez.
- Interfaze bisualak.

**Desabantailak**:
- Kostuak (harpidetzak, API erabilera).
- Kontrol tekniko txikiagoa.

---

### ⚙️ Artisauaren tailerra (Script bidezko kontrol osoa)

**Kontrol osoa**, pribatutasuna eta epe luzerako kostu txikia nahi dutenentzat.

#### Nola funtzionatuko luke?

1. **Sarrera**: Tokiko karpeta. Eskuzko script bat edo programatua. Estekak `.txt` fitxategi batean.
2. **Prozesamendua**:
   - Python script batek edukiak ateratzen ditu.
   - Bektore bihurtzen ditu tokiko embedding-ak erabiliz.
   - Bektore-datu-base lokal batean gordetzen dira (ChromaDB, FAISS).
3. **Kontsulta**:
   - Terminaletik edo web-aplikaziotik.
   - Guztia lokaletik prozesatzen da LLM baten bidez (adibidez, **Ollama**).

**Abantailak**:
- Kontrol osoa.
- Datu pribatuak.
- Konfigurazioaren ondoren kostu baxua.

**Desabantailak**:
- Ezagutza teknikoa behar da.
- Abian jartzeko denbora gehiago.

---

### 🚀 "Den-dena batean" soluzioa (SaaS)

Prest dauden plataformak erabiltzea da aukera, adibidez **PersonalAI**, **Notion AI**, eta bestelako berriak.

#### Nola funtzionatzen du?

1. **Sarrera**: Dokumentuak arrastatu edo URL-ak gehitu interfaze batean.
2. **Prozesamendua**: Guztiz opakua. Haiek arduratzen dira.
3. **Kontsulta**: Txat-aplikazio prest bat erabiliz, erreferentziak, bildumak, eta bestelako funtzio gehigarriekin.

**Abantailak**:
- Erabilgarritasun handiena.
- Interfaze zaindua.
- Konfiguraziorik ez.

**Desabantailak**:
- Malgutasun gutxi.
- Hirugarrenen zerbitzarietan gordetako datuak.
- Hileko/urteko harpidetzak.

---

## Ondorioa

Ezagutza-base propioa sortzeak informazio sakabanatua bihurtzen du sistema erabilgarri eta adimentsu batean. Aukeratutako metodoa ezagutza teknikoaren mailaren, datuen sentikortasunaren eta abiadura edo kontrolaren lehentasunaren arabera aldatuko da.

---

Eta zu? Zein aukera aukeratuko zenuke?
