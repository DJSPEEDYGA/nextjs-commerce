#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$ROOT/agent-007-storage-common.sh"
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"
[ -f "$ROOT/.agent-007-one-folder.env" ] && . "$ROOT/.agent-007-one-folder.env"

printf 'AGENT-007 ONE-FOLDER MODEL SESSION\n'
printf 'Root:         %s\n' "$AGENT_007_HOME"
printf 'Ollama store: %s\n' "$OLLAMA_MODELS"
printf 'GGUF store:   %s\n' "$AGENT_007_GGUF_STORE"
printf 'Online flag:  AGENT_007_ALLOW_ONLINE=%s\n' "${AGENT_007_ALLOW_ONLINE:-0}"
printf '\n'

mkdir -p "$OLLAMA_MODELS" "$AGENT_007_GGUF_STORE" "$AGENT_007_LOG_DIR"
touch "$OLLAMA_MODELS/.write-test" "$AGENT_007_GGUF_STORE/.write-test"
rm -f "$OLLAMA_MODELS/.write-test" "$AGENT_007_GGUF_STORE/.write-test"
printf '[OK] Model folders are writable and routed inside one folder.\n'

if [ "${AGENT_007_ALLOW_ONLINE:-0}" != "1" ]; then
  printf '[OFFLINE] Downloads are blocked by default. Existing local models only.\n'
  if command -v ollama >/dev/null 2>&1; then
    OLLAMA_MODELS="$OLLAMA_MODELS" ollama list || true
  else
    printf '[WARN] ollama command not found. Put/install Ollama for this platform to list or pull models.\n'
  fi
  printf '\nTo intentionally download missing models into this one folder, rerun like this:\n'
  printf '  cd %q && AGENT_007_ALLOW_ONLINE=1 bash ./AGENT-007-START-ALL-LLM-DOWNLOADS-ONE-FOLDER.sh\n' "$AGENT_007_HOME"
  exit 0
fi

if ! command -v ollama >/dev/null 2>&1; then
  printf '[FAIL] ollama command not found. Install/place Ollama for this platform first.\n' >&2
  exit 1
fi

if ! curl -fsS --max-time 5 "http://${OLLAMA_HOST}/api/tags" >/dev/null 2>&1; then
  printf '[START] Starting Ollama with one-folder model store.\n'
  HOME="$OLLAMA_HOME" OLLAMA_MODELS="$OLLAMA_MODELS" ollama serve > "$AGENT_007_LOG_DIR/ollama-download-session.log" 2>&1 &
  sleep 5
fi

MODELS_DEFAULT="${OSCAR_MODEL_LIST:-gemma3:4b llama3.1:8b mistral:7b qwen2.5:7b}"
printf '[INFO] Pull list: %s\n' "$MODELS_DEFAULT"
for model in $MODELS_DEFAULT; do
  printf '\n[PULL] %s -> %s\n' "$model" "$OLLAMA_MODELS"
  OLLAMA_MODELS="$OLLAMA_MODELS" ollama pull "$model"
done
printf '\n[OK] Model pull session complete.\n'
OLLAMA_MODELS="$OLLAMA_MODELS" ollama list || true
