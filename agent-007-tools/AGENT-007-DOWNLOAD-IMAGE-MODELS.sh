#!/usr/bin/env bash
set -euo pipefail
_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.sh).
_OSCAR_COMMON="$_SCRIPT_DIR/agent-007-storage-common.sh"
[ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"

say()  { printf "\n[%s] %s\n" "$(date '+%H:%M:%S')" "$*"; }
warn() { printf "\n[WARN] %s\n" "$*"; }
die()  { printf "\n[ERROR] %s\n" "$*" >&2; exit 1; }
need_cmd() { command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"; }

need_cmd python3

choose_from_list() {
  local prompt="$1"; shift
  local items=("$@")
  local i=1 choice
  printf "\n%s\n" "$prompt"
  for item in "${items[@]}"; do
    printf "  %d) %s\n" "$i" "$item"
    i=$((i+1))
  done
  while true; do
    read -r -p "Choose a number: " choice
    if [[ "$choice" =~ ^[0-9]+$ ]] && (( choice >= 1 && choice <= ${#items[@]} )); then
      printf '%s\n' "${items[$((choice-1))]}"
      return 0
    fi
    warn "Invalid choice."
  done
}

ensure_hf_cli() {
  if python3 -m huggingface_hub --help >/dev/null 2>&1; then
    return 0
  fi
  say "Installing huggingface_hub CLI..."
  python3 -m pip install --user --upgrade "huggingface_hub[cli]"
}

record_model() {
  local line="$1"
  mkdir -p "$(dirname "$MODEL_INDEX")"
  printf '%s | %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$line" >> "$MODEL_INDEX"
}

resolve_root() {
  local default_root=""
  if [[ -n "${1:-}" ]]; then
    default_root="$1"
  elif [[ -n "${AGENT_007_HOME:-}" ]]; then
    default_root="$AGENT_007_HOME"
  elif [[ -f ./.agent-007-one-folder.env ]]; then
    default_root="$(pwd)"
  fi

  printf "\nAgent-007 Image Model Downloader\n"
  printf "This script downloads or copies image models into Agent-007's shared model store.\n"

  if [[ -n "$default_root" ]]; then
    read -r -p "Agent-007 root folder [$default_root]: " AGENT_007_ROOT
    AGENT_007_ROOT=${AGENT_007_ROOT:-$default_root}
  else
    read -r -p "Agent-007 root folder: " AGENT_007_ROOT
  fi
  [[ -n "$AGENT_007_ROOT" ]] || die "No Agent-007 root folder provided."
  mkdir -p "$AGENT_007_ROOT"
  AGENT_007_ROOT="$(cd "$AGENT_007_ROOT" && pwd)"
}

load_env() {
  local envfile="$AGENT_007_ROOT/agent-007-image-runtimes.env"
  if [[ -f "$envfile" ]]; then
    # shellcheck disable=SC1090
    source "$envfile"
  else
    export AGENT_007_IMAGE_MODEL_ROOT="$AGENT_007_ROOT/models"
  fi
  MODEL_ROOT="${AGENT_007_IMAGE_MODEL_ROOT:-$AGENT_007_ROOT/models}"
  mkdir -p "$MODEL_ROOT"
  for d in checkpoints flux loras vae vae_approx controlnet embeddings upscalers clip clip_vision unet text_encoders ipadapter diffusers invokeai; do
    mkdir -p "$MODEL_ROOT/$d"
  done
  MODEL_INDEX="$MODEL_ROOT/MODEL-INDEX.txt"
}

show_layout() {
  cat <<EOM

Agent-007 shared image model store:
  $MODEL_ROOT/checkpoints
  $MODEL_ROOT/flux
  $MODEL_ROOT/loras
  $MODEL_ROOT/vae
  $MODEL_ROOT/vae_approx
  $MODEL_ROOT/controlnet
  $MODEL_ROOT/embeddings
  $MODEL_ROOT/upscalers
  $MODEL_ROOT/clip
  $MODEL_ROOT/clip_vision
  $MODEL_ROOT/unet
  $MODEL_ROOT/text_encoders
  $MODEL_ROOT/ipadapter
  $MODEL_ROOT/diffusers
  $MODEL_ROOT/invokeai
EOM
}

choose_category() {
  choose_from_list "Choose destination category:" \
    checkpoints flux loras vae vae_approx controlnet embeddings upscalers clip clip_vision unet text_encoders ipadapter diffusers invokeai
}

free_space_report() {
  local free_gb
  free_gb=$(df -Pk "$MODEL_ROOT" | awk 'NR==2 {print int($4/1024/1024)}')
  say "Free space available for models: ${free_gb} GB"
}

maybe_warn_expected_size() {
  local expected=""
  read -r -p "Optional: estimated download size in GB (press Enter to skip): " expected || true
  if [[ -n "$expected" ]] && [[ "$expected" =~ ^[0-9]+([.][0-9]+)?$ ]]; then
    local free_gb
    free_gb=$(df -Pk "$MODEL_ROOT" | awk 'NR==2 {print int($4/1024/1024)}')
    local expected_int=${expected%.*}
    if (( free_gb < expected_int )); then
      warn "Free space may be too low for this download."
    fi
  fi
}

hf_single_file() {
  ensure_hf_cli
  local category target_dir repo_id file_path out_name token_msg
  category=$(choose_category)
  target_dir="$MODEL_ROOT/$category"
  printf "\nHugging Face single-file download\n"
  read -r -p "Repo ID (example: stabilityai/stable-diffusion-xl-base-1.0): " repo_id
  read -r -p "Exact file path inside repo: " file_path
  [[ -n "$repo_id" && -n "$file_path" ]] || die "Repo ID and file path are required."
  read -r -p "Optional output filename (press Enter to keep original): " out_name || true
  maybe_warn_expected_size
  token_msg="If the repo is gated, export HF_TOKEN or run: huggingface-cli login"
  say "$token_msg"
  if [[ -n "$out_name" ]]; then
    python3 -m huggingface_hub download "$repo_id" "$file_path" --local-dir "$target_dir" --local-dir-use-symlinks False
    local downloaded="$target_dir/$(basename "$file_path")"
    if [[ -f "$downloaded" ]]; then
      mv -f "$downloaded" "$target_dir/$out_name"
      downloaded="$target_dir/$out_name"
    fi
    record_model "HF file | category=$category | repo=$repo_id | path=$file_path | saved=$downloaded"
    say "Saved to: $downloaded"
  else
    python3 -m huggingface_hub download "$repo_id" "$file_path" --local-dir "$target_dir" --local-dir-use-symlinks False
    local downloaded="$target_dir/$(basename "$file_path")"
    record_model "HF file | category=$category | repo=$repo_id | path=$file_path | saved=$downloaded"
    say "Saved to: $downloaded"
  fi
}

hf_repo_snapshot() {
  ensure_hf_cli
  local category target_dir repo_id allow_patterns folder_name
  category=$(choose_category)
  target_dir="$MODEL_ROOT/$category"
  printf "\nHugging Face folder/repo snapshot\n"
  read -r -p "Repo ID: " repo_id
  [[ -n "$repo_id" ]] || die "Repo ID is required."
  read -r -p "Allow patterns (comma-separated, example: '*.json,*.safetensors'; Enter for all): " allow_patterns || true
  read -r -p "Destination subfolder name (Enter to use repo name): " folder_name || true
  folder_name=${folder_name:-$(basename "$repo_id")}
  local repo_target="$target_dir/$folder_name"
  mkdir -p "$repo_target"
  maybe_warn_expected_size
  say "If the repo is gated, export HF_TOKEN or run: huggingface-cli login"
  python3 - "$repo_id" "$repo_target" "$allow_patterns" <<'PY'
import sys
from huggingface_hub import snapshot_download
repo_id = sys.argv[1]
local_dir = sys.argv[2]
allow = [x.strip() for x in sys.argv[3].split(',') if x.strip()]
kwargs = dict(repo_id=repo_id, local_dir=local_dir, local_dir_use_symlinks=False)
if allow:
    kwargs['allow_patterns'] = allow
snapshot_download(**kwargs)
print(local_dir)
PY
  record_model "HF snapshot | category=$category | repo=$repo_id | saved=$repo_target | allow_patterns=$allow_patterns"
  say "Saved to: $repo_target"
}

direct_url_download() {
  need_cmd curl
  local category target_dir url filename
  category=$(choose_category)
  target_dir="$MODEL_ROOT/$category"
  printf "\nDirect URL download\n"
  read -r -p "Direct file URL: " url
  [[ -n "$url" ]] || die "URL is required."
  read -r -p "Save as filename (Enter to use URL filename): " filename || true
  if [[ -z "$filename" ]]; then
    filename=$(basename "${url%%\?*}")
    [[ -n "$filename" && "$filename" != "/" ]] || filename="downloaded-model"
  fi
  maybe_warn_expected_size
  local out="$target_dir/$filename"
  curl -L --fail --retry 3 --continue-at - -o "$out" "$url"
  record_model "Direct URL | category=$category | url=$url | saved=$out"
  say "Saved to: $out"
}

copy_local_file() {
  local category target_dir src
  category=$(choose_category)
  target_dir="$MODEL_ROOT/$category"
  printf "\nCopy local model file or folder\n"
  read -r -p "Local source path: " src
  [[ -n "$src" ]] || die "Source path is required."
  [[ -e "$src" ]] || die "Source not found: $src"
  cp -R "$src" "$target_dir/"
  record_model "Local copy | category=$category | source=$src | saved=$target_dir/$(basename "$src")"
  say "Copied to: $target_dir/$(basename "$src")"
}

print_starter_guide() {
  cat <<'EOG'

Recommended starter model map
==============================

For SDXL / classic Stable Diffusion WebUIs:
- checkpoints/     -> main .safetensors checkpoints
- loras/           -> LoRA files
- vae/             -> VAE files
- controlnet/      -> ControlNet models
- embeddings/      -> textual inversion embeddings
- upscalers/       -> ESRGAN / upscaler models

For FLUX in ComfyUI / Forge:
- flux/            -> FLUX UNet / checkpoint files
- clip/            -> clip_l.safetensors (or similar CLIP encoder)
- text_encoders/   -> t5xxl_fp16.safetensors or related text encoders
- vae/             -> ae.safetensors / FLUX autoencoder files
- loras/           -> FLUX LoRAs

For Diffusers pipelines:
- diffusers/       -> full pipeline folders downloaded from Hugging Face

Typical FLUX-related files you may need, depending on workflow:
- flux1-dev.safetensors or flux1-schnell.safetensors
- ae.safetensors
- clip_l.safetensors
- t5xxl_fp16.safetensors (or another supported T5 encoder)

Notes:
- Some Hugging Face repos are gated and require license acceptance + HF_TOKEN.
- Some Civitai links require login or an API token.
- This script only routes models correctly; it does not bypass gated access.
EOG
}

main_menu() {
  while true; do
    free_space_report
    show_layout
    printf "\nChoose an action:\n"
    printf "  1) Download single file from Hugging Face\n"
    printf "  2) Download folder/repo snapshot from Hugging Face\n"
    printf "  3) Download from direct URL\n"
    printf "  4) Copy existing local file/folder into Agent-007\n"
    printf "  5) Show starter guide / folder map\n"
    printf "  6) Exit\n"
    read -r -p "Choose a number: " action
    case "$action" in
      1) hf_single_file ;;
      2) hf_repo_snapshot ;;
      3) direct_url_download ;;
      4) copy_local_file ;;
      5) print_starter_guide ;;
      6) break ;;
      *) warn "Invalid choice." ;;
    esac
  done
  say "Done. Model log: $MODEL_INDEX"
}

resolve_root "${1:-}"
load_env
main_menu
