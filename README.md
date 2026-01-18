# 🗂️ Task Manager Frontend

Interfaz web desarrollada en **React + TypeScript** que funciona como **dashboard visual** para la [API de Tareas](https://github.com/SrStamm/API-de-tareas-con-FastAPI), construida con **FastAPI**.

El objetivo del proyecto es ofrecer una experiencia clara y eficiente para la **gestión colaborativa de tareas**, integrando comunicación en tiempo real, permisos por rol y una arquitectura frontend modular.

**Deploy en Vercel:** https://front-task-api-vanilla.vercel.app/dashboard/tasks

- **Username:** test
- **Pasword:** 123456

---

## 🌐 Descripción general

Este frontend permite a los usuarios interactuar con la API REST de Tareas a través de una interfaz web ligera y organizada.

El sistema está pensado para trabajo colaborativo, permitiendo:

* Organización por **grupos** y **proyectos**
* Gestión y asignación de **tareas**
* Comentarios por tarea
* **Chat en tiempo real**
* **Notificaciones** instantáneas mediante WebSockets

---

## 🧭 Secciones principales del Dashboard

* 🏠 **Dashboard**
  Vista general del sistema y acceso rápido a grupos y proyectos.

* 👥 **Grupos**
  Administración de grupos, miembros y roles.

* 📁 **Proyectos**
  Gestión de proyectos, permisos y miembros asociados.

* ✅ **Tareas**

  * **Tareas del proyecto**: tablero Kanban con filtros, estados y modal de detalle (comentarios, asignaciones y estado).
  * **Tareas asignadas al usuario**: listado personal con seguimiento de progreso.

* 💬 **Chat**
  Mensajería en tiempo real mediante WebSocket, integrada por proyecto.

---

## ⚙️ Tecnologías utilizadas

| Categoría      | Tecnología / Herramienta                                                 |
| -------------- | ------------------------------------------------------------------------ |
| Lenguaje       | TypeScript                                                               |
| UI             | React                                                                    |
| HTML           | HTML semántico                                                           |
| Estilos        | CSS modular personalizado                                                |
| Comunicación   | Fetch API, WebSocket                                                     |
| Backend        | [FastAPI Task API](https://github.com/SrStamm/API-de-tareas-con-FastAPI) |
| Servidor local | npm                                                                      |

---

## 🚀 Ejecución local

1. Clona el repositorio:

   ```bash
   git clone https://github.com/SrStamm/front-task-api-vanilla
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre el navegador en:

   ```text
   http://localhost:5173
   ```

---

## 🔌 Conexión con la API

El frontend se comunica con la API de Tareas a través de:

* **Fetch API** → endpoints REST (`/groups`, `/projects`, `/tasks`, `/comments`, etc.)
* **WebSockets** → chat y notificaciones en tiempo real
* **Autenticación JWT** → tokens generados por la API

> ⚠️ Asegúrate de tener la API de Tareas en ejecución y de configurar correctamente las URLs del entorno (`js/config.js`).

---

## 💡 Características destacadas

* Arquitectura frontend **modular y mantenible**
* Comunicación en tiempo real (chat y notificaciones)
* Manejo de **roles y permisos** por grupo y proyecto
* Integración directa con una API propia en FastAPI
* Enfoque en experiencia de usuario y claridad visual

---

## 🧰 Fix pendientes

* [ ] 🔁 Duplicado de mensajes en chat o proyectos (ajustar observers)
* [ ] 🔒 Mejorar el manejo de conexión y reconexión de WebSockets
* [ ] 🔄 Evitar múltiples llamadas innecesarias a `/refresh`
* [x] 📱 Mejorar la responsividad en dispositivos móviles (Enero 2026)
* [ ] 🎞️ Optimizar animaciones y transiciones

---

## 🧩 Futuras features

* [x] 🔐 Restricción de acciones según rol y permisos (Enero 2026)
* [x] 💬 Mostrar información ampliada del usuario en comentarios y mensajes (Enero 2026)
* [ ] 🏷️ Sistema de etiquetas (tags) para tareas
* [x] 🔎 Filtros de tareas (Enero 2026)
* [ ] 🟢 Indicador de usuarios conectados al chat
* [ ] 🔔 Panel de notificaciones con estado leído/no leído
* [ ] 🧮 Badges (tareas pendientes, mensajes sin leer, etc.)
* [ ] 📊 Métricas de progreso por proyecto
* [ ] 📱 Soporte PWA (offline + notificaciones push)
* [ ] 🌙 Tema claro / oscuro
* [ ] ⚙️ Configuración de usuario

---

## 🧑‍💻 Autor

**Mirko Alexander Stamm**
📬 Desarrollador Backend & Full-Stack (en formación)

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.
