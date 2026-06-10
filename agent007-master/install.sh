#!/usr/bin/env bash
# ============================================================
# Agent-007 — Universal Installer (macOS / Linux / Jetson)
# Run from inside the master folder:  bash install.sh
# ============================================================
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OS="$(uname -s)"
echo "🕵️  Agent-007 installer — detected: $OS"
echo "    Master folder: $HERE"
echo ""

# --- 1. Python ---
if ! command -v python3 >/dev/null 2>&1; then
  echo "📦 Installing Python3..."
  if [ "$OS" = "Darwin" ]; then
    command -v brew >/dev/null 2>&1 && brew install python || \
      echo "⚠️  Install Homebrew or Python manually: https://www.python.org"
  else
    sudo apt-get update -y && sudo apt-get install -y python3 python3-venv python3-pip
  fi
fi

# --- 2. Python venv + deps ---
echo "🐍 Setting up Python venv..."
python3 -m venv "$HERE/.venv"
# shellcheck disable=SC1091
source "$HERE/.venv/bin/activate"
pip install --upgrade pip >/dev/null
# chat_server.py is stdlib-based; install extras only if a requirements file exists.
if [ -f "$HERE/core/requirements.txt" ]; then
  pip install -r "$HERE/core/requirements.txt"
fi

# --- 3. Ollama (local LLM runtime) ---
if ! command -v ollama >/dev/null 2>&1; then
  echo "🧠 Installing Ollama..."
  if [ "$OS" = "Darwin" ]; then
    command -v brew >/dev/null 2>&1 && brew install ollama || \
      echo "⚠️  Download Ollama for Mac: https://ollama.com/download"
  else
    curl -fsSL https://ollama.com/install.sh | sh || \
      echo "⚠️  Ollama install failed — see https://ollama.com/download"
  fi
else
  echo "✅ Ollama already installed."
fi

# --- 4. Sync core code into the kit (if running from repo) ---
if [ -f "$HERE/scripts/sync-core.sh" ] && [ -d "$HERE/../web-app/usb-ai/Shared" ]; then
  echo "📦 Syncing latest Agent-007 core..."
  bash "$HERE/scripts/sync-core.sh" || echo "⚠️  sync-core skipped"
fi

# --- 5. Config ---
if [ ! -f "$HERE/config/agent007.env" ]; then
  cp "$HERE/config/agent007.env.example" "$HERE/config/agent007.env"
  echo "📝 Created config/agent007.env — edit it to set your voice / audio device / model."
fi

# --- 6. Pull models (start ollama service first) ---
echo "🧠 Pulling models (this is the big download)..."
if command -v ollama >/dev/null 2>&1; then
  (ollama serve >/dev/null 2>&1 &) ; sleep 3
  bash "$HERE/models/pull-models.sh" || echo "⚠️  Some models failed — rerun models/pull-models.sh later."
fi

echo ""
echo "============================================================"
echo "✅ Agent-007 installed."
echo "   Start him:   bash scripts/start-agent007.sh"
echo "   He'll be at: http://127.0.0.1:3333  (GOAT app auto-detects him)"
echo "============================================================"
