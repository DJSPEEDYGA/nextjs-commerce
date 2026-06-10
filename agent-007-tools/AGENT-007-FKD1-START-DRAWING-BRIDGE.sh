#!/usr/bin/env bash
# Starts the offline FKD1 local drawing fallback endpoint on 127.0.0.1:3344.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$SCRIPT_DIR/agent-007-storage-common.sh"
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
FKD1_DRIVE_NAME="${FKD1_DRIVE_NAME:-FKD1}"
find_fkd1_root() {
  local requested="${FKD1_ROOT:-${FKD1_DRIVE:-}}"
  if [ -n "$requested" ]; then
    case "$requested" in
      /*) [ -d "$requested" ] && printf '%s\n' "$requested" && return 0 ;;
      *) for base in "/Volumes" "/media/${USER:-}" "/run/media/${USER:-}" "/mnt"; do [ -d "$base/$requested" ] && printf '%s\n' "$base/$requested" && return 0; done ;;
    esac
  fi
  for path in "/Volumes/$FKD1_DRIVE_NAME" "/media/${USER:-}/$FKD1_DRIVE_NAME" "/run/media/${USER:-}/$FKD1_DRIVE_NAME" "/mnt/$FKD1_DRIVE_NAME"; do
    [ -d "$path" ] && printf '%s\n' "$path" && return 0
  done
  return 1
}
PYTHON_BIN="$(command -v python3 || command -v python || true)"
[ -n "$PYTHON_BIN" ] || { echo "Python not found." >&2; exit 1; }
DRIVE_ROOT="$(find_fkd1_root)" || { echo "FKD1 drive not found. Set FKD1_ROOT=/path/to/FKD1." >&2; exit 1; }
mkdir -p "$DRIVE_ROOT/.goat-logs"
export FKD1_ROOT="$DRIVE_ROOT"
export GOAT_DATA_ROOT="$DRIVE_ROOT"
export AGENT_007_IMAGE_RENDER_ENDPOINT="http://127.0.0.1:${AGENT_007_DRAW_PORT:-3344}/api/draw"
export GOAT_IMAGE_RENDER_ENDPOINT="$AGENT_007_IMAGE_RENDER_ENDPOINT"
export AGENT_007_IMAGE_OUTPUT_DIR="$DRIVE_ROOT"
if curl -fsS --max-time 3 "http://127.0.0.1:${AGENT_007_DRAW_PORT:-3344}/health" >/dev/null 2>&1; then
  echo "Agent-007 FKD1 Local Drawing Bridge is already running at $AGENT_007_IMAGE_RENDER_ENDPOINT"
  exit 0
fi
nohup "$PYTHON_BIN" "$SCRIPT_DIR/AGENT-007-FKD1-LOCAL-DRAWING-BRIDGE.py" --root "$DRIVE_ROOT" > "$DRIVE_ROOT/.goat-logs/oscar-local-drawing-bridge.log" 2>&1 &
sleep 2
curl -fsS --max-time 5 "http://127.0.0.1:${AGENT_007_DRAW_PORT:-3344}/health" >/dev/null || { echo "Drawing bridge did not start. Check $DRIVE_ROOT/.goat-logs/oscar-local-drawing-bridge.log" >&2; exit 1; }
echo "Agent-007 FKD1 Local Drawing Bridge started: $AGENT_007_IMAGE_RENDER_ENDPOINT"
echo "Output root: $DRIVE_ROOT"
echo "Env vars to give Agent-007:"
echo "  AGENT_007_IMAGE_RENDER_ENDPOINT=$AGENT_007_IMAGE_RENDER_ENDPOINT"
echo "  GOAT_IMAGE_RENDER_ENDPOINT=$GOAT_IMAGE_RENDER_ENDPOINT"
echo "  AGENT_007_IMAGE_OUTPUT_DIR=$AGENT_007_IMAGE_OUTPUT_DIR"
