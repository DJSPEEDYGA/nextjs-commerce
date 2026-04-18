# 🐐 Super GOAT Royalty App — Final LLM Edition

**By DJ Speedy / GOAT Force**
*"IF YOU CAN THINK IT! You CAN DO IT IN THE APP"*

All-in-one desktop application combining:
- 💰 **Royalty Tracking** — Spotify, YouTube, Apple Music, Sony/The Orchard, Stripe, Amazon
- ⛓️ **Public Blockchain Ledger** — independent royalty verification on Polygon/Ethereum
- 🧠 **Super LLM (215 models fused)** — consensus router across all major LLMs
- ⛏️ **Crypto & Bitcoin Mining** — BTC, ETH, XMR with unified dashboard
- 📡 **DSP Distribution** — 237 DSPs loaded from Google Sheets database
- 🎬 **Video Editor 3D** — Filmora-class with 3D FX, color grading, 4K export
- 🔗 **Integrations** — YouTube, Spotify, Stripe, Sony/Orchard, Blockchain bridge
- 🔒 **Standalone** — no login required, all tools ready out of the box

---

## ⚡ One-Click Build (Copy-Paste)

### macOS / Linux
```bash
cd super-goat-app
bash build.sh
```

### Windows (CMD / PowerShell)
```cmd
cd super-goat-app
build.bat
```

### Build for a specific platform
```bash
bash build.sh win     # Windows EXE + Portable
bash build.sh mac     # macOS DMG
bash build.sh linux   # Linux AppImage + tar.gz
bash build.sh all     # Everything
```

---

## 📦 Outputs (in `./dist/`)

| Platform | File | Type |
|----------|------|------|
| Windows  | `SuperGOATRoyaltyApp-1.0.0-x64.exe`          | NSIS installer |
| Windows  | `SuperGOATRoyaltyApp-Portable-1.0.0.exe`     | Portable — no install |
| macOS    | `SuperGOATRoyaltyApp-1.0.0-x64.dmg`          | Intel DMG |
| macOS    | `SuperGOATRoyaltyApp-1.0.0-arm64.dmg`        | Apple Silicon DMG |
| Linux    | `SuperGOATRoyaltyApp-1.0.0-x64.AppImage`     | Portable |
| Linux    | `SuperGOATRoyaltyApp-1.0.0-x64.tar.gz`       | Portable archive |

---

## 🏃 Run in Dev Mode

```bash
npm install
npm start
```

---

## 🛠️ Requirements

- **Node.js 18+** (https://nodejs.org)
- **npm 9+**
- ~2 GB disk space for build artifacts
- For macOS DMG builds → must build on macOS
- For Windows EXE → can cross-build from macOS/Linux with Wine, or build natively on Windows

---

## 📂 Project Structure

```
super-goat-app/
├── package.json              # Electron + electron-builder config
├── build.sh                  # One-click build (macOS/Linux)
├── build.bat                 # One-click build (Windows)
├── README.md                 # This file
├── src/
│   ├── main/
│   │   ├── main.js           # Electron main process
│   │   └── preload.js        # Secure IPC bridge
│   └── renderer/
│       ├── index.html        # UI shell
│       ├── styles.css        # GOAT dark theme
│       └── app.js            # All 9 modules
└── assets/
    └── icon.png              # App icon
```

---

## 🔐 Data & Privacy

- **100% local.** No server, no login, no telemetry.
- Settings stored in your OS user-data folder.
- Blockchain verification uses public Polygon/Ethereum — anyone can audit.
- Royalty data pulls from your own API keys (set in Settings).

---

## 🎯 Modules Overview

### 1. Dashboard
Unified view: total royalties, active DSPs, hash rate, LLM status.

### 2. Royalty Tracker
Per-source breakdown (Spotify, YouTube, Sony/Orchard, Stripe…) + per-track earnings with on-chain hashes.

### 3. Blockchain Ledger
Anchor royalty batches to Polygon. Public contract for independent verification.

### 4. Super LLM (215)
Intelligent router dispatches each prompt across 215 models, returns a consensus-fused answer.

### 5. Crypto Mining
BTC / ETH / XMR rigs. Hash routing sliders. Mining earnings auto-anchored on the royalty ledger.

### 6. DSP Distribution
237 DSPs synced from Google Sheets. One-click push to all distributors (Sony/Orchard lead).

### 7. Video Editor 3D
NLE timeline, 3D FX library (Filmora-class), 4K H.265 export presets for YouTube/TikTok/Reels.

### 8. Integrations
Status cards for all external services — manage & re-sync.

### 9. Settings
Artist profile, royalty wallet, Google Sheets DSP URL — all stored locally.

---

## 📜 License

Proprietary — © 2025 DJ Speedy / GOAT Force. All rights reserved.
Partner: Sony via The Orchard.