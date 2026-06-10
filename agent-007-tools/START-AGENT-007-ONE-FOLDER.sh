#!/usr/bin/env bash
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$ROOT/agent-007-storage-common.sh"
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
[ -f "$ROOT/.agent-007-one-folder.env" ] && . "$ROOT/.agent-007-one-folder.env"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RED='\033[0;31m'; NC='\033[0m'
info() { printf '%b\n' "${CYAN}[INFO]${NC} $*"; }
ok() { printf '%b\n' "${GREEN}[OK]${NC} $*"; }
warn() { printf '%b\n' "${YELLOW}[WARN]${NC} $*"; }
fail_soft() { printf '%b\n' "${RED}[FAIL]${NC} $*"; }

mkdir -p "$AGENT_007_LOG_DIR" "$AGENT_007_HOME/runtime/pids" "$AGENT_007_OUTPUT_DIR" "$AGENT_007_IMAGE_OUTPUT_DIR"

wait_url() {
  local url="$1" seconds="${2:-20}" n=0
  while [ "$n" -lt "$seconds" ]; do
    if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 3 "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
    n=$((n + 1))
  done
  return 1
}

find_python() {
  if [ -n "${PYTHON_BIN:-}" ] && [ -x "$PYTHON_BIN" ]; then printf '%s\n' "$PYTHON_BIN"; return 0; fi
  command -v python3 2>/dev/null || command -v python 2>/dev/null || return 1
}

find_first_file() {
  local name="$1"
  find "$ROOT" \
    \( -path "$ROOT/models" -o -path "$ROOT/cache" -o -path "$ROOT/runtime" -o -path "$ROOT/node_modules" -o -path "$ROOT/.git" \) -prune \
    -o -type f -name "$name" -print -quit 2>/dev/null
}

find_goat_web_app() {
  local c
  for c in \
    "$ROOT/web-app" \
    "$ROOT/goat-royalty-portable-2.0.0/web-app" \
    "$ROOT/GOAT-Royalty-App/web-app" \
    "$ROOT/USB-Uncensored-LLM-main/goat-royalty-portable-2.0.0/web-app" \
    "$ROOT/apps/goat/web-app"; do
    if [ -d "$c" ] && { [ -f "$c/index.html" ] || [ -f "$c/powerhouse.html" ] || [ -f "$c/goat-launcher-home.html" ]; }; then
      printf '%s\n' "$c"
      return 0
    fi
  done
  find "$ROOT" \
    \( -path "$ROOT/models" -o -path "$ROOT/cache" -o -path "$ROOT/runtime" -o -path "$ROOT/node_modules" -o -path "$ROOT/.git" \) -prune \
    -o -type d -name web-app -print 2>/dev/null | while IFS= read -r d; do
      if [ -f "$d/index.html" ] || [ -f "$d/powerhouse.html" ] || [ -f "$d/goat-launcher-home.html" ]; then
        printf '%s\n' "$d"
        break
      fi
    done
}

find_ollama_bin() {
  local os arch c
  os="$(uname -s 2>/dev/null || echo unknown)"
  arch="$(uname -m 2>/dev/null || echo unknown)"
  case "$os:$arch" in
    Darwin:*)
      for c in "$ROOT/Shared/bin/ollama-darwin" "$ROOT/bin/ollama-darwin" "$(command -v ollama 2>/dev/null || true)"; do
        [ -n "$c" ] && [ -x "$c" ] && { printf '%s\n' "$c"; return 0; }
      done
      ;;
    Linux:aarch64|Linux:arm64)
      for c in "$ROOT/Shared/bin/ollama-linux-arm64" "$ROOT/bin/ollama-linux-arm64" "$ROOT/Shared/bin/ollama" "$ROOT/bin/ollama" "$(command -v ollama 2>/dev/null || true)"; do
        [ -n "$c" ] && [ -x "$c" ] && { printf '%s\n' "$c"; return 0; }
      done
      ;;
    Linux:x86_64|Linux:amd64)
      for c in "$ROOT/Shared/bin/ollama-linux-amd64" "$ROOT/bin/ollama-linux-amd64" "$ROOT/Shared/bin/ollama" "$ROOT/bin/ollama" "$(command -v ollama 2>/dev/null || true)"; do
        [ -n "$c" ] && [ -x "$c" ] && { printf '%s\n' "$c"; return 0; }
      done
      ;;
    *)
      command -v ollama 2>/dev/null && return 0
      ;;
  esac
  return 1
}

start_ollama() {
  if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 3 "http://${OLLAMA_HOST}/api/tags" >/dev/null 2>&1; then
    ok "Ollama already running at http://${OLLAMA_HOST}"
    return 0
  fi
  local bin
  bin="$(find_ollama_bin || true)"
  if [ -z "$bin" ]; then
    warn "Ollama binary not found. Put a Linux ARM64 Ollama binary on Thor or install Ollama, then rerun."
    warn "Model folder is still routed to: $OLLAMA_MODELS"
    return 0
  fi
  info "Starting Ollama with one-folder model store: $OLLAMA_MODELS"
  HOME="$OLLAMA_HOME" "$bin" serve > "$AGENT_007_LOG_DIR/ollama-$STAMP.log" 2>&1 &
  echo $! > "$AGENT_007_HOME/runtime/pids/ollama.pid"
  if wait_url "http://${OLLAMA_HOST}/api/tags" 45; then ok "Ollama started"; else warn "Ollama did not answer yet. Log: $AGENT_007_LOG_DIR/ollama-$STAMP.log"; fi
}

start_drawing_bridge() {
  local port="${AGENT_007_DRAW_PORT:-3344}"
  if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 3 "http://127.0.0.1:${port}/health" >/dev/null 2>&1; then
    ok "Drawing bridge already running: $AGENT_007_IMAGE_RENDER_ENDPOINT"
    return 0
  fi
  local py bridge
  py="$(find_python || true)"
  [ -n "$py" ] || { warn "Python not found; cannot start local drawing bridge."; return 0; }
  for bridge in \
    "$ROOT/AGENT-007-FKD1-LOCAL-DRAWING-BRIDGE.py" \
    "$ROOT/OSCAR-LOCAL-DRAWING-BRIDGE.py" \
    "$(find_first_file 'AGENT-007-FKD1-LOCAL-DRAWING-BRIDGE.py' || true)"; do
    if [ -n "$bridge" ] && [ -f "$bridge" ]; then
      info "Starting local drawing bridge: $AGENT_007_IMAGE_RENDER_ENDPOINT"
      HOME="$AGENT_007_RUNTIME_HOME" "$py" "$bridge" --root "$AGENT_007_HOME" --host "${AGENT_007_DRAW_HOST:-127.0.0.1}" --port "$port" > "$AGENT_007_LOG_DIR/oscar-drawing-bridge-$STAMP.log" 2>&1 &
      echo $! > "$AGENT_007_HOME/runtime/pids/drawing-bridge.pid"
      if wait_url "http://127.0.0.1:${port}/health" 15; then ok "Drawing bridge started"; else warn "Drawing bridge did not answer yet. Log: $AGENT_007_LOG_DIR/oscar-drawing-bridge-$STAMP.log"; fi
      return 0
    fi
  done
  warn "Drawing bridge script not found. Agent-007 may describe images unless another image backend is configured."
}

start_oscar_bridge() {
  if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 3 "http://127.0.0.1:${AGENT_007_CHAT_PORT:-3333}/api/tools" >/dev/null 2>&1; then
    ok "Agent-007 tool/chat bridge already running on port ${AGENT_007_CHAT_PORT:-3333}"
    return 0
  fi
  local py server
  py="$(find_python || true)"
  [ -n "$py" ] || { warn "Python not found; cannot start Agent-007 bridge."; return 0; }
  for server in \
    "$ROOT/Shared/chat_server.py" \
    "$ROOT/USB-Uncensored-LLM-main/Shared/chat_server.py" \
    "$(find_first_file 'chat_server.py' || true)"; do
    if [ -n "$server" ] && [ -f "$server" ]; then
      info "Starting Agent-007 bridge from: $server"
      HOME="$AGENT_007_RUNTIME_HOME" "$py" "$server" --no-browser > "$AGENT_007_LOG_DIR/oscar-chat-server-$STAMP.log" 2>&1 &
      echo $! > "$AGENT_007_HOME/runtime/pids/oscar-chat-server.pid"
      if wait_url "http://127.0.0.1:${AGENT_007_CHAT_PORT:-3333}/api/tools" 45; then ok "Agent-007 bridge started"; else warn "Agent-007 bridge did not answer yet. Log: $AGENT_007_LOG_DIR/oscar-chat-server-$STAMP.log"; fi
      return 0
    fi
  done
  warn "Agent-007 chat_server.py not found inside this one-folder deployment."
}

start_goat_intel() {
  if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 3 "http://127.0.0.1:${GOAT_INTEL_PORT:-5500}" >/dev/null 2>&1; then
    ok "GOAT Intel server already running on port ${GOAT_INTEL_PORT:-5500}"
    return 0
  fi
  local py intel
  py="$(find_python || true)"
  [ -n "$py" ] || return 0
  for intel in \
    "$ROOT/goat-intel-server/goat_intel.py" \
    "$ROOT/GOAT-Royalty-App/goat-intel-server/goat_intel.py" \
    "$(find_first_file 'goat_intel.py' || true)"; do
    if [ -n "$intel" ] && [ -f "$intel" ]; then
      info "Starting GOAT Intel server from: $intel"
      (cd "$(dirname "$intel")" && HOME="$AGENT_007_RUNTIME_HOME" "$py" "$intel") > "$AGENT_007_LOG_DIR/goat-intel-$STAMP.log" 2>&1 &
      echo $! > "$AGENT_007_HOME/runtime/pids/goat-intel.pid"
      sleep 2
      ok "GOAT Intel start attempted; log: $AGENT_007_LOG_DIR/goat-intel-$STAMP.log"
      return 0
    fi
  done
}

start_goat_web() {
  if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 3 "http://127.0.0.1:${GOAT_WEB_PORT:-8765}/" >/dev/null 2>&1; then
    ok "GOAT web server already running on port ${GOAT_WEB_PORT:-8765}"
    return 0
  fi
  local py web
  py="$(find_python || true)"
  [ -n "$py" ] || { warn "Python not found; cannot start GOAT web server."; return 0; }
  web="$(find_goat_web_app || true)"
  if [ -z "$web" ]; then
    warn "GOAT web-app folder not found inside this one-folder deployment."
    return 0
  fi
  info "Starting GOAT web app from: $web"
  HOME="$AGENT_007_RUNTIME_HOME" "$py" -m http.server "${GOAT_WEB_PORT:-8765}" --bind 127.0.0.1 --directory "$web" > "$AGENT_007_LOG_DIR/goat-web-$STAMP.log" 2>&1 &
  echo $! > "$AGENT_007_HOME/runtime/pids/goat-web.pid"
  if wait_url "http://127.0.0.1:${GOAT_WEB_PORT:-8765}/" 20; then ok "GOAT web app started"; else warn "GOAT web app did not answer yet. Log: $AGENT_007_LOG_DIR/goat-web-$STAMP.log"; fi
}

STAMP="$(date +%Y%m%d-%H%M%S)"
printf '\nAGENT-007 ONE-FOLDER START\nRoot: %s\n\n' "$AGENT_007_HOME"
start_ollama
start_drawing_bridge
start_oscar_bridge
start_goat_intel
start_goat_web

printf '\nLOCAL LINKS\n'
printf '  Agent-007 Chat/Tools:     http://127.0.0.1:%s/\n' "${AGENT_007_CHAT_PORT:-3333}"
printf '  GOAT Web App:         http://127.0.0.1:%s/\n' "${GOAT_WEB_PORT:-8765}"
printf '  Drawing API:          %s\n' "$AGENT_007_IMAGE_RENDER_ENDPOINT"
printf '  Ollama API:           http://%s/\n' "$OLLAMA_HOST"
printf '\nRun this to test everything:\n  bash %q/TEST-AGENT-007-ONE-FOLDER.sh\n' "$AGENT_007_HOME"
printf '\nRun this to stop services started by this launcher:\n  bash %q/STOP-AGENT-007-ONE-FOLDER.sh\n' "$AGENT_007_HOME"
