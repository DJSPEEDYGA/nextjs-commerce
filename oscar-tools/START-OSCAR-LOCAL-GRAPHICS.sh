#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Load multi-drive storage config if present (from OSCAR-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$ROOT_DIR/oscar-storage-common.sh"
# shellcheck disable=SC1090
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
export OSCAR_HOME="${OSCAR_HOME:-$ROOT_DIR}"
export OSCAR_IMAGE_OUTPUT_DIR="${OSCAR_IMAGE_OUTPUT_DIR:-$ROOT_DIR/outputs/images}"
export OSCAR_SAFE_IMAGE_PORT="${OSCAR_SAFE_IMAGE_PORT:-3344}"
mkdir -p "$ROOT_DIR/logs" "$OSCAR_IMAGE_OUTPUT_DIR"
pkill -f "oscar_safe_image_bridge.py" 2>/dev/null || true
python3 "$ROOT_DIR/image-runtimes/safe-image-bridge/oscar_safe_image_bridge.py" > "$ROOT_DIR/logs/oscar-local-graphics.log" 2>&1 &
echo $! > "$ROOT_DIR/logs/oscar-local-graphics.pid"
sleep 1
echo "Oscar Local Graphics:"
echo "  http://127.0.0.1:${OSCAR_SAFE_IMAGE_PORT}"
echo "Open it with:"
echo "  open \"http://127.0.0.1:${OSCAR_SAFE_IMAGE_PORT}\""
