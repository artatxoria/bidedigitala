---
title: "Esportazio, sinkronizazio eta segurtasun-kopia zerbitzuak"
description: "Planifikatzaile proiektuaren seigarren entrega: fase honetan sistemaren funtzionaltasuna zabaltzen duten zerbitzuak garatzen ditugu — datuen esportazioa, Google Calendar sinkronizazioa eta segurtasun-kopien kudeaketa automatikoa."
pubDate: "2025-10-13"
lang: "eu"
summary: "Planifikatzaile proiektuak heldutasun tekniko garrantzitsua lortzen du fase honetan, datuen interoperabilitatea, segurtasuna eta trazabilitatea bermatzen dituzten zerbitzuak garatuz. Esportazioa, sinkronizazioa eta segurtasun-kopiak jorratzen ditugu."
author: "Juan Carlos Beaskoetxea"
tags:
  - Prestakuntza
  - Produktibitatea
  - Automatizazioa
  - PyQt
  - Python
  - Agenda bisuala
  - Segurtasun-kopiak
  - Esportazioa
  - Sinkronizazioa
tkey: "centro-mando-formaciones-06"
---

# Esportazio, sinkronizazio eta segurtasun-kopia zerbitzuak

Gure **prestakuntzen planifikatzaileak** hazkunde tekniko garrantzitsua izan du seigarren entregan:  
sistemaren funtzionaltasuna zabaltzen duten **zerbitzu transbertsalak** garatu ditugu, datuen osotasuna, beste sistemekin interoperabilitatea eta informazioaren segurtasuna bermatuz.

Zerbitzu hauek ez dira datu-geruzaren edo logika nagusiaren parte zuzena, baina **funtsezkoak dira** eguneroko erabileran oinarritutako ingurune erreal batean.

---

## 1️⃣ Esportazio zerbitzua

Lehenik, **esportazio-modulua** garatu dugu, erabiltzaileari sistematik informazioa formatu estandar ezberdinetan ateratzeko aukera ematen diona.

`exportacion_servicio.py` moduluak hiru funtzionalitate nagusi eskaintzen ditu:

- **CSV esportazioa** → kalkulu-orrietarako eta datuen analisi azkarrerako.  
- **iCal (.ics) esportazioa** → kanpoko egutegietarako.  
- **PDF esportazioa** → txosten azkarrak sortzeko.

Bere egitura proiektuaren gainerakoarekin koherentea da: klase estatikoak, errore-kudeaketa eta **logging zentralizatua**.

```python
from planificador.data.db_manager import get_connection
import csv, logging
from pathlib import Path

class ServicioExportacion:

    @staticmethod
    def exportar_csv(nombre_tabla: str, ruta_destino: Path) -> Path:
        with get_connection() as conn:
            cursor = conn.execute(f"SELECT * FROM {nombre_tabla}")
            columnas = [d[0] for d in cursor.description]
            registros = cursor.fetchall()
        with open(ruta_destino, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(columnas)
            writer.writerows([tuple(r) for r in registros])
        return ruta_destino
```

### 🔍 Emaitza

Metodo honek CSV fitxategiak sortzen ditu automatikoki, zutabe-izenekin eta UTF-8 kodifikazioarekin, `exportacion.log` fitxategian jarduera guztiak erregistratuz.

## 2️⃣ Sinkronizazio zerbitzua (Google Calendar simulazioa)

Bigarren moduluak, `sincronizacion_servicio.py` izenekoak, **Google Calendar** zerbitzuarekin lotura ezartzeko oinarriak prestatzen ditu.
Oraindik **simulazio moduan** funtzionatu arren, arkitektura prest dago etorkizunean OAuth tokenak eta API errealeko deiak erabiltzeko.

Hiru metodo nagusi ditu:

- `exportar_a_google_calendar(sesiones)`: Planifikatzailetik ekitaldiak esportatzen ditu (simulazioan).
- `importar_desde_google_calendar()`: Proba gisa sortutako ekitaldi-zerrenda itzultzen du.
- `verificar_credenciales()`: Kredentzialen egiaztapen simulatu bat egiten du.

Logging sistemari esker, sinkronizazioaren jarduera guztiak erregistratuta geratzen dira — bai informazio orokorra, bai erroreak.

## 3️⃣ Segurtasun-kopia zerbitzua

Azkenik, `backup_servicio.py` moduluak funtzionaltasun ezinbesteko bat gehitzen du: **datu-base nagusiaren segurtasun-kopiak** automatikoki sortzea (`planificador.db` fitxategia).

Zerbitzu honek ahalbidetzen du:

- Data eta orduarekin izendatutako backup bat sortzea.
- Azken n kopiak soilik mantentzea (biraketa automatikoa).
- Aurreko kopia batetik datu-basea leheneratzea, beharrezkoa izanez gero.

```python
import shutil
from pathlib import Path
from datetime import datetime

class ServicioBackup:

    @staticmethod
    def realizar_backup(db_path: Path, carpeta_destino: Path, max_copias: int = 5) -> Path:
        carpeta_destino.mkdir(parents=True, exist_ok=True)
        fecha = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = carpeta_destino / f"planificador_backup_{fecha}.db"
        shutil.copy2(db_path, backup_path)
        return backup_path
```

Ekintza guztiak `backup.log` fitxategian erregistratzen dira: sortutako kopiak, ezabatutako zaharrak eta egindako leheneratzeak.

## 4️⃣ Unitate- eta integrazio-probak

Fase guztietan bezala, kodearen egiaztapena lehenetsia izan da.
Zerbitzu bakoitzerako proba bereziak sortu dira `tests/servicios/` karpetan:

- test_exportacion_csv.py
- test_sincronizacion_servicio.py
- test_backup_servicio.py

Proba hauek baieztatzen dute:

- CSV fitxategiak behar bezala sortzen direla.
- Sinkronizazioaren simulazioak espero diren ekitaldiak sortzen dituela.
- Segurtasun-kopiak behar bezala sortu, biratu eta leheneratzen direla.

Proba guztiak **%100 arrakastatsuak** izan dira, moduluen egonkortasuna baieztatuz.

## 5️⃣ Fasearen ondorioak

Entrega honekin, **Planifikatzaile proiektuak** honako hau gehitzen du:

- ✅ Datuen esportazioa hiru formatuetan (CSV, iCal, PDF).
- ✅ Google Calendar sinkronizazioaren simulazioa.
- ✅ Segurtasun-kopien sistema osoa, biraketa automatikoarekin.
- ✅ Jarduera guztien erregistro zehatza log fitxategi espezifikoetan.
- ✅ Zerbitzu guztien proba automatizatuak.

Sistema orain gai da bere informazioa **babestu, partekatu eta mantentzeko**, tresna sendo eta fidagarri bihurtuz, hurrengo urrats handiari begira: **interfaze grafikoa**.

📅 Hurrengo entregan **erabiltzaile-interfazearen (UI)** geruzan sartuko gara, egutegia, bezeroen fitxak eta eguneroko lanaren fluxua ikusizko moduan antolatuz.

🧩 **Urratsez urrats aurrera goaz: planifikatzaile bisual, sendo eta guztiz pertsonalizagarria sortzera.**
