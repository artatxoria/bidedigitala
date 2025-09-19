---
title: "Construyendo un Cerebro Digital (Parte Final): El Chat con Ollama y Streamlit"
description: "Última entrega: instalamos el servidor Ollama y descargamos algunos LLM para poder chatear con nuestros documentos."
pubDate: "2025-09-19"
lang: "es"
summary: "Instalamos el servidor Ollama y los modelos LLM necesarios y creamos un chat web con el uso de streamlit"
author: "Juan Carlos Beaskoetxea"
tags:
  - RAG
  - Base de conocimiento
  - Python
  - ChromaDB
  - Ollama
  - Embeddings
  - Vector DB
  - Automatización
tkey: "base-conocimiento-06"
---

# Construyendo un Cerebro Digital (Parte Final): El Chat con Ollama y Streamlit

🎉 ¡Bienvenidos al último capítulo de esta serie!
Ha sido un viaje largo: empezamos extrayendo conocimiento, seguimos dándole memoria semántica y ahora llegamos al gran momento… **conversar con nuestros documentos**.

Hoy instalaremos el **cerebro** de la IA y abriremos la **ventana de interacción** que lo conecta contigo:

1. ⚙️ **Instalar Ollama** – el motor que ejecuta modelos de lenguaje de última generación en tu propio ordenador.

2. 🧠 **Descargar los modelos** – los “cerebros” que entienden y generan respuestas.

3. 💬 **Construir la interfaz de chat con Streamlit** – la sala de control desde la que hablaremos con nuestra base de conocimiento.

## 1. Instalando el motor: Ollama ⚙️

Antes de hablar con una IA, necesitamos que algo mueva sus engranajes. Ese algo es **Ollama**, una herramienta que simplifica como nunca la ejecución local de LLMs.

Su instalación en Linux (Debian/Ubuntu) es tan simple como abrir la terminal y lanzar:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Esto deja Ollama corriendo como servicio en segundo plano: siempre disponible para recibir peticiones de tus scripts, sin necesidad de mantener la terminal abierta.

## 2. Instalando los cerebros: los modelos 🧠

Con el motor listo, toca cargar los cerebros. En nuestro proyecto usamos distintos modelos según su rol:

- **El Indexador** – `mxbai-embed-large` convierte texto en vectores (embeddings).

- **Los Conversadores (LLMs)** – los que realmente hablan contigo.

Se descargan con un simple `ollama pull` en la terminal:

```bash
# Embeddings (esencial para el indexador)
ollama pull mxbai-embed-large

# Modelo rápido y eficiente
ollama pull mistral

# Alternativa más potente
ollama pull llama3:8b

# Especialista en RAG y razonamiento
ollama pull command-r
```

Y listo: cada modelo queda instalado y preparado para usarse.

## 3. La ventana a nuestro conocimiento: Chat con Streamlit 💬

Aquí llega la magia: `consultar_documentos.py`.

Este script usa **Streamlit** para desplegar una aplicación web donde:

1. Escribes tu pregunta.

2. Busca en **ChromaDB** los fragmentos más relevantes de tus documentos.

3. Envía esos fragmentos + tu consulta al LLM.

4. Te devuelve la respuesta en tiempo real.

En otras palabras: es la **torre de control de todo el sistema RAG**.

### El código completo: `consultar_documentos.py`

Aquí lo tienes actualizado y listo para guardar en tu proyecto 👇

```python
# consultar_documentos.py
# ------------------------------------------------------------
# Interfaz de chat para hablar con tu base de conocimiento
# usando ChromaDB + Ollama + Streamlit
# ------------------------------------------------------------

import ollama
import chromadb
import streamlit as st
from pathlib import Path

# --- CONFIGURACIÓN ---
RUTA_BASE_PROYECTO = Path(__file__).parent
RUTA_CHROMA_DB = str(RUTA_BASE_PROYECTO / "chroma_db")
COLECCION_CHROMA = 'documentacion_general'
MODELO_EMBEDDINGS = 'mxbai-embed-large'

class SistemaRAG:
    """Encapsula la lógica del sistema Retrieval-Augmented Generation (RAG)."""
    def __init__(self, ruta_db, nombre_coleccion, modelo_embeddings):
        self.modelo_embeddings = modelo_embeddings
        try:
            cliente_db = chromadb.PersistentClient(path=ruta_db)
            self.coleccion = cliente_db.get_or_create_collection(name=nombre_coleccion)
            st.sidebar.success("✅ Conexión con la base de conocimiento establecida.")
        except Exception as e:
            st.error(f"Error al conectar con ChromaDB: {e}")
            st.stop()

    def buscar_contexto(self, consulta, n_resultados=10):
        """Busca los fragmentos más relevantes en la base vectorial."""
        try:
            resultados = self.coleccion.query(
                query_embeddings=ollama.embeddings(
                    model=self.modelo_embeddings,
                    prompt=consulta
                )["embedding"],
                n_results=n_resultados
            )
            return resultados['documents'][0], resultados['metadatas'][0]
        except Exception as e:
            st.error(f"Error al buscar contexto: {e}")
            return [], []

    def generar_respuesta(self, consulta, contexto, modelo_llm, prompt_sistema, historial_chat):
        """Genera respuesta con el LLM a partir de contexto + historial."""
        try:
            contexto_formateado = "\n---\n".join(contexto)
            mensajes_ollama = [{'role': 'system', 'content': prompt_sistema}]
            
            for msg in historial_chat:
                contenido = msg['content'].split('#### Fuentes Consultadas:')[0].strip()
                mensajes_ollama.append({'role': msg['role'], 'content': contenido})

            prompt_final = f"""
            Usa ÚNICAMENTE este contexto para responder a la última pregunta del usuario.
            Si la respuesta no está, di: "No tengo suficiente información en mis documentos".
            
            Contexto:
            ---
            {contexto_formateado}
            ---
            
            Pregunta: {consulta}
            """
            mensajes_ollama.append({'role': 'user', 'content': prompt_final})

            flujo = ollama.chat(model=modelo_llm, messages=mensajes_ollama, stream=True)
            yield from (chunk['message']['content'] for chunk in flujo)

        except Exception as e:
            st.error(f"Error generando respuesta con {modelo_llm}: {e}")
            yield ""

def configurar_interfaz():
    """Renderiza la interfaz de usuario en Streamlit."""
    st.set_page_config(page_title="Asistente de Documentación", layout="wide")
    st.title("💬 Asistente de Documentación Inteligente")

    with st.sidebar:
        st.header("⚙️ Configuración")
        modelo_llm = st.selectbox("Elige el modelo:", ('command-r','mistral','llama3:8b'))
        MODOS = {
            "Asistente General": "Responde basándote solo en el contexto proporcionado.",
            "Creador de Cursos": "Estructura en: Objetivos, Teoría, Ejemplos, Ejercicios.",
            "Redactor de LinkedIn": "Redacta un borrador de post con emojis y pregunta final."
        }
        modo = st.selectbox("Modo de trabajo:", list(MODOS.keys()))
        prompt_sistema = MODOS[modo]
        if st.button("🗑️ Limpiar Chat"):
            st.session_state.mensajes = []
            st.rerun()
    return modelo_llm, prompt_sistema

def principal():
    modelo_llm, prompt_sistema = configurar_interfaz()
    sistema = SistemaRAG(ruta_db=RUTA_CHROMA_DB, nombre_coleccion=COLECCION_CHROMA, modelo_embeddings=MODELO_EMBEDDINGS)

    if "mensajes" not in st.session_state:
        st.session_state.mensajes = []

    for mensaje in st.session_state.mensajes:
        with st.chat_message(mensaje["role"]):
            st.markdown(mensaje["content"])

    if pregunta := st.chat_input("¿Qué quieres preguntar o crear?"):
        st.session_state.mensajes.append({"role":"user","content":pregunta})
        with st.chat_message("assistant"):
            with st.spinner("💭 Pensando..."):
                contexto, metas = sistema.buscar_contexto(pregunta)
                if not contexto:
                    respuesta = "No encontré información relevante en los documentos."
                    st.write(respuesta)
                else:
                    flujo = sistema.generar_respuesta(pregunta, contexto, modelo_llm, prompt_sistema, st.session_state.mensajes[:-1])
                    respuesta = st.write_stream(flujo)
                    fuentes = sorted({m['fuente'] for m in metas})
                    st.markdown("#### 📂 Fuentes consultadas:\n" + "\n".join(f"- `{f}`" for f in fuentes))
        st.session_state.mensajes.append({"role":"assistant","content":respuesta})
        st.rerun()

if __name__ == "__main__":
    principal()
```

#### Pero ¿cómo se usa esto?

El comando necesario para ejecutar este último script y abrir el chat web es el siguiente:

```bash
# Activamos el entorno virtual de python
source entorno_rag/bin/activate
# Creamos el servidor web y accedemos a la ip que nos indica
streamlit run consultar_documentos.py
```

## 🎯 Conclusión de la serie: tu segundo cerebro está vivo

Hemos construido un sistema que:

- ✅ Extrae conocimiento de archivos y webs.
- ✅ Lo memoriza de forma semántica en ChromaDB.
- ✅ Razona y conversa contigo usando LLMs locales.

Todo corriendo **en tu ordenador, bajo tu control total**.

Pero ojo: esto no es el final, sino el principio.
El siguiente paso será transformar este “segundo cerebro” en un **Agente de IA autónomo**: capaz de recibir objetivos complejos, decidir qué herramientas usar (tus propios scripts) y ejecutar tareas de forma automática.

Imagina decirle:
*"Busca los últimos manuales de Python en ElHacker y hazme un resumen de las novedades"*,
y que tu sistema lo resuelva de principio a fin.

🔥 Esa es la próxima frontera: **la verdadera automatización inteligente**.

🙌 Gracias por acompañarme en este viaje.

Hemos construido juntos mucho más que un proyecto: una base sólida para el futuro de la IA personal y local.