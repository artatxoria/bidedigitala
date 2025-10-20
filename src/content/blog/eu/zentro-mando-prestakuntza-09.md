---
title: "Prestakuntza-zentroaren aginte-panela (IX): Bezeroen ereduaren hedapena eta fluxu komertzial automatizatua"
description: "Bederatzigarren fasea: datu-eredua hedatu dugu bezero finalak, harremanetarako pertsonak eta parte-hartzaileak barne. Errepositorioak eta zerbitzuak hobetu ditugu, eta oroigarri eta saioen automatizazioa osatu dugu."
pubDate: "2025-10-19"
lang: "eu"
summary: "Fase honetan bezeroaren eredua zabaldu dugu, bezero finalak eta parte-hartzaileak gehituz. Harreman komertzialen fluxua hobetu dugu eta oroigarri- eta saio-zerbitzuak probatu ditugu test unitarioekin."
author: "Juan Carlos Beaskoetxea"
tags:
  - Python
  - PyQt6
  - SQLite
  - Automatizazioa
  - CRM
  - Prestakuntza
  - Testing
tkey: "centro-mando-formaciones-09"
---

# Bezeroen ereduaren hedapena eta fluxu komertzial automatizatua

Bederatzigarren fase honetan proiektuaren **egitura nagusia hedatu** dugu:  
datu-eredua aberastu dugu bezero finalak, harremanetarako pertsonak eta prestakuntzetako parte-hartzaileak jasotzeko, eta aldi berean hobetu ditugu **zerbitzuen eta errepositorioen** arteko integrazioa, orain **interakzioak, saioak eta oroigarri automatikoak** sistema bakarrean uztartuta daudelarik.

---

## 1. Datu-ereduaren hedapena

Bezeroaren hasierako ereduari entitate berriak gehitu dizkiogu, enpresen arteko harreman errealak eta prestakuntza-prozesuaren kate osoa hobeto islatzeko.

### Entitate berriak:

- **BezeroFinala (ClienteFinal)**: prestakuntza jasotzen duen enpresa edo entitatea (kontratugilea ez denean).  
- **BezeroFinalarenKontaktua (ContactoClienteFinal)**: prestakuntzan inplikatutako pertsonak (arduraduna, koordinatzailea, parte-hartzailea…).  
- **Parte-hartzailea (Participante)**: prestakuntzako ikasle edo parte-hartzaileak.

Gainera, kontratazio bakoitzak orain **`id_cliente_final`** eremua izan dezake, nahi izanez gero, eta horrek **trazabilitate osoa** ematen du harreman komertzialetik prestakuntzaren exekuzioraino.

---

## 2. Errepositorioen eguneraketa

### 2.1. `interaccion_repo.py`

Emaitzaren balio posibleetan **“propuesta”** egoera gehitu da, jarduera komertzialen egoera errealagoak jasotzeko eta oroigarri-zerbitzuarekin bateragarritasuna mantentzeko.

```python
from planificador.data.db_manager import get_connection
import logging

logger = logging.getLogger(__name__)

class InteraccionRepository:

    @staticmethod
    def crear(id_cliente, fecha, tipo, descripcion=None,
              resultado="pendiente", proxima_accion=None,
              fecha_proxima_accion=None, crear_recordatorio=False):
        with get_connection() as conn:
            cur = conn.execute("""
                INSERT INTO InteraccionCliente (
                    id_cliente, fecha, tipo, descripcion, resultado,
                    proxima_accion, fecha_proxima_accion, crear_recordatorio
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (id_cliente, fecha, tipo, descripcion, resultado,
                  proxima_accion, fecha_proxima_accion, int(crear_recordatorio)))
            conn.commit()
            logger.info(f"Bezeroarentzako interakzio berria sortu da {id_cliente} ({tipo})")
            return cur.lastrowid

    @staticmethod
    def listar_todas():
        with get_connection() as conn:
            cur = conn.execute("""
                SELECT * FROM InteraccionCliente ORDER BY fecha DESC
            """)
            columnas = [c[0] for c in cur.description]
            return [dict(zip(columnas, fila)) for fila in cur.fetchall()]
```

### 2.2. sesion_repo.py

Kodea garbitu eta **logging** sistema gehitu da.
Ez du funtzionalitatea aldatzen, baina trazabilitatea eta egonkortasuna hobetzen ditu.

```python
import logging
from planificador.data.db_manager import get_connection

logger = logging.getLogger(__name__)

class SesionRepository:

    @staticmethod
    def crear(id_contratacion, fecha=None, hora_inicio=None, hora_fin=None,
              direccion=None, enlace_vc=None, estado="propuesta", notas=None):
        """
        Saio berri bat sortzen du. Orain proposamenak erregistratzea ere onartzen du.
        """
        with get_connection() as conn:
            cur = conn.execute("""
                INSERT INTO Sesion (id_contratacion, fecha, hora_inicio, hora_fin,
                                    direccion, enlace_vc, estado, notas)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (id_contratacion, fecha, hora_inicio, hora_fin, direccion, enlace_vc, estado, notas))
            conn.commit()
            logger.info(f"Saioa sortu da: egoera={estado}, kontratazioa={id_contratacion}, data={fecha or 'zehaztu gabe'}")
            return cur.lastrowid

    @staticmethod
    def listar_todas():
        with get_connection() as conn:
            cur = conn.execute("""
                SELECT id_sesion, id_contratacion, fecha, hora_inicio, hora_fin,
                    direccion, enlace_vc, estado, notas
                FROM Sesion
                ORDER BY fecha ASC, hora_inicio ASC
            """)
            columnas = [c[0] for c in cur.description]
            return [dict(zip(columnas, fila)) for fila in cur.fetchall()]
```

## 3. Oroigarri-zerbitzuaren eguneraketa
Oroigarriak sortzeko logika berrantolatu da, interakzio eta saio guztien arteko **bateratze-sistema bakarra** ezarriz.

```python
import logging
from datetime import datetime, timedelta
from planificador.data.repositories.interaccion_repo import InteraccionRepository
from planificador.data.repositories.sesion_repo import SesionRepository

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class ServicioRecordatorios:
    """
    Interakzio eta saioetatik abiatuta oroigarri automatikoak sortzen ditu
    eta datozen 24 orduetako abisuak egiaztatzen ditu.
    """

    @staticmethod
    def generar_desde_interacciones():
        interacciones = InteraccionRepository.listar_todas()
        recordatorios = []

        for inter in interacciones:
            if (
                inter["crear_recordatorio"]
                and inter["fecha_proxima_accion"]
                and datetime.strptime(inter["fecha_proxima_accion"], "%Y-%m-%d")
                >= datetime.now()
            ):
                recordatorio = {
                    "tipo": inter["tipo"],
                    "cliente": inter["id_cliente"],
                    "fecha": inter["fecha_proxima_accion"],
                    "descripcion": inter["proxima_accion"] or inter["descripcion"],
                }
                recordatorios.append(recordatorio)
                logger.info(f"Oroigarria sortu da interakziotik {inter['id_interaccion']}: {recordatorio}")

        logger.info(f"Guztira {len(recordatorios)} oroigarri sortu dira")
        return recordatorios

    @staticmethod
    def comprobar_sesiones_proximas(horas_anticipacion=24):
        sesiones = SesionRepository.listar_todas()
        ahora = datetime.now()
        margen = ahora + timedelta(hours=horas_anticipacion)

        proximas = [
            s for s in sesiones
            if datetime.strptime(s["fecha"] + " " + s["hora_inicio"], "%Y-%m-%d %H:%M") <= margen
            and datetime.strptime(s["fecha"] + " " + s["hora_inicio"], "%Y-%m-%d %H:%M") >= ahora
        ]

        logger.info(f"Hurrengo {horas_anticipacion} orduetan {len(proximas)} saio aurkitu dira")
        return proximas

    @staticmethod
    def avisar_proximos_eventos():
        recordatorios = ServicioRecordatorios.generar_desde_interacciones()
        sesiones = ServicioRecordatorios.comprobar_sesiones_proximas()

        avisos = {
            "recordatorios_interacciones": recordatorios,
            "sesiones_proximas": sesiones,
        }

        logger.info(f"Abisu konbinatuak sortu dira: {avisos}")
        return avisos
```

## 4. Test unitarioak

Test unitarioen bidez egiaztatu da interakzioak, saioak eta oroigarriak behar bezala sortzen direla, eta zerbitzu guztiak bateragarriak direla.

```python
from datetime import datetime, timedelta
from planificador.data.repositories.interaccion_repo import InteraccionRepository
from planificador.data.repositories.sesion_repo import SesionRepository
from planificador.data.repositories.contratacion_repo import ContratacionRepository
from planificador.servicios.servicio_recordatorios import ServicioRecordatorios

def test_avisar_proximos_eventos(tmp_path):
    c_id = ContratacionRepository.crear(
        id_cliente=1,
        id_formacion_base=1,
        expediente="EXP-002",
        precio_hora=40,
        horas_previstas=8,
        modalidad="presencial"
    )

    InteraccionRepository.crear(
        id_cliente=1,
        fecha="2025-10-10",
        tipo="reunion",
        descripcion="Proposamenaren berrikuspena",
        resultado="propuesta",
        proxima_accion="Deitu baieztapena lortzeko",
        fecha_proxima_accion=(datetime.now() + timedelta(hours=12)).strftime("%Y-%m-%d"),
        crear_recordatorio=True,
    )

    SesionRepository.crear(
        id_contratacion=c_id,
        fecha=(datetime.now() + timedelta(hours=18)).strftime("%Y-%m-%d"),
        hora_inicio=(datetime.now() + timedelta(hours=18)).strftime("%H:%M"),
        hora_fin=(datetime.now() + timedelta(hours=20)).strftime("%H:%M"),
        direccion="Bulego Nagusia",
        estado="programada",
    )

    avisos = ServicioRecordatorios.avisar_proximos_eventos()

    assert "recordatorios_interacciones" in avisos
    assert "sesiones_proximas" in avisos
    assert len(avisos["sesiones_proximas"]) >= 1
```

Exekuzioaren emaitza:

```bash
pytest -v tests/servicios/test_servicio_recordatorios.py
3 passed in 0.15s
```

## 5. Ondorioak

IX. fasearen ostean, **prestakuntzen planifikatzailea** hurrengo puntuetara iritsi da:

- ✅ **Bezero-eredu zabala**, enpresa nagusiak eta bezero finalak bereizita.
- ✅ **Kontaktuen eta parte-hartzaileen** kudeaketa datu-geruzan integratuta.
- ✅ **Errepositorio eguneratuak** trazabilitate eta egonkortasun handiagoarekin.
- ✅ **Oroigarri-zerbitzu bateratua**, interakzio eta saioekin koherentea.
- ✅ **Test guztiak gaindituta**, sistema guztiz funtzionala.

Sistema hau jada **prestakuntzan espezializatutako mini-CRM** bihurtzen ari da:
planifikazioa, jarraipena eta automatizazioa tresna bakarrean integratuta.

## Hurrengo urratsa
X. fasean, **fakturazio-modulua** garatuko dugu: kontratazio eta saioetatik abiatuta fakturak automatikoki sortzea, PDF formatuan esportatzea eta egoeren kudeaketa (zirriborroa, igorria, kobratua, baliogabetua).
Administrazio-geruzaren amaiera izango da eta hurrengo faseetako **analitika eta adimen funtzionalerako** oinarriak ezarriko ditu.

