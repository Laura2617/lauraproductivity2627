# Laura 26/27 · app personal de productividad

App web instalable (PWA) para iPhone e iPad que uso durante el curso 2026/27 para organizar mi día a día en un solo sitio: **hábitos** (al estilo *Hábitos atómicos*), **gimnasio**, **finanzas personales**, **estudios**, **recetas**, **lectura** y una **revisión semanal**.

La construí sin frameworks y sin servidor propio. El backend es **Google Apps Script** y la base de datos es **Google Sheets**, así que no tiene coste de mantenimiento y mis datos se quedan en mi cuenta de Google.

**Stack:** HTML + CSS + JavaScript (sin frameworks) · GitHub Pages · Google Apps Script como API · Google Sheets como base de datos · Google Calendar · Atajos de iOS + Apple Salud (reloj Polar) · Open Library API

---

## Funcionalidades

### Día a día
- **Hoy:**
  - Hábitos del día con rachas, % de cumplimiento, aviso de "nunca falles dos veces" y un "Nivel 2" de hábitos opcionales.
  - Números del día: sueño, pasos, móvil, páginas y minutos de curso.
  - Agenda, tareas para hoy y mañana, menú del día y gasto del día.
  - Los domingos, un recordatorio de la revisión semanal.
- **Añadir (+):** gastos, ingresos y traspasos entre cuentas en menos de 10 segundos, con aviso de cuánto queda en cada categoría del presupuesto.
- **Visión:** tarjetas a pantalla completa con mis fotos y el progreso real de cada meta del año. Las fotos están en mi Google Drive, no en este repositorio.

### Gimnasio
- Rutina del día (empuje / tirón / pierna / ciclo + core) con registro por serie de kg y repeticiones.
- **Doble progresión automática:** cuando completas todas las series en lo alto del rango, la app propone subir peso.
- Récords personales, temporizador de descanso con aviso sonoro y modos de 60, 45 o 30 minutos, más un modo "cansada".

### Dinero
- Gasto del mes frente al límite, con semáforo por categoría (verde, naranja o rojo).
- Gráfica del gasto de cada mes frente al límite, ingresos, ahorro, días sin gastar y meses de colchón.
- Hucha para un viaje con meta y aportación mensual automática.
- **Corregir saldo:** ajusta la cuenta al saldo real del banco sin inventar movimientos.

### Estudios
- Tareas por asignatura con fecha, tipo y prioridad, agrupadas en atrasadas, hoy, mañana, esta semana y más adelante.
- Asignaturas con fecha de examen, nota objetivo y nota final.
- Certificaciones con módulos completados y horas dedicadas.
- Plan de prácticas y checklist de currículum.
- Enlace a **NotebookLM** en cada asignatura y certificación.

### Calendario con avisos
- El conector crea y mantiene un calendario propio en **Google Calendar** con las clases (eventos semanales), el gym, las entregas, los exámenes y un recordatorio diario para registrar el día.
- **Sincronización incremental:** cada evento guarda una "firma" (hash) y solo se vuelve a crear lo que ha cambiado. Las tareas se sincronizan al momento y el resto cada hora, con un disparador programado.

### Progreso
- Calendario mensual de hábitos en colores, que se puede ver en conjunto o por hábito.
- Racha actual y mejor racha, y medias de sueño, pasos y móvil a 7 y 30 días.
- Entrenos de gym por semana, contador de pádel y fútbol, y **12 medallas** (rachas de 7, 21, 30, 66 y 100 días, semana perfecta, etc.).

### Recetas y compra
- Recetas con proteína y coste por ración, ingredientes, pasos y valoración.
- **Menú semanal** con cálculo de tandas para el *batch cooking* del domingo.
- **Lista de la compra automática:** suma los ingredientes de todo el menú, une singulares y plurales, deja marcar lo que ya hay en casa y se envía por **WhatsApp** con un toque.

### Biblioteca
- Libros con portadas automáticas (Open Library, por ISBN o por título), página actual, progreso y reto anual.
- Podcasts con episodios escuchados e ideas guardadas.

### Me gustaría comprar
- Lista de deseos ordenada por prioridad con la **regla de las 48 horas**.
- Lo que se descarta suma a "ahorrado por no comprar". Lo que se compra abre el registro del gasto ya rellenado.

### Revisión semanal + resumen para Claude
- Resumen automático de la semana: hábitos, gym, dinero, tareas hechas, atrasadas y próximas, y exámenes cercanos.
- Reflexión guiada: disfrute, qué fue bien, qué mejorar y 3 prioridades.
- "Cómo me siento" una vez al mes.
- Botón **"Copiar resumen para Claude"**: genera un informe en Markdown para analizar la semana con IA y planificar la siguiente.

### Diseño
- Modo claro y oscuro automático, diseño a dos columnas en iPad y áreas táctiles grandes.
- Se instala en la pantalla de inicio como una app y abre al instante gracias al *service worker*.

---

## Arquitectura

```
 iPhone / iPad  (PWA en GitHub Pages)
        │  fetch POST (JSON) + PIN
        ▼
 Google Apps Script  (doPost / doGet)
        │
        ├──►  Google Sheets   ← base de datos (hábitos, movimientos, entrenos, tareas, recetas…)
        ├──►  Google Calendar ← calendario propio, sincronizado cada hora
        └──►  Google Drive    ← fotos de la visión (solo lectura)

 Atajo de iOS (10:00 y 23:45) ── Apple Salud ◄── Polar Flow
        │  GET con los datos en la URL (sueño, pasos y hora de despertar)
        ▼
 Google Apps Script  (doGet)
```

**Decisiones técnicas**
- **Google Sheets como base de datos:** los datos se pueden ver, editar y analizar directamente en la hoja, que además calcula resúmenes con fórmulas (presupuesto, rachas, medias). La app solo lee y escribe celdas.
- **Sin CORS preflight:** la app envía `POST` con cuerpo de texto plano, que Apps Script acepta sin cabeceras especiales.
- **Atajo de iOS por `GET`:** al hacer `POST`, Apps Script redirige la petición y el iPhone la repite sin el cuerpo. Por eso el atajo manda los datos codificados en la URL. El conector interpreta los distintos formatos del iPhone: duraciones `m:ss` y `h:mm:ss`, listas de fases del sueño sin contar la noche dos veces, y miles con punto.
- **Migraciones de esquema:** el conector aplica solo los cambios de estructura de la hoja entre versiones, con una versión guardada en `PropertiesService`.
- **Pruebas:** el backend se prueba en Node con una simulación de `SpreadsheetApp`, `CalendarApp`, `DriveApp` y compañía, cargando una copia de la hoja en JSON. El frontend se prueba con Playwright en tamaño iPhone e iPad.
- **Modo demo:** si `config.js` no tiene URL del conector, la app funciona con datos de ejemplo en memoria.

## Privacidad y seguridad
- Este repositorio contiene **solo el código de la interfaz**. Los datos personales viven en mi Google Sheets y las fotos en mi Google Drive.
- El conector de Apps Script no está en este repositorio. Pide un **PIN** en cada petición y se bloquea 15 minutos tras 5 intentos fallidos.
- Todo el contenido que viene de la hoja se escapa antes de pintarlo, y los enlaces se validan (`https://`) antes de guardarlos.

## Estructura
```
index.html            estructura de la app
app.css               estilos (modo claro/oscuro, iPad)
app.js                lógica e interfaz de todas las pantallas
demo.js               datos de ejemplo para el modo demo
config.js             URL del conector (vacía = modo demo)
sw.js                 service worker (abre al instante y funciona con mala conexión)
manifest.webmanifest  instalación como app
```

## Cómo probarla
Clona el repositorio, deja `API_URL` vacío en `config.js` y sirve la carpeta (por ejemplo, `python3 -m http.server`). Se abre en **modo demo** con el PIN `1212`.

## Fases
- **Fase 1:** Hoy, Añadir, Gym, Visión y Más.
- **Fase 2:** Estudios y tareas, calendario con avisos, Dinero, Progreso y atajo de Apple Salud.
- **Fase 3:** Recetas, menú y lista de la compra, Biblioteca, Me gustaría comprar, Revisión semanal con resumen para IA, deporte extra, "cómo me siento" y NotebookLM.

---

*English summary: a personal all-in-one productivity PWA (habits, gym progressive-overload tracker, budgeting, study tasks, recipes and shopping list, reading tracker, wishlist and weekly review with an AI-ready summary). It is built with plain HTML/CSS/JS and hosted on GitHub Pages. Google Sheets is the database behind a Google Apps Script API, and the same script keeps a dedicated Google Calendar in sync incrementally. An iOS Shortcut sends sleep and steps from a Polar watch via Apple Health. Personal data never lives in this repository.*
