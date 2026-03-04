---
title: "Guía para desplegar IA Soberana en Local"
description: "El objetivo de este tutorial no es solo instalar software; es **reclamar tu soberanía tecnológica**."
pubDate: "2026-03-04"
lang: "es"
summary: "Guía para desplegar IA Soberana en Local"
author: "Juan Carlos Beaskoetxea"
categories:
  - Inteligencia Artificial
  - Español
tags:
  - RAG
  - Inteligencia Artificial
  - Autonmatización
  - IA
  - software librea
tkey: "Docker-model-runner"
---

# Guía para desplegar IA Soberana en Local

## 🎯 Declaración de Objetivos: Hacia la Autonomía Cognitiva

Imagina que tienes una idea brillante para un proyecto o un código fuente sensible que podría cambiar tu negocio. La inercia actual nos empuja a "regalar" esa información a nubes de terceros para obtener ayuda de una IA. El objetivo de este tutorial no es solo instalar software; es **reclamar tu soberanía tecnológica**.

A través de este proceso, nos hemos marcado tres metas fundamentales:

### 1. La "Caja Negra" de la Privacidad

El primer objetivo es construir un búnker digital. Queremos que el usuario sea el único dueño de sus datos. Al finalizar, habrás desplegado un sistema donde tus documentos, tus ideas y tu código nunca salen de tu red local. Es el fin de la duda de _"¿estará OpenAI entrenando sus modelos con mis secretos?"_.

### 2. Romper la Barrera del Coste y la Dependencia

Buscamos eliminar la "dictadura de la suscripción". El objetivo es que aprendas a aprovechar el hardware que ya tienes (tu propio PC o servidor con Linux) para ejecutar modelos de lenguaje de última generación. Queremos que tu asistente esté disponible 24/7, sin facturas a final de mes y sin depender de si un servidor en Silicon Valley decide caerse o cambiar sus políticas de uso.

### 3. La IA como Extensión Directa de tu Trabajo

No queremos otra pestaña abierta en el navegador que simplemente responde preguntas. El objetivo final es la **integración profunda**. Queremos que la IA sea capaz de "ver" tus archivos de proyecto y de integrarse directamente en tu editor de código (VS Code). Buscamos transformar la IA de un "oráculo lejano" a un "compañero de escritorio" que entiende tu contexto real.

> **En resumen:** Este tutorial no trata de "instalar un chat". Trata de dotar a un profesional de un **cerebro digital privado y potente** que trabaje bajo sus propias reglas, en su propia máquina y para su propio beneficio.
    
## 🛠️ Nodo de Inteligencia Local: Tu Centro de Operaciones con Inteligencia Soberana

Una vez que completes los pasos de esta guía, no tendrás simplemente un icono más en tu escritorio; habrás dado vida a un **nodo de inteligencia local**. Este "artefacto" tecnológico es un motor híbrido que combina la potencia de los modelos de lenguaje más avanzados con la seguridad de tu propio sistema de archivos.

Pero, ¿qué significa esto en el día a día? Significa que habrás desbloqueado tres superpoderes que hoy están reservados a quienes pagan costosas suscripciones o sacrifican su privacidad:

### 🧠 Un Cerebro con Memoria Propia (RAG Personalizado)

Imagina poder volcar en un solo lugar todos los manuales de tu empresa, tus notas de años de estudio o la documentación de un proyecto complejo, y que la IA sea capaz de razonar sobre ellos. Este sistema te permitirá crear "Espacios de Trabajo" donde el modelo no adivina respuestas, sino que las extrae de **tu propia base de conocimiento**. Es como tener un NotebookLM personal, pero donde tú eres el dueño absoluto de la biblioteca.

### 💻 Un Copiloto que Programa a tu Lado

Este artefacto tiene la capacidad de "vivir" dentro de tu editor de código (VS Code). Podrás pedirle que genere funciones, que explique bugs o que cree documentación técnica directamente sobre tus archivos. Tendrás un programador senior disponible 24/7 que conoce la arquitectura de tu software, pero con una diferencia vital: tus secretos industriales y tus credenciales de base de datos nunca viajan por internet.

### 🔌 La IA Conectada a tu Realidad (Protocolos MCP)

Lo que realmente separa a este sistema de un chat convencional es su capacidad de expansión. Gracias al protocolo MCP (Model Context Protocol), este artefacto puede llegar a conectarse directamente con tus bases de datos locales (como Postgres) o con tus herramientas de oficina. No es una IA aislada en una burbuja; es un motor que puede leer tus carpetas, analizar tus datos reales y ayudarte a automatizar flujos de trabajo que antes requerían horas de copy-paste.


> **La Ventaja Competitiva:** Al final del día, quien domina esta tecnología adquiere la capacidad de prototipar ideas a una velocidad asombrosa. Podrás pasar de una idea de negocio a una estructura de código documentada en minutos, con la tranquilidad de que tu propiedad intelectual sigue bajo tu control total. Estás construyendo una herramienta que no depende de las políticas de uso de un gigante tecnológico, sino de tu propia visión.
    
## 🧪 El Laboratorio: Los cimientos de tu Nodo

Para construir algo sólido, los materiales importan. En nuestro caso, hemos elegido un conjunto de herramientas que destacan por su estabilidad, ligereza y carácter _open source_. Aunque este ecosistema es versátil y puede adaptarse a Windows (vía WSL2) o macOS, nuestro laboratorio de pruebas ha sido **Debian**, el "sistema operativo universal" conocido por su robustez en entornos de servidor.

Este es el inventario de tecnología que da vida al proyecto:

### 🐧 Debian (Linux): El Suelo Firme

Hemos optado por Debian porque necesitamos un sistema que no consuma recursos innecesarios y que nos dé el control total sobre la red y los permisos. Es la base perfecta para quienes buscan que su nodo de IA funcione como un servicio profesional e ininterrumpido.

### 🐳 Docker & Docker Compose: El Encofrado

Para que la instalación sea limpia y no "ensucie" tu sistema operativo con cientos de dependencias, usamos contenedores. Docker nos permite empaquetar la IA y su interfaz en cajas aisladas que se comunican entre sí de forma eficiente. Si mañana quieres mover tu nodo a otra máquina, solo tendrás que llevarte un par de archivos.

### ⚙️ Docker Model Runner (DMR): El Corazón del Motor

Aquí es donde ocurre la magia. En lugar de usar soluciones más pesadas, empleamos el _runner_ de modelos de Docker. Es una pieza de ingeniería moderna que permite que tu procesador y tu memoria RAM se entiendan directamente con el modelo de lenguaje, optimizando cada ciclo de tu CPU para obtener respuestas lo más rápido posible.

### 🌐 Open WebUI: La Ventana al Conocimiento

No queremos una consola de texto aburrida. Hemos elegido Open WebUI porque es, posiblemente, la interfaz más avanzada que existe. No solo imita la fluidez de ChatGPT, sino que añade capas de gestión de documentos, usuarios y conexiones que la convierten en un verdadero sistema operativo para tu inteligencia local.

### 🧠 Microsoft Phi-4: El Invitado de Honor

Como "cerebro" del nodo, hemos seleccionado **Phi-4**. Es un modelo de última generación de 14B parámetros que ha demostrado una capacidad de razonamiento lógico y de programación asombrosa para su tamaño. Es el equilibrio perfecto: lo suficientemente inteligente para resolver problemas complejos y lo suficientemente optimizado para correr en el hardware que tienes hoy sobre tu mesa.
  
## 4. Etapas del Despliegue

## 🏗️ Etapa I: Preparación del Terreno y Arquitectura de Datos

Antes de despertar a la inteligencia, debemos construirle un lugar donde vivir. En el mundo de los contenedores, hay una regla de oro: **el software es efímero, pero los datos son sagrados**. No queremos que, si actualizas tu sistema o reinicias un contenedor, tu IA "olvide" todo lo que ha aprendido o pierda los documentos que le has confiado.

En esta etapa, vamos a preparar el sistema de archivos de nuestro Debian para que sea robusto y organizado.

### 📂 1. Creación del "Hogar" del Proyecto

No vamos a soltar archivos por cualquier sitio. Vamos a crear una estructura jerárquica que nos permita gestionar la **persistencia**. La persistencia es lo que garantiza que, aunque el contenedor se destruya, la información permanezca grabada en tu disco duro.

Crearemos una carpeta raíz para nuestro nodo y, dentro de ella, los subdirectorios necesarios para la base de datos de la interfaz y los modelos:

```bash
mkdir -p ~/orakulue-nodo/docker/openwebui
```

- **¿Para qué sirve esto?** La carpeta `openwebui` almacenará tu historial de chats, tus usuarios y, lo más importante, los índices de tus documentos. Es el "cerebro a largo plazo" de la interfaz.
    
### 🔑 2. El Entorno de Permisos: Seguridad sin Fricciones

Uno de los errores más comunes en Linux es ejecutar todo como `root` o encontrarse con errores de "Permiso denegado" cuando el contenedor intenta escribir datos.

Nuestro objetivo es que Docker tenga permisos de escritura en las carpetas que acabamos de crear, pero manteniendo la seguridad. Para ello, nos aseguramos de que nuestro usuario actual pertenece al grupo Docker:

```bash
sudo usermod -aG docker $USER
```

- **El porqué:** Esto permite que tu usuario gestione el nodo sin necesidad de invocar constantemente a `sudo`, lo cual es una buena práctica de seguridad y comodidad que evita que los archivos creados por la IA queden "bloqueados" bajo el usuario root.
    
### 📝 3. El Manifiesto (Docker Compose)

En lugar de lanzar comandos kilométricos en la terminal, vamos a usar un archivo de configuración llamado `docker-compose.yml`. Este archivo es el **plano arquitectónico** de nuestro nodo. En él definiremos qué imágenes descargar, qué puertos abrir (como nuestro puerto 3000) y qué carpetas de nuestro Debian se "conectarán" con el interior del contenedor.

Al dejarlo todo por escrito en un archivo, tu infraestructura se vuelve **replicable**: si quieres montar este mismo nodo en otro servidor, solo tendrás que copiar esta carpeta y ejecutar un comando.

```yaml
version: '3'
services:
  orakulue-ui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: Orakulue-UI
    # Estrategia de red: Usamos el modo 'host' para que la interfaz 
    # detecte el motor de IA local sin saltos de red complicados.
    network_mode: host 
    volumes:
      - ./docker/openwebui:/app/backend/data
    restart: always
    environment:
      - 'WEBUI_SECRET_KEY=tu_clave_secreta_aqui' # Cambia esto por algo seguro
      - 'PORT=3000' # <--- Aquí definimos tu puerto de acceso
```

> **Reflexión de esta etapa:** Hemos pasado de tener un sistema operativo vacío a tener una estructura lista para la acción. Tenemos seguridad, tenemos orden y, sobre todo, hemos garantizado que el conocimiento que generemos a partir de ahora esté a salvo.

#### 🔍 ¿Qué está pasando aquí realmente?

Es importante entender qué estamos "contratando" con este código:

- **`network_mode: host`**: Esta es la clave maestra. En lugar de crear una red virtual aislada (que a veces da problemas de comunicación entre la IA y la interfaz), le decimos al contenedor que use la misma red que tu máquina Debian. Es como quitar los tabiques entre dos habitaciones para que el aire fluya mejor.
    
- **`volumes`**: Aquí es donde conectamos el "mundo real" con el "mundo Docker". La carpeta `./docker/openwebui` de tu Debian se convierte en el almacén de datos del contenedor. Si borras el contenedor y lo vuelves a crear, tus chats seguirán ahí porque viven en tu disco duro, no dentro del contenedor.
    
- **`PORT=3000`**: Como el modo de red es `host`, no necesitamos mapear puertos como `3000:8080`. Simplemente le decimos a la aplicación interna que se ejecute directamente en el puerto 3000 de tu máquina.

## ⚙️ Etapa II: El Motor (Docker Model Runner)

Si el paso anterior fue construir la carrocería, ahora vamos a instalar el motor. Para nuestro nodo, utilizaremos una herramienta de vanguardia: el **Docker Model Runner (DMR)**.

A diferencia de otras soluciones más pesadas, este motor está diseñado para ser invisible y eficiente. Su única misión es escuchar tus peticiones, pasárselas al modelo de lenguaje (el cerebro) y devolverte una respuesta coherente.

### 🛠️ 1. Instalación del componente "Model"

Para que Docker entienda el comando `model`, necesitamos instalar el **Docker Model Management**. En sistemas Linux como Debian, esto se hace descargando el plugin que extiende las capacidades de Docker.

Si al escribir `docker model` tu sistema no responde, debemos ejecutar la instalación del plugin:

```bash
# Instalamos el soporte para modelos de Docker
sudo apt-get update
sudo apt-get install docker-model-management-plugin
```

- **¿Qué estamos instalando realmente?** No es un programa pesado, es simplemente un "traductor". A partir de ahora, Docker sabrá cómo gestionar ciclos de CPU y memoria RAM específicamente para modelos de Inteligencia Artificial, permitiendo que convivan con tus otros contenedores (como tu base de datos o tu CRM) sin conflictos.

### 🏎️ 2. Puesta en marcha del Runner

El motor no necesita una instalación compleja, se lanza como un servicio que queda esperando órdenes. Lo primero que haremos será asegurarnos de que el "corazón" está latiendo.

En tu terminal de Debian, ejecuta:

```bash
docker model start-runner
```

- **¿Qué estamos haciendo?** Estamos activando un proceso en segundo plano que abre un canal de comunicación (un puerto, específicamente el **12434**). A partir de este momento, tu máquina es capaz de hablar "lenguaje de IA". Es el puente entre tus archivos locales y la potencia de cálculo.

### 🧠 2. Descarga del Cerebro: El comando `pull`

Un motor sin combustible no camina. El combustible de nuestro nodo son los modelos. Vamos a descargar **Phi-4**, la joya de la corona de Microsoft para equipos locales (o eso dicen). Es un modelo que, a pesar de su tamaño compacto, razona con una profundidad asombrosa.

Para traerlo a nuestra máquina, ejecutamos:

```bash
docker model pull phi4
```

- **El proceso:** Verás una barra de progreso. En este momento, tu nodo está bajando gigabytes de "pesos neuronales". Estos pesos son el resultado de meses de entrenamiento donde la IA aprendió lógica, programación y lenguaje. Una vez que termine, **phi4** vivirá permanentemente en tu disco duro. No volverás a necesitar internet para consultarle nada.

### 🧪 3. Validación de la API: El "Hola Mundo" de la IA

Antes de abrir la interfaz gráfica, debemos estar seguros de que el motor y el cerebro están bien conectados. No queremos avanzar a ciegas. Vamos a hacer una prueba de "latido" usando una consulta directa al motor.

Ejecuta este comando (es un `curl`, una forma de llamar a la puerta del motor):

```bash
curl http://localhost:12434/v1/models
```

- **¿Qué buscamos aquí?** Si todo es correcto, tu terminal te escupirá un texto técnico (un JSON) donde verás el nombre de `phi4`.
    
- **La garantía:** Esto nos confirma dos cosas vitales:
    
    1. El motor está escuchando correctamente.
        
    2. El modelo **phi4** está cargado y listo para recibir órdenes.
        

> **Reflexión de esta etapa:** Ahora mismo, tu Debian ya es inteligente. Aunque aún no tenemos una interfaz bonita con botones, el núcleo del sistema ya puede procesar información. Hemos transformado electricidad y silicio en un motor de razonamiento privado.
    
## 🎨 Etapa III: El Cerebro Visual (Open WebUI)

Si el motor es el corazón y el modelo es el cerebro, **Open WebUI** es el rostro y el sistema nervioso de nuestro nodo. Es la capa que nos permite interactuar, subir archivos y gestionar nuestro conocimiento de forma visual.

En esta etapa, vamos a dar la orden para que todo lo que hemos preparado en el archivo `docker-compose.yml` cobre vida.

### 🚀 1. El Despegue: Levantando el Servicio

Con el archivo de configuración ya guardado en nuestra carpeta `~/orakulue-nodo`, vamos a decirle a Docker que ejecute el plan.

Exekutatu zure terminalean:

```bash
docker compose up -d
```

- **¿Qué significa esto?** El comando `up` lee el archivo de configuración y empieza a descargar la imagen de Open WebUI (si no la tienes) y a levantar el contenedor. El parámetro `-d` (de _detached_) es vital: le indica al sistema que ejecute la IA en segundo plano, permitiéndote seguir usando la terminal o cerrar la sesión sin que el nodo se detenga.
 
### 🌐 2. El Portal de Acceso: El Puerto 3000

Una vez ejecutado el comando, tu nodo ya está proyectando su interfaz. Pero, ¿cómo entramos?

Abre tu navegador preferido y escribe en la barra de direcciones: `http://localhost:3000` (o la IP de tu servidor, por ejemplo: `http://192.168.1.145:3000`).

- **¿Por qué el puerto 3000?** Lo hemos configurado así porque es un puerto estándar para aplicaciones web modernas que suele estar libre. Es tu puerta privada de entrada.
    
- **Importante:** La primera vez que entres, el sistema te pedirá crear una cuenta. **Tranquilo:** esa cuenta es 100% local. No viaja a internet, se guarda en la carpeta de persistencia que creamos en la Etapa I. Tú eres el administrador absoluto.
  
### 🔗 3. La Gran Conexión: Vinculando Interfaz y Motor

Ahora viene el paso crucial. Tenemos la interfaz abierta, pero necesitamos decirle que use el motor que arrancamos en la Etapa II.

1. Ve a **Ajustes** (el icono de engranaje abajo a la izquierda).
    
2. Busca la sección de **Conexiones** o **Cerrar Sesión/Configuración de API**.
    
3. Verás un campo para la URL de la API de OpenAI (u Ollama). Debemos introducir la dirección de nuestro motor local: `http://127.0.0.1:12434`
    
4. Haz clic en el icono de **Refrescar**. Si todo ha ido bien, aparecerá un check verde.

> **El resultado:** En el desplegable de modelos de la pantalla principal, ahora verás aparecer por fin a **phi4**. Selecciónalo y escribe tu primer mensaje. Felicidades: acabas de establecer la primera comunicación con tu IA soberana a través de tu propio servidor.

## 🌉 Etapa IV: El Puente de Comunicación (Networking)

En un entorno de contenedores, cada servicio (la interfaz y el motor) vive en su propia "isla". El desafío es que la interfaz (Open WebUI) necesita "llamar" al motor de IA para obtener respuestas. Si simplemente le decimos que busque en `localhost`, a veces la interfaz se busca a sí misma dentro de su propia isla y no encuentra nada.

Aquí es donde aplicamos la ingeniería de redes para que todo encaje.

### 🔌 1. Rompiendo las paredes: El modo Host

Como vimos en nuestro archivo `docker-compose.yml`, hemos tomado una decisión estratégica: usar `network_mode: host`.

- **¿Qué estamos haciendo?** En lugar de crear una red virtual compleja, le decimos a Open WebUI: _"Usa la misma red que el sistema operativo Debian"_.
    
- **La Ventaja:** Esto elimina cualquier barrera. La interfaz puede ver el puerto **12434** (donde vive el motor de IA) como si estuviera en la misma habitación. Es la solución más robusta para evitar el famoso error de _"Connection Refused"_.
  
### 🌐 2. El Gateway: La IP de salida

Si en tu caso decides no usar el modo host por razones de seguridad avanzada, existe una alternativa: el uso del **Gateway de Docker**.

- **El concepto:** Es como darle a la interfaz la dirección de la "puerta de salida" del contenedor para que pueda ver lo que hay en la máquina real (tu Debian).
    
- **La configuración:** En lugar de usar `localhost`, le daríamos la IP interna de la red de Docker (normalmente `172.17.0.1`). Esto permite que la interfaz "salte" fuera de su contenedor para hablar con el motor de IA que corre en el sistema.
  
### 🔗 3. Vinculación Final: El apretón de manos

Una vez que el puente está construido, debemos realizar la vinculación final dentro de los ajustes de Open WebUI para que el "apretón de manos" entre ambos servicios sea permanente.

1. **Dirección Maestra:** En el panel de administración, nos aseguramos de que la URL de conexión sea `http://host.docker.internal:12434` o `http://127.0.0.1:12434`.
    
2. **Validación de Salud:** Al hacer clic en el botón de verificar, la interfaz enviará un pequeño pulso al motor. Si el motor responde con la lista de modelos (como **phi4**), la vinculación ha sido un éxito.
  
> **Reflexión de esta etapa:** Configurar correctamente el networking es lo que diferencia una instalación inestable de un **Nodo de Inteligencia** profesional. Ahora, tu interfaz no solo es una cara bonita; es una ventana conectada directamente a los músculos de cálculo de tu servidor.

## 🚀 El Horizonte: Un antes y un después en tu productividad

Llegados a este punto, lo que tienes frente a ti es mucho más que un software instalado; es una **extensión de tu capacidad de pensamiento**. Hemos pasado de ser consumidores pasivos de servicios de terceros a ser arquitectos de nuestra propia inteligencia.

Tener un **Nodo de Inteligencia Soberana** en tu escritorio significa que la próxima vez que tengas una idea de negocio brillante, un código que no logras descifrar o un documento confidencial que analizar, no tendrás que pedir permiso a nadie ni comprometer tu privacidad. El poder de cómputo está ahí, en tu RAM, bajo tu control total.

Este es solo el primer paso. Una vez que experimentas la fluidez de tener un asistente de 14B parámetros trabajando en local, la forma en que entiendes la tecnología cambia para siempre.

### Me encantaría saber tu visión:

Ahora que la barrera de la privacidad y el coste ha desaparecido...

- **¿Qué proceso de tu día a día sería el primero que le confiarías a una IA que solo tú puedes leer?**
    
- **¿Dónde ves más valor hoy: en tener un copiloto de programación ciego a internet o en un sistema que "digiera" toda tu documentación privada?**

Te leo en los comentarios. ¡Es hora de que la IA trabaje para ti, y no al revés!