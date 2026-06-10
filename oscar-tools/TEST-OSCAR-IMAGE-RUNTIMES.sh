#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Load multi-drive storage config if present (from OSCAR-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$ROOT_DIR/oscar-storage-common.sh"
# shellcheck disable=SC1090
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
# shellcheck disable=SC1091
source "$ROOT_DIR/oscar-image-runtimes.env"

echo "Oscar image runtime test"
echo "Root:      $OSCAR_HOME"
echo "Models:    $OSCAR_IMAGE_MODEL_ROOT"
echo "Outputs:   $OSCAR_IMAGE_OUTPUT_DIR"
echo "Python:    $OSCAR_IMAGE_PYTHON"
echo

if [[ -x "$OSCAR_IMAGE_RUNTIME_ROOT/venvs/comfyui/bin/python" ]]; then
  "$OSCAR_IMAGE_RUNTIME_ROOT/venvs/comfyui/bin/python" --version
  echo "ComfyUI venv: PASS"
else
  echo "ComfyUI venv: FAIL"
fi

if [[ -x "$OSCAR_IMAGE_RUNTIME_ROOT/venvs/diffusers/bin/python" ]]; then
  "$OSCAR_IMAGE_RUNTIME_ROOT/venvs/diffusers/bin/python" - <<'PY'
import diffusers, torch, transformers
print("Diffusers import: PASS")
print("Torch:", torch.__version__)
PY
else
  echo "Diffusers venv: FAIL"
fi

if command -v curl >/dev/null 2>&1 && curl -fsS "http://127.0.0.1:${OSCAR_COMFY_PORT}" >/dev/null 2>&1; then
  echo "ComfyUI endpoint: PASS http://127.0.0.1:${OSCAR_COMFY_PORT}"
else
  echo "ComfyUI endpoint: not running yet. Start with ./START-OSCAR-IMAGE-RUNTIMES.sh"
fi
