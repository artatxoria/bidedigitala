---
title: "Agentic Coding tokiaren ameskeria: hardwarea, bide-gailuak ala harpidetza?"
description: "Analisi tekniko eta finantzarioa Claude Code bezalako agenteekin programatzean agertzen diren kuota-muga, OmniRoute motako bide-gailuen mito eta hardwarearen benetako kostuen inguruan."
pubDate: "2026-03-26"
lang: "eu"
summary: "Terminalean kodeketa-agenteak erabiltzeko mugak aztertu ditugu: AI Gateway-en bideragarritasuna probatu, 24 GB-ko GPUen merkatu erreala ebaluatu eta tokiko hardwarearen errentagarritasuna hodeiko harpidetzekin alderatu dugu."
author: "Juan Carlos Beaskoetxea"
categories:
  - Adimen Artifiziala
  - Software Garapena
tags:
  - Claude Code
  - IA Agenteak
  - Hardwarea
  - OmniRoute
  - Debian
  - Produktibitatea
tkey: "agentic-coding-hardware-vs-nube"
---

# Agentic Coding tokiaren ameskeria: hardwarea, bide-gailuak ala harpidetza?

Terminalean **Claude Code** edo **Google Antigravity** bezalako tresnekin egunero lan egiten duen edonork ezagutuko du egoera: birfaktorizazio konplexu baten erdian zaude, agentea erritmo ikusgarrian ari da komandoak exekutatzen eta aldaketak aplikatzen, eta bat-batean saioa moztu egiten da. Eguneko erabilera-muga gainditu duzu.

Autoosatze sinple batetik **garapen agentiko autonomora** igaro izanak baliabideen kontsumo izugarria dakar. Agente batek direktorio osoak irakurtzen dituenean, terminalean erroreak probatzen dituenean eta kode-adabakiak buklean zuzentzen ditituenean, tarifa lau estandar baten kuota pare bat ordutan desagertzen da.

Blokeo honen aurrean, erantzun tekniko ohikoena bi bide hauetako bat esploratzea izaten da: bitarteko bide-gailu bat (*gateway*) jartzea APIak anizteko, edo GPU indartsu bat erostea dena tokian bertan exekutatzeko. Zenbakiak egin ditugu.

---

## 1. AI Gateway-en ameskeria (OmniRoute, OpenRouter eta ordezko ereduak)

Blokeoa saihesteko lehen ideiak AI Gateway edo IA proxya (OmniRoute edo OpenRouter kasu) jartzea izaten du helburu. Teoriak itxura ona du: agentea endpoint bakar batera konektatu eta eskaerak doako ereduetara, ordezko *pooletara* edo inferentzia ultra-azkarreko hornitzaileetara (Groq, Cerebras, DeepSeek API, Hugging Face) bideratu.

Hala ere, hau terminaleko benetako lan-fluxu agentiko bati aplikatzean, estrategiak bi horma teknikorekin egiten du topo:

1. **Erabilera araberako ordainketaren kostua (*pay-as-you-go*):** Terminaleko agenteek ez dute idatzitako azken lerroa bakarrik bidaltzen. Iterazio bakoitzean proiektuaren egitura, *diff* adabakiak, errore-logak eta testuinguruaren historia osoa berriro bidaltzen dituzte. Errefaktorizazio arratsalde bakar batek milioika testuinguru-token sortzen ditu erraz. Bolumen hau API komertzialetatik token-prezioan igarotzea hileko edozein tarifa lau baino nabarmen garestiagoa da.
2. **Tresnen exekuzioaren haustura (*Tool Calling*):** CLI aurreratuek sistemako argibide konplexuak txertatzen dituzte eta funtzio-dei zorrotzak espero dituzte Linuxeko fitxategi-sistema manipulatzeko. Tokenak murrizten dituzten bide-gailuetatik igarotzean (RTK konpresioa) edo eskaerak *tool calling*-a menperatzen ez duten bigarren mailako ereduetara bideratzean, agentea errore-bukleetan sartzen da edo fitxategiak editatzeko gaitasuna galtzen du.

Bide-gailuak erabilgarriak dira editoreko autoosatuarentzat edo gidoi bakanetarako, baina ez dute garapen-agente oso baten jarraitutasuna ebazten.

---

## 2. IA lanabes profesional gisa: kostua bezeroari helaraztea

Osagaiak erostea ebaluatu aurretik, komeni da software-garapenaren ekuazio ekonomikoa berrikustea. Gure lanagatik fakturatzen badugu, adimen artifizialeko azpiegitura ez da saihestu beharreko gastu bat, proiektuaren entregarekin amortizatzen den **zuzeneko operazio-kostu bat (OpEx)** baizik.

Garapen agentikoak ordu fakturagarrien ohiko logika aldatzen du:

- **Denboraren murrizketa nabarmena:** Lehen 10 orduko eskuzko lana eskatzen zuen arkitektura edo *debugging* zeregin bat 2 ordutan ebazten da agentearen laguntzaz.
- **Balioaren transferentzia:** Bezeroak ez du ordaintzen programatzailea egunetan zehar idazten ikusteko; funtzionala, probatua eta garaiz dagoen entregagarri batengatik ordaintzen du.
- **Kostuaren xurgatzea:** Bezeroari kobratutako orduen beherakada orokorrak alferrikako marjinarik gabe xurgatzen ditu goi-kuotako plan baten hileko 90 € edo 100 €-ak (*Claude Max* edo tilakoak). Tresna bere kabuz ordaintzen da hilabeteko lehen entregarekin.

---

## 3. Abiapuntuaren azterketa: kasu erreala Debian-en

Gure kabuz %100 tokiko alternatiba bat eraiki dezakegun egiaztatzeko, Debian Linux gaineko ohiko lan-estazio bat hartu dugu proba-eredu gisa:

- **Prozesadorea:** 12 hari (*threads*).
- **RAM memoria:** 32 GB DDR4 @ 3200 MT/s.
- **GPU / VRAM:** NVIDIA RTX 4060 Ti (8 GB VRAM).
- **Biltegiratzea:** NVMe PCIe 4.0.

### Benetako gaitasuna tokian bertan
8 GB VRAMekin, GPUaren mugak tamaina txikiko ereduak bakarrik kargatzea ahalbidetzen du (**7B-tik 8B-ra** Q8/FP16 zehaztasunean), `qwen2.5-coder:7b` adibidez. VRAM bidezko errendimendua oso azkarra da (~70 token/segunto), bikaina funtzio bakartuak idazteko edo testak sortzeko.

Hala ere, agente autonomo baten kargari eusteko **32B parametroko** ereduak behar dira (Qwen 2.5 Coder 32B edo DeepSeek R1 32B kasu). 8 GB VRAM dituen ordenagailu batean, 32B-ko eredu bat mugitzeak 12 GB geruza baino gehiago sistemako RAM memoriara bideratzea eskatzen du. DDR4 busaren menpe geratzean, abiadura **2-5 token/segundora** jaisten da, lan-jardunbidean denbora errealean aritzeko onartuezina den latentzia.

---

## 4. 24 GB VRAMeko GPU bat erosi?

32B-ko ereduak tokian bertan exekutatzeko, gutxienez **24 GB VRAM** dituen GPU bat behar da. Hemen jartzen du hardwarearen merkatuak bere errealitatea:

- **Bigarren eskuko merkatua:** Foru eta sare sozialetan RTX 3090 bezalako txartel erabiliak 1.200 € inguruan lor daitezkeela esaten da. Hala ere, osagai hauen eskaintza urria eta aldakorra da, eta higadura handia izan duten gailuak bermerik gabe erosteak arrisku handia dakar.
- **Merkatu berria bermearekin:** Egonkortasun profesionala eta faktura kengarria bilatuz gero, 24 GB VRAM dituen GPU berri baten prezioa **1.900 € eta 2.000 € artean** kokatzen da.

---

## 5. Konparaketa finantzario eta operatiboa: Hardwarea vs. Hodeia

Datuak balantza batean jarrita:

| Kriterioa | Tokiko Hardware Inbertsioa (24 GB VRAM) | Goi-kuotako Hodei Harpidetza (adib. Max Plana) |
| :--- | :--- | :--- |
| **Hasierako inbertsioa** | ~1.900 € - 2.000 € | 0 € |
| **Gastu errepikakorra** | ~0 € (argindar kontsumoa soilik) | ~90 € / hilean |
| **Amortizazioaren baliokidetza** | Goiko harpidetzaren **21 hilabete baino gehiagoren** berdina da. | Lan-karga handiko hilabeteak bakarrik ordaintzen dituzu. |
| **Gaitasun agentikoa** | 32B eredu irekiak. Rendimendu ona edizioan, baina gainbegiratze handiagoa behar dute arrazoibide konplexuetan. | Muga-ereduak (Sonnet / Gemini Pro). Asmatze-tasa handia lehen saiakeran biltegi handietan. |
| **Ekurritasuna** | %100 etenik gabea (*rate limit*-ik gabe). | Plataformaren muga-bidezkoa (oso zabalak izan arren). |

2.000 € GPU batean inbertitzeak erabilgarritasuna ebazten du, baina kapitala azkar balioa galtzen duen hardware batean blokeatzen du; hodeiko ereduek, berriz, bertsioz bertsio bilakatzen jarraitzen dute erabiltzailearentzat azpiegitura-kosturik gabe.

---

## 🚀 Ondorioa: Arkitektura hibridoa

Ez dago soluzio unibertsal bakar bat. Erabakia ingurune bakoitzaren lehentasun operatiboen araberakoa da:

1. **Hodei Profesionalaren bidea:** Egokiena arrazoitze-gaitasun agentiko handiena eta lehen saiakerako asmatze-tasa lehenesten dituenarentzat. Goi-mailako tarifa lauaren kostua bere gain hartzen da proiektuaren baliora bideratuz.
2. **Hardware Dedikatuaren bidea:** Datuen pribatutasun-murrizketa zorrotzak dituzten inguruneetarako, *offline* proiektuetarako edo kuoten bidezko blokeoa onartezina den lekuetarako aproposa, hasierako gastua edozein dela ere.
3. **Bide Hibridoa (Eraginkorrena):** Dagoeneko dugun GPUa 7B/8B eredu txikiekin erabiltzea tokian bertan autoosatzeetarako, sintaxi-galderetarako eta fitxategi laburren ediziorako zero kostuan. Hodeiko CLI agentikoa arkitektura-errefakturazio konplexuetarako eta modulu anitzeko *debugging*-erako soilik erreserbatzea.

Azken finean, tresnak proiektuaren marjinara egokitu behar du, eta ez alderantziz.
