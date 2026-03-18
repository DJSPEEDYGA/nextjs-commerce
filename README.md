# Ms Money Penny Store — Desktop App

> **Life Imitates Art Inc. Nonprofit** — E-Commerce Store packaged as a standalone desktop application for Windows, macOS, and Linux.

![Ms Money Penny](static/logo.png)

---

## 📦 Downloads

Go to the [**Releases**](../../releases) page to download the latest builds:

| Platform | Format | File |
|----------|--------|------|
| **Windows 10/11** | Installer (.exe) | `Ms-Money-Penny-Store-Setup-x.x.x.exe` |
| **Windows 10/11** | Portable (.exe) | `Ms-Money-Penny-Store-Portable-x.x.x.exe` |
| **macOS** | Disk Image (.dmg) | `Ms-Money-Penny-Store-x.x.x.dmg` |
| **Linux** | AppImage | `Ms-Money-Penny-Store-x.x.x.AppImage` |
| **Linux** | Debian (.deb) | `ms-money-penny-store_x.x.x_amd64.deb` |
| **Linux** | Portable (.tar.gz) | `ms-money-penny-store-x.x.x.tar.gz` |

---

## 🚀 Getting Started

### Windows
- **Installer:** Run the `.exe` installer, follow the wizard, launch from Start Menu or Desktop shortcut.
- **Portable:** Just double-click the portable `.exe` — no installation needed!

### macOS
- Open the `.dmg`, drag **Ms Money Penny Store** into your Applications folder, and launch.

### Linux
- **AppImage:** `chmod +x *.AppImage && ./*.AppImage`
- **Debian:** `sudo dpkg -i *.deb`
- **Portable:** Extract the `.tar.gz` and run `./ms-money-penny-store`

---

## 🛠 Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
npm install
npm start
```

### Build locally
```bash
# Linux
npx electron-builder --linux

# Windows (requires Windows or Wine)
npx electron-builder --win

# macOS (requires macOS)
npx electron-builder --mac
```

---

## 🔄 CI/CD

Builds are automated via **GitHub Actions**. Push to the `desktop-app` branch or create a version tag (`v1.0.0`) to trigger builds for all 3 platforms.

Tagged releases automatically publish downloadable packages to GitHub Releases.

---

## 📄 License

Copyright © 2024 Life Imitates Art Inc. Nonprofit. All rights reserved.