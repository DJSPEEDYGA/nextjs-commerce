#!/usr/bin/env bash
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$ROOT/agent-007-storage-common.sh"
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
[ -f "$ROOT/.agent-007-one-folder.env" ] && . "$ROOT/.agent-007-one-folder.env"
PID_DIR="$AGENT_007_HOME/runtime/pids"
printf 'Stopping Agent-007 one-folder services from: %s\n' "$PID_DIR"
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
