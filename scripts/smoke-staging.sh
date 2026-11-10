set -Eeuo pipefail

BASE="${BASE_URL:-http://127.0.0.1:3001}"
DB="examinai-staging-postgres-1"
TEST_ID="00000000-0000-4000-8000-000000000001"

echo "=== EXAMINAI STAGING SMOKE TEST ==="

check_status() {
  local expected="$1"
  local label="$2"
  shift 2

  local actual
  actual=$(curl --noproxy '*' -sS \
    --max-time 15 \
    -o /dev/null \
    -w '%{http_code}' "$@")

  if [[ "$actual" != "$expected" ]]; then
    echo "FAIL: $label (expected $expected, got $actual)"
    exit 1
  fi

  echo "PASS: $label (HTTP $actual)"
}

echo
echo "[1] Health Check"

HEALTH=$(curl --noproxy '*' -fsS \
  --max-time 15 "$BASE/api/health")

printf '%s' "$HEALTH" | python3 -c '
import json, sys
data = json.load(sys.stdin)
assert data.get("status") == "ok"
assert data.get("service") == "examinai-staging"
print("PASS: Next.js staging health")
'

echo
echo "[2] Authentication Security"

check_status 401 "Profile" \
  "$BASE/api/profile"

check_status 401 "Conversations" \
  "$BASE/api/conversations"

check_status 401 "Messages" \
  "$BASE/api/conversations/$TEST_ID/messages"

for endpoint in \
  chat \
  chat/name \
  speaking \
  writing/assess \
  stt \
  tts \
  admin/exams/reading
do
  check_status 401 "$endpoint" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{}' \
    "$BASE/api/$endpoint"
done

echo
echo "[3] PostgreSQL Schema"

SCHEMA=$(docker exec "$DB" \
  psql -U examinai -d examinai_staging -Atqc "
SELECT CASE
  WHEN
    to_regclass('public.profiles') IS NOT NULL
    AND to_regclass('public.conversations') IS NOT NULL
    AND to_regclass('public.messages') IS NOT NULL
    AND to_regclass('public.ai_daily_quota') IS NOT NULL
  THEN 'OK'
  ELSE 'MISSING'
END;
")

if [[ "$SCHEMA" != "OK" ]]; then
  echo "FAIL: Missing required database tables"
  exit 1
fi

echo "PASS: Required PostgreSQL tables"

echo
echo "=================================="
echo "PASS: STAGING SMOKE TEST"
echo "=================================="
