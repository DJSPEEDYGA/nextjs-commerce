#!/usr/bin/env bash
# Agent-007 as-standing deploy/verification record — FKD1 local/offline routed edition.
# Agent-007 FKD1 basic-needs test.
# Verifies the drive, local app files, Agent-007 tools, crew profile endpoints,
# local Ollama models, and actual graphics output instead of text-only drawing.

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$SCRIPT_DIR/agent-007-storage-common.sh"
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"

FKD1_DRIVE_NAME="${FKD1_DRIVE_NAME:-FKD1}"
MIN_FREE_GB="${AGENT_007_MIN_FREE_GB:-20}"
STAMP="$(date +%Y%m%d-%H%M%S)"
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

pass() { PASS_COUNT=$((PASS_COUNT + 1)); printf '[PASS] %s\n' "$1"; }
fail() { FAIL_COUNT=$((FAIL_COUNT + 1)); printf '[FAIL] %s\n' "$1"; }
warn() { WARN_COUNT=$((WARN_COUNT + 1)); printf '[WARN] %s\n' "$1"; }
info() { printf '[INFO] %s\n' "$1"; }

have_cmd() { command -v "$1" >/dev/null 2>&1; }

find_fkd1_root() {
  local requested="${FKD1_ROOT:-${FKD1_DRIVE:-}}"
  if [ -n "$requested" ]; then
    case "$requested" in
      /*) [ -d "$requested" ] && printf '%s\n' "$requested" && return 0 ;;
      *)
        for base in "/Volumes" "/media/${USER:-}" "/run/media/${USER:-}" "/mnt"; do
          [ -d "$base/$requested" ] && printf '%s\n' "$base/$requested" && return 0
        done
        ;;
    esac
  fi
  for path in \
    "/Volumes/$FKD1_DRIVE_NAME" \
    "/media/${USER:-}/$FKD1_DRIVE_NAME" \
    "/run/media/${USER:-}/$FKD1_DRIVE_NAME" \
    "/mnt/$FKD1_DRIVE_NAME"; do
    [ -d "$path" ] && printf '%s\n' "$path" && return 0
  done
  return 1
}

print_mounted_volumes() {
  df -h | awk 'NR==1 || $NF ~ /^\/Volumes\// || $NF ~ /^\/media\// || $NF ~ /^\/run\/media\// || $NF ~ /^\/mnt\// {print}'
}

require_free_space() {
  local path="$1" min_gb="$2" avail_kb avail_gb
  avail_kb="$(df -Pk "$path" | awk 'NR==2 {print $4}')"
  if [ -z "$avail_kb" ]; then fail "Could not read free space for $path"; return; fi
  avail_gb=$((avail_kb / 1024 / 1024))
  if [ "$avail_gb" -ge "$min_gb" ]; then
    pass "FKD1 free space OK: ${avail_gb}GB available; ${min_gb}GB required"
  else
    fail "FKD1 free space too low: ${avail_gb}GB available; ${min_gb}GB required"
  fi
  if [ "$avail_gb" -lt 450 ]; then
    warn "Less than 450GB free. That may be too tight for downloading all ~400GB of 29-model packs, but it may be fine if they are already present."
  fi
}

safe_relpath() {
  local full="$1" root="$2"
  case "$full" in
    "$root"/*) printf '%s\n' "${full#$root/}" ;;
    *) printf '%s\n' "$full" ;;
  esac
}

find_first_dir() {
  local p
  for p in "$@"; do
    [ -n "$p" ] && [ -d "$p" ] && printf '%s\n' "$p" && return 0
  done
  return 1
}

find_first_file() {
  local p
  for p in "$@"; do
    [ -n "$p" ] && [ -f "$p" ] && printf '%s\n' "$p" && return 0
  done
  return 1
}

detect_oscar_root() {
  local p found
  for p in \
    "${AGENT_007_ROOT:-}" \
    "$DRIVE_ROOT" \
    "$SCRIPT_DIR" \
    "$DRIVE_ROOT/USB-Uncensored-LLM-main" \
    "$DRIVE_ROOT/GOAT-Royalty-App"; do
    [ -n "$p" ] || continue
    [ -f "$p/Shared/chat_server.py" ] && printf '%s\n' "$p" && return 0
  done
  found="$(find "$DRIVE_ROOT" -maxdepth 5 -path '*/Shared/chat_server.py' -type f 2>/dev/null | head -n 1 || true)"
  [ -n "$found" ] && dirname "$(dirname "$found")" && return 0
  return 1
}

detect_goat_app_root() {
  local p found
  for p in \
    "${GOAT_APP_ROOT:-}" \
    "${OSCAR_GOAT_APP_ROOT:-}" \
    "$DRIVE_ROOT/GOAT-Royalty-App" \
    "$DRIVE_ROOT/goat-royalty-portable-2.0.0" \
    "$DRIVE_ROOT/USB-Uncensored-LLM-main/goat-royalty-portable-2.0.0" \
    "$DRIVE_ROOT" \
    "$SCRIPT_DIR"; do
    [ -n "$p" ] || continue
    [ -d "$p/web-app" ] && printf '%s\n' "$p" && return 0
  done
  found="$(find "$DRIVE_ROOT" -maxdepth 5 -type d -name web-app 2>/dev/null | head -n 1 || true)"
  [ -n "$found" ] && dirname "$found" && return 0
  return 1
}

looks_like_ollama_store() {
  local p="$1"
  [ -n "$p" ] && [ -d "$p" ] && { [ -d "$p/manifests" ] || [ -d "$p/blobs" ]; }
}

detect_ollama_store() {
  local p
  for p in \
    "${OLLAMA_MODELS:-}" \
    "${AGENT_007_MODEL_STORE:-}" \
    "$DRIVE_ROOT" \
    "$DRIVE_ROOT/ollama_data" \
    "$DRIVE_ROOT/Agent007Models/ollama_data" \
    "$DRIVE_ROOT/Shared/models/ollama_data" \
    "$SCRIPT_DIR/Shared/models/ollama_data"; do
    looks_like_ollama_store "$p" && printf '%s\n' "$p" && return 0
  done
  printf '%s\n' "$DRIVE_ROOT"
}

find_python() {
  if have_cmd python3; then command -v python3; return 0; fi
  if have_cmd python; then command -v python; return 0; fi
  return 1
}

find_ollama_bin() {
  local p
  if have_cmd ollama; then command -v ollama; return 0; fi
  for p in \
    "$DRIVE_ROOT/Shared/bin/ollama-darwin" \
    "${AGENT_007_ROOT:-}/Shared/bin/ollama-darwin" \
    "$SCRIPT_DIR/Shared/bin/ollama-darwin"; do
    [ -x "$p" ] && printf '%s\n' "$p" && return 0
  done
  return 1
}

wait_url() {
  local url="$1" seconds="$2" n=0
  while [ "$n" -lt "$seconds" ]; do
    curl -fsS --max-time 3 "$url" >/dev/null 2>&1 && return 0
    sleep 1
    n=$((n + 1))
  done
  return 1
}

http_check() {
  local label="$1" url="$2" tmp code bytes
  tmp="$DRIVE_ROOT/.oscar-http-check-$$.tmp"
  code="$(curl -L --max-time 20 -sS -o "$tmp" -w "%{http_code}" "$url" 2>/tmp/oscar-curl-$$.err || true)"
  bytes=0; [ -f "$tmp" ] && bytes="$(wc -c < "$tmp" | tr -d ' ')"
  if [ "$code" = "200" ]; then pass "$label -> HTTP 200 ($bytes bytes)"; else fail "$label -> HTTP ${code:-ERR} $(cat /tmp/oscar-curl-$$.err 2>/dev/null || true)"; fi
  rm -f "$tmp" /tmp/oscar-curl-$$.err
}

json_key_check() {
  local label="$1" url="$2" key="$3" tmp code
  tmp="$DRIVE_ROOT/.oscar-json-check-$$.json"
  code="$(curl -L --max-time 20 -sS -o "$tmp" -w "%{http_code}" "$url" 2>/tmp/oscar-curl-$$.err || true)"
  if [ "$code" = "200" ] && grep -q "$key" "$tmp" 2>/dev/null; then
    pass "$label -> HTTP 200 and contains $key"
  elif [ "$code" = "200" ]; then
    warn "$label -> HTTP 200 but expected marker not found: $key"
  else
    fail "$label -> HTTP ${code:-ERR} $(cat /tmp/oscar-curl-$$.err 2>/dev/null || true)"
  fi
  rm -f "$tmp" /tmp/oscar-curl-$$.err
}

is_graphic_file() {
  local f="$1"
  [ -s "$f" ] || return 1
  case "$f" in
    *.png) head -c 8 "$f" | LC_ALL=C grep -q $'\x89PNG\r\n\x1a\n' ;;
    *.jpg|*.jpeg) head -c 2 "$f" | LC_ALL=C grep -q $'\xff\xd8' ;;
    *.svg) head -c 300 "$f" | grep -qi '<svg' ;;
    *) file "$f" 2>/dev/null | grep -Eqi 'PNG image|JPEG image|SVG' ;;
  esac
}

make_local_png_smoke() {
  local out="$1" py="$2"
  [ -n "$py" ] || return 1
  "$py" - "$out" <<'PYPNG'
import struct, zlib, sys
out = sys.argv[1]
w, h = 420, 240
rows = []
for y in range(h):
    row = bytearray([0])
    for x in range(w):
        # gradient background
        r = 20 + (x * 40 // w)
        g = 25 + (y * 60 // h)
        b = 45 + ((x + y) * 40 // (w + h))
        # gold circle
        cx, cy = w // 2, h // 2
        d = (x - cx) ** 2 + (y - cy) ** 2
        if d < 70 ** 2:
            r, g, b = 235, 180, 45
        if 55 ** 2 < d < 70 ** 2:
            r, g, b = 255, 225, 110
        # small horns/ears triangles
        if 140 < x < 185 and 50 < y < 105 and y < -1.2*(x-185)+105:
            r, g, b = 245, 210, 120
        if 235 < x < 280 and 50 < y < 105 and y < 1.2*(x-235)+50:
            r, g, b = 245, 210, 120
        # simple eyes and nose
        if (x-185)**2 + (y-120)**2 < 7**2 or (x-235)**2 + (y-120)**2 < 7**2:
            r, g, b = 10, 10, 15
        if abs(x-210) < 8 and abs(y-148) < 5:
            r, g, b = 10, 10, 15
        row.extend([r,g,b])
    rows.append(bytes(row))
raw = b''.join(rows)
def chunk(kind, data):
    return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data) & 0xffffffff)
with open(out, 'wb') as f:
    f.write(b'\x89PNG\r\n\x1a\n')
    f.write(chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)))
    f.write(chunk(b'IDAT', zlib.compress(raw, 9)))
    f.write(chunk(b'IEND', b''))
PYPNG
}

start_ollama_if_needed() {
  if curl -fsS --max-time 5 "http://$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
    pass "Ollama already listening on $OLLAMA_HOST"
    return
  fi
  if [ -z "${OLLAMA_BIN:-}" ]; then
    warn "Ollama binary not found; local model checks may fail"
    return
  fi
  info "Starting Ollama with FKD1 model store"
  HOME="$OLLAMA_HOME" "$OLLAMA_BIN" serve > "$LOG_DIR/ollama-basic-needs-$STAMP.log" 2>&1 &
  if wait_url "http://$OLLAMA_HOST/api/tags" 60; then pass "Ollama started"; else fail "Ollama did not start. Check $LOG_DIR/ollama-basic-needs-$STAMP.log"; fi
}

start_oscar_if_needed() {
  if curl -fsS --max-time 5 http://127.0.0.1:3333/api/tools >/dev/null 2>&1; then
    pass "Agent-007 chat/tool bridge already listening on 127.0.0.1:3333"
    return
  fi
  if [ ! -f "$SHARED/chat_server.py" ]; then
    fail "Missing Agent-007 server: $SHARED/chat_server.py"
    return
  fi
  [ -n "$PYTHON_BIN" ] || { fail "Python 3 not found for Agent-007 server"; return; }
  info "Starting Agent-007 chat/tool bridge"
  "$PYTHON_BIN" "$SHARED/chat_server.py" --no-browser > "$LOG_DIR/oscar-chat-server-basic-needs-$STAMP.log" 2>&1 &
  if wait_url http://127.0.0.1:3333/api/tools 60; then pass "Agent-007 chat/tool bridge started"; else fail "Agent-007 chat/tool bridge did not start. Check $LOG_DIR/oscar-chat-server-basic-needs-$STAMP.log"; fi
}

start_goat_if_needed() {
  if curl -fsS --max-time 5 http://127.0.0.1:8765/index.html >/dev/null 2>&1; then
    pass "GOAT web hub already listening on 127.0.0.1:8765"
    return
  fi
  if [ ! -d "$WEB_APP" ]; then
    fail "Missing GOAT web app: $WEB_APP"
    return
  fi
  [ -n "$PYTHON_BIN" ] || { fail "Python 3 not found for GOAT static server"; return; }
  info "Starting GOAT web hub"
  "$PYTHON_BIN" -m http.server 8765 --bind 127.0.0.1 --directory "$WEB_APP" > "$LOG_DIR/goat-web-basic-needs-$STAMP.log" 2>&1 &
  if wait_url http://127.0.0.1:8765/index.html 30; then pass "GOAT web hub started"; else fail "GOAT web hub did not start. Check $LOG_DIR/goat-web-basic-needs-$STAMP.log"; fi
}

verify_models() {
  if [ -d "$OLLAMA_MODELS/manifests" ] || [ -d "$OLLAMA_MODELS/blobs" ]; then
    count="$(find "$OLLAMA_MODELS/manifests" -type f 2>/dev/null | wc -l | tr -d ' ')"
    pass "Ollama model store exists on FKD1: $OLLAMA_MODELS ($count manifest files)"
    if [ "${count:-0}" -lt 1 ]; then warn "Model store exists but no model manifests were found."; fi
  else
    warn "No Ollama manifests/blobs found at $OLLAMA_MODELS. If your models are elsewhere on FKD1, set OLLAMA_MODELS to that folder."
  fi

  if curl -fsS --max-time 5 "http://$OLLAMA_HOST/api/tags" >/tmp/oscar-tags-$$.json 2>/dev/null; then
    if grep -q '"models"' /tmp/oscar-tags-$$.json; then pass "Ollama tags API returned a model list"; else warn "Ollama tags API replied but did not include models marker"; fi
  else
    fail "Ollama tags API is not reachable at $OLLAMA_HOST"
  fi
  rm -f /tmp/oscar-tags-$$.json
}

verify_file_bridge_write_read() {
  local test_rel test_abs payload resp code
  test_rel="oscar-basic-needs-write-test-$STAMP.txt"
  test_abs="$DRIVE_ROOT/$test_rel"
  payload="$DRIVE_ROOT/.agent-007-tools-write-payload-$$.json"
  resp="$DRIVE_ROOT/.agent-007-tools-write-response-$$.json"
  if [ -z "$PYTHON_BIN" ]; then warn "Skipping Agent-007 tool write test because Python is missing"; return; fi
  "$PYTHON_BIN" - "$payload" "$test_rel" <<'PYJSON'
import json, sys
payload, rel = sys.argv[1:3]
with open(payload, 'w', encoding='utf-8') as f:
    json.dump({"action":"write","path":rel,"content":"Agent-007 FKD1 basic needs write test\n"}, f)
PYJSON
  code="$(curl -sS -L --max-time 20 -o "$resp" -w "%{http_code}" -H 'Content-Type: application/json' --data-binary "@$payload" http://127.0.0.1:3333/api/tools 2>/tmp/oscar-write-curl-$$.err || true)"
  if [ "$code" = "200" ] && [ -f "$test_abs" ]; then
    pass "Agent-007 tool bridge can write into FKD1 workspace"
  elif [ "$code" = "200" ]; then
    warn "Agent-007 tool bridge replied HTTP 200 but write file was not found at $test_abs"
  else
    fail "Agent-007 tool bridge write test failed: HTTP ${code:-ERR} $(cat /tmp/oscar-write-curl-$$.err 2>/dev/null || true)"
  fi
  rm -f "$payload" "$resp" /tmp/oscar-write-curl-$$.err
}

verify_actual_image_output() {
  local png_out payload resp code endpoint action fallback
  png_out="$DRIVE_ROOT/oscar-image-render-smoke-$STAMP.png"
  payload="$DRIVE_ROOT/.oscar-image-payload-$$.json"
  resp="$DRIVE_ROOT/.oscar-image-response-$$.json"
  rm -f "$png_out" "$payload" "$resp"

  if [ -z "$PYTHON_BIN" ]; then
    fail "Python missing; cannot build image-render smoke payload"
    return
  fi

  "$PYTHON_BIN" - "$payload" "$png_out" <<'PYJSON'
import json, sys
payload, out = sys.argv[1:3]
data = {
    "prompt": "Create a simple gold goat head icon on a dark studio background. This is a graphics smoke test, not a text description.",
    "outputPath": out,
    "path": out,
    "format": "png",
    "offline": True,
    "save": True,
    "width": 512,
    "height": 512
}
with open(payload, 'w', encoding='utf-8') as f:
    json.dump(data, f)
PYJSON

  # First try the explicit GOAT image-render bridge.
  endpoint="http://127.0.0.1:3333/api/goat/image-render-bridge"
  code="$(curl -sS -L --max-time 60 -o "$resp" -w "%{http_code}" -H 'Content-Type: application/json' --data-binary "@$payload" "$endpoint" 2>/tmp/oscar-image-curl-$$.err || true)"
  if is_graphic_file "$png_out"; then
    pass "Agent-007 image-render bridge created an actual graphic: $png_out"
    rm -f "$payload" "$resp" /tmp/oscar-image-curl-$$.err
    return
  fi
  if [ "$code" = "200" ] && grep -Eiq 'data:image|base64' "$resp" 2>/dev/null; then
    pass "Agent-007 image-render bridge returned image data in the response"
    rm -f "$payload" "$resp" /tmp/oscar-image-curl-$$.err
    return
  fi

  # Try a few common tool action names against /api/tools.
  for action in image_render draw_image generate_image render_image; do
    "$PYTHON_BIN" - "$payload" "$png_out" "$action" <<'PYJSON'
import json, sys
payload, out, action = sys.argv[1:4]
data = {
    "action": action,
    "prompt": "Create a simple gold goat head icon on a dark studio background. This is a graphics smoke test, not a text description.",
    "outputPath": out,
    "path": out,
    "format": "png",
    "offline": True,
    "save": True,
    "width": 512,
    "height": 512
}
with open(payload, 'w', encoding='utf-8') as f:
    json.dump(data, f)
PYJSON
    code="$(curl -sS -L --max-time 60 -o "$resp" -w "%{http_code}" -H 'Content-Type: application/json' --data-binary "@$payload" http://127.0.0.1:3333/api/tools 2>/tmp/oscar-image-curl-$$.err || true)"
    if is_graphic_file "$png_out"; then
      pass "Agent-007 /api/tools action '$action' created an actual graphic: $png_out"
      rm -f "$payload" "$resp" /tmp/oscar-image-curl-$$.err
      return
    fi
    if [ "$code" = "200" ] && grep -Eiq 'data:image|base64' "$resp" 2>/dev/null; then
      pass "Agent-007 /api/tools action '$action' returned image data in the response"
      rm -f "$payload" "$resp" /tmp/oscar-image-curl-$$.err
      return
    fi
  done

  fail "Agent-007 did not create or return a real graphic file. This confirms the description-only drawing issue still needs fixing in Agent-007's image tool/back-end."
  fallback="$DRIVE_ROOT/oscar-local-graphics-fallback-$STAMP.png"
  if make_local_png_smoke "$fallback" "$PYTHON_BIN" && is_graphic_file "$fallback"; then
    warn "Local graphics fallback can create PNG files, so the problem is likely Agent-007 tool routing/model backend, not disk write access. Fallback proof: $fallback"
  else
    warn "Even the local PNG fallback failed; check Python and FKD1 write permissions."
  fi
  rm -f "$payload" "$resp" /tmp/oscar-image-curl-$$.err
}

DRIVE_ROOT="$(find_fkd1_root)" || {
  printf '[FAIL] FKD1 drive is not mounted. Mounted volumes:\n'
  print_mounted_volumes
  exit 1
}
LOG="$DRIVE_ROOT/oscar-basic-needs-test-$STAMP.txt"
LOG_DIR="$DRIVE_ROOT/.goat-logs"
mkdir -p "$LOG_DIR"
exec > >(tee "$LOG") 2>&1

printf '============================================================\n'
printf 'OSCAR FKD1 BASIC NEEDS TEST\n'
printf '============================================================\n'
printf 'Timestamp: %s\n' "$(date)"
printf 'FKD1 root:  %s\n' "$DRIVE_ROOT"
printf 'Report:     %s\n' "$LOG"
printf '\n'

if touch "$DRIVE_ROOT/.oscar-basic-needs-write-test" 2>/dev/null; then
  rm -f "$DRIVE_ROOT/.oscar-basic-needs-write-test"
  pass "FKD1 is writable"
else
  fail "FKD1 is not writable: $DRIVE_ROOT"
fi
require_free_space "$DRIVE_ROOT" "$MIN_FREE_GB"

PYTHON_BIN="$(find_python || true)"
if [ -n "$PYTHON_BIN" ]; then pass "Python available: $PYTHON_BIN"; else fail "Python not found"; fi

AGENT_007_ROOT="$(detect_oscar_root || true)"
if [ -n "$AGENT_007_ROOT" ]; then pass "Agent-007 root found: $AGENT_007_ROOT"; else fail "Agent-007 root with Shared/chat_server.py not found on FKD1"; fi
SHARED="${AGENT_007_ROOT:+$AGENT_007_ROOT/Shared}"
[ -z "$SHARED" ] && SHARED="$DRIVE_ROOT/Shared"

GOAT_APP_ROOT="$(detect_goat_app_root || true)"
if [ -n "$GOAT_APP_ROOT" ]; then pass "GOAT app root found: $GOAT_APP_ROOT"; else fail "GOAT app root with web-app folder not found on FKD1"; fi
WEB_APP="${GOAT_APP_ROOT:+$GOAT_APP_ROOT/web-app}"
[ -z "$WEB_APP" ] && WEB_APP="$DRIVE_ROOT/web-app"

OLLAMA_MODELS="$(detect_ollama_store)"
OLLAMA_HOME="${OLLAMA_HOME:-$DRIVE_ROOT/.ollama-runtime}"
OLLAMA_RUNNERS_DIR="${OLLAMA_RUNNERS_DIR:-$OLLAMA_HOME/runners}"
OLLAMA_TMPDIR="${OLLAMA_TMPDIR:-$OLLAMA_HOME/tmp}"
OLLAMA_HOST="${OLLAMA_HOST:-127.0.0.1:11434}"
OLLAMA_BIN="$(find_ollama_bin || true)"
mkdir -p "$OLLAMA_RUNNERS_DIR" "$OLLAMA_TMPDIR"

export FKD1_ROOT="$DRIVE_ROOT"
export GOAT_DATA_ROOT="$DRIVE_ROOT"
export GOAT_DOWNLOAD_DIR="${GOAT_DOWNLOAD_DIR:-$DRIVE_ROOT}"
export GOAT_APP_ROOT="$GOAT_APP_ROOT"
export AGENT_007_ROOT="$AGENT_007_ROOT"
export OSCAR_GOAT_APP_ROOT="$GOAT_APP_ROOT"
export AGENT_007_BRIDGE_WORKSPACE="$DRIVE_ROOT"
export AGENT_007_TOOL_WORKSPACE="$DRIVE_ROOT"
export AGENT_007_ASSET_ROOT="$DRIVE_ROOT"
export AGENT_007_IMAGE_RENDER_ENDPOINT="${AGENT_007_IMAGE_RENDER_ENDPOINT:-http://127.0.0.1:3344/api/draw}"
export GOAT_IMAGE_RENDER_ENDPOINT="${GOAT_IMAGE_RENDER_ENDPOINT:-$AGENT_007_IMAGE_RENDER_ENDPOINT}"
export AGENT_007_IMAGE_OUTPUT_DIR="${AGENT_007_IMAGE_OUTPUT_DIR:-$DRIVE_ROOT}"
export AGENT_007_OFFLINE="${AGENT_007_OFFLINE:-1}"
export GOAT_OFFLINE="${GOAT_OFFLINE:-1}"
export HF_HUB_OFFLINE="${HF_HUB_OFFLINE:-1}"
export TRANSFORMERS_OFFLINE="${TRANSFORMERS_OFFLINE:-1}"
export OLLAMA_MODELS
export AGENT_007_MODEL_STORE="$OLLAMA_MODELS"
export OLLAMA_HOME OLLAMA_RUNNERS_DIR OLLAMA_TMPDIR OLLAMA_HOST

cat > "$DRIVE_ROOT/.oscar-fkd1.env" <<ENVFILE
# FKD1 Agent-007/GOAT local environment generated by basic-needs test
export FKD1_ROOT="$DRIVE_ROOT"
export GOAT_DATA_ROOT="$DRIVE_ROOT"
export GOAT_DOWNLOAD_DIR="$GOAT_DOWNLOAD_DIR"
export GOAT_APP_ROOT="$GOAT_APP_ROOT"
export AGENT_007_ROOT="$AGENT_007_ROOT"
export OSCAR_GOAT_APP_ROOT="$GOAT_APP_ROOT"
export AGENT_007_BRIDGE_WORKSPACE="$DRIVE_ROOT"
export AGENT_007_TOOL_WORKSPACE="$DRIVE_ROOT"
export AGENT_007_ASSET_ROOT="$DRIVE_ROOT"
export AGENT_007_IMAGE_RENDER_ENDPOINT="${AGENT_007_IMAGE_RENDER_ENDPOINT:-http://127.0.0.1:3344/api/draw}"
export GOAT_IMAGE_RENDER_ENDPOINT="${GOAT_IMAGE_RENDER_ENDPOINT:-$AGENT_007_IMAGE_RENDER_ENDPOINT}"
export AGENT_007_IMAGE_OUTPUT_DIR="${AGENT_007_IMAGE_OUTPUT_DIR:-$DRIVE_ROOT}"
export AGENT_007_OFFLINE="$AGENT_007_OFFLINE"
export GOAT_OFFLINE="$GOAT_OFFLINE"
export HF_HUB_OFFLINE="$HF_HUB_OFFLINE"
export TRANSFORMERS_OFFLINE="$TRANSFORMERS_OFFLINE"
export OLLAMA_MODELS="$OLLAMA_MODELS"
export AGENT_007_MODEL_STORE="$OLLAMA_MODELS"
export OLLAMA_HOME="$OLLAMA_HOME"
export OLLAMA_RUNNERS_DIR="$OLLAMA_RUNNERS_DIR"
export OLLAMA_TMPDIR="$OLLAMA_TMPDIR"
export OLLAMA_HOST="$OLLAMA_HOST"
ENVFILE
pass "FKD1 environment file written: $DRIVE_ROOT/.oscar-fkd1.env"

start_ollama_if_needed
start_oscar_if_needed
start_goat_if_needed
verify_models

printf '\n============================================================\n'
printf 'GOAT PAGE CHECKS\n'
printf '============================================================\n'
http_check "GOAT Main Hub" "http://127.0.0.1:8765/index.html"
[ -f "$WEB_APP/goat-launcher-home.html" ] && http_check "GOAT Launcher" "http://127.0.0.1:8765/goat-launcher-home.html" || warn "goat-launcher-home.html not found"
[ -f "$WEB_APP/money-penny-codex.html" ] && http_check "Money Penny Codex" "http://127.0.0.1:8765/money-penny-codex.html" || warn "money-penny-codex.html not found"
[ -f "$WEB_APP/goat-picture-animation-lab.html" ] && http_check "Picture Animation Lab" "http://127.0.0.1:8765/goat-picture-animation-lab.html" || warn "goat-picture-animation-lab.html not found"
[ -f "$WEB_APP/developers.html" ] && http_check "Developers Console via Agent-007 bridge" "http://127.0.0.1:3333/goat/developers.html" || warn "developers.html not found"

printf '\n============================================================\n'
printf 'OSCAR TOOL AND CREW API CHECKS\n'
printf '============================================================\n'
json_key_check "Agent-007 tool policy" "http://127.0.0.1:3333/api/tools" '"actions"'
json_key_check "Agent-007 workspace bridge" "http://127.0.0.1:3333/api/workspace" '"root"'
json_key_check "GOAT image render bridge status" "http://127.0.0.1:3333/api/goat/image-render-bridge" '"ok"'
json_key_check "GOAT local model pack" "http://127.0.0.1:3333/api/goat/local-model-pack" '"ok"'
json_key_check "GOAT instrument lab" "http://127.0.0.1:3333/api/goat/instrument-lab" '"ok"'
json_key_check "GOAT asset style vault" "http://127.0.0.1:3333/api/goat/asset-style-vault" '"ok"'
json_key_check "GOAT career copilot" "http://127.0.0.1:3333/api/goat/career-copilot" '"ok"'
json_key_check "Money Penny profile" "http://127.0.0.1:3333/api/money-penny/profile" '"ok"'
json_key_check "Lexicon Lexi profile" "http://127.0.0.1:3333/api/lexicon-lexi/profile" '"ok"'
json_key_check "Ms Vanessa profile" "http://127.0.0.1:3333/api/ms-vanessa/profile" '"ok"'
json_key_check "Ms Nexus profile" "http://127.0.0.1:3333/api/ms-nexus/profile" '"ok"'
json_key_check "Sir Codex profile" "http://127.0.0.1:3333/api/sir-codex/profile" '"ok"'
json_key_check "Studio status" "http://127.0.0.1:3333/api/studio/status" '"ok"'
json_key_check "Voice status" "http://127.0.0.1:3333/api/voice/granite/status" '"ok"'

verify_file_bridge_write_read

printf '\n============================================================\n'
printf 'GRAPHICS / DRAWING CHECK\n'
printf '============================================================\n'
verify_actual_image_output

printf '\n============================================================\n'
printf 'SUMMARY\n'
printf '============================================================\n'
printf 'Pass: %s\n' "$PASS_COUNT"
printf 'Warn: %s\n' "$WARN_COUNT"
printf 'Fail: %s\n' "$FAIL_COUNT"
printf 'Report saved to: %s\n' "$LOG"
printf '\n'
printf 'Local links:\n'
printf '  Agent-007 Chat UI:       http://127.0.0.1:3333/\n'
printf '  GOAT Main Hub:       http://127.0.0.1:8765/index.html\n'
printf '  Developers Console: http://127.0.0.1:3333/goat/developers.html\n'
printf '  Picture Lab:        http://127.0.0.1:8765/goat-picture-animation-lab.html\n'
printf '\n'
if [ "$FAIL_COUNT" -eq 0 ]; then
  printf 'OSCAR BASIC NEEDS STATUS: PASS\n'
  exit 0
fi
printf 'OSCAR BASIC NEEDS STATUS: CHECK FAILURES ABOVE\n'
exit 1
