# 🗂️ Task Manager Frontend

Interfaz web desarrollada en **JavaScript Vanilla**, que sirve como **dashboard visual** para la [API de Tareas](https://github.com/SrStamm/API-de-tareas-con-FastAPI) creada con **FastAPI**.  
Permite gestionar grupos, proyectos, tareas y comunicación en tiempo real mediante chat y notificaciones.

---

## 🌐 Descripción general

Este proyecto ofrece una interfaz ligera y sin dependencias de frameworks para interactuar con la API REST de Tareas.  
El enfoque principal es la **organización colaborativa**: los usuarios pueden trabajar en grupo, gestionar proyectos, asignar tareas, comentar, comunicarse por el chat y recibir notificaciones.

---

## 🧭 Secciones principales del Dashboard

- 🏠 **Inicio:** vista general.  
- 👥 **Grupos:** administración de proyectos, miembros y sus roles.
- 📁 **Proyectos:** administración de tareas, miembros y permisos.
- ✅ **Tareas:** listado, comentarios, asignaciones y estado.
- 💬 **Chat:** mensajería en tiempo real con WebSocket.

---

## ⚙️ Tecnologías utilizadas

| Categoría | Herramienta / Tecnología |
|------------|--------------------------|
| Lenguaje | JavaScript (ES6+) |
| HTML | Estructura semántica básica |
| CSS | Estilos personalizados y modulares |
| Comunicación | Fetch API, WebSocket |
| Backend | [FastAPI Task API](https://github.com/SrStamm/API-de-tareas-con-FastAPI) |
| Servidor local | [`serve`](https://www.npmjs.com/package/serve) |

---

## 🚀 Ejecución local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/task-frontend.git
   ```
2. Instalar serve (si es que no lo tienes):
   ```bash
   npm install -g serve
   ```
3. Inicia el servidor local:
   ```bash
   serve .
   ```
4. Abre tu navegador y entra en:
   ```bash
   http://localhost:3000
   ```

---

## 🔌 Conexión con la API

El frontend se comunica con la API mediante:

- Fetch API → peticiones REST (/groups, /projects, /tasks, /comments, etc.)
- WebSockets → chat y notificaciones en tiempo real
- Autenticación → mediante tokens JWT generados en la API

#### ⚠️ Asegúrate de tener la API de Tareas corriendo y actualiza las URLs del entorno si es necesario (en js/config.js).

---

## 💡 Características destacadas

- Interfaz dinámica sin frameworks.
- Sistema de chat y notificaciones en tiempo real.
- Manejo de permisos y roles por grupo y proyecto.
- Integración con API propia desarrollada en FastAPI.
- Código modular y organizado por contexto.

---

## 🧰 Fix pendientes

- 🔁 Duplicado de mensajes en chat o proyectos (ajustar el observer).
- 🔒 Mejorar la conexión/desconexión de WebSocket.
- 🔄 Llamar una sola vez a /refresh.
- 📱 Mejorar la responsividad.
- 🎞️ Optimizar animaciones y transiciones.


---

## 🧩 Futuras features

- 🔐 Restringir botones/acciones según el rol/permiso del usuario.
- 💬 Mostrar más información sobre el usuario en comentarios o mensajes.
- 🏷️ Agregar tags para las tareas.
- 🔎 Filtros avanzados para tareas.
- ℹ️ Botones de “Más información” para mostrar relaciones inmediatas.
- 🟢 Indicar usuarios conectados al chat.
- 🔔 Listado de notificaciones con opción de marcarlas como leídas.
- 🧮 Badges: cantidad de tareas, mensajes no leídos, etc.
- 📊 Métricas (tareas completadas, pendientes, progreso de proyecto).
- 📱 Soporte PWA (modo offline y notificaciones push).
- 🌙 Tema oscuro / claro.
- ⚙️ Configuración de usuario.
- ⚡ Migración a TypeScript y React.

---

## 🧑‍💻 Autor
Mirko Alexander Stamm
📬 Desarrollador Backend & Full-Stack (en formación)

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia MIT.
