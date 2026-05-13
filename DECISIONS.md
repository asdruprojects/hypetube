# DECISIONS

## Enfoque general

El reto es básicamente un colador sobre un dump estático: leer un JSON tipo YouTube, transformarlo, mostrarlo bonito y destacar al ganador. Lo traté exactamente como eso, una app **read-only** sobre fuente inmutable, sin meter cosas que no aportan al criterio de evaluación.

## Decisiones técnicas

- **NestJS** en el backend porque me da pipes, validación, filters e interceptors globales sin armarlos a mano.
- **React + Vite + Tailwind** en el frontend porque arranca en segundos y no necesito SSR.
- **Turborepo + pnpm** para orquestar ambas apps y los paquetes compartidos.
- **Sin base de datos**: la fuente es un JSON estático. Lo cargo una vez en `OnModuleInit` y lo cacheo en memoria. Meter Postgres sería duplicar estado por gusto.
- **Sin auth**: no hay datos por usuario ni acciones mutables. Sería decoración con riesgo extra. En su lugar dejé rate limiting global con `@nestjs/throttler`.
- **React Query** en el front para el cache de las queries; `useState` local para los filtros. Sin state manager global.
- **Swagger** expuesto en `/docs` aunque sean tres endpoints; cuesta poco y es útil para inspeccionar el contrato.
- **Tests**: endpoint tests del API con Jest + supertest contra un fixture controlado, y E2E del front con Cypress mockeando el API. No metí unit tests de controllers ni snapshots porque no aportan.

## Organización del proyecto

```
apps/
  api/    NestJS, expone /api/videos, /api/stats y /health
  web/    React + Vite + Tailwind
packages/
  contracts/          DTOs y enums tipados (compartidos back ↔ front)
  services/           Cliente HTTP tipado (apiClient + videosService)
  ui/                 Primitives visuales (Card, Badge, Button, etc.)
  typescript-config/  Bases de tsconfig
```

Tres paquetes en vez de un único `shared` porque cada uno tiene su razón:

- `contracts` viaja entre apps y se compila a CommonJS para que NestJS lo cargue sin loaders.
- `services` no depende de React, así también sirve para un script o CLI.
- `ui` agrupa primitives sin lógica de negocio para no acoplar componentes a datos del feature.

En el backend cada feature es un módulo Nest (`videos`, `stats`, `health`) con su controller, service y, donde aplica, repository y helpers/transformers.

## Supuestos y simplificaciones

- La fuente es estática durante la vida del proceso, así que el cache no necesita invalidación.
- "Mes = 30 días" en el helper de fechas. No es exacto calendáricamente, pero "Hace 2 meses" es lo que el usuario espera. Calcularlo bien con `setMonth` agrega complejidad sin beneficio perceptible.
- Filtros y orden viven en el backend aunque con 50 videos cabría hacerlos en cliente. Mantengo una sola fuente de verdad y permite paginar después sin tocar el front.
- Hype score:
  - `comments === null` (campo ausente) → 0. Distingo `null` (chat deshabilitado) de `0` (habilitado pero vacío).
  - `views <= 0` → 0.
  - Tutorial detectado con `\btutorial\b` (palabra completa, case-insensitive).
  - `toFixed(4) → parseFloat` para evitar `0.30000000000004`.

## Problemas encontrados

1. **Thumbnails del mock no cargaban**. Las URLs venían con formato tipo `https://placehold.co/300x200/282c34/61dafb?text=Redux`. Los segmentos de color (`/282c34/61dafb`) hacían que el servicio devolviera 404 y las imágenes salieran rotas. Las dejé en la versión simple `https://placehold.co/300x200?text=Redux` y se vieron al toque. Aprovechando, dejé un `Thumbnail` en `packages/ui` con fallback por si alguna URL futura vuelve a fallar.
2. **`@nestjs/swagger` instaló v11 por default**, que pide `@nestjs/common@^11`. Como el proyecto está en Nest 10, peleaba con peer deps. Bajé a `@nestjs/swagger@^8`, que es la línea compatible con Nest 10.
3. **Timeout por defecto de Jest insuficiente para los tests de endpoint**. El primer arranque de Nest + ts-jest se va a 10-15s en frío y los specs morían en el `beforeAll` con el timeout de 5s. Lo subí a 30s en `test/setup.ts`.
4. **ESM en Node 22 con `contracts`**. Tenía `module: ESNext` y Node fallaba al cargar `import './videos'` por falta de extensión `.js`. Dejé ese paquete en CommonJS.
5. **Tailwind no veía las clases de `@hypetube/ui`**. Por defecto solo escanea su propio `content`. Agregué `'../../packages/ui/src/**/*.{ts,tsx}'` al `tailwind.config.ts` del web.
6. **Windows resolviendo `localhost` a `::1`**. NestJS escuchaba en IPv4 y el front fallaba con `ERR_CONNECTION_REFUSED`. El `apiClient` ahora normaliza `localhost → 127.0.0.1` en runtime.
7. **Cypress hereda el `exclude` del tsconfig padre**. Cuando excluí `cypress/` del `tsconfig.app.json`, el `tsconfig` interno de Cypress también lo heredó y compilaba vacío. Lo hice autónomo.

## Uso de IA

Usé un agente como pair programmer. Las decisiones que vinieron de mí, no del modelo:

- Estructura del monorepo y separación en `contracts` / `services` / `ui`.
- Stack: React + Vite, NestJS, Turborepo.
- Lógica del hype y el orden de las reglas (que `comments === null` gane sobre el multiplicador de tutorial).
- No meter base de datos ni auth.
- Qué dejar fuera (Storybook, i18n, state manager, ORM).

Algunos prompts útiles:

- Prompt inicial, para arrancar el esqueleto: *"Arma un monorepo con Turborepo y pnpm. `apps/api` en NestJS, `apps/web` en React + Vite + Tailwind, y tres paquetes compartidos: `contracts` (DTOs y enums), `services` (cliente HTTP tipado) y `ui` (primitives). Sin DB ni auth."*
- Sobre buenas prácticas en el backend: *"En el API quiero `ValidationPipe` global con `whitelist` y transform, un `HttpExceptionFilter` que devuelva siempre `{ error: { code, message } }`, un `ResponseInterceptor` que envuelva todo en `{ data }`, rate limiting con `@nestjs/throttler` y módulos por feature (controller + service + repo donde aplique)."*
- Sobre la lógica del hype: *"Implementa `calculateHype(input)` como función pura. Reglas en orden: si `comments === null` → 0; si `views <= 0` → 0; base = `(likes + comments) / views`; si el título matchea `\btutorial\b` (case-insensitive, palabra completa) → x2. Redondea con `toFixed(4) → parseFloat`."*
- Sobre un edge case que cambió el front: *"En la Joya de la Corona, ¿qué pasa si todos los videos tienen hype 0?"* → me llevó a no destacar nada en ese caso.

La IA no tomó decisiones de producto. "¿Hago paginación?" o "¿agrego dark/light toggle?" las cerré yo en favor de menos features y más pulido.
