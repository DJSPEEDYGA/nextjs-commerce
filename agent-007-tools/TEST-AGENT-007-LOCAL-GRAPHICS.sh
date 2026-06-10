#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$ROOT_DIR/agent-007-storage-common.sh"
# shellcheck disable=SC1090
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
PORT="${AGENT_007_SAFE_IMAGE_PORT:-3344}"

if ! curl -fsS "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then
  bash "$ROOT_DIR/START-AGENT-007-LOCAL-GRAPHICS.sh"
fi

RESP="$(curl -fsS -H "Content-Type: application/json" -d '{"prompt":"Agent-007 test graphic, local offline file"}' "http://127.0.0.1:${PORT}/api/draw")"
echo "$RESP"
FILE="$(python3 - <<PY
import json
j=json.loads('''$RESP''')
print(j.get("path",""))
PY
)"
if [[ -f "$FILE" ]]; then
  echo "AGENT-007 LOCAL GRAPHICS: PASS"
  echo "Created: $FILE"
else
  echo "AGENT-007 LOCAL GRAPHICS: FAIL"
  exit 1
fi
