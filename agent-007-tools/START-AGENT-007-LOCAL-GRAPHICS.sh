#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$ROOT_DIR/agent-007-storage-common.sh"
# shellcheck disable=SC1090
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
export AGENT_007_HOME="${AGENT_007_HOME:-$ROOT_DIR}"
export AGENT_007_IMAGE_OUTPUT_DIR="${AGENT_007_IMAGE_OUTPUT_DIR:-$ROOT_DIR/outputs/images}"
export AGENT_007_SAFE_IMAGE_PORT="${AGENT_007_SAFE_IMAGE_PORT:-3344}"
mkdir -p "$ROOT_DIR/logs" "$AGENT_007_IMAGE_OUTPUT_DIR"
pkill -f "agent_007_safe_image_bridge.py" 2>/dev/null || true
python3 "$ROOT_DIR/image-runtimes/safe-image-bridge/agent_007_safe_image_bridge.py" > "$ROOT_DIR/logs/oscar-local-graphics.log" 2>&1 &
echo $! > "$ROOT_DIR/logs/oscar-local-graphics.pid"
sleep 1
echo "Agent-007 Local Graphics:"
echo "  http://127.0.0.1:${AGENT_007_SAFE_IMAGE_PORT}"
echo "Open it with:"
echo "  open \"http://127.0.0.1:${AGENT_007_SAFE_IMAGE_PORT}\""
