# 📦 SUPER GOAT ROYALTIES APP - Build & Installation Guide

## Overview
This guide covers building and installing the SUPER GOAT ROYALTIES APP on all platforms.

---

## 📥 Download & Install

### Windows
1. Download `SUPER-GOAT-ROYALTIES-Setup-5.1.0.exe`
2. Run the installer
3. Follow the setup wizard
4. Launch from desktop shortcut or Start menu

**Portable Version:**
1. Download `SUPER-GOAT-ROYALTIES-Portable-5.1.0.exe`
2. Place anywhere on your computer
3. Double-click to run (no installation needed)

### macOS
1. Download the appropriate DMG:
   - `SUPER-GOAT-ROYALTIES-5.1.0-x64.dmg` for Intel Macs
   - `SUPER-GOAT-ROYALTIES-5.1.0-arm64.dmg` for Apple Silicon (M1/M2/M3)
2. Open the DMG file
3. Drag the app to Applications folder
4. Launch from Applications

**Note:** First launch may show a security warning. Right-click → Open → Confirm.

### Linux

**AppImage (Recommended):**
```bash
# Download
wget https://github.com/DJSPEEDYGA/nextjs-commerce/releases/download/v5.1.0/SUPER-GOAT-ROYALTIES-5.1.0-x64.AppImage

# Make executable
chmod +x SUPER-GOAT-ROYALTIES-5.1.0-x64.AppImage

# Run
./SUPER-GOAT-ROYALTIES-5.1.0-x64.AppImage
```

**DEB (Debian/Ubuntu):**
```bash
# Download
wget https://github.com/DJSPEEDYGA/nextjs-commerce/releases/download/v5.1.0/SUPER-GOAT-ROYALTIES-5.1.0-x64.deb

# Install
sudo dpkg -i SUPER-GOAT-ROYALTIES-5.1.0-x64.deb

# Run
super-goat-royalties
```

**TAR.GZ (Portable):**
```bash
# Download and extract
wget https://github.com/DJSPEEDYGA/nextjs-commerce/releases/download/v5.1.0/SUPER-GOAT-ROYALTIES-5.1.0-x64.tar.gz
tar -xzvf SUPER-GOAT-ROYALTIES-5.1.0-x64.tar.gz

# Run
cd SUPER-GOAT-ROYALTIES-5.1.0
./SUPER\ GOAT\ ROYALTIES
```

---

## 🔨 Build from Source

### Prerequisites
- Node.js 18+ (22 recommended)
- npm 9+

### Build Steps
```bash
# Clone the repository
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git
cd nextjs-commerce

# Install dependencies
npm install

# Build for current platform
npm run electron:build

# Build for specific platforms
npm run electron:build:win    # Windows
npm run electron:build:mac    # macOS
npm run electron:build:linux  # Linux
npm run electron:build:all    # All platforms
```

### Output Files
Build artifacts are placed in the `dist/` directory:

| Platform | Files |
|----------|-------|
| Windows | `SUPER-GOAT-ROYALTIES-Setup-*.exe`, `SUPER-GOAT-ROYALTIES-Portable-*.exe` |
| macOS | `SUPER-GOAT-ROYALTIES-*-x64.dmg`, `SUPER-GOAT-ROYALTIES-*-arm64.dmg` |
| Linux | `SUPER-GOAT-ROYALTIES-*.AppImage`, `*.deb`, `*.tar.gz` |

---

## 🚀 Features

- **242 API Endpoints** - Full REST API for all operations
- **6 AI Engines** - NVIDIA NIM, OpenRouter, Gemini, DeepSeek, ACE SteerLM, OpenShell
- **Voice Commands** - Speech recognition and text-to-speech
- **Self-Healing System** - 52 monitored capabilities with automatic recovery
- **Real-time Dashboard** - Live royalty tracking and analytics
- **Multi-platform Support** - Windows, macOS, Linux

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the application directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# AI Services (Optional - for enhanced features)
NVIDIA_NIM_API_KEY=your_key
OPENROUTER_API_KEY=your_key
GEMINI_API_KEY=your_key

# Database (Optional)
DATABASE_URL=your_database_url
```

### Data Directory
The application stores data in:
- **Windows:** `%APPDATA%/SUPER GOAT Royalties/`
- **macOS:** `~/Library/Application Support/SUPER GOAT Royalties/`
- **Linux:** `~/.config/SUPER GOAT Royalties/`

---

## 📞 Support

- **GitHub Issues:** https://github.com/DJSPEEDYGA/nextjs-commerce/issues
- **Documentation:** https://github.com/DJSPEEDYGA/nextjs-commerce/wiki

---

## 📄 License

MIT License - Copyright © 2024-2025 DJSPEEDYGA