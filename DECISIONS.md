# DECISIONS

Este documento explica el porqué de cada decisión. La consigna pedía proporcionalidad: si algo no aportaba valor real al producto, no entró.

---

## 1. Enfoque general

El reto está descrito como un colador de datos sobre un dump estático: leer un JSON, transformarlo, mostrarlo bonito y destacar al ganador. Mi prioridad fue tratarlo exactamente como eso — un sistema **read-only sobre fuente inmutable** — y resistir la tentación de meter herramientas que no aportan nada al criterio de evaluación.

El resultado es:

- Un backend NestJS pequeño pero con la higiene de un servicio real (validación, rate limiting, filter/interceptor globales, DTOs, tests).
- Un monorepo organizado para que la lógica compartida (DTOs, cliente HTTP, primitives UI) viva en paquetes versionables, no copiada entre apps.
- Un frontend que se nota cuidado a nivel visual pero que no se infla con un design system completo ni con animaciones gratuitas.

---

## 2. Por qué NO usé base de datos

El reto entrega un dump estático. Si lo metiera en una DB:

1. Necesitaría modelo, migraciones, seed, conexión, manejo de credenciales y un proceso de sincronización.
2. La fuente seguiría siendo el JSON, así que estaría duplicando estado por gusto.
3. El primer evaluador que clone el repo tendría que levantar Postgres antes de ver una pantalla — fricción gratis.

En cambio, el backend lee el JSON una vez (`OnModuleInit`), lo transforma, y lo cachea en memoria. Si en el futuro la fuente cambia a una API real, el `VideosRepository` es el único punto a tocar.

---

## 3. Por qué NO usé auth

No hay multi-tenant, ni datos por usuario, ni acciones mutables. Cualquier capa de autenticación sería decorativa y agregaría riesgo (manejo de tokens, refresh, CORS más complejo) sin protección real. Si más adelante el cliente quisiera, por ejemplo, "videos favoritos por usuario", entonces sí tiene sentido — pero ahora no.

En su lugar, mantuve **rate limiting global** con `@nestjs/throttler` (60 req/min por IP). Eso sí me parece higiene básica de un endpoint público.

---

## 4. Organización del monorepo

Estructura final:

```
apps/api          NestJS service
apps/web          React + Vite SPA
packages/contracts        DTOs + enums tipados (CommonJS, compilado)
packages/services         Cliente HTTP + servicios tipados (source, peer-importable)
packages/ui               Primitives visuales (Card/Badge/Button/...)
packages/typescript-config  Bases de tsconfig
```

**Por qué tres paquetes y no uno solo "shared":**

- `contracts` es **lenguaje franco**: lo importan tanto el backend como el frontend. Es el único que tiene que **compilar** (a JS) para que NestJS — que corre en Node CommonJS — pueda consumirlo sin gimnasia de loaders.
- `services` exporta source TS directo y un `createApiClient` agnóstico de framework. No depende de React. Si mañana hay un CLI o un script, también puede usarlo.
- `ui` agrupa primitives presentacionales (sin lógica de negocio). Vive aislado para forzar la disciplina de no acoplar componentes a datos del feature concreto. Tailwind escanea su carpeta gracias al `content` del `tailwind.config.ts` del web.

**Por qué no `@katalify/ui` con shadcn completo:**

Para esta cartelera, mover toda la familia Radix + Storybook + variantes sería caro y poco honesto: la app necesita 8 primitivos puntuales. Implementé esos 8 a mano (Card, Badge, Button, Skeleton, Input, Select, Stat, ErrorState, EmptyState) con `cn()` + Tailwind. Si en producción esto creciera, migrar a shadcn es directo porque ya respetamos las mismas APIs (forwardRef, variantes por prop, className override).

---

## 5. Cómo evité el overengineering

Hice una lista corta de cosas que **conscientemente** dejé fuera:

| Idea            | Decisión                                                                 |
| --------------- | ------------------------------------------------------------------------ |
| Swagger         | Fuera. Dos endpoints simples no justifican el setup ni la dependencia.   |
| ORM             | Fuera. No hay DB.                                                        |
| Storybook       | Fuera. 9 componentes, todos visibles en una sola pantalla.               |
| Logging avanzado| Fuera. `Logger` nativo de Nest alcanza.                                  |
| i18n            | Fuera. El reto es 100% en español.                                       |
| State manager   | Fuera. React Query maneja cache; `useState` para filtros locales.        |
| Tests E2E       | Fuera. Cubrí las reglas de negocio con unit tests (lo que realmente puede romperse). |

Lo que sí mantuve porque **agrega valor real al evaluador**:

- `ValidationPipe` global con `whitelist` y transformación de tipos.
- `HttpExceptionFilter` y `ResponseInterceptor` para que toda respuesta tenga shape consistente.
- Rate limiting global.
- Tests unitarios de las reglas que más importan (hype, tutoriales, fechas, transformación).
- Skeleton + empty + error states reales en el front.
- Búsqueda con debounce (300 ms) — no spammea al server.
- Singular/plural en español ("Hace 1 día" vs "Hace 2 días").

---

## 6. Cómo estructuré el cálculo de Hype

Lo aislé en `apps/api/src/modules/videos/helpers/hype.helper.ts`. Es una función pura con un único `HypeInput → HypeResult`. Esa pureza me dio dos cosas:

1. **Testeo sin Nest**: el spec corre la función directa, sin levantar módulo.
2. **Composición clara**: el `transformer` solo se preocupa de parsear el shape de YouTube; el `helper` solo se preocupa de aplicar las reglas. El servicio (`videos.service.ts`) ni siquiera sabe cómo se calcula hype.

Reglas, en orden:

1. Detectar tutorial con regex `\btutorial\b` (case-insensitive). El `\b` evita que `"tutorialero"` matchee — está testeado.
2. Si `comments === null` (campo ausente en el payload) → score 0. Aquí distingo `null` (deshabilitado) de `0` (habilitado pero sin comentarios). El transformer hace esa distinción explícita.
3. Si `views <= 0` o no finito → score 0. Cubre división por cero y valores corruptos.
4. Calcular base `(likes + comments) / views`.
5. Aplicar multiplicador si aplica.
6. Redondear con `toFixed(4) → parseFloat` para evitar artefactos tipo `0.30000000000004` en la respuesta JSON.

---

## 7. Cómo manejé los edge cases

| Caso                                                         | Tratamiento                                                                |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `commentCount` ausente (deshabilitado)                       | DTO devuelve `comments: null`. Hype forzado a 0. Badge "Sin comentarios" en el front. |
| `viewCount` = 0                                              | Hype = 0 (no se intenta dividir).                                          |
| Strings numéricos del payload                                | `parseNumeric()` defensivo, devuelve `null` si no parsea, default a 0.     |
| Item sin `id`                                                | Descartado en el transformer (no rompe el endpoint).                       |
| Thumbnail faltante                                           | Placeholder genérico oscuro centralizado.                                  |
| ISO de fecha inválido                                        | "Fecha desconocida" sin lanzar.                                            |
| Fecha en el futuro                                           | Prefijo "En …" en lugar de "Hace …".                                       |
| Cartelera donde **todos** tienen hype 0 (todos deshabilitados)| El front no destaca joya de la corona (no tendría sentido).               |
| Cero resultados tras filtrar                                  | EmptyState distinto al de "no hay videos cargados".                       |
| Error de red                                                  | ApiError con `status: 0` para distinguir red vs error HTTP. Front muestra ErrorState con reintento. |
| `localhost` resolviendo IPv6 en Windows                       | `apiClient` normaliza a `127.0.0.1` para evitar `ERR_CONNECTION_REFUSED`. |

---

## 8. Tradeoffs aceptados conscientemente

- **Cache in-memory sin invalidación**: aceptable porque la fuente es estática durante la vida del proceso. Si fuera una API real, agregaría TTL o un endpoint de refresh.
- **Mes = 30 días en `relativeFromIso`**: no es preciso calendáricamente, pero para feedback humano ("Hace 2 meses") es exactamente lo que el usuario espera. El cálculo exacto requeriría iterar meses con `setMonth`, agregando complejidad sin beneficio perceptible.
- **`contracts` compilado a CommonJS**: el cuerpo del paquete es trivial y compilar es barato; a cambio, NestJS lo carga sin necesidad de `ts-node`/loaders en runtime. `services` y `ui` se importan como source porque sus consumidores (Vite, Jest con ts-jest) ya transpilan TS.
- **Filtros + sort en backend, no en frontend**: aunque con 50 videos cabría hacerlo client-side, dejarlo en el backend mantiene una sola fuente de verdad y permite paginar más adelante sin tocar el frontend.

---

## 9. Testing

Unit tests en el backend, ubicados al lado del código que prueban (colocation):

- `hype.helper.spec.ts` — todas las reglas del hype + casing del tutorial.
- `relative-date.util.spec.ts` — singular/plural, futuro, ISO inválido, "Hace un momento".
- `video.transformer.spec.ts` — el flujo completo de transformación, incluyendo el caso "commentCount ausente".

Se corren con `pnpm --filter @hypetube/api test`. Decidí cubrir el camino crítico (las reglas de negocio que tendría que recordar si las tocara dentro de 6 meses) en vez de aumentar coverage con tests de controllers/módulos que no agregan valor.

---

## 10. Problemas que encontré durante el desarrollo

1. **Resolución ESM en Node 22 para el package compartido.** Al inicio dejé `contracts` con `module: ESNext` y Node 22 falló al cargar `import './videos'` por falta de extensión `.js`. Lo solucioné configurando ese paquete específico a CommonJS (Node lo entiende sin extensiones). Los otros paquetes siguen en TS source porque sus consumidores transpilan.

2. **Tailwind no detectaba clases del `@hypetube/ui`.** Por defecto Tailwind escanea solo `content` del propio app. Agregué `'../../packages/ui/src/**/*.{ts,tsx}'` al `content` del `tailwind.config.ts` del web.

3. **CORS en Windows con IPv6.** En Windows, `localhost` puede resolver a `::1` mientras NestJS escucha en IPv4. El `apiClient` normaliza `localhost → 127.0.0.1` automáticamente.

---

## 11. Prompts más relevantes usados (IA)

Usé el agente como pair-programmer para acelerar la implementación. Mantuve el criterio técnico: yo decidí la arquitectura, las reglas de negocio y los edge cases; la IA escribió la mayor parte del código siguiendo esas decisiones. Algunos prompts clave que dieron forma al proyecto:

- *"Quiero seguir el patrón del monorepo katalify pero más simple: sin Next.js, sin DB, sin auth. React + Vite en el front, Nest en el back, paquetes contracts/services/ui."*
- *"El cálculo de hype tiene reglas con prioridad: comments ausente gana sobre tutorial. ¿Cómo lo expresarías para que un humano lea el código una sola vez y lo entienda?"*
- *"Necesito el helper `relativeFromIso` 100% nativo, con singular/plural en español y handling de fechas futuras. Sin librerías."*
- *"En la Joya de la Corona, ¿qué pasa si todos los videos tienen hype 0?"* → me llevó a la decisión de no destacar nada en ese caso.

La IA no tomó decisiones de producto. Las preguntas tipo "¿hago paginación?" o "¿agrego dark/light toggle?" las cerré yo en favor de menos features y más pulido.
