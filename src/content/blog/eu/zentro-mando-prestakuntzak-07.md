---
title: "Prestakuntzen kontrol-gunea (VII):PyQt6 interfaz grafikoa: egitura modularra eta ikuspegi funtzionalak"
description: "Zazpigarren atala: gure prestakuntza-planifikatzailearen interfazea sortzen dugu PyQt6 erabiliz, ikuspegiak eta datuak egitura modular batean integratuz."
pubDate: "2025-10-13"
lang: "eu"
summary: "Zazpigarren atalean proiektuaren atal ikusgarrienetako batera iritsi gara: PyQt6-rekin egindako interfazea. Aplikazioak jada atal ezberdinen artean nabigatzea, datuak kontsultatzea eta bezeroak, prestakuntzak eta interakzioak kudeatzea ahalbidetzen du, egitura modular eta profesional baten bidez."
author: "Juan Carlos Beaskoetxea"
categories:
  - Prestakuntza zentroa
  - Euskera
tags:
  - PyQt6
  - Python
  - Produktibitatea
  - Neurrira egindako softwarea
  - Planifikazioa
  - Interfaze grafikoa
  - Programazio modularra
tkey: "centro-mando-formaciones-07"
---

# PyQt6 interfaz grafikoa: egitura modularra eta ikuspegi funtzionalak

Proiektuaren atal ikusgarrienera iritsi gara: **interfaze grafikoa**.  
Datuen, domeinuaren eta zerbitzuen geruzak eraiki ondoren, orain hori guztia interfaze eroso, argi eta erabilgarri batean integratzea zen helburua.

Horretarako, **PyQt6** hautatu dugu oinarri teknologiko gisa, bere indarragatik, egonkortasunagatik eta interfaze profesionalak sortzeko gaitasunagatik.

---

## Interfazearen egitura

Interfazearen egitura argia eta ordenatua dago `planificador/ui/` karpetan:

```bash
ui/
├── main_window.py
└── vistas/
├── vista_clientes.py
├── vista_calendario.py
├── vista_formaciones.py
├── vista_interacciones.py
└── vista_configuracion.py
```

Ikuspegi bakoitzak aplikazioaren atal bat ordezkatzen du eta panel lateraletik kargatzen da.  
Helburua argia da: kodea **ardura bakoitzaren arabera banatzea**, eta horrela etorkizuneko hedapenak (formularioak, drag&drop, iragazkiak...) erraztea.

## Leiho nagusia (`main_window.py`)

Klase nagusiak aplikazioaren egitura orokorra kudeatzen du: nabigazio botoiak dituen panel laterala eta ikuspegiak erakusten diren eremu nagusia.

```python
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QLabel, QStackedWidget
from planificador.ui.vistas.vista_clientes import VistaClientes
from planificador.ui.vistas.vista_calendario import VistaCalendario
from planificador.ui.vistas.vista_formaciones import VistaFormaciones
from planificador.ui.vistas.vista_interacciones import VistaInteracciones
from planificador.ui.vistas.vista_configuracion import VistaConfiguracion

class MainWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Prestakuntzen planifikatzailea")
        self.resize(1100, 700)

        layout = QHBoxLayout()
        self.setLayout(layout)

        # Alboko panela
        sidebar = QVBoxLayout()
        layout.addLayout(sidebar)

        botoiak = [
            ("Bezeroak", VistaClientes),
            ("Egutegia", VistaCalendario),
            ("Prestakuntzak", VistaFormaciones),
            ("Interakzioak", VistaInteracciones),
            ("Konfigurazioa", VistaConfiguracion)
        ]

        self.stack = QStackedWidget()
        layout.addWidget(self.stack)

        for izena, klasea in botoiak:
            btn = QPushButton(izena)
            btn.clicked.connect(lambda _, c=klasea: self._bistaratu(c))
            sidebar.addWidget(btn)
            self.stack.addWidget(klasea())

        sidebar.addStretch()
        self._bistaratu(VistaClientes)

    def _bistaratu(self, klasea):
        for i in range(self.stack.count()):
            if isinstance(self.stack.widget(i), klasea):
                self.stack.setCurrentIndex(i)
                break

if __name__ == "__main__":
    import sys
    app = QApplication(sys.argv)
    leihoa = MainWindow()
    leihoa.show()
    sys.exit(app.exec())
```

Egitura **sinple baina sendoa** da: ikuspegi berriak gehitzeko ez da beharrezkoa kode orokorra aldatzea.

### Ikuspegi modularrak eta funtzionalak

Ikuspegi bakoitzak bere eremua lantzen du.
Adibidez, **bezeroen ikuspegiak** enpresen eta kontaktuen datuak erakusten ditu; **prestakuntzen ikuspegiak** ikastaroen katalogoa; eta **interakzioen ikuspegiak** bezeroekin egindako harremanaren jarraipena (mini-CRM).

Ikuspegi guztiek eredu bera jarraitzen dute:

- Datuak kargatzen dituzte dagokien errepositorioetatik.
- Erregistroak taula edo zerrenda batean bistaratzen dituzte.
- Ekintza botoiak dituzte datuak eguneratzeko edo gehitzeko.
- Mezu argiak erakusten dituzte datuak ez badaude edo errepositorioa ez badago erabilgarri.

Adibidea: `vista_calendario.py`

```python
from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel, QCalendarWidget, QListWidget, QPushButton
from PyQt6.QtCore import QDate
from planificador.data.repositories.sesion_repo import SesionRepository

class VistaCalendario(QWidget):
    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()
        self.setLayout(layout)

        izenburua = QLabel("Egutegia")
        layout.addWidget(izenburua)

        self.egutegia = QCalendarWidget()
        self.egutegia.selectionChanged.connect(self.kargatu_saioak)
        layout.addWidget(self.egutegia)

        self.zerrenda = QListWidget()
        layout.addWidget(self.zerrenda)

        self.btn = QPushButton("Eguneratu saioak")
        layout.addWidget(self.btn)
        self.btn.clicked.connect(self.kargatu_saioak)

        self.kargatu_saioak()

    def kargatu_saioak(self):
        data = self.egutegia.selectedDate().toString("yyyy-MM-dd")
        self.zerrenda.clear()
        saioak = SesionRepository.listar_por_fecha(data)
        if not saioak:
            self.zerrenda.addItem(f"Ez dago saiorik {data} egunean")
            return
        for s in saioak:
            self.zerrenda.addItem(f"{s['hora_inicio']} - {s['hora_fin']} | {s['direccion']}")
```

### Datu-basearekiko integrazioa

Ikuspegi guztiak **datu-geruzako CRUD errepositorioekin** konektatuta daude.
Aplikazioa exekutatzean, PyQt6-k zuzenean kontsultatzen du SQLite, eta datu eguneratuak bistaratzen ditu.

Horrek esan nahi du interfazean ikus daitekeen guztia **erreala eta sinkronizatua** dela.
Gainera, erabiltzaileari mezu lagungarriak erakusten zaizkio datuak hutsik badaude edo errepositorioak oraindik ez badaude eskuragarri.

### Konfigurazioa eta utilitateak

**Konfigurazio** ikuspegiak aukera ematen du babeskopiak sortzeko eta CSV esportazioak egiteko botoi bakar baten bidez.
Aurreko faseetan sortutako zerbitzuei esker, funtzionalitate hauek guztiz operatiboak dira.

```python
self.btn_backup.clicked.connect(self._sortu_backup)
self.btn_exportar_csv.clicked.connect(self._esportatu_bezeroak_csv)
```

Botoi horien atzean benetako funtzioak exekutatzen dira:

- Datu-basearen ZIP babeskopia sortzen dute.
- Bezeroen datuak CSV formatura esportatzen dituzte.

## Emaitzak

Aplikazioak jada interfaze **osatu eta erabilgarria** du:

- ✅ Atalen artean nabigatu daiteke (Bezeroak, Egutegia, Prestakuntzak, Interakzioak, Konfigurazioa).
- ✅ Datu errealak bistaratzen dira, zuzenean SQLite datu-basetik.
- ✅ Babeskopiak eta esportazioak egiteko aukera dago.
- ✅ Bezeroekin izandako interakzioak erregistratu eta jarraipenak presta daitezke.
- ✅ Egitura modularra mantentzen da, etorkizuneko hedapenei irekia.

##Hurrengo urratsak

Hurrengo fasean arreta jarriko dugu **formulario interaktiboetan, drag & drop** funtzioetan, **asteko eta eguneroko bistetan**, eta **oroigarri automatikoetan**, planifikatzaile profesional baten esperientzia osatzeko.

Planifikatzaile proiektuak hazten jarraitzen du, eta urrats bakoitzak tresna osatuago eta erabilgarriago batera hurbiltzen gaitu.

Hurrengo atalean: **Formularioak eta funtzionalitate aurreratuak**.