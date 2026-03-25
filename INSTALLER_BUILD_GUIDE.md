# SUPER GOAT ROYALTIES - Desktop Installer Build Guide

This comprehensive guide covers building production-ready desktop installers for Windows, macOS, and Linux platforms.

## 📦 Supported Installer Formats

| Platform | Formats | Description |
|----------|---------|-------------|
| Windows | `.exe` (NSIS), Portable | Windows installer with uninstaller + standalone portable |
| macOS | `.dmg` | macOS disk image with drag-to-install |
| Linux | `.AppImage`, `.deb` | Universal AppImage + Debian/Ubuntu package |

---

## 🚀 Quick Start

### Option 1: GitHub Actions (Recommended for Cross-Platform)

The easiest way to build all platforms is using GitHub Actions:

1. **Push a version tag:**
   ```bash
   git tag v3.0.0
   git push origin v3.0.0
   ```

2. **Or manually trigger:**
   - Go to Actions → "Build Desktop Installers" → Run workflow

3. **Download artifacts:**
   - Artifacts are uploaded to the workflow run
   - Release is automatically created with all installers

### Option 2: Local Build (Single Platform)

Build installers for your current platform:

```bash
# Install dependencies
npm install

# Build for current platform
npm run electron:build

# Or specify platform
npm run electron:build:linux   # Linux
npm run electron:build:win     # Windows
npm run electron:build:mac     # macOS
```

---

## 🛠️ Detailed Build Instructions

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git** (for versioning)

#### Platform-Specific Requirements

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install -y imagemagick

# For .deb builds
sudo apt-get install -y fakeroot dpkg-deb
```

**Windows:**
- No additional requirements (native build)
- Visual Studio Build Tools (optional, for native modules)

**macOS:**
- Xcode Command Line Tools: `xcode-select --install`
- For signed builds: Apple Developer Certificate

---

### Building on Linux

```bash
# 1. Clone and install
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git
cd nextjs-commerce
npm install

# 2. Generate icons
./build-installers.sh

# 3. Build AppImage (recommended)
npm run electron:build:linux

# Output: dist/GOAT-Royalties-3.0.0.AppImage
```

The AppImage is a portable executable that runs on any Linux distribution.

### Building on Windows

```powershell
# 1. Install dependencies
npm install

# 2. Build NSIS installer + Portable
npm run electron:build:win

# Output:
#   dist/GOAT-Royalties-3.0.0-Setup.exe (NSIS installer)
#   dist/GOAT-Royalties-3.0.0-Portable.exe (Portable)
```

### Building on macOS

```bash
# 1. Install dependencies
npm install

# 2. Build DMG
npm run electron:build:mac

# Output: dist/GOAT-Royalties-3.0.0.dmg
```

#### macOS Code Signing (Optional)

For signed builds that don't show "unidentified developer" warnings:

```bash
# Set environment variables
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password

# Build with signing
npm run electron:build:mac
```

---

## 📁 Build Output Structure

```
dist/
├── GOAT-Royalties-3.0.0-Setup.exe      # Windows NSIS installer
├── GOAT-Royalties-3.0.0-Portable.exe   # Windows portable
├── GOAT-Royalties-3.0.0.dmg            # macOS disk image
├── GOAT-Royalties-3.0.0.AppImage       # Linux AppImage
├── GOAT-Royalties-3.0.0.deb            # Debian/Ubuntu package
├── win-unpacked/                        # Unpacked Windows build
├── linux-unpacked/                      # Unpacked Linux build
└── mac/                                 # Unpacked macOS build
```

---

## 🎨 Icon Generation

The build system automatically generates icons from `build/icon.ico`:

```bash
# Manual icon generation
./build-installers.sh

# Icons created:
#   build/icon.png       # Main PNG icon
#   build/icon.ico       # Windows icon (existing)
#   build/icons/         # Multiple sizes
```

### Custom Icons

Replace `build/icon.ico` with your custom icon:
- **Windows:** `build/icon.ico` (256x256 recommended)
- **macOS:** `build/icon.icns` (auto-generated from PNG)
- **Linux:** `build/icon.png` (auto-generated from ICO)

---

## 🔧 Build Script Usage

The master build script provides convenient commands:

```bash
# Build all platforms (requires cross-platform setup)
./build-installers.sh all

# Build specific platform
./build-installers.sh linux
./build-installers.sh win
./build-installers.sh mac

# Build portable versions only
./build-installers.sh portable

# Clean build artifacts
./build-installers.sh clean
```

---

## 🐳 Docker Build (Alternative)

For isolated, reproducible builds:

```dockerfile
# Build using Docker
FROM node:20-bookworm

RUN apt-get update && apt-get install -y \
    imagemagick \
    wine \
    wine32 \
    wine64 \
    xvfb

WORKDIR /app
COPY . .

RUN npm install
RUN DISPLAY=:99 npm run electron:build:all
```

```bash
docker build -t goat-royalties-builder .
docker run --rm -v $(pwd)/dist:/app/dist goat-royalties-builder
```

---

## ⚡ Performance Tips

1. **Cache npm dependencies:** Use `npm ci` instead of `npm install` in CI
2. **Parallel builds:** GitHub Actions builds all platforms simultaneously
3. **Incremental builds:** Electron caches downloads in `~/.cache/electron-builder`

---

## 🔐 Security Considerations

### Windows

- **Code Signing:** For trusted installs, sign with a code signing certificate
- **SmartScreen:** Unsigned builds may trigger Windows SmartScreen warnings

### macOS

- **Notarization:** Required for distribution outside App Store
- **Hardened Runtime:** Enable for notarization

```bash
# Notarization (macOS)
xcrun notarytool submit dist/GOAT-Royalties-3.0.0.dmg \
  --apple-id "your@email.com" \
  --team-id "YOURTEAMID" \
  --password "@keychain:AC_PASSWORD" \
  --wait
```

### Linux

- **No signing required** for AppImage
- **GPG signing** optional for .deb packages

---

## 📤 Distribution

### GitHub Releases

The GitHub Actions workflow automatically creates releases with all installers attached.

### Direct Distribution

- **AppImage:** Upload as-is, users make executable (`chmod +x`)
- **Windows:** Upload both NSIS and Portable versions
- **macOS:** Upload DMG, consider notarizing first

### Auto-Update (Optional)

To enable auto-updates, integrate `electron-updater`:

```javascript
const { autoUpdater } = require('electron-updater')

autoUpdater.checkForUpdatesAndNotify()
```

---

## 🐛 Troubleshooting

### "wine is required" on Linux

For cross-platform builds on Linux, Wine is needed for Windows builds:
```bash
sudo apt-get install wine wine32 wine64
```

### Icon not showing

Ensure icons are in the correct format:
```bash
# Check icon
file build/icon.ico

# Regenerate
convert build/icon.ico build/icon.png
```

### Build fails with "cannot execute"

On Linux, ensure Wine has a display server:
```bash
Xvfb :99 -screen 0 1024x768x24 &
export DISPLAY=:99
npm run electron:build:win
```

### macOS "unidentified developer"

This requires code signing and notarization. See the macOS Code Signing section above.

---

## 📋 Build Checklist

Before releasing:

- [ ] Update version in `package.json`
- [ ] Test application with `npm run electron`
- [ ] Verify icons display correctly
- [ ] Build all target platforms
- [ ] Test installers on clean machines
- [ ] Sign Windows build (optional)
- [ ] Notarize macOS build (optional)
- [ ] Create GitHub release with notes

---

## 📞 Support

For issues with builds:
1. Check this documentation
2. Search existing GitHub issues
3. Create a new issue with build logs attached

---

**Last Updated:** March 2025  
**Version:** 3.0.0