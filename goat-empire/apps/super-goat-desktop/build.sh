#!/usr/bin/env bash
# ============================================================
# SUPER GOAT ROYALTY APP — One-Click Build Script
# Builds: EXE (Windows), DMG (macOS), Portable (Linux/Windows)
# Usage:  bash build.sh           → build for current platform
#         bash build.sh all       → build for all platforms
#         bash build.sh win       → Windows EXE + Portable
#         bash build.sh mac       → macOS DMG
#         bash build.sh linux     → Linux AppImage + tar.gz
# ============================================================
set -e

echo ""
echo "🐐 ============================================"
echo "🐐  SUPER GOAT ROYALTY APP — FINAL LLM BUILD"
echo "🐐  by DJ Speedy / GOAT Force"
echo "🐐 ============================================"
echo ""

# Check Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js not found. Install Node 18+ from https://nodejs.org"
  exit 1
fi
echo "✔ Node: $(node -v)"
echo "✔ npm:  $(npm -v)"
echo ""

# Install dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
else
  echo "✔ Dependencies already installed"
fi
echo ""

TARGET="${1:-current}"
echo "🚀 Building target: $TARGET"
echo ""

case "$TARGET" in
  all)     npm run build:all ;;
  win)     npm run build:win ;;
  mac)     npm run build:mac ;;
  linux)   npm run build:linux ;;
  current|*) npm run build ;;
esac

echo ""
echo "✅ ============================================"
echo "✅  BUILD COMPLETE"
echo "✅  Output: ./dist/"
echo "✅ ============================================"
ls -lh dist/ 2>/dev/null || true