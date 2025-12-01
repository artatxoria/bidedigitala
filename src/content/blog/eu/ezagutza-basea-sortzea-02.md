---
title: "Ezagutza-base pertsonala (II): RAG bidezko aukera lokalak"
description: "Bigarren atala: arkitektura lokal eta libreak (script-ak eta n8n) zure ezagutza-basea RAG bidez eraikitzeko."
pubDate: "2025-09-04"
lang: "eu"
summary: "Bi bide lokal: kontrol osoa script-ekin edo orkestrazio bisuala n8n-rekin; bietan RAG, zure dokumentazio propioan oinarrituta."
author: "Juan Carlos Beaskoetxea"
categories:
  - Ezagutzea basea
  - Euskera
tags:
  - RAG
  - Ezagutza-basea
  - Automatizazioa
  - IA
  - software librea
tkey: "base-conocimiento-02"
---

# Ezagutza-base pertsonala

## Itxaropenak

Proiektu bati ekin aurretik, **zer egin nahi dugun ondo adieraztea** funtsezkoa da; bestela, helburua argi ez edukitzeagatik amaierarik gabeko bueltan sar gaitezke.

Nire kasuan, honako behar hauek estali nahi ditut:

- Sareatik deskargatutako dokumentu asko pilatu ditut, `.pdf`, `.docx`, `.odt`, `.txt` eta baita `.md` formatuetan ere.
- Prestatu ditudan formazioetako dokumentazio asko daukat, **LaTeX**en (PDFra bihurtuta edo ez).
- **Webguneetarako esteka-zerrenda** bat mantentzen dut; bertan, ikastaroak atal ezberdinetan eta orrialde askotan banatuta daude (adibidez, Python ikastaro bat maila eta ikasgai askorekin). **Esteka horietatik abiatuta, gune horretako orrialde esanguratsu guztiak automatikoki identifikatzea** nahi dut.
- **YouTube bideoetarako estekak** ere baditut, eta haien edukia **transkribatu** edo beste hizkuntzetatik **itzuli** eta transkribatu nahi dut.

> Informazio sakabanatu guzti honekin, **nire dokumentazio-sistema propioa** sortu nahi dut: automatikoki gordea, indexatua eta etiketatua.

---

## Eta gero, zer?

Behin ezagutza-basea eskura dudanean, **kontsultatu** egin nahi dut, modu hauetan esaterako:

- “*XXX* ikastaro bat prestatu behar dut, eta **eduki-eskema** bat egin diezadazula nahi dut.”
- “*XXX* ikastaroko **YYY gaia** prestatu, honako egiturekin: helburuak, azalpen teorikoa adibideekin (zailtasun progresiboa) eta **ariketen zerrenda** **irtenbideekin**.”  
  > Hau **txantiloi** modura sortuko litzateke, berrerabiltzeko.
- “*XXX* ikastaroko *YYY* gaiaren *ZZZ* atala prestatu, egitura berarekin (helburuak, teoria adibideekin, ariketak eta soluzioak).”
- “LinkedIn-erako **post-gaien zerrenda** bat nahi dut dokumentazioan oinarrituta; zehaztu gaia, maila, etab.”
- “Nire **blogerako post** bat edo **LinkedIn artikulu** bat prestatu *XXX* gaiari buruz.”

Baldintza osagarriak:

- Dena **tokian bertan** (lokalean) ibiliko da, komunikaziorako interfaze batekin (chat/CLI/tokiko weba).
- **Ez** da erabiliko hodeiko LLMrik: **ereduak nire ekipoan** instalatuta egongo dira.
- **Babes-kopia** sistema egokia eduki behar du.
- Ez dut arazorik **Bash/Python** script-ak programatzeko, ezta **n8n** Debianen instalatzeko ere.
- **Ekonomikoak** eta ahal dela **software librean** oinarritutako aukerak behar ditut.

---

## Zer aukerari heldu?

Sistema **lokal, merkea, automatizatua eta librea** eraikiko dugu; horren bidez, dokumentu eta esteka multzo bat **eduki-sorkuntza adimenduneko laguntzaile** bihurtuko dugu.

Goiko itxaropenak eta alternatibak kontuan hartuta, **bi aukera** hautatu ditut. Bietan erabiltzen da **RAG (Retrieval-Augmented Generation)**, ezinbestekoa baita IAk **nire dokumentazioan** oinarrituta erantzun dezan, ez ezagutza generikoan.

### 1. Aukera: Artisau Digitalaren Tailerra (kontrol osoa script-ekin)

“2. Alternatiba: Artisauaren Tailerra” eta “Script pertsonalizatuan oinarritutako lan-fluxua” gauzatzen ditu. Bide ahaltsuena da, eta **kontrol osoa** ematen du. **Script** bilduma batean oinarritzen da; nik neuk sortu eta orkestratuko ditut.

**Kontzeptua**  
**Python** eta/edo **Bash** script-ek informazioaren bizi-zikloa osorik estaltzen dute: **biltzea**, **prozesatzea**, **indexatzea** eta **kontsultatzea**. Guztia nire Debianen, **pribatutasuna** eta **kontrola** bermatuz.

**Zergatik egokia niretzat**

- **Iturri konplexuen** tratamendua: PDF eta ofimatika fitxategientzako moduluak; LaTeX kudeaketa (PDFra konpilatu eta testua ateratzeko); web ikastarorako *crawler* bat; eta YouTube transkripzioa.
- **Erabat lokala** eta **software librean** oinarritua.
- **Automatizazio pertsonalizatua** *cronjob* bidez.
- **Kontsultan indarra**: txantiloiak eta logika script-etan bertan.

**Teknologia giltzarriak**

- **Orkestrazioa**: Python + Bash.
- **IA lokala**: **Ollama** (LLMak eta **embedding**-ak).
- **Behe-datu bektoriala**: **ChromaDB** edo **FAISS**.
- **Interfazea**: hasieran CLI; gero **Streamlit** tokikoa.
- **Python liburutegiak**: `PyMuPDF`, `python-docx`, `BeautifulSoup`/`Scrapy`, `yt-dlp` + **Whisper**.

---

### 2. Aukera: Orkestratzaile Bisual Hibridoa (n8n tokian + script-ak)

Script-en malgutasuna eta **n8n**-ren kudeaketa bisuala uztartzen ditu. “2. Alternatiba: n8n + IA bidezko automatizazioa” da, baina **osorik lokala**.

**Kontzeptua**  
**n8n** instantzia tokiko bat erabiliko da **lan-fluxuaren garuna** gisa. Hodeiko zerbitzuen ordez, n8n-k **nire script propioak** abiaraziko ditu (Python/Bash).

**Zergatik egokia litzateke**

- **Fluxuaren kudeaketa bisuala**: “PDF sartzen bada, egin X; YouTube bada, Y…”
- **Bi munduen onena**: zeregin konplexuetarako script pertsonalizatuak; automatizazio **astun**a (zaintza, egutegia, *trigger*-ak) n8n-ren esku.
- **“API” pertsonala**: webhook-ak erraz sortzen dira; tokiko web interfazea (adib. Streamlit) **n8n**-rekin hitz egiten du.
- **Eskalatze antolatua**: iturri/urrats berriak gehitzea errazagoa da script monolitikoa ukitu gabe.

**Teknologia giltzarriak**

- **Orkestrazioa**: **n8n** auto-ostatua.
- **Exekuzioa**: **Execute Command** nodoa script-ak deitzeko.
- **IA lokala**: **Ollama**.
- **Behe-datu bektoriala**: **ChromaDB** edo **FAISS**.
- **Interfazea**: **Streamlit** tokikoa, n8n-ko webhook-ari dei eginez.

---

## Ondorioa eta gomendioa

| Ezaugarria                      | 1. Aukera: Artisau Tailerra (script-ak)              | 2. Aukera: Orkestratzaile Bisuala (n8n + script-ak)     |
|---------------------------------|------------------------------------------------------|---------------------------------------------------------|
| **Kontrola**                    | Maximoa. Lerro bakoitza zeurea da.                  | Oso handia. Kontrola n8n-ek deitzen dituen script-etan. |
| **Ikasketa-kurba**              | Handia. Programazio eta arkitektura behar dira.     | Tartekoa. n8n-ek orkestrazioa errazten du.              |
| **Fluxuaren kudeaketa**         | Kodean oinarritua; konplexua bihur liteke.          | Bisuala eta intuitiboa; mantentzeko errazagoa.          |
| **Malgutasuna**                 | Osoa; zure gaitasunak jartzen du muga.              | Osoa; 1. aukeraren berdina, baina geruza bisualarekin.  |
| **Baldintzak (lokala/librea/€)**| Betetzen ditu.                                       | Betetzen ditu.                                          |

- **1. aukera** hautatu **kode hutseko** ingurunean eroso bazaude, sistema **monolitiko eta optimizatua** eraiki nahi baduzu.
- **2. aukera** hautatu **“zer egin”** (script-ak) eta **“noiz/nola egin”** (n8n-ko fluxua) bereizi nahi badituzu. **Modernoagoa** eta **epe luzera mantengarriagoa** da, batez ere fluxua handitzen denean.
