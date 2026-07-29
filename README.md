# AFT — Reports Generator (React)

Frontend de formulario multinivel del ecosistema **AFT (Alfabetización Tecnológica)**, desarrollado para **LeadForward Global Solutions**. Aplicación SPA de 5 pantallas que guía al participante desde la bienvenida hasta la finalización de la evaluación.

## Tech Stack

- **React 19 + Vite + SWC** — Framework y build tool
- **Zustand** — Manejo de estado global
- **Tailwind CSS v4** — Estilos utilitarios con modo oscuro
- **SweetAlert2** — Notificaciones y diálogos
- **Playwright** — Pruebas E2E

## Features

- 5 pantallas: bienvenida, código de invitación, datos generales, preguntas, finalización
- Opciones dinámicas de formulario obtenidas desde la API
- Persistencia de progreso con auto-guardado y restauración
- Modificadores de pantalla: grid (tabla) y unique (opciones únicas)
- 6 integraciones API (encuesta, código, email, progreso, respuestas, opciones)
- 13 pruebas E2E con Playwright

## Setup

```bash
cp .env.example .env
# Configurar VITE_API_ENDPOINT y VITE_API_KEY
npm install
npm run dev
```

---

## Contacto

Desarrollado por [Smooth Software Solutions (3S)](https://darideveloper.com)

- 🌐 [darideveloper.com](https://darideveloper.com)
- 💬 [WhatsApp](https://api.whatsapp.com/send?phone=5214493402622)
- 📂 [Ver proyecto en el portafolio](https://darideveloper.com/portafolio/aft)
