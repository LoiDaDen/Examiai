#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR=/root/LoiDen/Examiai-production
BACKUP_DIR=/root/examinai-backups
APP_CONTAINER=examinai-production-app-1
DB_CONTAINER=examinai-production-postgres-1

if [[ "$#" -ne 1 || ! "$1" =~ ^[0-9a-f]{40}$ ]]; then
  echo 'Usage: examinai-deploy-production <40-character commit SHA>' >&2
  exit 2
fi
EXPECTED_SHA="$1"

exec 9>/run/lock/examinai-production-deploy.lock
flock -n 9 || { echo 'ERROR: Another Production deploy is running' >&2; exit 1; }

cd "$APP_DIR"
[[ -f .env.production && -f docker-compose.prod.yml ]] || {
  echo 'ERROR: Production env/Compose is missing' >&2
  exit 1
}

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo 'ERROR: Production worktree has tracked changes. Refusing deploy.' >&2
  exit 1
fi

export GIT_TERMINAL_PROMPT=0
git fetch --no-tags origin main
ACTUAL_SHA="$(git rev-parse refs/remotes/origin/main)"
[[ "$EXPECTED_SHA" == "$ACTUAL_SHA" ]] || {
  echo "ERROR: Expected $EXPECTED_SHA but current origin/main is $ACTUAL_SHA" >&2
  exit 1
}

compose() {
  docker compose --env-file .env.production -f docker-compose.prod.yml "$@"
}

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
umask 077
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
ROLLBACK_IMAGE="examinai-production-rollback:$STAMP"
OLD_IMAGE_ID="$(docker inspect "$APP_CONTAINER" --format '{{.Image}}')"
docker image inspect "$OLD_IMAGE_ID" >/dev/null

echo "=== BACKUP DATABASE: $STAMP ==="
DUMP_FILE="$BACKUP_DIR/examinai-production-$STAMP.dump"
compose exec -T postgres pg_dump -U examinai_prod -d examinai_production -Fc > "$DUMP_FILE"
[[ -s "$DUMP_FILE" ]] || { echo 'ERROR: Empty database backup' >&2; exit 1; }
docker exec -i "$DB_CONTAINER" pg_restore -l < "$DUMP_FILE" >/dev/null

echo "=== PIN ROLLBACK IMAGE: $OLD_IMAGE_ID ==="
docker image tag "$OLD_IMAGE_ID" "$ROLLBACK_IMAGE"
BACKUP_READY=1
ROLLOUT_STARTED=0

on_error() {
  local rc=$?
  trap - ERR
  echo "ERROR: Deployment failed (exit $rc)" >&2
  if [[ "$BACKUP_READY" == 1 ]]; then
    echo 'Restoring previous Production app image...' >&2
    if docker image tag "$ROLLBACK_IMAGE" examinai-production-app:latest; then
      if [[ "$ROLLOUT_STARTED" == 1 ]]; then
        compose up -d --no-deps --no-build --force-recreate app \
          || echo 'CRITICAL: App rollback failed; manual intervention required' >&2
      fi
    else
      echo 'CRITICAL: Could not retag rollback image' >&2
    fi
  fi
  echo 'Database was not changed by this deployment script.' >&2
  echo 'The Git working tree may be at the attempted commit; inspect the running image.' >&2
  exit "$rc"
}
trap on_error ERR

echo "=== CHECKOUT $EXPECTED_SHA ==="
git switch --detach "$EXPECTED_SHA"
compose config --quiet
test -f ops/smoke-production.sh
bash -n ops/smoke-production.sh

echo '=== BUILD PRODUCTION IMAGE ==='
compose build app

echo '=== UPDATE APP ONLY (DO NOT TOUCH POSTGRES) ==='
ROLLOUT_STARTED=1
compose up -d --no-deps --no-build --force-recreate app

echo '=== WAIT FOR HEALTH ==='
HEALTH_OK=0
for attempt in {1..30}; do
  if curl -fsS --max-time 5 http://127.0.0.1:3002/api/health \
    | python3 -c 'import json,sys; j=json.load(sys.stdin); sys.exit(0 if j.get("status")=="ok" and j.get("service")=="examinai-production" else 1)' \
    >/dev/null 2>&1; then
    HEALTH_OK=1
    break
  fi
  sleep 4
done
[[ "$HEALTH_OK" == 1 ]] || { echo 'ERROR: Production health failed' >&2; false; }

echo '=== SMOKE TEST ==='
bash ops/smoke-production.sh

printf '%s\n' "$EXPECTED_SHA" > "$BACKUP_DIR/production-last-successful-sha"
echo "DEPLOY SUCCESS: $EXPECTED_SHA"
