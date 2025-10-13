---
title: "Domeinu-geruza eta jardueren trazabilitatea logging bidez"
description: "Bosgarren atala: gure planifikatzaileari adimena ematen diogu. Domeinu-klaseak inplementatzen ditugu, balidazioak txertatzen ditugu eta logging sistema bat gehitzen dugu, proiektuaren jarduera osoa erregistratzeko."
pubDate: "2025-10-11"
lang: "eu"
summary: "Bosgarren atal honetan gure prestakuntza-planifikatzailearen garapeneko urrats garrantzitsu bat egiten dugu: domeinu-klaseak sortu, balidazioak gehitu eta logging sistema sendo bat inplementatzen dugu, aplikazioaren ekintza, arrakasta eta errore guztiak zentralizatutako erregistro batean gordetzeko."
author: "Juan Carlos Beaskoetxea"
tags:
  - Prestakuntza
  - Produktibitatea
  - Automatizazioa
  - PyQt
  - Python
  - Agenda bisuala
  - Logging
  - Neurrira egindako softwarea
tkey: "centro-mando-formaciones-05"
---

# Domeinu-geruza eta jardueren trazabilitatea logging bidez

Aurreko atalean **datu-geruza** eraiki genuen: gure planifikatzailearen informazioa gordetzen duen hezurdura.  
Bosgarren atal honetan urrats bat gehiago egiten dugu: **domeinu-geruza** garatzen dugu, hau da, sistemako entitate nagusiak ordezkatzen dituzten klaseak eta negozio-logika barne hartzen dituztenak.

Horrez gain, **logging sistema zentralizatu** bat gehitu dugu, aplikazioan gertatzen den guztia erregistratzen duena: objektuen sorrera, balidazioak, erroreak, abisuak eta barne-prozesuak.  
Erregistro hau funtsezkoa izango da aplikazioaren portaera ulertzeko eta arazketarako.

---

## Domeinu-geruza: sistemaren bihotza

Domeinu-klase bakoitzak gure planifikatzailearen funtzio-eremu bat ordezkatzen du:

- **Bezeroa** → prestakuntza kontratatzen duen enpresa edo pertsona.  
- **Gaia** → prestakuntza-gaien katalogoa.  
- **OinarrizkoPrestakuntza** → prestakuntza orokor baten definizioa (adibidez, “Excel Oinarrizkoa”).  
- **Kontratazioa** → bezero jakin batek egindako prestakuntza baten instantzia.  
- **Saioa** → kontratazio baten saio zehatza.  
- **Eranskina** → dokumentu lotuak (kontratuak, gidoiak, edukiak...).  
- **BezeroElkarreragina** → harreman eta negoziazio erregistroa (mini-CRM moduan).

Klase bakoitzak bere datuak balidatzen ditu instantziatzean, eta datu okerrak aurkituz gero, salbuespena jaurtitzen du, automatikoki log fitxategian jasota geratzen dena.

---

## Logging sistemaren integrazioa

Logging konfigurazioa zentralizatzeko, `planificador/common/registro.py` modulu komun bat sortu dugu.

Konfigurazioaren bertsio sinplifikatu bat honakoa da:

```python
import logging
from pathlib import Path

def configurar_registro(archivo=None, nivel_texto="INFO", forzar=False):
    archivo = archivo or Path(__file__).resolve().parents[2] / "planificador.log"
    nivel = getattr(logging, nivel_texto.upper(), logging.INFO)

    logging.basicConfig(
        level=nivel,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        handlers=[logging.FileHandler(archivo, encoding="utf-8"), logging.StreamHandler()],
        force=forzar
    )

def get_logger(nombre):
    return logging.getLogger(nombre)
```

Horri esker, edozein klasek honela erregistratu ditzake ekintzak:

```python
from planificador.common.registro import get_logger
log = get_logger(__name__)
```

Adibidea: `Bezeroa` klasea

```python
from datetime import datetime
from planificador.common.registro import get_logger

log = get_logger(__name__)

class Cliente:
    def __init__(self, empresa, cif, persona_contacto=None, telefono=None,
                 email=None, direccion=None, notas=None, color_hex="#377eb8", id_cliente=None):
        self.id_cliente = id_cliente
        self.empresa = empresa
        self.cif = cif
        self.persona_contacto = persona_contacto
        self.telefono = telefono
        self.email = email
        self.direccion = direccion
        self.notas = notas
        self.color_hex = color_hex
        self.created_at = datetime.now().isoformat()

        self._validar()
        log.info(f"Cliente creado: {self.empresa} ({self.cif}), id={self.id_cliente or 'pendiente'}")

    def _validar(self):
        if not self.empresa:
            log.error("Error al crear Cliente: falta 'empresa'")
            raise ValueError("El campo 'empresa' es obligatorio")
        if not self.cif:
            log.error("Error al crear Cliente: falta 'cif'")
            raise ValueError("El campo 'cif' es obligatorio")
```

Eredu bera jarraitzen dute gainerako klase guztiek, koherentzia eta trazabilitatea bermatuz.

### Logging proben inplementazioa

Kalitatea bermatzeko, unitate-probak sortu ditugu domeinu-klase bakoitzarentzat, logging sistemaren funtzionamendua egiaztatzeko.

Adibidea: `tests/dominio/test_logging_cliente.py`

```python
import pytest
from planificador.dominio.modelos.cliente import Cliente
from planificador.common.registro import configurar_registro

@pytest.fixture(autouse=True)
def setup_logging(tmp_path):
    log_file = tmp_path / "cliente.log"
    configurar_registro(archivo=log_file, nivel_texto="DEBUG", forzar=True)
    return log_file

def test_logging_cliente_ok(setup_logging):
    log_file = setup_logging
    Cliente(empresa="Empresa Demo", cif="B12345678", email="test@demo.com")
    contenido = log_file.read_text(encoding="utf-8")
    assert "Cliente" in contenido
    assert "creado" in contenido
```

Domeinuko klase guztiek beren logging-probak dituzte (Bezeroa, Gaia, OinarrizkoPrestakuntza, Kontratazioa, Saioa, Eranskina eta BezeroElkarreragina).

### Integrazio-probak

Unitate-probez gain, bi **integrazio-proba** garatu ditugu:

#### 1. Fluxu osoa (errore gabe)

Aplikazioaren ohiko erabilera simulatzeko:

1. Bezero bat sortu
2. Gai bat erregistratu
3. Oinarrizko prestakuntza bat sortu
4. Kontratazio bat egin
5. Saio bat programatu
6. Eranskina gehitu
7. Elkarreragin komertzial bat erregistratu

Probak egiaztatzen du log fitxategiak urrats guztiak jasotzen dituela:

```python
assert "Cliente" in contenido
assert "Tema" in contenido
assert "FormacionBase" in contenido
assert "Contratacion" in contenido or "Contratación" in contenido
assert "Sesion" in contenido or "Sesión" in contenido
assert "Adjunto" in contenido
assert "Interaccion" in contenido
```

#### 2. Fluxu negatiboa (erroreekin)

Honako akats arrunten logging-a egiaztatzeko:

- Bezeroa enpresarik gabe.
- Saioa ordu baliogabeekin.
- Eranskina fitxategi-biderik gabe.
- Elkarreragina mota baliogabearekin.

Probak baieztatzen du ERROR eta WARNING mailako sarrerak behar bezala jasotzen direla logean.

## Jardueren erregistroa: istorioak kontatzen dituen loga

Fase honen ondoren gure **domeinu-geruza** osatu dugu, eta sistemak orain honako gaitasunak ditu:

- Balidazio koherenteak klase guztietan.
- Jarduera guztien trazabilitate osoa logging zentralizatuaren bidez.
- Unitate- eta integrazio-probak, kasu zuzenak eta erroreak barne.

Planifikatzailearen **log fitxategiak** orain istorio oso bat kontatzen du:
bezero bat alta ematen den unetik, elkarreragin komertzial bat edo errore bat gertatzen den arte.

Hurrengo urratsak
Hurrengo atalean zerbitzu-geruza landuko dugu: esportazioak, Google Calendar-ekin sinkronizazioa eta babeskopia automatikoak.
Hori izango da gure planifikatzailea tresna profesional eta oso bihurtzeko urrats handia.

## 🧭 3. Fasearen laburpena:

- Domeinu-klaseak inplementatu dira (Bezeroa, Gaia, OinarrizkoPrestakuntza, Kontratazioa, Saioa, Eranskina, BezeroElkarreragina).
- Logging sistema zentralizatua gehitu da.
- Datuen balidazioak eta salbuespen kontrolatuak inplementatu dira.
- Unitate- eta integrazio-probak sortu dira (fluxu zuzenak eta erroredunak).

Proiektuak orain sendoagoa eta trazagarriagoa den oinarri bat du, hurrengo faserako prest.