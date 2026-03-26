# SUPER GOAT ROYALTIES APP - Installation Guide

## 🐐 The Ultimate AI-Powered Music Royalty Management Platform

Version 3.0.0 | [Website](https://www.goatroyaltyapp.org) | [Support](mailto:contact@goatroyaltyapp.org)

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Windows Installation](#windows-installation)
3. [macOS Installation](#macos-installation)
4. [Linux Installation](#linux-installation)
5. [Portable Version](#portable-version)
6. [Docker Installation](#docker-installation)
7. [Development Setup](#development-setup)
8. [Configuration](#configuration)
9. [Troubleshooting](#troubleshooting)
10. [Uninstallation](#uninstallation)

---

## System Requirements

### Minimum Requirements
- **CPU**: Dual-core 2.0 GHz or higher
- **RAM**: 4 GB minimum (8 GB recommended)
- **Disk Space**: 500 MB for installation + 1 GB for data
- **Network**: Broadband internet connection (for initial setup)
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

### Recommended Requirements
- **CPU**: Quad-core 3.0 GHz or higher
- **RAM**: 16 GB
- **Disk Space**: 10 GB SSD for optimal performance
- **Network**: Gigabit connection for large file operations

### Supported Operating Systems
- **Windows**: Windows 10 (64-bit) or Windows 11
- **macOS**: macOS 11 (Big Sur) or later (Intel and Apple Silicon)
- **Linux**: Ubuntu 20.04+, Debian 11+, Fedora 36+, or equivalent

---

## Windows Installation

### Method 1: EXE Installer (Recommended)

1. **Download the installer**
   - Go to [releases.goatroyaltyapp.org](https://releases.goatroyaltyapp.org)
   - Download `SUPER-GOAT-ROYALTIES-APP-3.0.0-x64-setup.exe`

2. **Run the installer**
   - Right-click the downloaded file and select "Run as administrator"
   - If prompted by Windows SmartScreen, click "More info" → "Run anyway"

3. **Follow the installation wizard**
   - Choose installation directory (default: `C:\Program Files\SUPER GOAT ROYALTIES APP`)
   - Select additional shortcuts (Desktop, Start Menu)
   - Click "Install" and wait for completion

4. **Launch the application**
   - Double-click the desktop shortcut, OR
   - Find "SUPER GOAT ROYALTIES APP" in the Start Menu
   - The application will start on `http://localhost:4001`

### Method 2: Portable Version

1. Download `SUPER-GOAT-ROYALTIES-APP-3.0.0-Portable.exe`
2. Place it in your preferred location (e.g., `C:\Apps\SUPER GOAT ROYALTIES\`)
3. Double-click to run (no installation required)
4. Data is stored in the same directory as the executable

### Silent Installation (For IT Administrators)

```powershell
# Silent install with default options
SUPER-GOAT-ROYALTIES-APP-3.0.0-x64-setup.exe /S

# Silent install with custom directory
SUPER-GOAT-ROYALTIES-APP-3.0.0-x64-setup.exe /S /D=D:\CustomPath
```

---

## macOS Installation

### Method 1: DMG Installer (Recommended)

1. **Download the DMG**
   - Go to [releases.goatroyaltyapp.org](https://releases.goatroyaltyapp.org)
   - Download the appropriate version:
     - Intel Macs: `SUPER-GOAT-ROYALTIES-APP-3.0.0-x64.dmg`
     - Apple Silicon: `SUPER-GOAT-ROYALTIES-APP-3.0.0-arm64.dmg`

2. **Open the DMG**
   - Double-click the downloaded `.dmg` file
   - A window will appear with the app and Applications folder

3. **Install the application**
   - Drag "SUPER GOAT ROYALTIES APP" to the "Applications" folder
   - Wait for the copy to complete

4. **First Launch**
   - Open Spotlight (Cmd+Space) and type "SUPER GOAT ROYALTIES"
   - If you see "cannot be opened because it is from an unidentified developer":
     - Go to System Preferences → Privacy & Security
     - Click "Open Anyway" next to the security message
     - Click "Open" in the confirmation dialog

### Method 2: Homebrew (Coming Soon)

```bash
brew install --cask goat-royalties-app
```

### Method 3: Portable Version

1. Download `SUPER-GOAT-ROYALTIES-APP-3.0.0-macos-portable.tar.gz`
2. Extract the archive
3. Open Terminal, navigate to the extracted folder
4. Run: `chmod +x start-mac-linux.sh && ./start-mac-linux.sh`

---

## Linux Installation

### Method 1: AppImage (Recommended)

AppImage runs on all Linux distributions without installation.

```bash
# Download
wget https://releases.goatroyaltyapp.org/linux/SUPER-GOAT-ROYALTIES-APP-3.0.0-x86_64.AppImage

# Make executable
chmod +x SUPER-GOAT-ROYALTIES-APP-3.0.0-x86_64.AppImage

# Run
./SUPER-GOAT-ROYALTIES-APP-3.0.0-x86_64.AppImage
```

### Method 2: DEB Package (Debian/Ubuntu)

```bash
# Download
wget https://releases.goatroyaltyapp.org/linux/super-goat-royalties-app_3.0.0_amd64.deb

# Install
sudo dpkg -i super-goat-royalties-app_3.0.0_amd64.deb

# Fix dependencies if needed
sudo apt-get install -f

# Run
super-goat-royalties
```

### Method 3: Tarball

```bash
# Download
wget https://releases.goatroyaltyapp.org/linux/super-goat-royalties-app-3.0.0-linux-x64.tar.gz

# Extract
tar -xzf super-goat-royalties-app-3.0.0-linux-x64.tar.gz

# Run
cd super-goat-royalties-app-3.0.0
./super-goat-royalties
```

### Method 4: From Source

```bash
# Clone repository
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git
cd nextjs-commerce

# Install dependencies
npm install

# Run in development
npm run dev

# OR build for production
npm run build
npm start
```

---

## Portable Version

The portable version runs on all platforms without installation.

### Features
- ✅ No installation required
- ✅ Runs from any location (USB drive, network share, etc.)
- ✅ Self-contained with all dependencies
- ✅ Data stored locally in application folder

### Usage

1. **Download** the portable package for your platform
2. **Extract** to your desired location
3. **Run** the appropriate launcher:
   - Windows: `START-WINDOWS.bat`
   - macOS/Linux: `./start-mac-linux.sh`
4. **Access** the application at `http://localhost:4001`

### First Run
On first run, the portable version will:
1. Check for Node.js (prompt to install if missing)
2. Install required dependencies
3. Start the server on port 4001

---

## Docker Installation

### Using Docker Compose (Recommended)

```yaml
# docker-compose.yml
version: '3.8'
services:
  goat-royalties:
    image: goatroyaltyapp/super-goat-royalties:latest
    container_name: super-goat-royalties
    ports:
      - "4001:4001"
    volumes:
      - ./data:/app/data
      - ./config:/app/config
    environment:
      - NODE_ENV=production
      - PORT=4001
    restart: unless-stopped
```

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Using Docker Directly

```bash
# Pull image
docker pull goatroyaltyapp/super-goat-royalties:latest

# Run container
docker run -d \
  --name super-goat-royalties \
  -p 4001:4001 \
  -v $(pwd)/data:/app/data \
  -e NODE_ENV=production \
  goatroyaltyapp/super-goat-royalties:latest

# View logs
docker logs -f super-goat-royalties
```

---

## Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git
cd nextjs-commerce

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:4001
```

### Build for Production

```bash
# Build all platforms
npm run build:all

# Build specific platform
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
npm run build:portable  # Portable
```

---

## Configuration

### Environment Variables

Create a `.env` file in the application directory:

```env
# Server Configuration
PORT=4001
NODE_ENV=production

# Optional: API Keys for enhanced features
GEMINI_API_KEY=your_gemini_key
NVIDIA_NIM_API_KEY=your_nvidia_key
OPENROUTER_API_KEY=your_openrouter_key
DID_API_KEY=your_did_key

# Storage Configuration
DATA_DIR=/path/to/data
LOG_LEVEL=info
```

### Configuration File

Edit `local-data/config/goat-config.json`:

```json
{
  "app": {
    "name": "SUPER GOAT ROYALTIES APP",
    "version": "3.0.0"
  },
  "server": {
    "port": 4001,
    "host": "localhost"
  },
  "features": {
    "voiceCommands": true,
    "selfHealing": true,
    "aiEngines": true
  }
}
```

---

## Troubleshooting

### Common Issues

#### "Port 4001 is already in use"
```bash
# Find process using port
# Windows
netstat -ano | findstr :4001

# macOS/Linux
lsof -i :4001

# Kill the process or change port
PORT=4002 npm start
```

#### "Node.js is not installed"
- Download from [nodejs.org](https://nodejs.org/)
- Install the LTS version (18.x or higher)
- Restart your terminal/command prompt

#### "Permission denied" (macOS/Linux)
```bash
chmod +x start-mac-linux.sh
chmod +x super-goat-royalties
```

#### "Cannot be opened because it is from an unidentified developer" (macOS)
```bash
# Allow the app
xattr -cr /Applications/SUPER\ GOAT\ ROYALTIES\ APP.app

# Or use System Preferences → Privacy & Security → Open Anyway
```

#### "Windows protected your PC"
- Click "More info"
- Click "Run anyway"

### Logs Location

- **Windows**: `%APPDATA%\SUPER GOAT ROYALTIES APP\logs\`
- **macOS**: `~/Library/Logs/SUPER GOAT ROYALTIES APP/`
- **Linux**: `~/.config/super-goat-royalties/logs/`
- **Portable**: `<app-directory>/logs/`

### Getting Help

- **Documentation**: [docs.goatroyaltyapp.org](https://docs.goatroyaltyapp.org)
- **Email**: support@goatroyaltyapp.org
- **GitHub Issues**: [github.com/DJSPEEDYGA/nextjs-commerce/issues](https://github.com/DJSPEEDYGA/nextjs-commerce/issues)

---

## Uninstallation

### Windows
1. Open Settings → Apps → Installed apps
2. Find "SUPER GOAT ROYALTIES APP"
3. Click Uninstall
4. Optionally delete `%APPDATA%\SUPER GOAT ROYALTIES APP` for complete removal

### macOS
1. Open Finder → Applications
2. Drag "SUPER GOAT ROYALTIES APP" to Trash
3. Empty Trash
4. Optionally delete `~/Library/Application Support/SUPER GOAT ROYALTIES APP`

### Linux

```bash
# DEB package
sudo dpkg --remove super-goat-royalties-app

# AppImage
rm SUPER-GOAT-ROYALTIES-APP-*.AppImage

# Tarball
rm -rf super-goat-royalties-app-*
```

### Docker

```bash
docker-compose down
docker rmi goatroyaltyapp/super-goat-royalties
```

---

## Support

- **Website**: [www.goatroyaltyapp.org](https://www.goatroyaltyapp.org)
- **Email**: contact@goatroyaltyapp.org
- **GitHub**: [github.com/DJSPEEDYGA/nextjs-commerce](https://github.com/DJSPEEDYGA/nextjs-commerce)

---

*Made with ❤️ by the GOAT Royalty Team*