---
title: "Prestakuntzen kontrol-gunea (III): inplementazioaren hasiera, egitura eta bertsioen kontrola"
description: "Hirugarren atala: Python bidez proiektuaren hasierako egitura sortzea, ingurune birtuala konfiguratzea, oinarrizko konfigurazioa definitzea eta Git eta GitHub bidez bertsioen kontrola ezartzea."
pubDate: "2025-09-22"
lang: "eu"
summary: "Helburuak eta arkitektura definitu ondoren, kodearekin zikintzeko garaia iritsi da. Artikulu honetan prestakuntzen planifikatzailearen lehen inplementazioa hasten dugu: egitura modularra, ingurune birtuala, mendekotasunak, konfigurazioa eta bertsioen kontrola."
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
tkey: "centro-mando-formaciones-03"
---

# Inplementazioaren hasiera: egitura, ingurunea eta bertsioen kontrola

Proiektuaren **helburuak** (1. artikulua) eta **arkitektura eta datu-eredua** (2. artikulua) definitu ondoren, orain bai, garaia da **kodearekin lanean hasteko**.  
Artikulu honetan prestakuntzen planifikatzailearen lehen urrats praktikoa emango dugu.

Bidea luzea izango da, baina **1. fase honek** proiektuaren oinarri teknikoak ezartzen ditu.

---

## 1. fasea: Prestaketak

1. faseak lau zeregin nagusi ditu:

1. Proiektuaren hasierako egitura sortzea.  
2. Ingurune birtuala eta gutxieneko mendekotasunak konfiguratzea.  
3. Hasierako konfigurazio-fitxategia definitzea.  
4. Git biltegia hastea eta GitHub-en argitaratzea.  

Hasi gaitezen urratsez urrats.

---

## 1. Proiektuaren hasierako egitura

Erroko karpeta `Planificador/` sortu dugu eta haren barruan kodea moduluetan antolatu dugu, **geruzazko arkitektura modularra** errespetatuz:

```bash
Planificador/
├─ planificador/
│ ├─ init.py
│ ├─ main.py
│ ├─ app.py
│ ├─ common/
│ │ ├─ init.py
│ │ ├─ tipos.py
│ │ └─ utils.py
│ ├─ data/
│ │ ├─ init.py
│ │ ├─ db_manager.py
│ │ └─ repositories/
│ │ └─ init.py
│ ├─ domain/
│ │ ├─ init.py
│ │ └─ models/
│ │ └─ init.py
│ ├─ services/
│ │ └─ init.py
│ └─ ui/
│ ├─ init.py
│ ├─ views/
│ │ └─ init.py
│ └─ widgets/
│ └─ init.py
└─ tests/
├─ init.py
└─ test_sanity.py
```

Honek lehen egunetik bertatik **modularitatea eta mantengarritasuna** bermatzen ditu.

`__main__.py` fitxategiak paketea exekutatzea ahalbidetzen du:

```bash
python -m planificador
```

__main__.py-ren gutxieneko edukia:

```python
def main():
    print("Planificador: hasierako egitura sortuta. Hurrengo urratsa: ingurunea eta mendekotasunak.")


if __name__ == "__main__":
    main()
```

## 2. Ingurune birtuala eta gutxieneko mendekotasunak

**Ingurune birtuala** sortzen dugu proiektua isolatuta mantentzeko:

```bash
python3 -m venv entorno_planificador
source entorno_planificador/bin/activate
```

pip eguneratzen dugu:

```bash
pip install --upgrade pip
```

### Hasierako mendekotasunak

Liburutegi minimoak instalatzen ditugu:

```bash
pip install PyQt5 reportlab icalendar pytest
```

- PyQt5 → interfaze grafikoa.
- reportlab → PDF sortzea.
- icalendar → egutegiak esportatu/inportatzea.
- pytest → proben framework-a.

Zerrenda requirements.txt fitxategian gordetzen dugu:

```bash
pip freeze > requirements.txt
```

## 3. Hasierako konfigurazio-fitxategia

Erroan config.json sortzen dugu oinarrizko parametroak zentralizatzeko:

```json
{
  "app": {
    "nombre": "Planificador de Formaciones",
    "version": "0.1.0",
    "idioma": "es-ES"
  },
  "base_datos": {
    "archivo": "planificador.db",
    "backup_dir": "backups"
  },
  "calendario": {
    "zona_horaria": "Europe/Madrid",
    "margen_desplazamiento_min": 60
  },
  "ui": {
    "tema": "claro",
    "fuente": "Arial",
    "tamaño_fuente": 10
  },
  "notificaciones": {
    "email": false,
    "servidor_smtp": "",
    "puerto": 587,
    "usuario": "",
    "password": ""
  }
}
```

Eta `planificador/common/config.py` modulu bat sortzen dugu hura kargatzeko:

```python
import json
from pathlib import Path

CONFIG_PATH = Path(__file__).resolve().parents[2] / "config.json"


def cargar_config():
    """Kargatu eta itzuli config.json-etik konfigurazio-dizionarioa."""
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


if __name__ == "__main__":
    config = cargar_config()
    print("Konfigurazioa kargatuta:", config["app"]["nombre"])
```

### Proba azkarra

```bash
python planificador/common/config.py
```

#### Espero den irteera

```yaml
Konfigurazioa kargatuta: Planificador de Formaciones
```

## 4. Bertsioen kontrola Git eta GitHub-ekin

Biltegia lokalean hasieratzen dugu:

```bash
git init
git branch -m main
```

Oinarrizko `.gitignore` bat sortzen dugu:

```bash
# Ingurune birtuala
entorno_planificador/

# Python cache-ak
__pycache__/
*.pyc

# Datu-basea eta kopiak
*.db
backups/

# Sistema-fitxategiak
.DS_Store
Thumbs.db
```

Lehen commit-a:

```bash
git add .
git commit -m "Planificador proiektuaren hasierako egitura"
```

GitHub-en biltegia sortzen dugu eta lotzen dugu (adibidez, SSH bidez):

```bash
git remote add origin git@github.com:tu_usuario/Planificador.git
git push -u origin main
```

Honekin proiektua argitaratuta eta bertsionatuta daukagu.

## Ondorioa
Lehen fase honetan proiektuaren oinarri teknikoak osatu ditugu:

- ✅ Python-en egitura modularra.

- ✅ Ingurune birtuala eta hasierako mendekotasunak.

- ✅ config.json fitxategian zentralizatutako konfigurazioa.

- ✅ Git eta GitHub bidezko bertsioen kontrola.

# Hurrengo urratsak

Hemendik aurrera **2. fasea** dator, datu-geruzari eskainita:

1. SQL script-a diseinatzea, taula guztiekin.

2. Datu-basearen kudeatzailea (db_manager.py) inplementatzea.

3. Lehen errepositorioak sortzea SQLite-rekin elkarreragiteko.

👉 Hurrengo artikuluan **datu-basearen diseinu fisikoa** ikusiko dugu eta lehen kode-zatiak idatziko ditugu, bezeroen, prestakuntzen eta saioen informazio errealarekin lan egiten hasteko.