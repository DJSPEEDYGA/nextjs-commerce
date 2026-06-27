<p align="center">
  <img src="AGENT-007-LOGO.svg" alt="AGENT-007 Logo" width="300"/>
</p>

# AGENT-007 — Local AI Operations Center

Scripts for deploying, downloading, and managing the **AGENT-007** AI system across
**multiple drives/storage locations**.

## Quick Start — The Main Launcher

```bash
bash AGENT-007-LAUNCH.sh
```

This is the **one script to rule them all**. It:
1. Loads your storage config (which drives store what)
2. Detects and mounts your NAS if available
3. Starts all services (Ollama, Drawing Bridge, GOAT, etc.)
4. Shows status of everything

Other launcher modes:
```bash
bash AGENT-007-LAUNCH.sh --status      # check what's running
bash AGENT-007-LAUNCH.sh --storage     # pick which drives store what
bash AGENT-007-LAUNCH.sh --nas-setup   # set up NAS folders
bash AGENT-007-LAUNCH.sh --test        # launch + run all tests
bash AGENT-007-LAUNCH.sh --stop        # stop everything
```

## Choose Your Drives

```bash
bash AGENT-007-CHOOSE-STORAGE.sh
```

This interactive tool:
1. Lists all mounted drives with free space
2. Lets you pick which drive for each data category (LLM models, image models, outputs, cache, etc.)
3. Writes `.agent-007-storage-config.env` so all Agent-007 scripts respect your choices

On Windows:
```powershell
powershell -ExecutionPolicy Bypass -File .\AGENT-007-CHOOSE-STORAGE.ps1
```

## Storage Categories

| Category | Description | Typical Size |
|----------|-------------|-------------|
| **LLM Models** | Ollama model blobs | ~400 GB (29-model pack) |
| **GGUF Models** | Hugging Face GGUF files | 10-100 GB |
| **Image Models** | Checkpoints, FLUX, LoRA, VAE, ControlNet | 20-200 GB |
| **Outputs** | Generated images, renders | Varies |
| **Downloads** | General downloads | Varies |
| **Cache** | HF cache, pip, torch | 5-50 GB |
| **Logs** | Service logs | Small |
| **Runtime** | Venvs, Ollama runtime, temp | 5-20 GB |
| **GOAT Data** | GOAT Royalty App data | 1-5 GB |

## How It Works

1. **`AGENT-007-CHOOSE-STORAGE.sh`** generates `.agent-007-storage-config.env` with `AGENT_007_DRIVE_*` variables
2. **`agent-007-storage-common.sh`** is sourced by every script — it loads the config and maps `AGENT_007_DRIVE_*` → the canonical env vars each script expects (`OLLAMA_MODELS`, `AGENT_007_GGUF_STORE`, `HF_HOME`, etc.)
3. If no config exists, scripts fall back to the existing FKD1 auto-detection

## Example: Split Models Across Two Drives

```
Drive 1 (2TB SSD "THOR"):  LLM models, GGUF models, image models
Drive 2 (8TB HDD "FKD1"):  Outputs, downloads, cache, logs, GOAT data
```

Run `AGENT-007-CHOOSE-STORAGE.sh`, pick drive 1 for the model categories, drive 2 for everything else.

## Files

| File | Purpose |
|------|---------|
| **`AGENT-007-LAUNCH.sh`** | **Main launcher — starts everything** |
| `AGENT-007-CHOOSE-STORAGE.sh` | Interactive drive picker (Mac/Linux) |
| `AGENT-007-CHOOSE-STORAGE.ps1` | Interactive drive picker (Windows) |
| `AGENT-007-SETUP-NAS.sh` | Create Agent-007 folders on NAS |
| `AGENT-007-AUTOMOUNT-NAS.sh` | Auto-mount NAS on boot (macOS/Linux) |
| `agent-007-storage-common.sh` | Shared library all scripts source |
| `AGENT-007-START-ALL-LLM-DOWNLOADS.sh` | Download/verify Ollama + GGUF models |
| `AGENT-007-START-ALL-LLM-DOWNLOADS-ONE-FOLDER.sh` | One-folder variant of model downloads |
| `AGENT-007-DOWNLOAD-IMAGE-MODELS.sh` | Interactive image model downloader |
| `AGENT-007-ADD-IMAGE-RUNTIMES.sh` | Install ComfyUI, A1111, Forge, etc. |
| `AGENT-007-FKD1-BASIC-NEEDS-TEST.sh` | Full system verification test |
| `AGENT-007-STANDING-DEPLOY-COPY-PASTE.sh` | Deploy/verify record |
| `AGENT-007-FKD1-LOCAL-DRAWING-BRIDGE.py` | Local offline drawing endpoint |
| `AGENT-007-FKD1-START-DRAWING-BRIDGE.sh` | Start drawing bridge (Mac/Linux) |
| `AGENT-007-FKD1-START-DRAWING-BRIDGE.ps1` | Start drawing bridge (Windows) |
| `START-AGENT-007-*.sh` | Service launchers |
| `STOP-AGENT-007-*.sh` | Service stoppers |
| `TEST-AGENT-007-*.sh` | Test scripts |
| `agent-007-image-runtimes.env` | Image runtime environment (auto-generated) |

## NAS Setup (WD My Cloud / Network Storage)

```bash
# 1. Set up auto-mount so NAS connects on every boot
bash AGENT-007-AUTOMOUNT-NAS.sh

# 2. Create Agent-007 folder structure on the NAS
bash AGENT-007-SETUP-NAS.sh /Volumes/SPEEDYSCLOUD

# 3. Pick the NAS for data categories (outputs, cache, backups, etc.)
bash AGENT-007-CHOOSE-STORAGE.sh
```

## Environment Variables

Set these **before** running scripts to override defaults:

| Variable | Effect |
|----------|--------|
| `AGENT_007_STORAGE_CONFIG` | Path to `.agent-007-storage-config.env` |
| `AGENT_007_DRIVE_APP` | Override Agent-007 home path |
| `AGENT_007_DRIVE_LLM_MODELS` | Override LLM model store |
| `AGENT_007_DRIVE_GGUF` | Override GGUF model store |
| `AGENT_007_DRIVE_IMAGE_MODELS` | Override image model store |
| `AGENT_007_DRIVE_OUTPUTS` | Override output directory |
| `AGENT_007_DRIVE_DOWNLOADS` | Override downloads directory |
| `AGENT_007_DRIVE_CACHE` | Override cache directory |
| `AGENT_007_DRIVE_LOGS` | Override logs directory |
| `AGENT_007_DRIVE_RUNTIME` | Override runtime directory |
| `AGENT_007_DRIVE_GOAT_DATA` | Override GOAT data directory |
| `AGENT_007_EXTRA_DRIVE` | Add an extra drive path to detection |
