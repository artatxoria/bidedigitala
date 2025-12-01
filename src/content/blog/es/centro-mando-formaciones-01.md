---
title: "Centro de mando de formaciones (I): de excels dispersos a una agenda visual"
description: "Primera entrega: cómo nace la idea de una herramienta propia para planificar cursos, evitar solapamientos y centralizar toda la información logística."
pubDate: "2025-09-10"
lang: "es"
summary: "¿Impartes formación en varias empresas y usas mil excels? Esta serie muestra paso a paso cómo construir tu propia agenda visual para organizar sesiones, evitar solapamientos y conectar con Google Calendar."
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
tkey: "centro-mando-formaciones-01"
---

# De los excels dispersos a una agenda visual: así construiré mi “centro de mando” de formaciones

Si impartes cursos en varias empresas cada mes, sabrás que el reto no es solo el contenido: es la **logística**. Múltiples clientes, personas de contacto, horarios, sedes, modalidades… y cambios de última hora que desordenan cualquier planning genérico.

De esa necesidad nace este proyecto: **crear una agenda visual propia** que me permita planificar de un vistazo todas las formaciones que imparto y tomar decisiones rápidas con información fiable.

---

## Qué problema resuelve

- Evitar solapamientos y tiempos de desplazamiento imposibles.  
- Unificar datos dispersos (clientes, responsables, contratos, enlaces de VC…).  
- Ver calendario por vistas (anual, mensual, semanal, diaria) con estados y colores.  
- Calcular horas impartidas por rango, cliente o tema para alimentar la facturación.  

---

## Objetivos del proyecto

No es “otra agenda”. Es una herramienta ajustada a la **formación tecnológica**:

- Vistas anual / mensual / semanal / diaria.  
- Fichas de formación con tema, cliente, fechas, horas, lugar, modalidad (presencial/online), tarifa, enlace de videoconferencia, etc.  
- Vinculación con cliente: datos de contacto, dirección, CIF e interlocutor.  
- Control de solapamientos y aviso de tiempo mínimo de desplazamiento.  
- Eventos recurrentes (módulos que se reparten en semanas/meses).  
- Códigos de color + estados: confirmado, tentativo, cancelado, prioridad.  

---

## Funcionalidades complementarias

- Exportación a PDF de las vistas (anual, mensual, semanal).  
- Sincronización con Google Calendar para consulta móvil.  
- Gestión de adjuntos (contratos, guiones, propuestas).  
- Histórico de cambios (quién cambió qué y cuándo).  
- Cálculo de horas por fechas/cliente/tema con puente a facturación.  

---

## Diseño y arquitectura (claridad antes que complejidad)

**Stack:** `Python` + `PyQt` para la interfaz, `SQLite` para almacenamiento local.

**Capas:**

- **Datos:** base SQLite y acceso vía repositorios.  
- **Dominio:** clases `Cliente`, `Formacion`, `Tema`… con reglas (solapamientos, cálculo de horas).  
- **Servicios:** exportaciones, Google Calendar, adjuntos.  
- **Interfaz:** calendario visual, formularios y herramientas de planificación.  

**¿Por qué así?**  
Prioriza **velocidad de desarrollo**, **portabilidad** (funciona sin servidor) y **control del dato**. Más adelante, si compensa, habrá camino para API/Cloud.

---

## Roadmap de la serie

Este es el primer artículo. En las próximas entregas verás, paso a paso:

1. Modelo de datos y esquema (tablas, relaciones, estados, recurrencias).  
2. Repositorios y reglas de negocio (validación de solapamientos, tiempos mínimos).  
3. Interfaz del calendario en PyQt y componentes clave.  
4. Integración con Google Calendar y mapeo bidireccional seguro.  
5. Exportaciones a PDF con plantillas limpias.  
6. Métricas y horas para facturación y reporting.  
7. Empaquetado y despliegue en entorno de trabajo.  

---

## Cierra el círculo

Mi objetivo es **convertir una necesidad real en una aplicación útil** y compartir el camino: decisiones, dudas, errores y soluciones.

Si te dedicas a la formación (o gestionas proyectos con muchas fechas/personas), este proyecto te puede ahorrar tiempo y errores.

---

**¿Qué vista o funcionalidad te parece más crítica para empezar?**  
Te leo en comentarios y adaptaré el desarrollo en base a vuestro feedback.
