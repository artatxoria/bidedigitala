---
title: "Prestakuntzen kontrol-gunea (II): arkitekturaren eta datu-ereduaren diseinua"
description: "Bigarren atala: aplikazioa geruzatan antolatzea eta datu-eredu malgu bat definitzea, nire eguneroko lana islatzeko."
pubDate: "2025-09-15"
lang: "eu"
summary: "Ideia orokorraren ondoren, urrats garrantzitsuena: agenda bisualaren arkitektura geruzaz antolatzea (datuak, domeinua, zerbitzuak, interfazea) eta datu-eredua zehaztea, oinarrizko prestakuntzak, kontratazioak eta saioak bereiziz."
author: "Juan Carlos Beaskoetxea"
categories:
  - Prestakuntza zentroa
  - Euskera
tags:
  - Prestakuntza
  - Produktibitatea
  - Automatizazioa
  - PyQt
  - Python
  - Agenda bisuala
  - Neurrira egindako softwarea
tkey: "centro-mando-formaciones-02"
---

# Arkitekturaren eta datu-ereduaren diseinua

Serie honetako lehen artikuluan ideia orokorra azaldu nuen: nire agenda bisuala eraikitzea, bezero ezberdinei ematen dizkiedan prestakuntzak planifikatu eta kudeatzeko.  
Orain urrats garrantzitsu bat dator: aplikazioa nola antolatuko den barrutik eta zein datu-eredu erabiliko dugun nire eguneroko lanaren isla zehatza egiteko.

---

## Geruzazko arkitektura modularra

Aukeratu dudan planteamendua modularra eta objektuetara bideratua da, geruzazko arkitekturaren arabera. Horrek esan nahi du proiektua bloke argietan banatzen dela, bakoitza bere eginkizun zehatzarekin:

### Datu-geruza
- **SQLite**-n biltegiratzea, bezero, prestakuntza, kontratazio eta saioetarako taula normalizatuekin.  
- **CRUD** eragiketa guztiak (sortu, irakurri, eguneratu, ezabatu) kudeatuko ditu.  

### Domeinu-geruza
- Klase nagusiak: `Bezeroa`, `OinarrizkoPrestakuntza`, `Kontratazioa`, `Saioa`, `Gaia`, `Eranskina`.  
- Negozio-logika jasoko du: gainjartzeen balidazioa, orduen kalkulua, egoeren kontrola.  

### Zerbitzu-geruza
- Laguntza-funtzionalitateak: esportazioak (PDF, CSV, iCal), Google Calendar sinkronizazioa eta babes-kopiak.  

### Aurkezpen-geruza (UI)
- **PyQt** bidezko interfaze grafikoa:  
  - Egutegi-ikuspegiak (urtekoa, hilekoa, astekoa eta egungoa).  
  - Bezero eta kontratazio formularioak.  
  - Saioak antolatzeko arrastatu-eta-askatu funtzioak.  
  - Kolore eta egoera bisualak ekitaldiak bereizteko.  

Diseinu honek geruza bakoitza modu independentean garatzea ahalbidetzen du, sistema erabilerrazagoa eta hedagarriagoa bihurtuz (adibidez, etorkizunean fakturazioa gehitzeko).

---

## Hiru mailatako datu-eredua

Beharrizanak aztertu ondoren, ezinbestekoa ikusi nuen hiru kontzeptu hauek argi bereiztea:

### Oinarrizko prestakuntza
- “Katalogoko” ikastaroa da (adibidez: *Excel Oinarrizkoa*).  
- Bezeroetatik independentea existitzen da.  
- Datu orokorrak jasotzen ditu: izena, deskribapena, gaia, erreferentzia-orduak, maila eta eduki estandarra.  

### Kontratazioa
- Bezero zehatz batekin egindako akordioa da prestakuntza emateko.  
- Oinarrizko prestakuntzatik abiatzen da, baina baldintza espezifikoak jasotzen ditu: prezioa/ordua, aurreikusitako ordu kopurua, modalitatea (presentziala edo online), helbidea edo esteka, arduraduna, datak, egoera (behin-behinekoa, baieztatua, bertan behera).  
- Kontratazio bakoitzak **espediente-kode** bat izango du, etorkizunean fakturazioarekin lotzeko.  

### Saioa
- Egutegian agertzen den bloke zehatza da.  
- Kontratazio bati lotuta dago eta data, ordua, lekua eta egoera zehazten ditu.  
- Bakana izan daiteke edo errepikakorra (adibidez: hilabete batez asteartero 9etatik 12etara).  

Gainera, **eranskinak** (kontratuak, gidoiak, materialak) bezeroei, kontratazioei edo saioei lotu ahal izango zaizkie.

---

## Entitateen arteko erlazioak

Sinplifikatuz, eredua honela funtzionatzen du:

- **Bezero** batek hainbat kontratazio izan ditzake.  
- **Oinarrizko prestakuntza** bat bezero desberdinek kontrata dezakete.  
- **Kontratazio** bakoitza saio batean edo gehiagotan banatzen da, eta egutegian agertzen dira.  
- **Eranskinak** bezero, kontratazio edo saioei lotu daitezke.  

Eredu honek bikoizketak saihesten ditu, kontratu bakoitzaren berezitasunak jasotzeko malgua da eta etorkizuneko hedapenetarako prestatuta dago.

---

## Negozio-arau nagusiak

Hasieratik aplikatuko diren arau batzuk:

- **Gainjartzerik ez**: bi saio ezin dira ordutegi berdinean kokatu.  
- **Desplazamendu-kontrola**: egun berean hainbat saio badaude toki ezberdinetan, ohartaraziko da ez badago nahikoa tarte.  
- **Koloreak eta egoerak**: bezero bakoitzak kolore bat izango du, eta saio/kontratazio bakoitzak egoera bat (baieztatua, behin-behinekoa, bertan behera).  
- **Orduen kalkulua**: dataka, bezeroka edo gaiaren arabera batura egiteko, estatistikak eta fakturazioa prestatzeko.  
- **Aldaketen historiala**: datetan, orduetan edo egoeretan egindako aldaketak erregistratuko dira trazabilitatea bermatzeko.  

---

## Hurrengo urratsak

Hurrengo artikuluan, **SQLite** datu-basea definituko dugu, beharrezko taula eta erlazioekin.  
Horrez gain, **Python** bidezko errepositorioak eraikiko ditugu, datu-basearen eta domeinu-klaseen arteko zubia izango direnak.  

Orduan iritsiko da teoriatik lehenengo kode-zatiekin praktikara pasatzeko momentua.
