# Local development

The product is two repositories side by side:

| Repo | Role | Default URL |
|------|------|-------------|
| `ne-travel-platform` | Next.js frontend | http://localhost:3000 |
| `ne-travel-platform-backend/backend` | REST API | http://localhost:5001 |

## 1. Supabase

Use **one** Supabase project for:

- Postgres connection strings in the **API** `.env` (`DATABASE_URL`, `DIRECT_URL`)
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the **frontend** `.env`

Mixing regions or projects (e.g. northeast pooler in one place and southeast in another) causes “Can’t reach database server” and confusing logs.

## 2. API (backend)

```bash
cd /path/to/ne-travel-platform-backend/backend
cp .env.example .env
# Fill DATABASE_URL, DIRECT_URL, SUPABASE_JWT_SECRET from Supabase dashboard
npm install
npm run db:migrate   # or db:push for quick experiments
npm run db:seed:admin
npm run dev
```

Confirm startup logs show the **same** pooler host for `[env] DATABASE_URL host:` and `[database] Prisma/pg pool host:`.

## 3. Frontend

```bash
cd /path/to/ne-travel-platform
cp .env.example .env
# Set NEXT_PUBLIC_API_URL=http://localhost:5001 (or your API port)
# Set Supabase and other keys as in .env.example
npm install
npm run dev
```

## 4. Run both at once (optional)

From the **frontend** repo, if this machine keeps both repos as siblings (`ne-travel-platform` next to `ne-travel-platform-backend`):

```bash
npm run dev:stack
```

Otherwise run `npm run dev` in each repo in two terminals.

## 5. When auth or DB fails

1. Is the API running and healthy?
2. Does `NEXT_PUBLIC_API_URL` in the frontend match `PORT` in the API `.env`?
3. After changing `DATABASE_URL`, did you **fully restart** the API (not just hot reload)?
4. Is there only **one** `DATABASE_URL` line in `backend/.env`?
