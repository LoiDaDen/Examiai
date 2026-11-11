
#!/usr/bin/env bash
set -Eeuo pipefail

BASE_URL="http://127.0.0.1:3002"
DB_CONTAINER="examinai-production-postgres-1"

echo "=== EXAMINAI PRODUCTION SMOKE TEST ==="

echo "[1/4] Checking Production Health"

curl -fsS --max-time 10 \
  "$BASE_URL/api/health" |
  python3 -c '
import sys, json
data = json.load(sys.stdin)
assert data.get("status") == "ok"
assert data.get("service") == "examinai-production"
print("HEALTH PASS")
'

echo "[2/4] Checking Website"

curl -fsS --max-time 10 \
  -o /dev/null "$BASE_URL/"

echo "WEBSITE PASS"

echo "[3/4] Checking API Authentication"

STATUS=$(curl -sS --max-time 10 \
  -o /dev/null \
  -w "%{http_code}" \
  -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[]}')

if [[ "$STATUS" != "401" ]]; then
    echo "AUTH FAILED: HTTP $STATUS"
    exit 1
fi

echo "AUTH PASS"

echo "[4/4] Checking Production Database"

RESULT=$(docker exec "$DB_CONTAINER" \
  psql -U examinai_prod \
  -d examinai_production \
  -tAc "
    SELECT
      to_regclass('public.profiles') IS NOT NULL
      AND
      to_regclass('public.ai_daily_quota') IS NOT NULL;
  ")

if [[ "$RESULT" != "t" ]]; then
    echo "DATABASE CHECK FAILED"
    exit 1
fi

echo "DATABASE PASS"
echo "=== ALL SMOKE TESTS PASSED ==="
