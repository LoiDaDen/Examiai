# syntax=docker/dockerfile:1
# Examinai / Next.js 16 - staging image (no server-only secrets during build)
FROM node:22-alpine AS deps
WORKDIR /app
RUN npm install -g pnpm@10.18.3
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are deliberately embedded at build time by Next.js.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}
RUN ./node_modules/.bin/next build

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache poppler-utils
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/next.config.ts ./next.config.ts
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
RUN mkdir -p .next/cache && chown -R node:node .next/cache
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=8s --start-period=45s --retries=3 \
  CMD node -e "const http=require('http'); const r=http.get('http://127.0.0.1:3000/api/health',x=>process.exit(x.statusCode===200?0:1));r.on('error',()=>process.exit(1));r.setTimeout(6000,()=>{r.destroy();process.exit(1)});"
CMD ["./node_modules/.bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
