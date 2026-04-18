# 🐐 GOAT Royalty Empire — Monorepo

**Owner:** DJ Speedy / GOAT Force
**Partner:** Sony via The Orchard
*"IF YOU CAN THINK IT! You CAN DO IT IN THE APP"*

---

## 📖 What Is This

This is the permanent home of the entire GOAT Royalty ecosystem. Every app, every dataset, every server config, every doc — all in one monorepo so **nothing is ever lost** between sessions or agents.

**Current location:** `DJSPEEDYGA/nextjs-commerce` → branch `goat-royalty-empire` → folder `goat-empire/`

> 💡 This can be split out to its own repo (`DJSPEEDYGA/goat-royalty-empire`) at any time via GitHub UI: **Settings → Extract subdirectory to new repository**.

---

## 🗂️ Structure

```
goat-empire/
├── README.md              ← This file
├── TODO.md                ← What's left to build (agents read this)
├── DONE.md                ← What's been completed (agents don't redo)
├── apps/
│   ├── super-goat-desktop/   ← Electron app (EXE/DMG/Portable) — BUILT ✅
│   ├── web-commerce/         ← Next.js commerce site (placeholder)
│   ├── goat-royalty-usb/     ← USB Portable Edition (from other timeline)
│   └── mobile/               ← iOS/Android (future)
├── data/
│   ├── raw/                  ← Original Excel/CSV catalog files
│   └── processed/            ← Clean unified-catalog.json
├── servers/
│   ├── server-1-main/        ← 93.127.214.171 deploy configs
│   └── server-2-gaming/      ← 72.61.193.184 FiveM/gaming configs
├── docs/
│   ├── DEPLOYMENT.md
│   ├── ROADMAP.md
│   ├── ARCHITECTURE.md
│   ├── INVESTOR_DECK.md
│   └── LEGAL.md
├── lib/                      ← Shared libraries (RAG, LLM, royalty calc)
├── models/                   ← AI model Modelfiles (Ollama)
└── scripts/
    ├── setup.sh
    ├── deploy-server-1.sh
    └── deploy-server-2.sh
```

---

## 🚀 Quick Start for Any New AI Agent / Session

Paste this as your first message in any new SuperNinja / Cursor / Claude session:

```
Continue GOAT Royalty Empire build.

Repo: https://github.com/DJSPEEDYGA/nextjs-commerce
Branch: goat-royalty-empire
Folder: goat-empire/

1. Clone the branch.
2. Read goat-empire/TODO.md (what's left).
3. Read goat-empire/DONE.md (what's complete — don't redo).
4. Resume from the highest priority [ ] item in TODO.md.
5. Mark items [x] in TODO.md as you finish. Append to DONE.md.
6. Commit + push after each major task.
```

---

## ⚡ Build the Desktop App Right Now

```bash
cd goat-empire/apps/super-goat-desktop
bash build.sh          # macOS/Linux
# or
build.bat              # Windows
```

Outputs EXE + DMG + Portable in `dist/`.

---

## 🖥️ Servers

- **Server 1 (Main App):** `93.127.214.171` — Ubuntu 24.04 LTS (KVM 8)
- **Server 2 (Gaming):** `72.61.193.184` — Ubuntu 24.04 + Docker + Traefik (KVM 2)

Deploy scripts live in `servers/`. Do not commit credentials — use SSH keys via `~/.ssh/`.

---

## 📜 License

Proprietary — © 2025 DJ Speedy / GOAT Force. All rights reserved.