# Frontend de Gestión de Tareas

Panel de gestión colaborativa de tareas (grupos, proyectos, tablero Kanban, comentarios y chat en tiempo real) construido con **React + TypeScript** para la [API de Tareas con FastAPI](https://github.com/SrStamm/API-de-tareas-con-FastAPI).

[English](README.md) | [Español](README.es.md)

**Demo en vivo:** <https://front-task-api-vanilla.vercel.app/dashboard/tasks>

## Descripción y funcionalidades principales

Este frontend es el cliente web de la API de Tareas. Está pensado para el **trabajo colaborativo**: organiza usuarios, proyectos y tareas con comunicación en tiempo real.

- **Grupos** — creación de grupos, gestión de miembros y asignación de roles por grupo.
- **Proyectos** — proyectos dentro de grupos, con sus propios miembros y permisos.
- **Tareas Kanban** — tablero con arrastrar y soltar (`@dnd-kit`), estados, etiquetas y modal de detalle.
- **Comentarios en tareas** — comentarios en la vista de detalle de cada tarea.
- **Vista de tareas asignadas** — listado paginado y personal de tareas asignadas al usuario actual.
- **Chat en tiempo real** — mensajería por proyecto mediante WebSocket.
- **Notificaciones instantáneas** — enviadas por la misma conexión WebSocket.
- **Roles y permisos** — acciones restringidas según el rol de grupo y el permiso de proyecto.
- **Tema claro / oscuro** — conmutador persistido en `localStorage`.
- **Filtros de tareas** — filtrado de tareas del proyecto y asignadas por estado y etiqueta.

## Diagrama de arquitectura

La aplicación es un SPA de Vite + React organizado en carpetas por funcionalidad (*features*). La capa de datos usa TanStack Query sobre un envoltorio común `Fetch` (`src/utils/api.ts`) que inyecta el JWT desde `localStorage`; el tiempo real fluye por un hook dedicado de WebSocket.

```mermaid
flowchart TD
    subgraph SPA["Frontend — React 18 + TypeScript (Vite)"]
        main["main.tsx<br/>QueryClientProvider + RouterProvider"]
        router["routes/AppRouter.tsx<br/>loaders + PublicRoute / PrivateRoute"]
        authP["providers/AuthProvider.tsx<br/>JWT en localStorage, GET /user/me"]
        gpP["providers/GroupProjectProvider.tsx<br/>groupId, projectId, role, permission"]
        layout["layouts/DashboardLayout<br/>Sidebar + Outlet"]
        pages["pages/Dashboard<br/>Groups · Projects · Tasks · Chat"]
        feats["features/<br/>groups · projects · tasks · comments · chat · users"]
        kanban["KanbanBoard (@dnd-kit)<br/>TaskFilters · TaskModal · comentarios"]
        qf["TanStack Query 5<br/>useQuery / useInfiniteQuery / useMutation"]
        api["utils/api.ts — Fetch<br/>Authorization: Bearer JWT"]
        ws["features/chat/hooks/useChatSocket.ts<br/>WebSocket + registro de listeners"]
    end

    subgraph API["Backend FastAPI"]
        rest[("API REST<br/>/groups /projects /tasks /comments /users ...")]
        wss[("WebSocket<br/>chat + notificaciones")]
    end

    main --> router
    router --> authP
    router -->|"rutas privadas /dashboard"| layout
    authP --- gpP
    layout --> pages
    pages --> feats
    feats --> kanban
    feats --> qf
    qf --> api
    api -->|"REST + JWT"| rest
    ws <-->|"WS + token (?token=)"| wss
```

Piezas clave del código real:

| Capa | Ubicación | Rol |
| ---- | --------- | --- |
| Enrutamiento y guards | `src/routes/AppRouter.tsx`, `ProtectedRoute`, `PublicRoute` | Público `/login` y `/register`; privado `/dashboard/*` tras un loader de token |
| Proveedores | `src/providers/AuthProvider.tsx`, `GroupProjectProvider.tsx` | Estado de autenticación (usuario, login/logout) y contexto de grupo/proyecto seleccionado con rol/permiso |
| Cliente REST | `src/utils/api.ts` | Envoltorio único `Fetch`: cuerpo JSON, token `Bearer` y manejo de errores |
| Capa de consultas | hooks en `src/features/*` | TanStack Query: caché, mutaciones y paginación infinita de tareas asignadas |
| Tiempo real | `src/features/chat/hooks/useChatSocket.ts` | Un socket, distribución a listeners suscritos (chat, actualizaciones de proyecto) |
| Carpetas de funcionalidad | `src/features/{groups,projects,tasks,comments,chat,users}` | Cada feature posee su `api/`, `components/`, `hooks/` y `schemas/` (Zod) |

## Tecnologías

| Tecnología | Versión | Rol |
| ---------- | ------- | --- |
| React | ^18.2.0 | Librería de UI |
| TypeScript | ~5.9.3 | Sistema de tipos |
| Vite | ^7.1.7 | Servidor de desarrollo y empaquetado de producción |
| react-router-dom | ^7.9.5 | Enrutamiento del lado del cliente (data router + loaders) |
| TanStack Query | ^5.90.12 | Capa de estado de servidor (consultas, mutaciones, caché) |
| @dnd-kit (core + modifiers) | ^6.3.1 / ^9.0.0 | Arrastrar y soltar en el tablero Kanban |
| Zod | ^4.1.12 | Validación de esquemas |
| react-icons | ^5.5.0 | Conjunto de iconos |
| ESLint | ^9.36.0 | Análisis estático (configuración plana, `typescript-eslint`) |
| CSS | — | CSS personalizado plano, temas claro/oscuro |
| Backend | — | [API de Tareas con FastAPI](https://github.com/SrStamm/API-de-tareas-con-FastAPI) (REST + WebSocket + JWT) |

## Instalación y ejecución

> La aplicación vive en el directorio `front-tasks/`. El lockfile versionado es `package-lock.json`, por lo que **npm es el gestor de paquetes canónico**.

1. Clona el repositorio:

   ```bash
   git clone https://github.com/SrStamm/front-task-api-vanilla.git
   cd front-task-api-vanilla/front-tasks
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno (ver siguiente sección).

4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abre el navegador en <http://localhost:5173>.

<details>
<summary>Opcional: pnpm</summary>

```bash
pnpm install
pnpm dev
```

</details>

## Variables de entorno

Crea un archivo `.env` dentro de `front-tasks/` (Vite lee las variables `VITE_*` en tiempo de desarrollo/compilación):

| Variable | Propósito | Ejemplo |
| -------- | --------- | ------- |
| `VITE_URL` | URL base de la API REST | `https://your-api.example.com` |
| `VITE_URL_WS` | URL base del endpoint WebSocket | `wss://your-api.example.com` |

```bash
# front-tasks/.env
VITE_URL=https://your-api.example.com
VITE_URL_WS=wss://your-api.example.com
```

Ambas URLs deben apuntar a una instancia en ejecución de la [API de Tareas con FastAPI](https://github.com/SrStamm/API-de-tareas-con-FastAPI).

## Pruebas y comandos

| Script | Comando | Propósito |
| ------ | ------- | --------- |
| `npm run dev` | `vite` | Servidor de desarrollo con HMR |
| `npm run build` | `tsc -b && vite build` | Verificación de tipos y generación del bundle de producción en `dist/` |
| `npm run lint` | `eslint .` | Análisis de todos los archivos TypeScript/TSX (configuración plana) |
| `npm run preview` | `vite preview` | Sirve localmente la compilación de producción |

> **Nota honesta:** actualmente **no hay una suite de pruebas unitarias** configurada en este proyecto. Los comandos de verificación disponibles son `npm run lint` y `npm run build`.

## Capturas de pantalla

| Captura | Vista previa |
| ------- | ------------ |
| Inicio de sesión | ![Inicio de sesión](docs/screenshots/login.png) |
| Panel (dashboard) | ![Panel](docs/screenshots/dashboard.png) |
| Tareas — tablero Kanban | ![Tablero Kanban](docs/screenshots/tasks-kanban.png) |
| Chat | ![Chat](docs/screenshots/chat.png) |

## Limitaciones conocidas

Correcciones pendientes actuales, en orden de impacto:

1. **Mensajes duplicados ocasionales** en el chat y en las vistas de proyecto — los observadores de TanStack Query requieren ajustes para que las actualizaciones en tiempo real no rendericen entradas duplicadas.
2. **Reconexión de WebSocket** — el hook de socket aún no tiene una estrategia automática de reconexión con *backoff*; una conexión interrumpida requiere recargar la página.
3. **Llamadas redundantes a `/refresh`** — algunos flujos disparan el endpoint de *refresh* más de lo necesario y deberían deduplicarse.
4. **Sin suite de pruebas automatizadas** — la verificación se apoya actualmente en `npm run lint` y `npm run build`.

## Demo en vivo

- **URL:** <https://front-task-api-vanilla.vercel.app/dashboard/tasks>
- **Usuario:** `test`
- **Contraseña:** `123456`

## Autor

**Mirko Alexander Stamm** — desarrollador Backend & Full-Stack.

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
