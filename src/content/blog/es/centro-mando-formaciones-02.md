---
title: "Centro de mando de formaciones (II): diseñando la arquitectura y el modelo de datos"
description: "Segunda entrega: cómo estructurar la aplicación en capas modulares y definir un modelo de datos que refleje la realidad de la formación."
pubDate: "2025-09-15"
lang: "es"
summary: "Tras la idea inicial, llega el paso clave: organizar la arquitectura de la agenda visual por capas (datos, dominio, servicios, interfaz) y definir un modelo de datos flexible con formaciones base, contrataciones y sesiones."
author: "Juan Carlos Beaskoetxea"
categories:
  - Gestión de Formaciones
  - Castellano
tags:
  - Formación
  - Productividad
  - Automatización
  - PyQt
  - Python
  - Agenda visual
  - Software a medida
tkey: "centro-mando-formaciones-02"
---

# Diseñando la arquitectura y el modelo de datos de mi agenda visual de formaciones

En el primer artículo de esta serie compartí la idea general: construir una agenda visual que me ayude a planificar y gestionar todas las formaciones que imparto a diferentes clientes.  
Hoy toca dar un paso clave: definir cómo se organizará internamente la aplicación y qué modelo de datos usaremos para reflejar la realidad de mi trabajo diario.

---

## Una arquitectura modular por capas

He optado por un enfoque modular y orientado a objetos, siguiendo una arquitectura por capas. ¿Qué significa esto? Que el proyecto se divide en bloques claros, cada uno con una función bien definida:

### Capa de datos
- Almacenamiento en **SQLite**, con tablas normalizadas para clientes, formaciones, contrataciones y sesiones.  
- Se encargará de todas las operaciones **CRUD** (crear, leer, actualizar y borrar).  

### Capa de dominio
- Clases principales: `Cliente`, `FormacionBase`, `Contratacion`, `Sesion`, `Tema`, `Adjunto`.  
- Contendrá la lógica de negocio: validación de solapamientos, cálculo de horas, control de estados.  

### Capa de servicios
- Funcionalidades de apoyo: exportaciones (PDF, CSV, iCal), sincronización con Google Calendar y copias de seguridad.  

### Capa de presentación (UI)
- Interfaz gráfica en **PyQt** con:  
  - Vistas del calendario (anual, mensual, semanal y diaria).  
  - Formularios de clientes y contrataciones.  
  - Funciones de arrastrar y soltar para organizar sesiones.  
  - Colores y estados visuales para diferenciar eventos.  

Este diseño facilita que cada capa evolucione de forma independiente, logrando un sistema más mantenible y preparado para futuras ampliaciones (como facturación).

---

## Un modelo de datos en tres niveles

Tras analizar las necesidades, vi fundamental separar tres conceptos que a menudo se confunden:

### Formación base
- Curso de “catálogo” (ejemplo: *Excel Básico*).  
- Existe independientemente de los clientes.  
- Incluye: nombre, descripción, tema, horas de referencia, nivel y contenido estándar.  

### Contratación
- Acuerdo con un cliente concreto para impartir una formación.  
- Parte de una formación base, pero con condiciones específicas: precio/hora, número de horas previstas, modalidad (presencial u online), dirección o enlace, responsable, fechas previstas, estado (tentativo, confirmado, cancelado).  
- Cada contratación tendrá un **código de expediente** que servirá después para enlazar con la facturación.  

### Sesión
- Bloque concreto que aparece en el calendario.  
- Vinculada a una contratación, con fecha, hora, lugar y estado.  
- Puede ser única o parte de una recurrencia (ejemplo: todos los martes de 9 a 12 durante un mes).  

Además, los **adjuntos** (contratos, guiones, materiales) podrán asociarse tanto a clientes como a contrataciones o sesiones.

---

## Relaciones entre entidades

De forma simplificada, el modelo funciona así:

- Un **cliente** puede tener varias contrataciones.  
- Una **formación base** puede ser contratada por diferentes clientes.  
- Cada **contratación** se compone de una o más sesiones que se reflejan en el calendario.  
- Los **adjuntos** se pueden vincular a clientes, contrataciones o sesiones.  

Este esquema evita duplicidades, permite adaptarse a particularidades de cada contrato y abre la puerta a futuras ampliaciones.

---

## Reglas de negocio principales

Algunas reglas que se aplicarán desde el inicio:

- **Sin solapamientos**: dos sesiones no pueden ocupar el mismo rango horario.  
- **Control de desplazamientos**: aviso si no hay margen suficiente entre sesiones en lugares distintos.  
- **Colores y estados**: cada cliente tendrá un color, y cada sesión/contratación tendrá un estado (confirmado, tentativo, cancelado).  
- **Cómputo de horas**: sumatorio por fechas, clientes o temas para estadísticas y facturación.  
- **Histórico de cambios**: registro de modificaciones en fechas, horas o estados para garantizar trazabilidad.  

---

## Próximos pasos

En el siguiente artículo entraremos en materia: definiremos la **base de datos SQLite** con las tablas y relaciones necesarias, y construiremos los **repositorios en Python** que servirán de puente entre la base de datos y las clases de dominio.  

Será el momento de pasar de la teoría a los primeros fragmentos de código.
