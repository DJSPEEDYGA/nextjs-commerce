# FashionForge Studio - Complete Build Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Initial Setup](#initial-setup)
3. [Building for Windows](#building-for-windows)
4. [Building for macOS](#building-for-macos)
5. [Creating Portable Versions](#creating-portable-versions)
6. [Troubleshooting](#troubleshooting)
7. [Distribution](#distribution)

## 🖥️ System Requirements

### Development Machine
- **RAM:** 8GB minimum, 16GB recommended
- **Storage:** 10GB free space
- **OS:** Windows 10+, macOS 11+, or Linux

### Build Tools
- Node.js 20.x or higher
- Rust 1.70 or higher
- Git (for version control)

## 🚀 Initial Setup

### 1. Install Node.js
Download from: https://nodejs.org/
```bash
node --version  # Should show v20.x or higher
npm --version   # Should show v10.x or higher
```

### 2. Install Rust
**Windows:**
- Download from: https://rustup.rs/
- Run the installer
- Restart terminal

**macOS/Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustc --version  # Verify installation
```

### 3. Install Platform-Specific Dependencies

**Windows:**
- Install Visual Studio C++ Build Tools
- Download: https://visualstudio.microsoft.com/visual-cpp-build-tools/
- Select "Desktop development with C++"

**macOS:**
```bash
xcode-select --install
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

### 4. Clone/Extract Project
```bash
cd FashionForge-Studio
npm install
```

## 🪟 Building for Windows

### Windows 64-bit (Recommended)
```bash
# Install target
rustup target add x86_64-pc-windows-msvc

# Build
npm run tauri:build:win64
```

**Output Location:**
```
src-tauri/target/x86_64-pc-windows-msvc/release/bundle/
├── msi/
│   └── FashionForge Studio_1.0.0_x64_en-US.msi
└── nsis/
    └── FashionForge Studio_1.0.0_x64-setup.exe
```

### Windows 32-bit
```bash
# Install target
rustup target add i686-pc-windows-msvc

# Build
npm run tauri:build:win32
```

**Output Location:**
```
src-tauri/target/i686-pc-windows-msvc/release/bundle/
├── msi/
│   └── FashionForge Studio_1.0.0_x86_en-US.msi
└── nsis/
    └── FashionForge Studio_1.0.0_x86-setup.exe
```

### Windows Portable Version
The `.exe` file in the release folder is already portable:
```
src-tauri/target/release/FashionForge Studio.exe
```

Simply copy this file to any location or USB drive.

## 🍎 Building for macOS

### macOS Intel (x86_64)
```bash
# Install target
rustup target add x86_64-apple-darwin

# Build
npm run tauri:build:mac-intel
```

**Output Location:**
```
src-tauri/target/x86_64-apple-darwin/release/bundle/
├── dmg/
│   └── FashionForge Studio_1.0.0_x64.dmg
└── macos/
    └── FashionForge Studio.app
```

### macOS Apple Silicon (ARM64)
```bash
# Install target
rustup target add aarch64-apple-darwin

# Build
npm run tauri:build:mac-silicon
```

**Output Location:**
```
src-tauri/target/aarch64-apple-darwin/release/bundle/
├── dmg/
│   └── FashionForge Studio_1.0.0_aarch64.dmg
└── macos/
    └── FashionForge Studio.app
```

### macOS Universal Binary (Intel + Apple Silicon)
```bash
# Install both targets
rustup target add x86_64-apple-darwin
rustup target add aarch64-apple-darwin

# Build universal binary
npm run tauri:build:mac-universal
```

**Output Location:**
```
src-tauri/target/universal-apple-darwin/release/bundle/
├── dmg/
│   └── FashionForge Studio_1.0.0_universal.dmg
└── macos/
    └── FashionForge Studio.app
```

### macOS Code Signing (Optional)
For distribution outside the Mac App Store:

1. Get a Developer ID certificate from Apple
2. Add to tauri.conf.json:
```json
{
  "bundle": {
    "macOS": {
      "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)"
    }
  }
}
```

## 📦 Creating Portable Versions

### Windows Portable
The executable is already portable. To create a zip:
```bash
cd src-tauri/target/release
zip -r FashionForge-Studio-Portable-Windows.zip "FashionForge Studio.exe"
```

### macOS Portable
The .app bundle is portable. To create a zip:
```bash
cd src-tauri/target/release/bundle/macos
zip -r FashionForge-Studio-Portable-macOS.zip "FashionForge Studio.app"
```

## 🔧 Build Optimization

### Reduce Bundle Size
In `src-tauri/Cargo.toml`, the release profile is already optimized:
```toml
[profile.release]
panic = "abort"
codegen-units = 1
lto = true
opt-level = "z"
strip = true
```

### Frontend Optimization
The Vite build is already optimized. For further optimization:
```bash
# Analyze bundle size
npm run build -- --mode production
```

## 🐛 Troubleshooting

### Issue: "Rust not found"
**Solution:**
```bash
# Restart terminal after installing Rust
# Or manually source:
source $HOME/.cargo/env  # macOS/Linux
# Windows: Restart terminal
```

### Issue: "WebKit not found" (Linux)
**Solution:**
```bash
sudo apt install libwebkit2gtk-4.0-dev
```

### Issue: Build fails on Windows
**Solution:**
- Ensure Visual Studio C++ Build Tools are installed
- Restart terminal after installation
- Try running as Administrator

### Issue: "Permission denied" on macOS
**Solution:**
```bash
chmod +x src-tauri/target/release/bundle/macos/FashionForge\ Studio.app/Contents/MacOS/FashionForge\ Studio
```

### Issue: Large bundle size
**Solution:**
- Ensure you're building in release mode
- Check that LTO is enabled in Cargo.toml
- Remove unused dependencies

### Issue: Slow build times
**Solution:**
```bash
# Use more CPU cores
export CARGO_BUILD_JOBS=8

# Enable incremental compilation (dev only)
export CARGO_INCREMENTAL=1
```

## 📤 Distribution

### Windows Distribution
1. **MSI Installer** - Professional installation experience
2. **NSIS Installer** - Lightweight alternative
3. **Portable EXE** - No installation required

**Recommended:** MSI for enterprise, Portable for personal use

### macOS Distribution
1. **DMG** - Standard macOS distribution format
2. **App Bundle** - Direct .app file

**Recommended:** DMG for public distribution

### Code Signing

**Windows:**
```bash
# Sign with SignTool (requires certificate)
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com "FashionForge Studio.exe"
```

**macOS:**
```bash
# Sign with codesign (requires Developer ID)
codesign --deep --force --verify --verbose --sign "Developer ID Application: Your Name" "FashionForge Studio.app"
```

### Notarization (macOS)
For distribution outside Mac App Store:
```bash
# Create zip
ditto -c -k --keepParent "FashionForge Studio.app" FashionForge-Studio.zip

# Submit for notarization
xcrun notarytool submit FashionForge-Studio.zip --apple-id your@email.com --team-id TEAM_ID --password app-specific-password

# Staple notarization
xcrun stapler staple "FashionForge Studio.app"
```

## 📊 Build Verification

### Test Checklist
- [ ] Application launches successfully
- [ ] All pages load without errors
- [ ] 3D viewport renders correctly
- [ ] AI features work (with API keys)
- [ ] File operations work
- [ ] Settings persist
- [ ] Export functions work
- [ ] No console errors

### Performance Benchmarks
- **Startup Time:** < 2 seconds
- **Memory Usage:** < 500MB idle
- **3D Rendering:** 60 FPS at 1080p
- **Bundle Size:** < 100MB installed

## 🎯 Release Checklist

Before releasing:
- [ ] Update version in package.json
- [ ] Update version in Cargo.toml
- [ ] Update version in tauri.conf.json
- [ ] Test on clean systems
- [ ] Verify all features work
- [ ] Check for console errors
- [ ] Test installers
- [ ] Create release notes
- [ ] Sign binaries (if applicable)
- [ ] Create distribution packages

## 📝 Version Management

Update versions in:
1. `package.json` - "version": "1.0.0"
2. `src-tauri/Cargo.toml` - version = "1.0.0"
3. `src-tauri/tauri.conf.json` - "version": "1.0.0"

## 🚢 Continuous Integration

For automated builds, consider:
- GitHub Actions
- GitLab CI
- Jenkins
- CircleCI

Example GitHub Actions workflow available in `.github/workflows/build.yml`

## 📞 Support

For build issues:
1. Check this guide
2. Review error messages
3. Check Tauri documentation: https://tauri.app/
4. Contact development team

---

**Happy Building! 🎉**