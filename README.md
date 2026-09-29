# Laura 26/27 · app personal de productividad

App web (PWA) para iPhone e iPad que uso durante el curso 2026/27 para seguir mis **hábitos** (estilo *Atomic Habits*), mis **entrenos de gimnasio**, mis **finanzas personales** y mis **estudios**.

**Stack:** HTML + CSS + JavaScript sin frameworks · GitHub Pages · Google Apps Script como API · Google Sheets como base de datos · Atajos de iOS + Apple Salud (reloj Polar) para sueño y pasos.

## Qué hace (fase 1)
- **Hoy:** hábitos del día con rachas, % diario, aviso de "nunca falles dos veces", números (sueño, móvil, páginas, pasos, minutos de curso), agenda del día y gasto del día.
- **Añadir:** gastos, ingresos y traspasos en menos de 10 segundos, con aviso de cuánto queda en cada categoría.
- **Gym:** rutina del día (empuje / tirón / pierna / ciclo), registro por serie (kg y reps), doble progresión automática ("¡toca subir!"), récords y temporizador de descanso.
- **Visión:** tarjetas a pantalla completa con mis fotos (guardadas en mi Google Drive, no en este repositorio) y el progreso real de cada meta.
- **Diseño:** modo claro/oscuro automático y diseño adaptado a iPad.

## Arquitectura
```
iPhone / iPad (PWA en GitHub Pages)
        │  fetch POST (JSON) + PIN
        ▼
Google Apps Script (doPost)  ──►  Google Sheets (hábitos, movimientos, entrenos…)
        ▲
Atajo de iOS (cada mañana) ── Apple Salud ◄── Polar Flow
```
Los datos personales viven solo en mi Google Sheets; este repositorio contiene únicamente el código.

---
*English summary: a personal habit / gym / budget tracker built as a no-framework PWA, using Google Sheets as the database through a Google Apps Script API, plus an iOS Shortcut that syncs sleep and steps from a Polar watch via Apple Health.*
