#!/usr/bin/env bash
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$ROOT/agent-007-storage-common.sh"
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
[ -f "$ROOT/.agent-007-one-folder.env" ] && . "$ROOT/.agent-007-one-folder.env"
STAMP="$(date +%Y%m%d-%H%M%S)"
REPORT="$AGENT_007_LOG_DIR/oscar-one-folder-test-$STAMP.txt"
mkdir -p "$AGENT_007_LOG_DIR" "$AGENT_007_OUTPUT_DIR" "$AGENT_007_IMAGE_OUTPUT_DIR"
exec > >(tee "$REPORT") 2>&1

PASS=0; WARN=0; FAIL=0
pass(){ PASS=$((PASS+1)); printf '[PASS] %s\n' "$*"; }
warn(){ WARN=$((WARN+1)); printf '[WARN] %s\n' "$*"; }
fail(){ FAIL=$((FAIL+1)); printf '[FAIL] %s\n' "$*"; }

wait_url() {
  local url="$1" seconds="${2:-10}" n=0
  while [ "$n" -lt "$seconds" ]; do
    if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 3 "$url" >/dev/null 2>&1; then return 0; fi
    sleep 1; n=$((n + 1))
  done
  return 1
}

find_goat_web_app() {
  local c
  for c in "$ROOT/web-app" "$ROOT/goat-royalty-portable-2.0.0/web-app" "$ROOT/GOAT-Royalty-App/web-app" "$ROOT/USB-Uncensored-LLM-main/goat-royalty-portable-2.0.0/web-app"; do
    [ -d "$c" ] && { [ -f "$c/index.html" ] || [ -f "$c/powerhouse.html" ] || [ -f "$c/goat-launcher-home.html" ]; } && { printf '%s\n' "$c"; return 0; }
  done
  find "$ROOT" \( -path "$ROOT/models" -o -path "$ROOT/cache" -o -path "$ROOT/runtime" -o -path "$ROOT/node_modules" -o -path "$ROOT/.git" \) -prune -o -type d -name web-app -print 2>/dev/null | while IFS= read -r d; do
    if [ -f "$d/index.html" ] || [ -f "$d/powerhouse.html" ] || [ -f "$d/goat-launcher-home.html" ]; then printf '%s\n' "$d"; break; fi
  done
}

find_file() {
  local name="$1"
  find "$ROOT" \( -path "$ROOT/models" -o -path "$ROOT/cache" -o -path "$ROOT/runtime" -o -path "$ROOT/node_modules" -o -path "$ROOT/.git" \) -prune -o -type f -name "$name" -print -quit 2>/dev/null
}

printf '============================================================\n'
printf 'AGENT-007 ONE-FOLDER BASIC NEEDS TEST\n'
printf '============================================================\n'
printf 'Timestamp: %s\n' "$(date)"
printf 'Root:      %s\n' "$AGENT_007_HOME"
printf 'Report:    %s\n' "$REPORT"
printf '\n'

[ -d "$AGENT_007_HOME" ] && pass "One-folder root exists" || fail "One-folder root missing: $AGENT_007_HOME"
touch "$AGENT_007_HOME/.oscar-write-test" 2>/dev/null && { rm -f "$AGENT_007_HOME/.oscar-write-test"; pass "One-folder root is writable"; } || fail "One-folder root is not writable"

for d in "$GOAT_DATA_ROOT" "$GOAT_DOWNLOAD_DIR" "$AGENT_007_MODEL_STORE" "$AGENT_007_GGUF_STORE" "$AGENT_007_LOG_DIR" "$AGENT_007_RUNTIME_DIR" "$AGENT_007_IMAGE_OUTPUT_DIR"; do
  [ -d "$d" ] && pass "Folder exists: $d" || fail "Folder missing: $d"
done

for var in AGENT_007_HOME FKD1_ROOT AGENT_007_BRIDGE_WORKSPACE AGENT_007_TOOL_WORKSPACE GOAT_DATA_ROOT GOAT_DOWNLOAD_DIR AGENT_007_MODEL_STORE OLLAMA_MODELS AGENT_007_GGUF_STORE HF_HOME TMPDIR; do
  val="${!var:-}"
  if [ -z "$val" ]; then
    fail "$var is empty"
  else
    case "$val" in
      "$AGENT_007_HOME"*) pass "$var routes inside one folder -> $val" ;;
      *) fail "$var routes outside one folder -> $val" ;;
    esac
  fi
done

free_kb="$(df -Pk "$AGENT_007_HOME" | awk 'NR==2 {print $4}')"
free_gb="$(awk -v kb="$free_kb" 'BEGIN { printf "%.1f", kb/1024/1024 }')"
min_gb="${AGENT_007_MIN_FREE_GB:-50}"
if awk -v f="$free_gb" -v m="$min_gb" 'BEGIN { exit(f >= m ? 0 : 1) }'; then
  pass "Free space OK: ${free_gb} GB available; ${min_gb} GB requested"
else
  warn "Free space below requested amount: ${free_gb} GB available; ${min_gb} GB requested"
fi

web="$(find_goat_web_app || true)"
[ -n "$web" ] && pass "GOAT web app found: $web" || warn "GOAT web app folder not found"

chat="$(find_file chat_server.py || true)"
[ -n "$chat" ] && pass "Agent-007 chat/tool bridge source found: $chat" || warn "Agent-007 chat_server.py not found"

draw="$(find_file AGENT-007-FKD1-LOCAL-DRAWING-BRIDGE.py || true)"
[ -n "$draw" ] && pass "Local drawing bridge found: $draw" || warn "Local drawing bridge file not found"

if [ -d "$OLLAMA_MODELS" ]; then
  model_markers="$(find "$OLLAMA_MODELS" -maxdepth 5 \( -type f -name manifest.json -o -path '*/blobs/*' -o -path '*/manifests/*' \) 2>/dev/null | head -50 | wc -l | tr -d ' ')"
  if [ "${model_markers:-0}" -gt 0 ]; then pass "Ollama model store has local model files/markers"; else warn "No Ollama model markers found in $OLLAMA_MODELS yet"; fi
else
  fail "Ollama model store missing: $OLLAMA_MODELS"
fi

if [ -x "$ROOT/START-AGENT-007-ONE-FOLDER.sh" ]; then
  printf '\n[STEP] Starting local services for test...\n'
  bash "$ROOT/START-AGENT-007-ONE-FOLDER.sh" || warn "Start script returned a warning/failure"
else
  warn "Start script missing"
fi

if command -v curl >/dev/null 2>&1; then
  wait_url "http://127.0.0.1:${AGENT_007_DRAW_PORT:-3344}/health" 10 && pass "Drawing bridge health endpoint is live" || warn "Drawing bridge health endpoint is not live"
  test_img="$AGENT_007_IMAGE_OUTPUT_DIR/oscar-basic-needs-drawing-$STAMP.png"
  if curl -fsS --max-time 20 -H 'Content-Type: application/json' \
    -d "{\"prompt\":\"Agent-007 basic needs test: make a real image file\",\"outputPath\":\"$test_img\",\"format\":\"png\",\"width\":256,\"height\":256}" \
    "$AGENT_007_IMAGE_RENDER_ENDPOINT" >/tmp/oscar-draw-test-$$.json 2>/tmp/oscar-draw-test-$$.err; then
    if [ -s "$test_img" ]; then
      magic="$(head -c 8 "$test_img" | od -An -tx1 | tr -d ' \n')"
      if [ "$magic" = "89504e470d0a1a0a" ]; then
        pass "Agent-007 drawing bridge created a real PNG: $test_img"
      else
        fail "Drawing output exists but is not a PNG: $test_img"
      fi
    else
      fail "Drawing bridge returned OK but image file is missing: $test_img"
    fi
  else
    err="$(cat /tmp/oscar-draw-test-$$.err 2>/dev/null || true)"
    warn "Drawing POST failed: $err"
  fi
  rm -f /tmp/oscar-draw-test-$$.json /tmp/oscar-draw-test-$$.err

  wait_url "http://127.0.0.1:${AGENT_007_CHAT_PORT:-3333}/api/tools" 5 && pass "Agent-007 tool API is live" || warn "Agent-007 tool API is not live"
  wait_url "http://127.0.0.1:${GOAT_WEB_PORT:-8765}/" 5 && pass "GOAT web app is live" || warn "GOAT web app is not live"
  wait_url "http://${OLLAMA_HOST}/api/tags" 5 && pass "Ollama API is live" || warn "Ollama API is not live"
else
  warn "curl not found; HTTP/API tests skipped"
fi

printf '\n============================================================\n'
printf 'SUMMARY\n'
printf '============================================================\n'
printf 'Pass: %s\nWarn: %s\nFail: %s\n' "$PASS" "$WARN" "$FAIL"
printf 'Report saved to: %s\n' "$REPORT"
if [ "$FAIL" -eq 0 ]; then
  printf 'AGENT-007 ONE-FOLDER STATUS: PASS / CHECK WARNINGS IF ANY\n'
  exit 0
fi
printf 'AGENT-007 ONE-FOLDER STATUS: CHECK FAILURES ABOVE\n'
exit 1
