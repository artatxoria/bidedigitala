---
title: "Base de conocimiento personal (II): opciones locales con RAG"
description: "Segunda entrega: arquitecturas locales y libres (scripts y n8n) para construir tu base de conocimiento con RAG."
pubDate: "2025-09-04"
lang: "es"
summary: "Dos caminos en local: control total con scripts o orquestación visual con n8n, ambos apoyados en RAG para trabajar con tu propia documentación."
author: "Juan Carlos Beaskoetxea"
categories:
  - Base de conocimiento
  - Castellano
tags:
  - RAG
  - Base de conocimiento
  - Automatización
  - IA
  - software libre
tkey: "base-conocimiento-02"
---


# Base de conocimiento personal

## Las expectativas

Antes de comenzar con cualquier proyecto es esencial **declarar qué queremos que haga el sistema**. De lo contrario, corremos el riesgo de caer en un bucle sin fin al no tener claro el objetivo.

En mi caso, deseo cubrir estas necesidades:

- Me he juntado con muchos documentos descargados de la red, en formatos `.pdf`, `.docx`, `.odt`, `.txt` e incluso `.md`.
- También tengo mucha documentación de formaciones que he preparado, en **LaTeX** (traducida o no a PDF).
- Mantengo un listado de **enlaces a sitios web** que dan acceso a cursos con lecciones distribuidas en distintas páginas (por ejemplo, un curso de Python con varios niveles y páginas). **Quiero que, a partir de esos links, el sistema identifique todas las páginas significativas**.
- Tengo enlaces a **vídeos de YouTube** cuyo contenido deseo **transcribir** o **traducir** y transcribir.

> Con toda esta información dispersa, quiero crear **mi propio sistema de documentación**: almacenado, indexado y etiquetado **de forma automática**.

---

## ¿Y después qué?

Con la base de conocimiento ya disponible, quiero poder **consultarla** de maneras como:

- “Tengo que elaborar un curso de *XXX* y quiero que me elabores un **guion de contenidos** a tratar.”
- “Quiero que me elabores el **tema *YYY*** del curso *XXX* con: objetivos, desarrollo teórico con ejemplos de dificultad incremental y una **lista de ejercicios** con **soluciones**.”  
  > Esto se crearía como una **plantilla** para reutilizar.
- “Quiero que me elabores el apartado *ZZZ* del tema *YYY* del curso *XXX* con el mismo esquema (objetivos, teoría con ejemplos, ejercicios y soluciones).”
- “Quiero una **lista de temas para posts** de LinkedIn a partir de la documentación, indicando materia, nivel, etc.”
- “Quiero elaborar un **post para mi blog** o un **artículo para LinkedIn** sobre el tema *XXX*.”

Requisitos adicionales:

- Todo debe funcionar **en local**, con una interfaz de comunicación (chat/CLI/web local).
- **Sin LLMs en la nube**: los modelos estarán **instalados en mi equipo**.
- Debe contar con un **sistema de backup** apropiado.
- No tengo problema en programar **scripts Bash/Python** ni en instalar **n8n** en **Debian**.
- **Alternativas económicas** y, a poder ser, de **software libre**.

---

## ¿Qué alternativas me van quedando?

Vamos a construir un sistema **local, económico, automatizado y libre** para transformar documentos y enlaces en un asistente de generación de contenido inteligente.

A partir de las expectativas y alternativas previas, selecciono dos opciones que **combinan RAG (Retrieval-Augmented Generation)** para que la IA responda basándose en **mi documentación** y no en conocimiento genérico.

### Opción 1: El Taller del Artesano Digital (Control total con scripts)

Materializa la “Alternativa 2: El Taller del Artesano” y el “Flujo de Trabajo Basado en Script Personalizado”. Es la vía más potente y ofrece **control absoluto**. Se basa en una colección de **scripts** que debo crear y orquestar.

**Concepto**  
Scripts en **Python** y/o **Bash** cubren el ciclo de vida de la información: **recolección**, **procesamiento**, **indexación** y **consulta**. Todo en mi Debian, con **privacidad** y **control** máximos.

**Por qué es apropiada para mí**

- **Fuentes complejas**: módulos para PDFs y ofimática, gestión de LaTeX (compilando a PDF para extraer texto), *crawler* para cursos web y transcripción de YouTube.
- **Totalmente local y open source**.
- **Automatización a medida** con *cronjobs*.
- **Potencia en la consulta**: plantillas y lógica en los propios scripts.

**Tecnologías clave**

- **Orquestación**: Python + Bash.
- **IA local**: **Ollama** para LLMs y **embeddings**.
- **BD vectorial**: **ChromaDB** o **FAISS**.
- **Interfaz**: CLI inicial; **Streamlit** local más adelante.
- **Librerías (Python)**: `PyMuPDF`, `python-docx`, `BeautifulSoup`/`Scrapy`, `yt-dlp` + **Whisper**.

---

### Opción 2: Orquestador Visual Híbrido (n8n local + scripts)

Combina la flexibilidad de los scripts con la gestión visual de **n8n**. Es la “Alternativa 2: Automatización con n8n + IA” pero **todo local**.

**Concepto**  
Una instancia local de **n8n** como cerebro del flujo. En lugar de depender de servicios cloud, n8n **dispara mis propios scripts** de Python/Bash.

**Por qué sería apropiada**

- **Gestión visual** del flujo: “si entra PDF, haz X; si es YouTube, haz Y”.
- **Lo mejor de ambos mundos**: scripts para lo complejo, n8n para *triggers* y planificación.
- **“API” personal**: webhooks fáciles; una interfaz web local (p. ej. Streamlit) **habla con n8n**.
- **Escalabilidad organizada**: más fácil añadir fuentes/pasos sin tocar un script monolítico.

**Tecnologías clave**

- **Orquestación**: **n8n** autoalojado.
- **Ejecución**: nodo **Execute Command** para scripts.
- **IA local**: **Ollama**.
- **BD vectorial**: **ChromaDB** o **FAISS**.
- **Interfaz**: **Streamlit** local que consume el webhook de n8n.

---

## Conclusión y recomendación

| Característica                  | Opción 1: Taller del Artesano (Scripts)                  | Opción 2: Orquestador Visual (n8n + Scripts)             |
|---------------------------------|----------------------------------------------------------|----------------------------------------------------------|
| **Control**                     | Máximo. Cada línea de código es tuya.                    | Muy alto. El control vive en los scripts llamados por n8n. |
| **Curva de aprendizaje**        | Alta. Requiere programación y arquitectura.              | Media. n8n simplifica la orquestación.                   |
| **Gestión del flujo**           | Basada en código; puede volverse compleja.               | Visual e intuitiva; fácil de mantener.                   |
| **Flexibilidad**                | Total; el límite es tu habilidad.                        | Total; igual que la Opción 1, con capa visual.           |
| **Requisitos (local/libre/€)**  | Cumple.                                                  | Cumple.                                                  |

- **Elige la Opción 1** si te sientes cómodo en un entorno puramente de **código** y quieres un sistema **monolítico y optimizado**.
- **Elige la Opción 2** si prefieres separar **qué hacer** (scripts) de **cuándo/cómo** (flujo en **n8n**). Es una aproximación más **moderna** y **mantenible** cuando el flujo crece.

