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

## ⚡ Lightning AI — Model APIs

Unified access to 14+ AI models from Lightning AI, OpenAI, and Google through a single API key with consolidated billing and usage tracking.

| Model | Provider | Input ⚡/M | Context | Throughput |
|---|---|---|---|---|
| GPT OSS 20B | Lightning AI | 0.05 | 128K | 6.43 tok/s |
| GPT OSS 120B | Lightning AI | 0.10 | 128K | 177.56 tok/s |
| Llama 3.3 70B | Lightning AI | 0.30 | 128K | 60.23 tok/s |
| DeepSeek V3.1 | Lightning AI | 0.32 | 164K | 90.23 tok/s |
| NVIDIA Nemotron 3 Super 120B | Lightning AI | 1.40 | 256K | 376.15 tok/s |
| GPT 5 nano | OpenAI | 0.05 | 400K | 107.33 tok/s |
| Gemini 3 Flash | Google | 0.50 | 1M | 159.34 tok/s |

📖 **[Full Model Catalog & Integration Guide →](lightning-ai/README.md)**

**Quick start:**
```bash
cd lightning-ai && chmod +x scripts/setup.sh && ./scripts/setup.sh
python scripts/model-selector.py --list-models
python scripts/model-selector.py --task chat --budget 0.50
```

---

## 🔗 AI Stack Integration Map

| Component | Directory | Description |
|---|---|---|
| ⚡ Lightning AI Models | [`lightning-ai/`](lightning-ai/) | Unified model API gateway (14+ models) |
| 🤖 NeMo Agent Toolkit | [`nemo-agent-toolkit/`](nemo-agent-toolkit/) | NVIDIA NAT 1.5 agent workflows |
| 🧠 NVIDIA Nemotron | [`nvidia-nemotron/`](nvidia-nemotron/) | Nemotron-3-Nano-30B MoE model |
| 🐚 OpenShell | [`openshell/`](openshell/) | Secure Python sandbox runtime |
| 🗣️ NVIDIA Speech | [`nvidia-speech/`](nvidia-speech/) | ASR, TTS, voice agents |
| 🤗 HuggingFace Models | [`huggingface-models/`](huggingface-models/) | 100+ trending models + LoRA art styles |

---

## 📄 License

Copyright © 2024 Life Imitates Art Inc. Nonprofit. All rights reserved.