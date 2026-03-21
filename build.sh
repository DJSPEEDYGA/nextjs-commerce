#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════╗
# ║  🐐 SUPER GOAT ROYALTY APP — Build Script v5.0.0                ║
# ║  Builds standalone desktop executables (EXE, DMG, AppImage)      ║
# ╠══════════════════════════════════════════════════════════════════╣
# ║  Usage:                                                          ║
# ║    ./build.sh            — Build for current platform            ║
# ║    ./build.sh win        — Build Windows EXE + Portable          ║
# ║    ./build.sh linux      — Build Linux AppImage + DEB            ║
# ║    ./build.sh mac        — Build macOS DMG                       ║
# ║    ./build.sh all        — Build for all platforms               ║
# ╚══════════════════════════════════════════════════════════════════╝

set -e
echo "🐐 ══════════════════════════════════════════════"
echo "🐐  SUPER GOAT ROYALTY APP — Build System v5.0.0"
echo "🐐 ══════════════════════════════════════════════"
echo ""

# Ensure dependencies
echo "📦 Installing dependencies..."
npm install

# Create build directory with icon placeholder
mkdir -p build
if [ ! -f build/icon.png ]; then
    echo "⚠️  No icon found — using placeholder. Add build/icon.png (256x256+) for custom icon"
fi

TARGET=${1:-$(uname -s | tr '[:upper:]' '[:lower:]')}

case "$TARGET" in
    win|windows)
        echo "🪟 Building for Windows..."
        npx electron-builder --win --x64
        echo "✅ Windows build complete — check dist/ folder"
        ;;
    linux)
        echo "🐧 Building for Linux..."
        npx electron-builder --linux --x64
        echo "✅ Linux build complete — check dist/ folder"
        ;;
    mac|macos|darwin)
        echo "🍎 Building for macOS..."
        npx electron-builder --mac
        echo "✅ macOS build complete — check dist/ folder"
        ;;
    all)
        echo "🌍 Building for ALL platforms..."
        npx electron-builder --win --linux --x64
        echo "✅ All builds complete — check dist/ folder"
        # Note: macOS DMG can only be built on macOS
        echo "⚠️  macOS DMG requires building on a Mac"
        ;;
    *)
        echo "❌ Unknown target: $TARGET"
        echo "Usage: ./build.sh [win|linux|mac|all]"
        exit 1
        ;;
esac

echo ""
echo "🐐 Build artifacts:"
ls -la dist/*.exe dist/*.AppImage dist/*.dmg dist/*.deb 2>/dev/null || echo "   Check dist/ folder"
echo ""
echo "🐐 SUPER GOAT ROYALTY APP v5.0.0 — Build Complete! 🚀"