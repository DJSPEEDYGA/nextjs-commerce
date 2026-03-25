# SUPER GOAT ROYALTIES APP - Installer Build Status

## 📦 Current Build Status

### ✅ Linux Installers (Ready Locally)

| File | Size | Status |
|------|------|--------|
| `GOAT-Royalties-3.0.0.AppImage` | 126 MB | ✅ Ready |
| `GOAT-Royalties-3.0.0-Linux-Portable.tar.gz` | 125 MB | ✅ Ready |

**Usage:**
```bash
# AppImage (recommended - works on all Linux distros)
chmod +x GOAT-Royalties-3.0.0.AppImage
./GOAT-Royalties-3.0.0.AppImage

# Portable tarball
tar -xzf GOAT-Royalties-3.0.0-Linux-Portable.tar.gz
./linux-unpacked/super-goat-royalties
```

### 🔄 Cross-Platform Build System

A GitHub Actions workflow has been set up to automatically build:
- **Windows**: NSIS installer + Portable .exe
- **macOS**: DMG installer
- **Linux**: AppImage + .deb package

**Trigger:** Push a version tag (e.g., `v4.0.2`)

## 🚀 How to Build All Platforms

### Option 1: GitHub Actions (Recommended)

```bash
# Create and push a version tag
git tag v4.0.2
git push origin v4.0.2

# Or manually trigger via GitHub UI:
# Actions → Build Desktop Installers → Run workflow
```

### Option 2: Local Build (Current Platform Only)

```bash
# Linux
npm run electron:build:linux

# Windows (on Windows)
npm run electron:build:win

# macOS (on Mac)
npm run electron:build:mac
```

### Option 3: Using the Build Script

```bash
chmod +x build-installers.sh
./build-installers.sh linux   # Build for Linux
./build-installers.sh all     # Build all platforms (requires Wine)
```

## 📁 Build Output Locations

```
dist/
├── GOAT-Royalties-5.0.0-Setup.exe      # Windows NSIS installer
├── GOAT-Royalties-5.0.0-Portable.exe   # Windows portable
├── GOAT-Royalties-5.0.0.dmg            # macOS disk image
├── GOAT-Royalties-5.0.0.AppImage       # Linux AppImage
├── GOAT-Royalties-5.0.0.deb            # Debian/Ubuntu package
└── linux-unpacked/                      # Unpacked Linux build
```

## 🔧 Build Configuration

The build is configured in `package.json` under the `"build"` key:

- **App ID**: `com.goatroyalties.superapp`
- **Product Name**: `SUPER GOAT Royalties`
- **Version**: 5.0.0 (from package.json)

## 📋 Features Included in Installers

- ✅ **10 AI Assistants** with unique personalities
- ✅ **6 AI Engines** (NVIDIA NIM, OpenRouter, Gemini, Lightning AI, Hugging Face, OpenShell)
- ✅ **Self-Healing Server** management
- ✅ **242 API Endpoints**
- ✅ **Voice Commands** integration
- ✅ **System Tray** integration
- ✅ **Real-time Dashboard**
- ✅ **Auto-Update Ready**

## ⚠️ Known Issues

1. **macOS Code Signing**: Requires Apple Developer certificate (optional, unsigned builds work)
2. **GitHub Artifact Storage**: Quota may be hit with large builds (wait 6-12 hours for reset)
3. **Windows SmartScreen**: Unsigned builds may show warning (users can click "Run anyway")

## 📤 Distribution

### Direct Download
Upload the built installers to:
- GitHub Releases
- AWS S3
- Google Drive
- Your website

### GitHub Releases
When a version tag is pushed, the workflow creates a GitHub Release with all installers attached.

## 🔐 Security Notes

- Rate limiting is enabled on API endpoints
- Environment variables are properly configured
- No hardcoded secrets in the codebase

---

**Last Updated:** March 2026  
**Version:** 5.0.0