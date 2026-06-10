#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Load multi-drive storage config if present (from OSCAR-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$ROOT_DIR/oscar-storage-common.sh"
# shellcheck disable=SC1090
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
# shellcheck disable=SC1091
source "$ROOT_DIR/oscar-image-runtimes.env"
mkdir -p "$OSCAR_IMAGE_OUTPUT_DIR" "$OSCAR_IMAGE_LOG_DIR"

start_bg() {
  local name="$1" cmd="$2" logfile="$3"
  if [[ -f "$OSCAR_IMAGE_LOG_DIR/${name}.pid" ]]; then
    oldpid="$(cat "$OSCAR_IMAGE_LOG_DIR/${name}.pid" 2>/dev/null || true)"
    if [[ -n "${oldpid:-}" ]] && kill -0 "$oldpid" 2>/dev/null; then
      echo "$name is already running at PID $oldpid"
      return 0
    fi
  fi
  echo "Starting $name"
  bash -lc "$cmd" >"$logfile" 2>&1 &
  echo $! > "$OSCAR_IMAGE_LOG_DIR/${name}.pid"
}

if [[ -d "$COMFYUI_DIR" && -f "$OSCAR_IMAGE_RUNTIME_ROOT/venvs/comfyui/bin/activate" ]]; then
  start_bg comfyui "source '$OSCAR_IMAGE_RUNTIME_ROOT/venvs/comfyui/bin/activate' && cd '$COMFYUI_DIR' && python main.py --listen 127.0.0.1 --port '$OSCAR_COMFY_PORT'" "$OSCAR_IMAGE_LOG_DIR/comfyui.log"
fi

echo
echo "Image runtime endpoints:"
echo "ComfyUI: http://127.0.0.1:${OSCAR_COMFY_PORT}"
echo
echo "Diffusers is installed as a script runtime, not a web server:"
echo "  source '$OSCAR_IMAGE_RUNTIME_ROOT/venvs/diffusers/bin/activate'"
echo "  python '$DIFFUSERS_DIR/generate_image.py'"
