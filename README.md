# HypeTube

Monorepo con backend en NestJS y frontend en React + Vite.

## Requisitos

- Node ≥ 20.9
- pnpm ≥ 9 (`npm i -g pnpm`)

## Instalar

```bash
git clone <repo>
cd hypetube
pnpm install
```

## Levantar el proyecto

Ambos servicios en paralelo:

```bash
pnpm dev
```

- API → http://localhost:4000
- Web → http://localhost:5173
- Swagger → http://localhost:4000/docs

Por separado:

```bash
pnpm --filter @hypetube/api dev    # backend
pnpm --filter @hypetube/web dev    # frontend
```

## Variables de entorno (opcional)

Las apps funcionan con defaults. Si necesitas cambiar puertos o CORS:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

## Tests

```bash
pnpm --filter @hypetube/api test:e2e   # backend (Jest + supertest)
pnpm --filter @hypetube/web cy:run     # frontend (Cypress, requiere `pnpm dev` corriendo)
```

## Demo (despliegue)

Front en producción (Railway): [https://hypetubeweb-production.up.railway.app/](https://hypetubeweb-production.up.railway.app/)