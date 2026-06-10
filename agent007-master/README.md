# 🕵️ Agent-007 — Master Drop-and-Deploy Folder

**One folder. Everything Agent-007 needs. Drop it on any machine, run one script, done.**

This is the single source of truth for Agent-007 (GOAT Royalty Force local AI).
Its permanent home is the **WD MyCloud** — every machine (Mac, Windows PCs,
Jetson Thor/Orin) pulls from here. After deploying, you can delete the scattered
duplicates and free up space.

> Models (Ollama LLMs + Stable Diffusion checkpoints) are **multi-GB** and are
> NOT stored in git. The install scripts **pull/copy them automatically**. This
> folder ships the *code, configs, and installers* — small and version-controlled.

---

## What's in here

```
agent007-master/
├── README.md              ← you are here
├── VERSION                ← version stamp
├── install.sh             ← universal installer (macOS / Linux / Jetson)
├── install.ps1            ← Windows installer
├── config/
│   └── agent007.env.example   ← copy to agent007.env and edit
├── models/
│   ├── MODELS.md          ← which models 007 uses + sizes
│   └── pull-models.sh     ← ollama pull + SD checkpoint fetch
└── scripts/
    ├── deploy-to-mycloud.sh   ← rsync this whole kit → WD MyCloud
    ├── start-agent007.sh      ← launch the engine (macOS/Linux)
    └── sync-core.sh           ← copy latest agent code from the repo
```

The actual Agent-007 engine code lives in the repo at
`web-app/usb-ai/Shared/` (chat_server.py + modules). `sync-core.sh` copies it
into `agent007-master/core/` so the master folder is self-contained on MyCloud.

---

## Quick start

### 1. Build the kit (one time, from the repo)
```bash
cd agent007-master
bash scripts/sync-core.sh        # pulls chat_server.py + modules into core/
```

### 2. Put it on WD MyCloud (permanent home)
```bash
bash scripts/deploy-to-mycloud.sh 192.168.1.50 Agent007   # <ip> <share>
```

### 3. Deploy to any machine (pull from MyCloud, then install)
**Mac / Linux / Jetson:**
```bash
bash install.sh
```
**Windows (PowerShell as admin):**
```powershell
./install.ps1
```

### 4. Run him
```bash
bash scripts/start-agent007.sh
```
Then the GOAT Royalty App sees Agent-007 on `http://127.0.0.1:3333`.

---

## Drive space needed

| Component | Size |
|-----------|------|
| This kit (code + configs + installers) | ~30 MB |
| Python + Node deps | ~500 MB |
| Ollama models (per 7B–13B) | 4–8 GB each |
| Stable Diffusion checkpoint | 2–7 GB |
| Voice library (optional) | varies |
| **Conservative (3 models)** | **~20–30 GB** |
| **Full stack (6+ models + SD)** | **~60–80 GB** |

WD MyCloud has 2.3 TB free — plenty.
