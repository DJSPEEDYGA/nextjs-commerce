#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Load multi-drive storage config if present (from OSCAR-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$ROOT_DIR/oscar-storage-common.sh"
# shellcheck disable=SC1090
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
if [[ -f "$ROOT_DIR/logs/oscar-local-graphics.pid" ]]; then
  pid="$(cat "$ROOT_DIR/logs/oscar-local-graphics.pid" 2>/dev/null || true)"
  if [[ -n "${pid:-}" ]] && kill -0 "$pid" 2>/dev/null; then
    kill "$pid" || true
    echo "Stopped Oscar Local Graphics ($pid)"
  fi
  rm -f "$ROOT_DIR/logs/oscar-local-graphics.pid"
fi
pkill -f "oscar_safe_image_bridge.py" 2>/dev/null || true
