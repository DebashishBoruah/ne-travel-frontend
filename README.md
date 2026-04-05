# NE Travel — Frontend

Next.js app for the Northeast India travel platform (tourist, host, and admin areas).

## Requirements

- Node.js 20+
- Running [NE Travel API](../ne-travel-platform-backend/backend) for auth and data (`NEXT_PUBLIC_API_URL`)

## Quick start

```bash
cp .env.example .env
# Set NEXT_PUBLIC_API_URL, Supabase keys, and other vars from .env.example
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Full stack locally

See [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) for Supabase alignment, backend setup, and optional `npm run dev:stack` (frontend + API together when both repos sit side by side).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js dev server |
| `npm run dev:api` | Start API via sibling folder `../ne-travel-platform-backend/backend` |
| `npm run dev:stack` | Frontend + API together |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
