---
title: "Prestakuntzen kontrol-gunea (I): Excel sakabanatuetatik agenda bisualera"
description: "Lehen atala: nola sortu nire agenda bisuala ikastaroak planifikatzeko, gainjartzeak saihesteko eta informazio logistikoa zentralizatzeko."
pubDate: "2025-09-10"
lang: "eu"
summary: "Hilero prestakuntzak ematen badituzu, eta mila Excel darabiltzazu, serie honek pausoz pauso erakutsiko dizu nola eraiki zure agenda bisuala: saioak antolatzeko, gainjartzeak saihesteko eta Google Calendarrarekin sinkronizatzeko."
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
tkey: "centro-mando-formaciones-01"
---

# Excel sakabanatuetatik agenda bisualera: prestakuntzen “kontrol-gunea” nola eraikiko dudan

Hilero hainbat enpresatan ikastaroak ematen badituzu, badakizu erronka ez dela eduki bakarrik: **logistika** da. Bezero ugari, harremanetarako arduradunak, ordutegiak, egoitzak, modalitateak… eta azken orduko aldaketak, edozein planifikazio orokor nahasi dezaketenak.

Beharrizan horretatik sortu da proiektua: **agenda bisual propioa sortzea**, begirada bakarrean nire prestakuntza guztiak planifikatu eta erabaki azkarrak hartu ahal izateko, informazio fidagarrian oinarrituta.

---

## Zein arazo konpontzen duen

- Gainjartzeak saihestu eta desplazamendurako denbora errealista bermatu.  
- Sakabanatutako datuak bateratu (bezeroak, arduradunak, kontratuak, bideokonferentziarako estekak…).  
- Egutegi-ikuspegiak: urtekoa, hilabetekoa, astekoa eta egunekoa, kolore eta egoerekin.  
- Orduen kalkulua datu-tartez / bezeroz / gaiz, fakturazioari elikatzeko.  

---

## Proiektuaren helburuak

Ez da “beste agenda bat”. Prestakuntza teknologikora doitutako tresna da:

- Ikuspegiak: urteko / hilabeteko / asteko / eguneko.  
- Prestakuntzaren fitxak: gaia, bezeroa, datak, orduak, lekua, modalitatea (aurrez aurrekoa / online), tarifa, bideokonferentziarako esteka, eta abar.  
- Bezeroarekiko lotura: kontaktu-datuak, helbidea, IFK eta elkarrizketarako arduraduna.  
- Gainjartzeen kontrola eta desplazamendu-denbora minimoaren abisuak.  
- Ekitaldi errepikakorrak (asteetan / hilabeteetan banatutako saioak).  
- Kolore-kodeak + egoerak: baieztatua, behin-behinekoa, bertan behera, lehentasuna.  

---

## Osagarri funtzionalak

- PDFra esportatzea (urteko, hilabeteko edo asteko ikuspegiak).  
- Google Calendarrekin sinkronizazioa, mugikorretik kontsultatzeko.  
- Eranskin-kudeaketa (kontratuak, gidoiak, proposamenak).  
- Aldaketen erregistroa (nork zer eta noiz aldatu duen).  
- Orduen kalkulua data / bezero / gaiaren arabera, fakturaziorako zubiarekin.  

---

## Diseinua eta arkitektura (argitasuna lehenik)

**Stack-a:** `Python` + `PyQt` interfazerako, `SQLite` tokiko biltegiratzerako.

**Geruzak:**

- **Datuak:** SQLite eta sarbidea errepositorioen bidez.  
- **Domeinua:** `Bezeroa`, `Prestakuntza`, `Gaia`… klaseak eta arauak (gainjartzeak, orduen kalkulua).  
- **Zerbitzuak:** esportazioak, Google Calendar, eranskinak.  
- **Interfazea:** egutegi bisuala, inprimakiak eta planifikazio-tresnak.  

**Zergatik horrela?** Garapen-abiadura, eramangarritasuna (zerbitzari gabe funtzionatzen du) eta datuaren kontrola lehenesten dituelako. Gerora, egokia bada, API/Cloud-era bidea egon daiteke.

---

## Seriearen ibilbide-orria

Hau da lehen artikulua. Hurrengoetan, pausoz pauso:

1. Datu-eredua eta eskema (taulak, erlazioak, egoerak, errepikakortasuna).  
2. Errepositorioak eta negozio-arauak (gainjartzeen balidazioa, denbora minimoak).  
3. Egutegiaren interfazea PyQt-n eta osagai giltzarriak.  
4. Google Calendar integrazioa eta mapaketa segurua bi norabidetan.  
5. PDF esportazioak txantiloi garbiekin.  
6. Metrikak eta orduak fakturaziorako eta reporting-erako.  
7. Paketatzea eta zabalkundea lan-ingurunean.  

---

## Amaitzeko

Nire asmoa da **benetako behar bat tresna erabilgarri bihurtzea**, eta bidean hartutako erabakiak, zalantzak, akatsak eta konponbideak partekatzea.

Prestakuntzan (edo data eta pertsona askoko proiektuetan) bazaude, proiektu honek **denbora eta akatsak aurrez diezazkizuke**.

---

**Zein ikuspegi edo funtzionalitate jotzen duzu funtsezkotzat hasierarako?**  
Iruzkinetan irakurriko zaitut, eta zuen feedback-aren arabera moldatuko dut garapena.
