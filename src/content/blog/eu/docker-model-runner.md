---
title: "AA Subiranoa Lokalean zabaltzeko gida"
description: "Tutorial honen helburua ez da softwarea instalatzea soilik, baizik eta zure subiranotasun teknologikoa erreklamatzea."
pubDate: "2026-03-04"
lang: "eu"
summary: "AA Subiranoa Lokalean zabaltzeko gida"
author: "Juan Carlos Beaskoetxea"
categories:
  - Adimen Artifiziala
  - Euskera
tags:
  - RAG
  - Adimen Artifiziala
  - Automatizazioa
  - IA
  - software librea
tkey: "Docker-model-runner"
---

# AA Subiranoa Lokalean zabaltzeko gida

## 🎯 Helburuen Adierazpena: Autonomia Kognitiborantz
Imajinatu proiektu baterako ideia bikaina duzula, edo zure negozioa alda lezakeen iturburu-kode babestu bat. Gaur egungo inertziak informazio hori hirugarrenen hodeiei "oparitzera" bultzatzen gaitu, AA baten laguntza lortzeko. Tutorial honen helburua ez da softwarea instalatzea soilik, baizik eta **zure subiranotasun teknologikoa erreklamatzea**.

Prozesu horren bidez, funtsezko hiru helburu ezarri ditugu:

#### 1. Pribatutasunaren "Kutxa Beltza"
Lehenengo helburua bunker digital bat eraikitzea da. Erabiltzailea bere datuen jabe bakarra izatea nahi dugu. Amaitzean, zure dokumentuak, ideiak eta kodea zure sare lokaletik inoiz ateratzen ez diren sistema bat zabalduko duzu. Zalantzaren amaiera da _"OpenAI bere ereduak nire sekretuekin entrenatzen egongo al da?"_.

#### 2. Kostuaren eta Mendekotasunaren Hesia haustea
"Harpidetzaren diktadura" ezabatu nahi dugu. Helburua da lehendik duzun hardwarea (zure PC propioa edo Linux duen zerbitzaria) aprobetxatzen ikastea, azken belaunaldiko lengoaia ereduak exekutatzeko. Zure laguntzailea 24/7 eskuragarri egotea nahi dugu, hilaren amaieran fakturarik gabe eta Silicon Valleyko zerbitzari batek erortzea edo erabilera politikak aldatzea erabakitzen duen kontuan hartu gabe.

#### 3. AA, zure lanaren zuzeneko hedapen gisa
Ez dugu beste erlaitz ireki bat nahi nabigatzailean, galderak baino erantzuten ez dituena. Azken helburua **integrazio sakona** da. AA zure proiektu fitxategiak "ikusteko" eta zure kode editorean (VS Code edo) zuzenean integratzeko gai izatea nahi dugu. Adimen artifiziala "urrutiko orakulu" batetik zure benetako testuingurua ulertzen duen "mahaigain kide" batera eraldatu nahi dugu.

>**Laburbilduz:** Tutorial honek ez du "txat bat instalatu" nahi. Profesional bati **garun digital pribatu eta indartsua** eman nahi dio, bere arauekin, bere makinarekin eta bere onurarako lan egingo duena.

## 🛠️ Tokiko Inteligentzia Nodoa: Zure Operazio Zentroa Inteligentzia Subiranoarekin
Gida honetako urratsak bete ondoren, ez duzu beste ikono bat besterik izango zure idazmahaian; **inteligentzia lokaleko nodo** bat sortuko duzu. "Artefaktu" teknologiko hau motor hibrido bat da, lengoaia eredu aurreratuenen potentzia zure fitxategi sistemaren segurtasunarekin konbinatzen duena.

Baina, zer esan nahi du horrek egunerokoan? Horrek esan nahi du hiru superbotere desblokeatu dituzula, gaur egun harpidetza garestiak ordaintzen dituztenentzat edo pribatutasuna sakrifikatzen dutenentzat erreserbatuta daudenak:

### 🧠 Memoria Propioa duen Garuna (RAG Pertsonalizatua)
Imajinatu zure enpresaren eskuliburu guztiak, ikasketa urteetako oharrak edo proiektu konplexu baten dokumentazioa leku bakar batean irauli ahal izatea, eta AA horiei buruz arrazoitzeko gai izatea. Sistema horri esker, "Lan Espazioak" sortu ahal izango dituzu, non ereduak ez dituen erantzunak asmatzen, baizik eta **zure ezagutza oinarritik** ateratzen dituen. NotebookLM pertsonal bat edukitzea bezala da, baina zu zara liburutegiaren erabateko jabea.

## 🧪 Laborategia: Zure Nodo zimenduak
Zerbait solidoa eraikitzeko, materialek garrantzia dute. Gure kasuan, beren egonkortasunagatik, arintasunagatik eta _open source_ izaeragatik nabarmentzen diren tresna multzo bat aukeratu dugu. Ekosistema hau moldakorra den arren eta Windowsera (WSL2 bidez) edo macOSera egokitu daitekeen arren, gure proba laborategia **Debian** izan da, zerbitzari-inguruneetan duen sendotasunagatik ezagutzen den "sistema eragile unibertsala".

Hau da proiektuari bizitza ematen dion teknologiaren inbentarioa:

### 🐧 Debian (Linux): Zoru Irmoa
Debianen alde egin dugu, beharrezkoak ez diren baliabideak kontsumitzen ez dituen eta sarearen eta baimenen gaineko erabateko kontrola emango digun sistema bat behar dugulako. Oinarri ezin hobea da beren AA nodoa zerbitzu profesional eta etengabe gisa funtzionatzea bilatzen dutenentzat.

### 🐳 Docker & Docker Compose: Enkofratua
Instalazioa garbia izan dadin eta zure sistema eragilea ehunka mendekotasunarekin "zikindu" ez dezan, edukiontziak erabiltzen ditugu. Dockerrek aukera ematen digu AA eta haren interfazea elkarren artean modu eraginkorrean komunikatzen diren kutxa isolatuetan paketatzeko. Bihar zure nodoa beste makina batera mugitu nahi baduzu, fitxategi pare bat baino ez duzu eraman beharko.

### ⚙️ Docker Model Runner (DMR): Motorraren Bihotza
Hemen gertatzen da magia. Soluzio astunagoak erabili beharrean, Docker ereduen _runner_ erabiltzen dugu. Ingeniaritza modernoko pieza bat da, zure prozesadorea eta RAM memoria hizkuntza ereduarekin zuzenean ulertzea ahalbidetzen duena, zure PUZaren ziklo bakoitza optimizatuz, erantzunak ahalik eta azkarren lortzeko.

### 🌐 Open WebUI: Ezagutzarako leihoa
Ez dugu testu-kontsola aspergarririk nahi. Open WebUI aukeratu dugu, ziurrenik dagoen interfazerik aurreratuena delako. ChatGPTren arintasuna imitatzeaz gain, dokumentuak, erabiltzaileak eta konexioak kudeatzeko geruzak gehitzen ditu, zure adimen lokalerako benetako sistema eragile bihurtzen dutenak.

### 🧠 Microsoft Phi-4: Ohorezko Gonbidatua
Nodoaren "garun" gisa, **Phi-4** hautatu dugu. 14B parametroen azken belaunaldiko eredu bat da, eta bere tamainarako arrazoiketa logikorako eta programaziorako gaitasun harrigarria erakutsi du. Oreka perfektua da: arazo konplexuak konpontzeko bezain adimentsua eta gaur zure mahai gainean duzun hardwarean korrika egiteko bezain optimizatua.

## 4. Hedapenaren etapak
## 🏗️ I. Etapa: Laborategia eta Datuen Arkitektura prestatzea
Adimena esnatu aurretik, bizitzeko leku bat eraiki behar diogu. Edukiontzien munduan, urrezko arau bat dago: **softwarea iragankorra da, baina datuak sakratuak dira**. Ez dugu nahi, zure sistema eguneratzen baduzu edo edukiontzi bat berrhasten baduzu, zure AAk ikasi duen guztia "ahaztea" edo eman dizkiozun dokumentuak galtzea.

Etapa honetan, gure Debianen fitxategi sistema prestatuko dugu, sendoa eta antolatua izan dadin.

### 📂 1. Proiektuaren "Etxea" sortzea
Ez dugu artxiborik askatuko edozein lekutan. Egitura hierarkiko bat sortuko dugu, **iraunkortasuna** kudeatu ahal izateko. Iraunkortasunak bermatzen du, edukiontzia suntsitu arren, informazioa zure disko gogorrean grabatuta egotea.

Gure nodorako erro karpeta bat sortuko dugu, eta, horren barruan, interfazearen eta ereduen datu baserako beharrezkoak diren azpidirektorioak:

```bash
mkdir -p ~/orakulue-nodo/docker/openwebui
```

- **Zertarako balio du horrek?** `Openwebui` karpetak zure txaten historia, zure erabiltzaileak eta, garrantzitsuena, zure dokumentuen aurkibideak gordeko ditu. Interfazearen "epe luzeko garuna" da.

### 🔑 2. Baimenen Ingurunea: Marruskadurarik gabeko segurtasuna

Linuxen errore ohikoenetako bat da dena `root` gisa exekutatzea edo "Baimena ukatuta" erroreak aurkitzea edukiontzia datuak idazten saiatzen denean.

Gure helburua da Dockerrek sortu berri ditugun karpetetan idazteko baimenak izatea, baina segurtasuna mantenduz. Horretarako, gure egungo erabiltzailea Docker taldekoa dela ziurtatzen dugu:

```bash
sudo usermod -aG docker $USER
```

- **Zergatia:** Horri esker, zure erabiltzaileak nodoa kudeatu dezake, etengabe izurritera deitu beharrik gabe, eta hori segurtasun eta erosotasun praktika ona da, AAk sortutako fitxategiak root erabiltzailearen azpian "blokeatuta" geratzea saihesten duena.

### 📝 3. Manifestua (Docker Compose)

Terminalean komando kilometrikoak jaurti beharrean, `docker-compose.yml` izeneko konfigurazio fitxategi bat erabiliko dugu. Artxibo hau gure nodoaren **plano arkitektonikoa** da. Bertan zehaztuko dugu zer irudi deskargatu, zer portu ireki (gure portua 3000) eta gure Debian karpetak edukiontziaren barrualdearekin "konektatuko" diren.

Dena fitxategi batean idatzita uztean, zure azpiegitura **erreplikagarria** bihurtzen da: nodo hau beste zerbitzari batean muntatu nahi baduzu, karpeta hau kopiatu eta komando bat exekutatu besterik ez duzu egin beharko.

```yaml
version: '3'
services:
  orakulue-ui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: Orakulue-UI
    # Estrategia de red: Usamos el modo 'host' para que la interfaz 
    # detecte el motor de IA local sin saltos de red complicados.
    network_mode: host 
    volumes:
      - ./docker/openwebui:/app/backend/data
    restart: always
    environment:
      - 'WEBUI_SECRET_KEY=tu_clave_secreta_aqui' # Cambia esto por algo seguro
      - 'PORT=3000' # <--- Aquí definimos tu puerto de acceso
```

>**Etapa honetako hausnarketa:** Sistema eragile bat hutsik izatetik ekintzarako egitura prest izatera igaro gara. Segurtasuna dugu, ordena dugu eta, batez ere, hemendik aurrera sortzen dugun ezagutza salbu egongo dela bermatu dugu.

#### 🔍 Zer gertatzen ari da hemen benetan?

Garrantzitsua da ulertzea zer "kontratatzen" ari garen kode honekin:

- **`network_mode: host`**: Hau da gako nagusia. Sare birtual isolatu bat sortu beharrean (batzuetan AAren eta interfazearen arteko komunikazio arazoak ematen dituena), edukiontziari esaten diogu zure Debian makinaren sare bera erabiltzeko. Bi gelen arteko trenkadak kentzea bezala da, airea hobeto ibil dadin.

- **`volumes`**: Hemen konektatzen ditugu "mundu erreala" eta "Docker mundua". Zure Debian karpeta `/ docker/openwebui` bihurtzen da edukiontziaren datu-biltegi. Edukiontzia ezabatu eta berriro sortzen baduzu, zure txatek hor jarraituko dute, zure disko gogorrean bizi direlako, ez edukiontziaren barruan.

- **`PORT = 3000`**: Sare-modua "host" denez, ez dugu portuak `3000:8080` gisa mapatu behar. Zure makinaren 3000 atakan zuzenean exekutatzeko besterik ez diogu esaten barne-aplikazioari.

## ⚙️ II Etapa: Motorra (Docker Model Runner)

Aurreko urratsa karrozeria eraikitzea izan bazen, orain motorra instalatuko dugu. Gure nodorako, abangoardiako tresna bat erabiliko dugu: **Docker Model Runner (DMR)**.

Beste soluzio astunagoak ez bezala, motor hau ikusezina eta eraginkorra izateko diseinatuta dago. Zure eskaerak entzutea, hizkuntza eredura (garunera) pasatzea eta erantzun koherente bat itzultzea da bere zeregin bakarra.

### 🛠️ 1. "Model" osagaia instalatzea
Dockerrek “model” komandoa uler dezan, **Docker Model Management** instalatu behar dugu. Debian bezalako Linux sistemetan, Dockerren gaitasunak zabaltzen dituen plugina deskargatuz egiten da hori.

`Docker model` idaztean zure sistemak ez badu erantzuten, pluginaren instalazioa exekutatu behar dugu:

```bash
# Instalamos el soporte para modelos de Docker
sudo apt-get update
sudo apt-get install docker-model-management-plugin
```

- **Zer instalatzen ari gara benetan?** Ez da programa astuna, "itzultzaile" bat besterik ez da. Hemendik aurrera, Dockerrek jakingo du nola kudeatu Adimen Artifizialeko ereduetarako bereziki CPU zikloak eta RAM memoria zikloak, zure beste edukiontziekin (hala nola zure datu basearekin edo zure CRMarekin) gatazkarik gabe bizitzeko aukera emanez.

### 🏎️ 2. Runnerra martxan jartzea

Motorrak ez du instalazio konplexurik behar, aginduen zain geratzen den zerbitzu bat bezala abiarazten da. Lehenik eta behin, "bihotza" taupadaka ari dela ziurtatuko dugu.

Debianeko zure terminalean, exekutatu:

```bash
docker model start-runner
```

- **Zer egiten ari gara?** Komunikazio-kanal bat irekitzen duen bigarren mailako prozesu bat aktibatzen ari gara (ataka bat, zehazki** 12434**). Une horretatik aurrera, zure makina gai da "AA lengoaia" hitz egiteko. Zure fitxategi lokalen eta kalkulu potentziaren arteko zubia da.

### 🧠 2. Garunaren deskarga: `pull` Komandoa.

Erregairik gabeko motorra ez dabil. Gure nodoaren erregaia modeloak dira. **Phi-4** deskargatuko dugu, Microsoften tokiko ekipoetarako koroaren harribitxia (edo hori diote). Tamaina trinkoa izan arren, sakontasun harrigarriz arrazoitzen duen eredua da.

Gure makinara ekartzeko, hau exekutatzen dugu:

```bash
docker model pull phi4
```

- **Prozesua:** Aurrerapen-barra bat ikusiko duzu. Une honetan, zure nodoa gigabyteak jaisten ari da "pisu neuronaletatik". Pisu horiek AAk logika, programazioa eta hizkuntza ikasi zituen hilabeteetako entrenamenduaren emaitza dira. Amaitutakoan, **phi4** etengabe biziko da zure disko gogorrean. Ez duzu berriro internet beharko ezer kontsultatzeko.

### 🧪 3. APIaren balidazioa: AAren "Kaixo Mundua"

Interfaze grafikoa ireki aurretik, ziur egon behar dugu motorra eta garuna ondo konektatuta daudela. Ez dugu itsu-itsuan aurrera egin nahi. "Taupada" proba bat egingo dugu, motorrari zuzenean kontsulta eginez.

Exekutatu komando hau (`curl` bat da, motorraren atea jotzeko modu bat):

```bash
curl http://localhost:12434/v1/models
```

- **Zer bilatzen dugu hemen?** Dena zuzena bada, zure terminalak testu tekniko bat (JSON bat) bota egingo dizu, eta hor `phi4` izena ikusiko duzu.
- **Bermea:** Horrek funtsezko bi gauza berresten dizkigu:
	1. Motorra ondo entzuten ari da.
	2. **phi4** modeloa kargatuta eta aginduak jasotzeko prest dago.

> **Etapa honetako hausnarketa:** Oraintxe bertan, zure Debian adimenduna da. Oraindik botoiak dituen interfaze politik ez dugun arren, sistemaren nukleoak informazioa prozesatu dezake. Elektrizitatea eta silizioa arrazoiketa pribatuko motor bihurtu ditugu.

## 🎨 III Etapa: Bisuala Garuna (Open WebUI)

Motorra bihotza bada eta eredua garuna bada, **Open WebUI** gure nodoaren aurpegia eta nerbio-sistema da. Geruza horrek aukera ematen digu elkarri eragiteko, fitxategiak igotzeko eta gure ezagutza modu bisualean kudeatzeko.

Etapa honetan, ordena emango dugu, guztia prestatu dugu artxiboan `docker-compose.yml` bizitza.

### 🚀 1. Aireratzea: Zerbitzua altxatuz
Konfigurazio fitxategia gure karpetan gordeta daukagularik `~/orakulue-nodo`, Dockerri esango diogu plana exekutatzeko.

```bash
docker compose up -d
```

- **Zer esan nahi du horrek?** `Up` komandoak konfigurazio fitxategia irakurtzen du eta Open WebUIren irudia deskargatzen (ez baduzu) eta edukiontzia altxatzen hasten da. "D" (de _detached_) parametroa funtsezkoa da: sistemari adierazten dio AA bigarren planoan exekutatzeko, terminala erabiltzen jarraitzeko edo saioa ixteko aukera emanez, nodoa gelditu gabe.

### 🌐 2. Sarbide Ataria: Portua 3000
Komandoa exekutatu ondoren, zure nodoa interfazea proiektatzen ari da. Baina, nola sartuko gara?

Ireki zure nabigatzailerik gogokoena eta idatzi helbide-barran: `http://localhost: 3000` (edo zure zerbitzariaren IPa, adibidez: `http://192.168.1.145: 3000`).

- **Zergatik 3000 portua?** Web aplikazio modernoetarako portu estandarra delako konfiguratu dugu horrela, eta libre egoten da. Zure sarrerako ate pribatua da.

- **Garrantzitsua:** Sartzen zaren lehen aldian, sistemak kontu bat sortzeko eskatuko dizu. **Lasai:** kontu hori % 100 tokikoa da. Ez du Internetera bidaiatzen, I. etapan sortzen dugun iraunkortasun karpetan gordetzen da. Zu zara administratzaile absolutua.

### 🔗 3. Konexio handia: interfazea eta motorra lotzen
Orain dator urrats erabakigarria. Interfazea irekita daukagu, baina II. etapan abiarazten dugun motorra erabiltzeko esan behar diogu.

1. Joan **Ezarpenak** atalera (behean ezkerretara dagoen engranaje-ikonoa).

2. Bilatu **Konexioak** edo **Itxi API Saioa/Konfigurazioa** atala.

3. OpenAIren (edo Ollamaren) APIaren URLrako eremu bat ikusiko duzu. Gure motor lokalaren helbidea sartu behar dugu: `http://127.0.0.1: 12434`

4. Egin klik **Freskatu** ikonoan. Dena ondo joan bada, check berde bat agertuko da.

> **Emaitza:** Pantaila nagusiko ereduen goitibeherakoan, orain ikusiko duzu **phi4** agertzen. Aukeratu eta idatzi zure lehen mezua. Zorionak: zure AA subiranoarekin lehen komunikazioa ezarri berri duzu zure zerbitzariaren bidez.

## 🌉 IV. Etapa: Komunikazio Zubia (Networking)
Edukiontzien ingurune batean, zerbitzu bakoitza (interfazea eta motorra) bere "uhartean" bizi da. Erronka da interfazeak (Open WebUI) AAren motorrari "deitu" behar diola erantzunak lortzeko. `Localhost` en bilatzeko besterik esaten ez badiogu, batzuetan interfazeak bere burua bilatzen du bere uhartearen barruan, eta ez du ezer aurkitzen.

Hemen aplikatzen dugu sareen ingeniaritza, dena egoki dadin.

### 🔌 1. Hormak hausten: Host modua

Gure fitxategian ikusi genuenez `docker-compose.yml`, erabaki estrategiko bat hartu dugu: `network_mode: host` erabiltzea.

- **Zer egiten ari gara?** Sare birtual konplexu bat sortu beharrean, Open WebUIri esaten diogu: _Debian sistema eragilearen sare bera erabiltzen du_.

- **Abantaila:** Honek edozein hesi ezabatzen du. Interfazeak **12434** portua (AAren motorra bizi den lekua) gela berean balego bezala ikus dezake. Konponbiderik sendoena da _Connection Refused_ akats ospetsua saihesteko.

### 🌐 2. Gateway: irteerako IPa

Zure kasuan, segurtasun aurreratuko arrazoiengatik host modua ez erabiltzea erabakitzen baduzu, aukera bat dago: Dockerren **Gateway** erabiltzea.

- **Kontzeptua:** Interfazeari edukiontziaren `irteerako atearen` helbidea ematea bezala da, benetako makinan zer dagoen ikus dezan (zure Debian).

- **Konfigurazioa:** `Localhost` erabili beharrean, Docker sarearen barneko IPa emango genioke (normalean `172.17.0.1`). Horri esker, interfazeak bere edukiontzitik kanpo salto egin dezake, sisteman dabilen AAko motorrarekin hitz egiteko.

### 🔗 3. Azken lotura: Bostekoa ematea

Zubia eraiki ondoren, azken lotura egin behar dugu Open WebUIren doikuntzen barruan, bi zerbitzuen arteko "bostekoa" iraunkorra izan dadin.

1. **Zuzendaritza Nagusia:** Administrazio-panelean, konexioko URLa `http://host.docker.internal:12434` edo `http://127.0.0.1: 12434` dela ziurtatzen dugu.

2. **Osasunaren balidazioa:** Egiaztatzeko botoian klik egitean, interfazeak pultsu txiki bat bidaliko dio motorrari. Motorrak modeloen zerrendarekin erantzuten badu (**phi4** bezala), lotura arrakastatsua izan da.

> **Etapa honetako hausnarketa:** Networkinga behar bezala konfiguratzeak bereizten ditu instalazio ezegonkor bat eta **Adimen** profesionaleko nodo bat. Orain, zure interfazea ez da aurpegi polita bakarrik; zure zerbitzariaren kalkulu muskuluetara zuzenean konektatutako leihoa da.

## 🚀 Horizontea: Mugarri bat zure produktibitatean

Puntu honetara iritsita, zure aurrean daukazuna instalatutako software bat baino askoz gehiago da; **zure pentsamendu-gaitasunaren hedapen bat da**. Hirugarrenen zerbitzuen kontsumitzaile pasibo izatetik geure adimenaren arkitekto izatera igaro gara.

Zure mahaigainean **Adimen Subiranoko Nodo** bat izateak esan nahi du negozio ideia distiratsu bat, deszifratzea lortzen ez duzun kode bat edo aztertzeko dokumentu konfidentzial bat duzun hurrengoan ez diozula inori baimenik eskatu beharko, ezta zure pribatutasuna arriskuan jarri ere. Zenbaketa ahalmena hor dago, zure RAMean, zure erabateko kontrolpean.

Hau lehen urratsa baino ez da. Lokalean lan egiten duten 14B parametroetako laguntzaile bat izateko arintasuna esperimentatzen duzunean, teknologia ulertzeko modua betiko aldatzen da.

### Zure ikuspegia jakin nahiko nuke:

Pribatutasunaren eta kostuaren oztopoa desagertu den honetan...

- **Zure eguneroko zein prozesu emango zenioke zuk bakarrik irakur dezakezun AA bati?**

- **Gaur egun, non ikusten duzu baliorik handiena: Interneterako programazio itsuko kopilotu bat edukitzean edo zure dokumentazio pribatu guztia "esango" lukeen sistema batean?**

Iruzkinetan irakurtzen dizut. AAk zuretzat lan egiteko garaia da, eta ez alderantziz!
