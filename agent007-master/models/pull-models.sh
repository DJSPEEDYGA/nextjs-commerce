#!/usr/bin/env bash
# Pull the Ollama models Agent-007 uses. Edit MODELS to match your hardware.
# Usage:  bash pull-models.sh
set -u

MODELS=(
  "llama3"
  "mistral"
  "codellama"
  # "llava"          # uncomment for vision
  # "llama3:70b"     # big rigs only
)

if ! command -v ollama >/dev/null 2>&1; then
  echo "❌ ollama not found. Install it first (install.sh handles this)." >&2
  exit 1
fi

echo "🕵️  Agent-007 — pulling ${#MODELS[@]} Ollama model(s)..."
for m in "${MODELS[@]}"; do
  echo "  ⬇  ollama pull $m"
  ollama pull "$m" || echo "  ⚠️  failed to pull $m (skipping)"
done

echo "✅ Done. Installed models:"
ollama list
