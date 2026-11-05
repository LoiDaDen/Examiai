# Examinai staging — initial recovery scaffold

Source repo: https://github.com/LoiDaDen/Examiai

This package deliberately does not contain Nginx or SSL changes. Nginx on Ubuntu already serves other websites and must remain untouched until staging HTTP verification succeeds.

## Add these files to the existing Examinai repository

Copy Dockerfile, .dockerignore, docker-compose.yml, .env.staging.example, and app/api/health/route.ts to their corresponding repository locations.

The `.env.staging` file contains secrets and should never be committed or pasted in chat.

## Before building

```bash
cd /root/LoiDen/Examiai
cp .env.staging.example .env.staging
chmod 600 .env.staging
# Edit .env.staging using nano or your preferred editor.
# Only use a dedicated staging Supabase project.
docker compose --env-file .env.staging config --quiet
```

## After staging-only environment settings are verified

```bash
docker compose --env-file .env.staging build app
docker compose --env-file .env.staging up -d
docker compose --env-file .env.staging ps
docker compose --env-file .env.staging logs --tail=40 app
curl -i http://127.0.0.1:3001/api/health
```

Do not use `docker compose down -v`, Docker pruning or any commands targeting the existing `techbyte` stack.

## Important: database is NOT provisioned by migrations

A new staging Postgres instance starts with an empty database. The repository currently has no complete migration tree checked in, and the app uses Supabase Auth IDs together with a `profiles` table in `DATABASE_URL`. Do not assume app functionality is ready simply because `/api/health` returns 200. Inspect and plan schema creation, Supabase Auth integration, and staging test data separately.

## Implementation notes

- No Nginx, DNS or certificate modifications are made by this package.
- No existing Docker network or volume is reused; `pgdata` is scoped to `examinai-staging`.
- Postgres does not publish a host port.
- Next.js publishes only `127.0.0.1:3001:3000`, for a future host Nginx reverse proxy.
- Public Supabase variables are compiled into the Next.js build; server secrets are supplied only at runtime.
- `pdftotext` is supplied by `poppler-utils` in the runtime image.
- `next/font/google` may require outbound network during the Docker build.
- The `/api/health` route checks process responsiveness, NOT DB or AI connectivity.
