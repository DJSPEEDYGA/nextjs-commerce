#!/usr/bin/env bash
# Launch the Agent-007 engine (macOS / Linux / Jetson).
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # agent007-master/

# Load env if present.
if [ -f "$HERE/config/agent007.env" ]; then
  # shellcheck disable=SC1091
  source "$HERE/config/agent007.env"
else
  echo "ℹ️  No config/agent007.env — using defaults. Copy agent007.env.example to set up."
fi

CORE="$HERE/core"
if [ ! -f "$CORE/chat_server.py" ]; then
  echo "❌ core/chat_server.py missing. Run: bash scripts/sync-core.sh" >&2
  exit 1
fi

# Prefer the kit's venv if it exists.
PY="python3"
if [ -x "$HERE/.venv/bin/python" ]; then
  PY="$HERE/.venv/bin/python"
fi

echo "🕵️  Starting Agent-007 on http://127.0.0.1:3333 ..."
cd "$CORE"
exec "$PY" chat_server.py
