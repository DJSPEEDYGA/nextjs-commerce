#!/usr/bin/env bash
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
# Load multi-drive storage config if present (from OSCAR-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$ROOT/oscar-storage-common.sh"
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
[ -f "$ROOT/.oscar-one-folder.env" ] && . "$ROOT/.oscar-one-folder.env"
PID_DIR="$OSCAR_HOME/runtime/pids"
printf 'Stopping Oscar one-folder services from: %s\n' "$PID_DIR"
if [ -d "$PID_DIR" ]; then
  for f in "$PID_DIR"/*.pid; do
    [ -f "$f" ] || continue
    pid="$(cat "$f" 2>/dev/null || true)"
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      printf 'Stopping %s PID %s\n' "$(basename "$f")" "$pid"
      kill "$pid" 2>/dev/null || true
    fi
    rm -f "$f"
  done
fi
printf 'Stop command complete. If a service was started outside this launcher, stop it separately.\n'
