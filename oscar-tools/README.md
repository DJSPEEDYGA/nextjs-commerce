# Oscar Multi-Drive Storage Tools

Scripts for deploying, downloading, and managing the Oscar AI system across
**multiple drives/storage locations**.

## Quick Start — Choose Your Drives

```bash
bash OSCAR-CHOOSE-STORAGE.sh
```

This interactive tool:
1. Lists all mounted drives with free space
2. Lets you pick which drive for each data category (LLM models, image models, outputs, cache, etc.)
3. Writes `.oscar-storage-config.env` so all Oscar scripts respect your choices

On Windows:
```powershell
powershell -ExecutionPolicy Bypass -File .\OSCAR-CHOOSE-STORAGE.ps1
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

1. **`OSCAR-CHOOSE-STORAGE.sh`** generates `.oscar-storage-config.env` with `OSCAR_DRIVE_*` variables
2. **`oscar-storage-common.sh`** is sourced by every script — it loads the config and maps `OSCAR_DRIVE_*` → the canonical env vars each script expects (`OLLAMA_MODELS`, `OSCAR_GGUF_STORE`, `HF_HOME`, etc.)
3. If no config exists, scripts fall back to the existing FKD1 auto-detection

## Example: Split Models Across Two Drives

```
Drive 1 (2TB SSD "THOR"):  LLM models, GGUF models, image models
Drive 2 (8TB HDD "FKD1"):  Outputs, downloads, cache, logs, GOAT data
```

Run `OSCAR-CHOOSE-STORAGE.sh`, pick drive 1 for the model categories, drive 2 for everything else.

## Files

| File | Purpose |
|------|---------|
| `OSCAR-CHOOSE-STORAGE.sh` | Interactive drive picker (Mac/Linux) |
| `OSCAR-CHOOSE-STORAGE.ps1` | Interactive drive picker (Windows) |
| `oscar-storage-common.sh` | Shared library all scripts source |
| `OSCAR-START-ALL-LLM-DOWNLOADS.sh` | Download/verify Ollama + GGUF models |
| `OSCAR-START-ALL-LLM-DOWNLOADS-ONE-FOLDER.sh` | One-folder variant of model downloads |
| `OSCAR-DOWNLOAD-IMAGE-MODELS.sh` | Interactive image model downloader |
| `OSCAR-ADD-IMAGE-RUNTIMES.sh` | Install ComfyUI, A1111, Forge, etc. |
| `OSCAR-FKD1-BASIC-NEEDS-TEST.sh` | Full system verification test |
| `OSCAR-STANDING-DEPLOY-COPY-PASTE.sh` | Deploy/verify record |
| `OSCAR-FKD1-LOCAL-DRAWING-BRIDGE.py` | Local offline drawing endpoint |
| `OSCAR-FKD1-START-DRAWING-BRIDGE.sh` | Start drawing bridge (Mac/Linux) |
| `OSCAR-FKD1-START-DRAWING-BRIDGE.ps1` | Start drawing bridge (Windows) |
| `START-OSCAR-*.sh` | Service launchers |
| `STOP-OSCAR-*.sh` | Service stoppers |
| `TEST-OSCAR-*.sh` | Test scripts |
| `oscar-image-runtimes.env` | Image runtime environment (auto-generated) |

## Environment Variables

Set these **before** running scripts to override defaults:

| Variable | Effect |
|----------|--------|
| `OSCAR_STORAGE_CONFIG` | Path to `.oscar-storage-config.env` |
| `OSCAR_DRIVE_APP` | Override Oscar home path |
| `OSCAR_DRIVE_LLM_MODELS` | Override LLM model store |
| `OSCAR_DRIVE_GGUF` | Override GGUF model store |
| `OSCAR_DRIVE_IMAGE_MODELS` | Override image model store |
| `OSCAR_DRIVE_OUTPUTS` | Override output directory |
| `OSCAR_DRIVE_DOWNLOADS` | Override downloads directory |
| `OSCAR_DRIVE_CACHE` | Override cache directory |
| `OSCAR_DRIVE_LOGS` | Override logs directory |
| `OSCAR_DRIVE_RUNTIME` | Override runtime directory |
| `OSCAR_DRIVE_GOAT_DATA` | Override GOAT data directory |
| `OSCAR_EXTRA_DRIVE` | Add an extra drive path to detection |
