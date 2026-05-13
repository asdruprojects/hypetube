# HypeTube

> Cartelera curada de videos tech: un colador inteligente sobre el payload crudo de YouTube.

HypeTube toma un dump simulado de la API de YouTube y devuelve, vía un backend NestJS, una versión limpia y enriquecida: thumbnail, autor, fecha humana y un **Hype Score** propio. El frontend en React + Vite consume ese feed y destaca al ganador del momento como **Joya de la Corona**.

```
hypetube/
├── apps/
│   ├── api/          # NestJS — lee el JSON, calcula hype, expone /api/videos y /api/stats
│   └── web/          # React + Vite + Tailwind — grilla, búsqueda con debounce, joya de la corona
└── packages/
    ├── contracts/        # DTOs, enums, query params (compartidos back ↔ front)
    ├── services/         # Cliente HTTP tipado reutilizable (apiClient + videosService)
    ├── ui/               # Primitives visuales (Card, Badge, Button, Skeleton, Stat, Empty/Error)
    └── typescript-config/ # tsconfig bases compartidos
```

---

## Requisitos

| Herramienta | Versión |
| ----------- | ------- |
| Node.js     | ≥ 20.9  |
| pnpm        | ≥ 9     |

Si no tienes pnpm:

```bash
npm i -g pnpm
```

---

## Instalación

```bash
git clone <repo>
cd hypetube
pnpm install
```

> El `postinstall` no es necesario: la primera ejecución de `pnpm dev` ya construye `@hypetube/contracts` antes de arrancar el resto (declarado en `turbo.json` con `dependsOn: ["^build"]`).

---

## Variables de entorno

Ambas apps funcionan con valores por defecto. Si quieres personalizar:

### Backend (`apps/api/.env`)

```bash
cp apps/api/.env.example apps/api/.env
```

```env
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
CORS_ORIGIN=http://localhost:5173

# Opcional: ruta absoluta a un JSON con el shape de YouTube videoListResponse.
# Si se omite, se usa apps/api/src/data/mock-youtube-api.json (incluido en el repo).
# MOCK_VIDEOS_PATH=/abs/path/to/mock-youtube-api.json
```

### Frontend (`apps/web/.env.local`)

```bash
cp apps/web/.env.example apps/web/.env.local
```

```env
VITE_API_URL=http://localhost:4000
```

---

## Levantar el proyecto

**Un solo comando, ambos servicios:**

```bash
pnpm dev
```

Turborepo levanta back y front en paralelo:

- API → http://localhost:4000
- Web → http://localhost:5173

Si quieres correrlos por separado:

```bash
pnpm --filter @hypetube/api dev
pnpm --filter @hypetube/web dev
```

---

## Endpoints

| Método | Ruta             | Descripción                              |
| ------ | ---------------- | ---------------------------------------- |
| GET    | `/health`        | Liveness                                 |
| GET    | `/api/videos`    | Lista transformada con filtros y orden   |
| GET    | `/api/stats`     | Totales, hype promedio, top creator      |

Todas las respuestas exitosas devuelven `{ data: ... }`. Los errores siguen el shape `{ error: { code, message, details? } }`.

### Query params soportados en `/api/videos`

| Param           | Tipo                                         | Default |
| --------------- | -------------------------------------------- | ------- |
| `search`        | `string` (busca en `title` + `author`)       | —       |
| `sortBy`        | `hype \| views \| likes \| comments \| newest` | `hype`  |
| `order`         | `asc \| desc`                                | `desc`  |
| `tutorialsOnly` | `boolean`                                    | `false` |

Ejemplos:

```
GET /api/videos?search=react
GET /api/videos?sortBy=views&order=desc
GET /api/videos?tutorialsOnly=true
```

---

## Reglas del Hype Score

```
base = (likes + comments) / views
hype = base * (esTutorial ? 2 : 1)
```

- Título contiene **tutorial** (case-insensitive, palabra completa) ⇒ se duplica.
- `commentCount` ausente en el payload (comentarios deshabilitados) ⇒ hype = **0**.
- `viewCount` no positivo ⇒ hype = **0** (división por cero segura).
- Valores numéricos siempre se parsean defensivamente desde string.

---

## Fecha relativa

Sin librerías de fechas. Implementación nativa en `apps/api/src/common/utils/relative-date.util.ts`:

- `Hace 1 día`, `Hace 2 meses`, `Hace 1 año`
- Singular/plural en español.
- Fechas futuras → `En N unidades`.
- Diferencia < 1 min → `Hace un momento`.
- ISO inválido → `Fecha desconocida`.

---

## Tests

```bash
pnpm --filter @hypetube/api test
```

Cubre lo crítico:

- Cálculo de hype (base, multiplicador tutorial, comentarios deshabilitados, división por cero).
- Detección de tutoriales con casing arbitrario.
- Transformación completa del item de YouTube al `VideoDTO`.
- Formateo de fecha relativa.

---

## Build de producción

```bash
pnpm build
```

Genera:

- `apps/api/dist` (Node CommonJS, entrypoint `dist/main.js`)
- `apps/web/dist` (estáticos listos para CDN)

---

## Deploy

### Frontend → Vercel

1. Proyecto apuntando a `apps/web`.
2. Framework: **Vite**.
3. Variable: `VITE_API_URL=https://tu-api.example.com`.
4. Build command (auto): `pnpm --filter @hypetube/web build`.

### Backend → Render / Railway

1. Variable obligatoria: `CORS_ORIGIN=https://tu-frontend.vercel.app`.
2. Build: `pnpm install && pnpm --filter @hypetube/api build`.
3. Start: `node apps/api/dist/main`.
4. Si quieres usar otro dump, monta el archivo y setea `MOCK_VIDEOS_PATH=/path/al/json`.

---

## Scripts disponibles

| Comando                                       | Descripción                          |
| --------------------------------------------- | ------------------------------------ |
| `pnpm dev`                                    | API + Web en paralelo                |
| `pnpm build`                                  | Build de todo el monorepo            |
| `pnpm test`                                   | Tests del backend                    |
| `pnpm check-types`                            | Type-check de todos los paquetes     |
| `pnpm format`                                 | Prettier sobre todo el repo          |
