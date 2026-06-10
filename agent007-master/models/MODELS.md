# Agent-007 — Models

Agent-007 runs **100% local**. No cloud APIs. These are the models the install
pulls onto each machine. Edit `pull-models.sh` to add/remove models for your
hardware (a Jetson Nano can't run the same models as a 4090 rig).

## Ollama LLMs (chat / reasoning / code)

| Model | Size | Good for | Min VRAM |
|-------|------|----------|----------|
| `llama3` (8B) | ~4.7 GB | general chat, default | 8 GB |
| `mistral` (7B) | ~4.1 GB | fast, snappy replies | 6 GB |
| `codellama` (13B) | ~7.4 GB | code / scripting | 12 GB |
| `llama3:70b` | ~40 GB | heavy reasoning (big rigs only) | 48 GB |
| `llava` | ~4.5 GB | image understanding (vision) | 8 GB |

> ⚠️ Confirm your actual pulled models on the Mac with `ollama list` and put the
> exact names in `pull-models.sh`. The list above is the recommended default set.

## Stable Diffusion (Codex Draw — art / promo / render)

| Checkpoint | Size | Notes |
|------------|------|-------|
| SDXL base 1.0 | ~6.9 GB | high quality, 1024px |
| DreamShaper / Juggernaut XL | ~6–7 GB | cinematic, great for promo art |

SD checkpoints are **not** auto-downloaded by Ollama — drop the `.safetensors`
into your `stable-diffusion-webui/models/Stable-diffusion/` folder, or set the
path in `pull-models.sh`.

## Per-machine recommendation

| Machine | Models |
|---------|--------|
| Jetson Nano / Orin Nano | `mistral` only |
| Jetson Thor / Orin AGX | `llama3` + `codellama` |
| Mac Studio / 3090–4090 | `llama3` + `codellama` + `llava` + SDXL |
| 5090 / 70B-capable rig | add `llama3:70b` |
