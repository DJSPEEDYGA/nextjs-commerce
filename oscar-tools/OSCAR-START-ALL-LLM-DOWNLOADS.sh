#!/usr/bin/env bash
# Start or verify Oscar model availability on the FKD1 drive.
# Default is offline/local: it uses models already on FKD1 and does not download.
# To intentionally download missing model packs, run with OSCAR_ALLOW_ONLINE=1.
# This script never formats, erases, partitions, or mounts a raw disk.

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Load multi-drive storage config if present (from OSCAR-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$SCRIPT_DIR/oscar-storage-common.sh"
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"

FKD1_DRIVE_NAME="${FKD1_DRIVE_NAME:-FKD1}"
MODEL_PACK="${OSCAR_MODEL_PACK:-all}"
INCLUDE_HF_GGUF="${OSCAR_INCLUDE_HF_GGUF:-1}"
INCLUDE_EXPERIMENTAL="${OSCAR_INCLUDE_EXPERIMENTAL:-0}"
RESTART_OLLAMA="${OSCAR_RESTART_OLLAMA:-1}"
DRY_RUN="${OSCAR_DRY_RUN:-0}"
OSCAR_ALLOW_ONLINE="${OSCAR_ALLOW_ONLINE:-0}"
OSCAR_OFFLINE="${OSCAR_OFFLINE:-1}"
MIN_FREE_GB_OFFLINE="${OSCAR_MIN_FREE_GB_OFFLINE:-20}"
MIN_FREE_GB_ONLINE="${OSCAR_MIN_FREE_GB_ONLINE:-450}"
STAMP="$(date +%Y%m%d-%H%M%S)"

fail() {
  printf '[FAIL] %s\n' "$1"
  [ -n "${LOG:-}" ] && printf 'Log saved to: %s\n' "$LOG"
  exit 1
}

warn() { printf '[WARN] %s\n' "$1"; }
pass() { printf '[PASS] %s\n' "$1"; }
info() { printf '[INFO] %s\n' "$1"; }

mounted_volume_from_input() {
  raw="$1"
  [ -n "$raw" ] || return 1
  case "$raw" in
    /*) printf '%s\n' "$raw" ;;
    *)
      for base in "/Volumes" "/media/${USER:-}" "/run/media/${USER:-}" "/mnt"; do
        [ -d "$base/$raw" ] && printf '%s\n' "$base/$raw" && return 0
      done
      printf '/Volumes/%s\n' "$raw"
      ;;
  esac
}

find_fkd1_root() {
  local requested="${FKD1_ROOT:-${FKD1_DRIVE:-${OSCAR_MODEL_DRIVE:-}}}"
  if [ -n "$requested" ]; then
    local resolved
    resolved="$(mounted_volume_from_input "$requested" || true)"
    [ -n "$resolved" ] && [ -d "$resolved" ] && printf '%s\n' "$resolved" && return 0
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
  printf 'Mounted writable volumes right now:\n'
  df -h | awk 'NR==1 || $NF ~ /^\/Volumes\// || $NF ~ /^\/media\// || $NF ~ /^\/run\/media\// || $NF ~ /^\/mnt\// {print}'
}

require_free_space() {
  local path="$1" min_gb="$2" avail_kb avail_gb
  avail_kb="$(df -Pk "$path" | awk 'NR==2 {print $4}')"
  [ -n "$avail_kb" ] || fail "Could not read free space for $path"
  avail_gb=$((avail_kb / 1024 / 1024))
  printf '[SPACE] FKD1 free space: %sGB available; %sGB required\n' "$avail_gb" "$min_gb"
  if [ "$avail_gb" -lt "$min_gb" ]; then
    fail "Not enough free space on FKD1. Free at least $((min_gb - avail_gb))GB and run again."
  fi
}

looks_like_ollama_store() {
  local p="$1"
  [ -n "$p" ] && [ -d "$p" ] && { [ -d "$p/manifests" ] || [ -d "$p/blobs" ]; }
}

count_ollama_store_models() {
  local p="$1"
  [ -n "$p" ] && [ -d "$p" ] || { echo 0; return; }
  if [ -d "$p/manifests" ]; then
    find "$p/manifests" -type f 2>/dev/null | wc -l | tr -d ' '
  else
    echo 0
  fi
}

detect_ollama_store() {
  local p
  for p in \
    "${OSCAR_MODEL_STORE:-}" \
    "${OLLAMA_MODELS:-}" \
    "$DRIVE_ROOT" \
    "$DRIVE_ROOT/ollama_data" \
    "$DRIVE_ROOT/OscarModels/ollama_data" \
    "$DRIVE_ROOT/Shared/models/ollama_data" \
    "$SCRIPT_DIR/Shared/models/ollama_data"; do
    if looks_like_ollama_store "$p"; then
      printf '%s\n' "$p"
      return 0
    fi
  done
  printf '%s\n' "$DRIVE_ROOT"
}

detect_gguf_store() {
  local p
  for p in \
    "${OSCAR_GGUF_STORE:-}" \
    "$DRIVE_ROOT" \
    "$DRIVE_ROOT/huggingface_gguf" \
    "$DRIVE_ROOT/OscarModels/huggingface_gguf" \
    "$DRIVE_ROOT/Shared/models/huggingface_gguf" \
    "$SCRIPT_DIR/Shared/models/huggingface_gguf"; do
    [ -n "$p" ] && [ -d "$p" ] || continue
    if find "$p" -maxdepth 5 -type f -iname '*.gguf' -print -quit 2>/dev/null | grep -q .; then
      printf '%s\n' "$p"
      return 0
    fi
  done
  printf '%s\n' "$DRIVE_ROOT"
}

detect_oscar_root() {
  local p found
  for p in \
    "${OSCAR_ROOT:-}" \
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

find_ollama_bin() {
  local p
  if command -v ollama >/dev/null 2>&1; then command -v ollama; return 0; fi
  for p in \
    "$DRIVE_ROOT/Shared/bin/ollama-darwin" \
    "${OSCAR_ROOT:-}/Shared/bin/ollama-darwin" \
    "$SCRIPT_DIR/Shared/bin/ollama-darwin"; do
    [ -n "$p" ] && [ -x "$p" ] && printf '%s\n' "$p" && return 0
  done
  return 1
}

DRIVE_ROOT="$(find_fkd1_root)" || {
  print_mounted_volumes
  fail "FKD1 drive is not mounted. Mount the drive named FKD1 or set FKD1_ROOT=/path/to/FKD1."
}
[ -d "$DRIVE_ROOT" ] || fail "Drive path does not exist: $DRIVE_ROOT"
touch "$DRIVE_ROOT/.oscar-model-write-test" 2>/dev/null || fail "FKD1 is not writable: $DRIVE_ROOT"
rm -f "$DRIVE_ROOT/.oscar-model-write-test"

LOG="$DRIVE_ROOT/oscar-all-llm-downloads-$STAMP.txt"
exec > >(tee "$LOG") 2>&1

OSCAR_ROOT="$(detect_oscar_root || true)"
SHARED="${OSCAR_ROOT:+$OSCAR_ROOT/Shared}"
[ -z "$SHARED" ] && SHARED="$DRIVE_ROOT/Shared"
MODEL_STORE="$(detect_ollama_store)"
GGUF_STORE="$(detect_gguf_store)"
RUNTIME="${OLLAMA_HOME:-$DRIVE_ROOT/.ollama-runtime}"
OLLAMA_BIN="$(find_ollama_bin || true)"

if [ "$OSCAR_ALLOW_ONLINE" = "1" ]; then
  REQUIRED_GB="$MIN_FREE_GB_ONLINE"
else
  REQUIRED_GB="$MIN_FREE_GB_OFFLINE"
fi
require_free_space "$DRIVE_ROOT" "$REQUIRED_GB"

mkdir -p "$MODEL_STORE" "$GGUF_STORE" "$RUNTIME/tmp" "$RUNTIME/runners" "$DRIVE_ROOT/.goat-logs" || fail "Could not create required FKD1 folders"
touch "$MODEL_STORE/.oscar-write-test" "$GGUF_STORE/.oscar-write-test" 2>/dev/null || fail "Target model folders are not writable"
rm -f "$MODEL_STORE/.oscar-write-test" "$GGUF_STORE/.oscar-write-test"

export FKD1_ROOT="$DRIVE_ROOT"
export GOAT_DATA_ROOT="$DRIVE_ROOT"
export GOAT_DOWNLOAD_DIR="${GOAT_DOWNLOAD_DIR:-$DRIVE_ROOT}"
export OSCAR_BRIDGE_WORKSPACE="$DRIVE_ROOT"
export OSCAR_TOOL_WORKSPACE="$DRIVE_ROOT"
export OSCAR_ASSET_ROOT="$DRIVE_ROOT"
export OSCAR_IMAGE_RENDER_ENDPOINT="${OSCAR_IMAGE_RENDER_ENDPOINT:-http://127.0.0.1:3344/api/draw}"
export GOAT_IMAGE_RENDER_ENDPOINT="${GOAT_IMAGE_RENDER_ENDPOINT:-$OSCAR_IMAGE_RENDER_ENDPOINT}"
export OSCAR_IMAGE_OUTPUT_DIR="${OSCAR_IMAGE_OUTPUT_DIR:-$DRIVE_ROOT}"
export OSCAR_OFFLINE="$OSCAR_OFFLINE"
export GOAT_OFFLINE="$OSCAR_OFFLINE"
export HF_HUB_OFFLINE="$OSCAR_OFFLINE"
export TRANSFORMERS_OFFLINE="$OSCAR_OFFLINE"
export OLLAMA_MODELS="$MODEL_STORE"
export OSCAR_MODEL_STORE="$MODEL_STORE"
export OSCAR_GGUF_STORE="$GGUF_STORE"
export OLLAMA_HOME="$RUNTIME"
export OLLAMA_RUNNERS_DIR="$RUNTIME/runners"
export OLLAMA_TMPDIR="$RUNTIME/tmp"
export OLLAMA_HOST="${OLLAMA_HOST:-127.0.0.1:11434}"
export OLLAMA_CONTEXT_LENGTH="${OLLAMA_CONTEXT_LENGTH:-32768}"
export OLLAMA_NUM_PARALLEL="${OLLAMA_NUM_PARALLEL:-1}"
export OLLAMA_MAX_LOADED_MODELS="${OLLAMA_MAX_LOADED_MODELS:-1}"

cat > "$DRIVE_ROOT/.oscar-fkd1.env" <<ENVFILE
# FKD1 Oscar/GOAT local model environment
export FKD1_ROOT="$DRIVE_ROOT"
export GOAT_DATA_ROOT="$DRIVE_ROOT"
export GOAT_DOWNLOAD_DIR="$GOAT_DOWNLOAD_DIR"
export OSCAR_BRIDGE_WORKSPACE="$DRIVE_ROOT"
export OSCAR_TOOL_WORKSPACE="$DRIVE_ROOT"
export OSCAR_ASSET_ROOT="$DRIVE_ROOT"
export OSCAR_IMAGE_RENDER_ENDPOINT="${OSCAR_IMAGE_RENDER_ENDPOINT:-http://127.0.0.1:3344/api/draw}"
export GOAT_IMAGE_RENDER_ENDPOINT="${GOAT_IMAGE_RENDER_ENDPOINT:-$OSCAR_IMAGE_RENDER_ENDPOINT}"
export OSCAR_IMAGE_OUTPUT_DIR="${OSCAR_IMAGE_OUTPUT_DIR:-$DRIVE_ROOT}"
export OSCAR_OFFLINE="$OSCAR_OFFLINE"
export GOAT_OFFLINE="$OSCAR_OFFLINE"
export HF_HUB_OFFLINE="$OSCAR_OFFLINE"
export TRANSFORMERS_OFFLINE="$OSCAR_OFFLINE"
export OLLAMA_MODELS="$OLLAMA_MODELS"
export OSCAR_MODEL_STORE="$OSCAR_MODEL_STORE"
export OSCAR_GGUF_STORE="$OSCAR_GGUF_STORE"
export OLLAMA_HOME="$OLLAMA_HOME"
export OLLAMA_RUNNERS_DIR="$OLLAMA_RUNNERS_DIR"
export OLLAMA_TMPDIR="$OLLAMA_TMPDIR"
export OLLAMA_HOST="$OLLAMA_HOST"
ENVFILE

printf '============================================================\n'
printf 'OSCAR FKD1 LOCAL MODEL SESSION\n'
printf '============================================================\n'
printf 'FKD1 root:      %s\n' "$DRIVE_ROOT"
printf 'Oscar root:     %s\n' "${OSCAR_ROOT:-not found yet}"
printf 'Model pack:     %s\n' "$MODEL_PACK"
printf 'Ollama store:   %s\n' "$MODEL_STORE"
printf 'GGUF store:     %s\n' "$GGUF_STORE"
printf 'Online allowed: %s\n' "$OSCAR_ALLOW_ONLINE"
printf 'Offline flags:  %s\n' "$OSCAR_OFFLINE"
printf 'Dry run:        %s\n' "$DRY_RUN"
printf 'Log:            %s\n' "$LOG"
printf '\n'

local_model_count="$(count_ollama_store_models "$MODEL_STORE")"
printf '[INFO] Local Ollama manifest files found: %s\n' "$local_model_count"
if find "$GGUF_STORE" -maxdepth 5 -type f -iname '*.gguf' -print -quit 2>/dev/null | grep -q .; then
  pass "GGUF files found on FKD1"
else
  warn "No .gguf files found in $GGUF_STORE"
fi

if [ -z "$OLLAMA_BIN" ]; then
  warn "Ollama binary not found. Put bundled Ollama under Shared/bin or install Ollama locally. No online install attempted."
elif [ "$RESTART_OLLAMA" = "1" ]; then
  info "Restarting local/bundled Ollama so it uses FKD1 model store."
  pkill -f "$OLLAMA_BIN" 2>/dev/null || true
  sleep 2
fi

if [ -n "$OLLAMA_BIN" ]; then
  if ! curl -fsS --max-time 5 "http://$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
    info "Starting Ollama against FKD1 model store."
    HOME="$RUNTIME" "$OLLAMA_BIN" serve > "$DRIVE_ROOT/.goat-logs/oscar-fkd1-ollama.log" 2>&1 &
    for _ in $(seq 1 60); do
      curl -fsS --max-time 5 "http://$OLLAMA_HOST/api/tags" >/dev/null 2>&1 && break
      sleep 1
    done
  fi

  if curl -fsS --max-time 5 "http://$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
    pass "Ollama is online locally at $OLLAMA_HOST using $OLLAMA_MODELS"
    "$OLLAMA_BIN" list 2>/dev/null || true
  else
    warn "Ollama did not come online. Check $DRIVE_ROOT/.goat-logs/oscar-fkd1-ollama.log"
  fi
fi

if [ "$DRY_RUN" = "1" ]; then
  printf '\n[DRY] Target folders are writable. No downloads will run.\n'
  exit 0
fi

if [ "$OSCAR_ALLOW_ONLINE" != "1" ]; then
  printf '\n[LOCAL ONLY] No internet downloads were started.\n'
  if [ "$local_model_count" -eq 0 ]; then
    warn "No Ollama models were detected. If the 29 models are already on FKD1, confirm the drive contains Ollama manifests/blobs or set OLLAMA_MODELS to the correct folder."
  else
    pass "Oscar can use the model store already on FKD1."
  fi
  printf '\nTo intentionally download missing models to FKD1, run:\n'
  printf '  cd %q && OSCAR_ALLOW_ONLINE=1 OSCAR_MODEL_PACK=%q bash ./OSCAR-START-ALL-LLM-DOWNLOADS.sh\n' "$SCRIPT_DIR" "$MODEL_PACK"
  exit 0
fi

[ -n "$SHARED" ] && [ -x "$SHARED/model_packs/install-goat-local-models.sh" ] || fail "Model pack installer missing: $SHARED/model_packs/install-goat-local-models.sh"

printf '\n[STEP] Pulling Oscar local model pack to FKD1: %s\n' "$MODEL_PACK"
bash "$SHARED/model_packs/install-goat-local-models.sh" "$MODEL_PACK"

if [ "$INCLUDE_EXPERIMENTAL" = "1" ]; then
  printf '\n[STEP] Pulling Oscar experimental model pack to FKD1.\n'
  bash "$SHARED/model_packs/install-goat-local-models.sh" experimental
fi

if [ "$INCLUDE_HF_GGUF" = "1" ]; then
  if [ -f "$SCRIPT_DIR/OSCAR-HUGGINGFACE-GGUF-PICKS.sh" ]; then
    printf '\n[STEP] Downloading/importing Oscar Hugging Face GGUF picks to FKD1.\n'
    bash "$SCRIPT_DIR/OSCAR-HUGGINGFACE-GGUF-PICKS.sh"
  else
    warn "OSCAR-HUGGINGFACE-GGUF-PICKS.sh not found; skipping GGUF downloads."
  fi
fi

printf '\n============================================================\n'
printf 'OSCAR MODEL SESSION COMPLETE\n'
printf '============================================================\n'
printf 'Ollama store: %s\n' "$MODEL_STORE"
printf 'GGUF store:   %s\n' "$GGUF_STORE"
printf 'Log:          %s\n' "$LOG"
printf '\nInstalled models visible to this Ollama session:\n'
[ -n "$OLLAMA_BIN" ] && "$OLLAMA_BIN" list 2>/dev/null || true
