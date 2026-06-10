#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$ROOT_DIR/agent-007-storage-common.sh"
# shellcheck disable=SC1090
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
# shellcheck disable=SC1091
source "$ROOT_DIR/agent-007-image-runtimes.env"
pkill -f "$COMFYUI_DIR/main.py" 2>/dev/null || true
source "$AGENT_007_IMAGE_RUNTIME_ROOT/venvs/comfyui-mac-legacy/bin/activate"
cd "$COMFYUI_DIR"
echo "Starting ComfyUI Mac Legacy on http://127.0.0.1:${AGENT_007_COMFY_PORT}"
python main.py --listen 127.0.0.1 --port "$AGENT_007_COMFY_PORT"
