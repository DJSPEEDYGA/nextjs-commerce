#!/usr/bin/env bash
set -euo pipefail
_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$_SCRIPT_DIR/agent-007-storage-common.sh"
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"

say() { printf "\n[%s] %s\n" "$(date '+%H:%M:%S')" "$*"; }
warn() { printf "\n[WARN] %s\n" "$*"; }
die() { printf "\n[ERROR] %s\n" "$*" >&2; exit 1; }
ask_yes_no() {
  local prompt="$1" default="${2:-Y}" reply
  if [[ "$default" == "Y" ]]; then
    read -r -p "$prompt [Y/n]: " reply || true
    reply=${reply:-Y}
  else
    read -r -p "$prompt [y/N]: " reply || true
    reply=${reply:-N}
  fi
  [[ "$reply" =~ ^[Yy]$ ]]
}
need_cmd() { command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"; }

need_cmd git
need_cmd python3

ROOT_DEFAULT=""
if [[ -n "${1:-}" ]]; then
  ROOT_DEFAULT="$1"
elif [[ -n "${AGENT_007_HOME:-}" ]]; then
  ROOT_DEFAULT="$AGENT_007_HOME"
elif [[ -f ./.agent-007-one-folder.env ]]; then
  ROOT_DEFAULT="$(pwd)"
fi

printf "\nAgent-007 Image Runtime Installer\n"
printf "This adds local image generation runtimes into one shared Agent-007 folder.\n"
printf "It creates one shared model store for checkpoints, FLUX, LoRA, VAE, ControlNet, embeddings, outputs, and caches.\n"

if [[ -n "$ROOT_DEFAULT" ]]; then
  read -r -p "Agent-007 root folder [$ROOT_DEFAULT]: " AGENT_007_ROOT
  AGENT_007_ROOT=${AGENT_007_ROOT:-$ROOT_DEFAULT}
else
  read -r -p "Agent-007 root folder: " AGENT_007_ROOT
fi
[[ -n "$AGENT_007_ROOT" ]] || die "No Agent-007 root folder provided."
mkdir -p "$AGENT_007_ROOT"
AGENT_007_ROOT="$(cd "$AGENT_007_ROOT" && pwd)"

ENV_FILE="$AGENT_007_ROOT/.agent-007-one-folder.env"
RUNTIME_ROOT="$AGENT_007_ROOT/image-runtimes"
MODEL_ROOT="$AGENT_007_ROOT/models"
CACHE_ROOT="$AGENT_007_ROOT/cache"
OUTPUT_ROOT="$AGENT_007_ROOT/outputs"
LOG_ROOT="$AGENT_007_ROOT/logs"
SCRIPT_ROOT="$AGENT_007_ROOT"
VENV_ROOT="$RUNTIME_ROOT/venvs"

mkdir -p "$RUNTIME_ROOT" "$MODEL_ROOT" "$CACHE_ROOT" "$OUTPUT_ROOT" "$LOG_ROOT" "$VENV_ROOT"
mkdir -p \
  "$MODEL_ROOT/checkpoints" \
  "$MODEL_ROOT/flux" \
  "$MODEL_ROOT/loras" \
  "$MODEL_ROOT/vae" \
  "$MODEL_ROOT/vae_approx" \
  "$MODEL_ROOT/controlnet" \
  "$MODEL_ROOT/embeddings" \
  "$MODEL_ROOT/upscalers" \
  "$MODEL_ROOT/clip" \
  "$MODEL_ROOT/clip_vision" \
  "$MODEL_ROOT/unet" \
  "$MODEL_ROOT/text_encoders" \
  "$MODEL_ROOT/ipadapter" \
  "$MODEL_ROOT/diffusers" \
  "$MODEL_ROOT/invokeai"

FREE_GB=$(df -Pk "$AGENT_007_ROOT" | awk 'NR==2 {print int($4/1024/1024)}')
say "Free space at target: ${FREE_GB} GB"
if (( FREE_GB < 50 )); then
  warn "Less than 50 GB free. Image runtimes may install, but you likely need more for models."
fi

cat > "$SCRIPT_ROOT/agent-007-image-runtimes.env" <<ENVVARS
export AGENT_007_HOME="$AGENT_007_ROOT"
export AGENT_007_IMAGE_RUNTIME_ROOT="$RUNTIME_ROOT"
export AGENT_007_IMAGE_MODEL_ROOT="$MODEL_ROOT"
export AGENT_007_IMAGE_OUTPUT_DIR="$OUTPUT_ROOT/images"
export AGENT_007_IMAGE_LOG_DIR="$LOG_ROOT"
export HF_HOME="$CACHE_ROOT/huggingface"
export TRANSFORMERS_CACHE="$CACHE_ROOT/huggingface/transformers"
export HUGGINGFACE_HUB_CACHE="$CACHE_ROOT/huggingface/hub"
export XDG_CACHE_HOME="$CACHE_ROOT/xdg"
export TORCH_HOME="$CACHE_ROOT/torch"
export PIP_CACHE_DIR="$CACHE_ROOT/pip"
export COMFYUI_DIR="$RUNTIME_ROOT/ComfyUI"
export A1111_DIR="$RUNTIME_ROOT/stable-diffusion-webui"
export FORGE_DIR="$RUNTIME_ROOT/stable-diffusion-webui-forge"
export INVOKEAI_DIR="$RUNTIME_ROOT/InvokeAI"
export DIFFUSERS_DIR="$RUNTIME_ROOT/diffusers"
export AGENT_007_COMFY_PORT="8188"
export AGENT_007_A1111_PORT="7860"
export AGENT_007_FORGE_PORT="7861"
export AGENT_007_INVOKEAI_PORT="9090"
ENVVARS

# Preserve earlier env if present by appending image runtime variables only once.
if [[ -f "$ENV_FILE" ]]; then
  if ! grep -q 'agent-007-image-runtimes.env' "$SCRIPT_ROOT/START-AGENT-007-ONE-FOLDER.sh" 2>/dev/null; then
    :
  fi
else
  touch "$ENV_FILE"
fi

link_if_missing() {
  local target="$1" linkpath="$2"
  mkdir -p "$(dirname "$linkpath")"
  if [[ -L "$linkpath" || -e "$linkpath" ]]; then
    return 0
  fi
  ln -s "$target" "$linkpath"
}

setup_python_venv() {
  local venv_path="$1"
  [[ -d "$venv_path" ]] || python3 -m venv "$venv_path"
  # shellcheck disable=SC1090
  source "$venv_path/bin/activate"
  python -m pip install --upgrade pip wheel setuptools
}

git_clone_or_update() {
  local repo="$1" dir="$2"
  if [[ -d "$dir/.git" ]]; then
    say "Updating $(basename "$dir")"
    git -C "$dir" pull --ff-only || warn "Could not fast-forward update $dir; leaving existing checkout in place."
  elif [[ -d "$dir" ]]; then
    warn "$dir exists but is not a git repo; leaving it in place."
  else
    say "Cloning $repo"
    git clone "$repo" "$dir"
  fi
}

install_comfyui() {
  local dir="$RUNTIME_ROOT/ComfyUI"
  git_clone_or_update https://github.com/comfyanonymous/ComfyUI "$dir"
  setup_python_venv "$VENV_ROOT/comfyui"
  python -m pip install -r "$dir/requirements.txt"
  deactivate || true
  mkdir -p "$dir/models"
  link_if_missing "$MODEL_ROOT/checkpoints" "$dir/models/checkpoints"
  link_if_missing "$MODEL_ROOT/flux" "$dir/models/flux"
  link_if_missing "$MODEL_ROOT/loras" "$dir/models/loras"
  link_if_missing "$MODEL_ROOT/vae" "$dir/models/vae"
  link_if_missing "$MODEL_ROOT/vae_approx" "$dir/models/vae_approx"
  link_if_missing "$MODEL_ROOT/controlnet" "$dir/models/controlnet"
  link_if_missing "$MODEL_ROOT/embeddings" "$dir/models/embeddings"
  link_if_missing "$MODEL_ROOT/upscalers" "$dir/models/upscale_models"
  link_if_missing "$MODEL_ROOT/clip" "$dir/models/clip"
  link_if_missing "$MODEL_ROOT/clip_vision" "$dir/models/clip_vision"
  link_if_missing "$MODEL_ROOT/unet" "$dir/models/unet"
  link_if_missing "$MODEL_ROOT/text_encoders" "$dir/models/text_encoders"
  link_if_missing "$MODEL_ROOT/ipadapter" "$dir/models/ipadapter"
}

install_a1111() {
  local dir="$RUNTIME_ROOT/stable-diffusion-webui"
  git_clone_or_update https://github.com/AUTOMATIC1111/stable-diffusion-webui "$dir"
  mkdir -p "$dir/models/Stable-diffusion" "$dir/models/Lora" "$dir/models/VAE" "$dir/models/ESRGAN" "$dir/embeddings" "$dir/extensions"
  link_if_missing "$MODEL_ROOT/checkpoints" "$dir/models/Stable-diffusion/shared"
  link_if_missing "$MODEL_ROOT/loras" "$dir/models/Lora/shared"
  link_if_missing "$MODEL_ROOT/vae" "$dir/models/VAE/shared"
  link_if_missing "$MODEL_ROOT/upscalers" "$dir/models/ESRGAN/shared"
  link_if_missing "$MODEL_ROOT/embeddings" "$dir/embeddings/shared"
  cat > "$dir/webui-user.sh" <<'EOSH'
#!/usr/bin/env bash
export COMMANDLINE_ARGS="--listen --api --port 7860"
EOSH
  chmod +x "$dir/webui-user.sh"
}

install_forge() {
  local dir="$RUNTIME_ROOT/stable-diffusion-webui-forge"
  git_clone_or_update https://github.com/lllyasviel/stable-diffusion-webui-forge "$dir"
  mkdir -p "$dir/models/Stable-diffusion" "$dir/models/Lora" "$dir/models/VAE" "$dir/models/ESRGAN" "$dir/embeddings"
  link_if_missing "$MODEL_ROOT/checkpoints" "$dir/models/Stable-diffusion/shared"
  link_if_missing "$MODEL_ROOT/loras" "$dir/models/Lora/shared"
  link_if_missing "$MODEL_ROOT/vae" "$dir/models/VAE/shared"
  link_if_missing "$MODEL_ROOT/upscalers" "$dir/models/ESRGAN/shared"
  link_if_missing "$MODEL_ROOT/embeddings" "$dir/embeddings/shared"
  cat > "$dir/webui-user.sh" <<'EOSH'
#!/usr/bin/env bash
export COMMANDLINE_ARGS="--listen --api --port 7861"
EOSH
  chmod +x "$dir/webui-user.sh"
}

install_diffusers() {
  local dir="$RUNTIME_ROOT/diffusers"
  mkdir -p "$dir"
  setup_python_venv "$VENV_ROOT/diffusers"
  python -m pip install diffusers transformers torch accelerate safetensors
  cat > "$dir/generate_image.py" <<'EOPY'
import os
from diffusers import DiffusionPipeline
import torch

model_id = os.environ.get("DIFFUSERS_MODEL_ID", "stabilityai/sdxl-turbo")
prompt = os.environ.get("DIFFUSERS_PROMPT", "A cinematic portrait of Agent-007, futuristic offline AI operator, detailed lighting")
outdir = os.environ.get("AGENT_007_IMAGE_OUTPUT_DIR", os.path.join(os.getcwd(), "outputs"))
os.makedirs(outdir, exist_ok=True)

pipe = DiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32)
if torch.cuda.is_available():
    pipe = pipe.to("cuda")
image = pipe(prompt=prompt).images[0]
outpath = os.path.join(outdir, "diffusers-sample.png")
image.save(outpath)
print(outpath)
EOPY
  deactivate || true
}

install_invokeai() {
  local dir="$RUNTIME_ROOT/InvokeAI"
  mkdir -p "$dir"
  setup_python_venv "$VENV_ROOT/invokeai"
  python -m pip install invokeai
  deactivate || true
}

ask_yes_no "Install ComfyUI?" Y && install_comfyui
ask_yes_no "Install Stable Diffusion WebUI (Auto1111)?" Y && install_a1111
ask_yes_no "Install SD WebUI Forge?" Y && install_forge
ask_yes_no "Install Diffusers Python runtime?" Y && install_diffusers
ask_yes_no "Install InvokeAI?" Y && install_invokeai

cat > "$SCRIPT_ROOT/START-AGENT-007-IMAGE-RUNTIMES.sh" <<'EOFSTART'
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
source "$ROOT_DIR/agent-007-image-runtimes.env"
mkdir -p "$AGENT_007_IMAGE_OUTPUT_DIR" "$AGENT_007_IMAGE_LOG_DIR"

start_bg() {
  local name="$1" cmd="$2" logfile="$3"
  echo "Starting $name"
  bash -lc "$cmd" >"$logfile" 2>&1 &
  echo $! > "$AGENT_007_IMAGE_LOG_DIR/${name}.pid"
}

if [[ -d "$COMFYUI_DIR" ]]; then
  start_bg comfyui "source '$AGENT_007_IMAGE_RUNTIME_ROOT/venvs/comfyui/bin/activate' && cd '$COMFYUI_DIR' && python main.py --listen 0.0.0.0 --port '$AGENT_007_COMFY_PORT'" "$AGENT_007_IMAGE_LOG_DIR/comfyui.log"
fi
if [[ -d "$A1111_DIR" ]]; then
  start_bg a1111 "cd '$A1111_DIR' && ./webui.sh --listen --api --port '$AGENT_007_A1111_PORT'" "$AGENT_007_IMAGE_LOG_DIR/a1111.log"
fi
if [[ -d "$FORGE_DIR" ]]; then
  start_bg forge "cd '$FORGE_DIR' && ./webui.sh --listen --api --port '$AGENT_007_FORGE_PORT'" "$AGENT_007_IMAGE_LOG_DIR/forge.log"
fi
if [[ -d "$INVOKEAI_DIR'" ]]; then :; fi
if [[ -d "$INVOKEAI_DIR" ]]; then
  start_bg invokeai "source '$AGENT_007_IMAGE_RUNTIME_ROOT/venvs/invokeai/bin/activate' && invokeai-web --host 0.0.0.0 --port '$AGENT_007_INVOKEAI_PORT'" "$AGENT_007_IMAGE_LOG_DIR/invokeai.log"
fi

echo
echo "Endpoints:"
echo "ComfyUI:    http://127.0.0.1:${AGENT_007_COMFY_PORT}"
echo "A1111:      http://127.0.0.1:${AGENT_007_A1111_PORT}"
echo "Forge:      http://127.0.0.1:${AGENT_007_FORGE_PORT}"
echo "InvokeAI:   http://127.0.0.1:${AGENT_007_INVOKEAI_PORT}"
EOFSTART
chmod +x "$SCRIPT_ROOT/START-AGENT-007-IMAGE-RUNTIMES.sh"

cat > "$SCRIPT_ROOT/STOP-AGENT-007-IMAGE-RUNTIMES.sh" <<'EOFSTOP'
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
source "$ROOT_DIR/agent-007-image-runtimes.env"
for name in comfyui a1111 forge invokeai; do
  pidfile="$AGENT_007_IMAGE_LOG_DIR/${name}.pid"
  if [[ -f "$pidfile" ]]; then
    pid=$(cat "$pidfile" || true)
    if [[ -n "${pid:-}" ]] && kill -0 "$pid" 2>/dev/null; then
      kill "$pid" || true
      echo "Stopped $name ($pid)"
    fi
    rm -f "$pidfile"
  fi
done
EOFSTOP
chmod +x "$SCRIPT_ROOT/STOP-AGENT-007-IMAGE-RUNTIMES.sh"

cat > "$SCRIPT_ROOT/TEST-AGENT-007-IMAGE-RUNTIMES.sh" <<'EOFTEST'
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
source "$ROOT_DIR/agent-007-image-runtimes.env"
check_url() {
  local label="$1" url="$2"
  if command -v curl >/dev/null 2>&1 && curl -fsS "$url" >/dev/null 2>&1; then
    echo "$label: PASS ($url)"
  else
    echo "$label: NOT RESPONDING ($url)"
  fi
}
check_url "ComfyUI"  "http://127.0.0.1:${AGENT_007_COMFY_PORT}"
check_url "A1111"    "http://127.0.0.1:${AGENT_007_A1111_PORT}/sdapi/v1/sd-models"
check_url "Forge"    "http://127.0.0.1:${AGENT_007_FORGE_PORT}/sdapi/v1/sd-models"
check_url "InvokeAI" "http://127.0.0.1:${AGENT_007_INVOKEAI_PORT}"

echo "Model store: $AGENT_007_IMAGE_MODEL_ROOT"
echo "Outputs:     $AGENT_007_IMAGE_OUTPUT_DIR"
EOFTEST
chmod +x "$SCRIPT_ROOT/TEST-AGENT-007-IMAGE-RUNTIMES.sh"

cat > "$SCRIPT_ROOT/OSCAR-IMAGE-RUNTIME-REGISTER.txt" <<EOFREG
Add these endpoints to Agent-007's tool registry / crew map:

ComfyUI:
  UI:    http://127.0.0.1:8188
  API:   http://127.0.0.1:8188
  Use:   node workflows, FLUX, LoRA, advanced pipelines

Stable Diffusion WebUI (Auto1111):
  UI:    http://127.0.0.1:7860
  API:   http://127.0.0.1:7860/sdapi/v1/
  Use:   classic SD/LoRA workflow, extensions

SD WebUI Forge:
  UI:    http://127.0.0.1:7861
  API:   http://127.0.0.1:7861/sdapi/v1/
  Use:   faster WebUI, lower VRAM, FLUX support

InvokeAI:
  UI:    http://127.0.0.1:9090
  Use:   unified canvas, inpaint, outpaint, creative workflow

Diffusers:
  Script: $RUNTIME_ROOT/diffusers/generate_image.py
  Use:    programmatic generation, batch jobs, Python workflows

Shared model folders:
  $MODEL_ROOT/checkpoints
  $MODEL_ROOT/flux
  $MODEL_ROOT/loras
  $MODEL_ROOT/vae
  $MODEL_ROOT/controlnet
  $MODEL_ROOT/embeddings
  $MODEL_ROOT/upscalers
EOFREG

cat > "$SCRIPT_ROOT/README-OSCAR-IMAGE-RUNTIMES.txt" <<EOFREADME
OSCAR IMAGE RUNTIMES ADD-ON
===========================

What this adds
---------------
- ComfyUI
- Stable Diffusion WebUI (Auto1111)
- SD WebUI Forge
- Diffusers (Python)
- InvokeAI
- Shared local model / LoRA / VAE / ControlNet store
- Start, stop, and test scripts

Main scripts
------------
- AGENT-007-ADD-IMAGE-RUNTIMES.sh
- START-AGENT-007-IMAGE-RUNTIMES.sh
- STOP-AGENT-007-IMAGE-RUNTIMES.sh
- TEST-AGENT-007-IMAGE-RUNTIMES.sh
- agent-007-image-runtimes.env

Run
---
1) Install runtimes:
   bash ./AGENT-007-ADD-IMAGE-RUNTIMES.sh

2) Start runtimes:
   bash ./START-AGENT-007-IMAGE-RUNTIMES.sh

3) Test runtimes:
   bash ./TEST-AGENT-007-IMAGE-RUNTIMES.sh

Shared folders
--------------
All major model assets are centralized here:
- $MODEL_ROOT/checkpoints
- $MODEL_ROOT/flux
- $MODEL_ROOT/loras
- $MODEL_ROOT/vae
- $MODEL_ROOT/controlnet
- $MODEL_ROOT/embeddings
- $MODEL_ROOT/upscalers

Notes
-----
- Models are NOT downloaded automatically by this add-on.
- This installer sets up the runtimes and shared storage layout.
- You can place FLUX, SD, LoRA, VAE, and ControlNet files directly into the shared model folders.
- Draw Things is not bundled here because it is a Mac App Store app, not a Git repo/runtime you can embed the same way.
- On NVIDIA Thor / Jetson Linux ARM64, some projects may require ARM64-specific dependency work. ComfyUI and Diffusers are usually the cleanest local path. Auto1111 / Forge support may vary by system libraries and PyTorch build availability.

Recommended first path for Thor
-------------------------------
1. ComfyUI
2. Diffusers
3. InvokeAI
4. Then test Auto1111 / Forge only if needed
EOFREADME

say "Done. Image runtimes are now wired into Agent-007 at: $AGENT_007_ROOT"
say "Next steps:"
printf '  1) bash "%s/START-AGENT-007-IMAGE-RUNTIMES.sh"\n' "$SCRIPT_ROOT"
printf '  2) bash "%s/TEST-AGENT-007-IMAGE-RUNTIMES.sh"\n' "$SCRIPT_ROOT"
printf '  3) Put model files into: %s\n' "$MODEL_ROOT"
