#!/usr/bin/env bash
# agent-007-storage-common.sh — shared storage configuration loader.
# Source this file at the top of any Agent-007/GOAT script to load the
# multi-drive storage configuration.  If no .agent-007-storage-config.env
# exists yet, it falls back to standard FKD1 / one-folder detection.
#
# Usage (add near the top of each script, after set -u/-euo pipefail):
#   _OSCAR_COMMON="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/agent-007-storage-common.sh"
#   [ -f "$_OSCAR_COMMON" ] && . "$_OSCAR_COMMON"

# ── helpers ──────────────────────────────────────────────────────────
_oscar_info() { printf '[STORAGE] %s\n' "$1"; }

# ── locate config ────────────────────────────────────────────────────
# Search order: explicit env var, script directory, Agent-007 home, FKD1 root.
_oscar_find_storage_config() {
  local c
  for c in \
    "${AGENT_007_STORAGE_CONFIG:-}" \
    "${BASH_SOURCE[0]%/*}/.agent-007-storage-config.env" \
    "${AGENT_007_HOME:-}/.agent-007-storage-config.env" \
    "${FKD1_ROOT:-}/.agent-007-storage-config.env" \
    "${SCRIPT_DIR:-}/.agent-007-storage-config.env" \
    "$(pwd)/.agent-007-storage-config.env"; do
    [ -n "$c" ] && [ -f "$c" ] && printf '%s\n' "$c" && return 0
  done
  return 1
}

# ── detect mounted volumes (Mac + Linux) ─────────────────────────────
oscar_list_drives() {
  # Returns lines: MOUNT_POINT|FREE_GB|TOTAL_GB|LABEL_OR_NAME
  local line mount_path free_kb total_kb free_gb total_gb label
  df -Pk 2>/dev/null | awk 'NR>1' | while IFS= read -r line; do
    mount_path="$(echo "$line" | awk '{print $NF}')"
    case "$mount_path" in
      /Volumes/*|/media/*|/run/media/*|/mnt/*|/home/*) ;;
      *) continue ;;
    esac
    total_kb="$(echo "$line" | awk '{print $2}')"
    free_kb="$(echo "$line" | awk '{print $4}')"
    total_gb=$((total_kb / 1024 / 1024))
    free_gb=$((free_kb / 1024 / 1024))
    label="$(basename "$mount_path")"
    printf '%s|%s|%s|%s\n' "$mount_path" "$free_gb" "$total_gb" "$label"
  done
}

# ── FKD1 fallback (preserved for backward compat) ───────────────────
_oscar_find_fkd1_root() {
  local drive_name="${FKD1_DRIVE_NAME:-FKD1}"
  local requested="${FKD1_ROOT:-${FKD1_DRIVE:-}}"
  if [ -n "$requested" ]; then
    case "$requested" in
      /*) [ -d "$requested" ] && printf '%s\n' "$requested" && return 0 ;;
      *)
        local base
        for base in "/Volumes" "/media/${USER:-}" "/run/media/${USER:-}" "/mnt"; do
          [ -d "$base/$requested" ] && printf '%s\n' "$base/$requested" && return 0
        done
        ;;
    esac
  fi
  local path
  for path in \
    "/Volumes/$drive_name" \
    "/media/${USER:-}/$drive_name" \
    "/run/media/${USER:-}/$drive_name" \
    "/mnt/$drive_name"; do
    [ -d "$path" ] && printf '%s\n' "$path" && return 0
  done
  return 1
}

# ── load config and map to canonical env vars ────────────────────────
_oscar_load_storage_config() {
  local config_file
  config_file="$(_oscar_find_storage_config 2>/dev/null || true)"

  if [ -n "$config_file" ] && [ -f "$config_file" ]; then
    _oscar_info "Loading storage config: $config_file"
    # shellcheck disable=SC1090
    . "$config_file"

    # Map AGENT_007_DRIVE_* vars → canonical vars that all scripts expect.
    export AGENT_007_HOME="${AGENT_007_DRIVE_APP:-${AGENT_007_HOME:-}}"
    export FKD1_ROOT="${AGENT_007_DRIVE_APP:-${FKD1_ROOT:-}}"
    export AGENT_007_BRIDGE_WORKSPACE="${AGENT_007_DRIVE_APP:-${AGENT_007_BRIDGE_WORKSPACE:-}}"
    export AGENT_007_TOOL_WORKSPACE="${AGENT_007_DRIVE_APP:-${AGENT_007_TOOL_WORKSPACE:-}}"
    export AGENT_007_ASSET_ROOT="${AGENT_007_DRIVE_APP:-${AGENT_007_ASSET_ROOT:-}}"

    export OLLAMA_MODELS="${AGENT_007_DRIVE_LLM_MODELS:-${OLLAMA_MODELS:-}}"
    export AGENT_007_MODEL_STORE="${AGENT_007_DRIVE_LLM_MODELS:-${AGENT_007_MODEL_STORE:-}}"
    export AGENT_007_GGUF_STORE="${AGENT_007_DRIVE_GGUF:-${AGENT_007_GGUF_STORE:-}}"

    export AGENT_007_IMAGE_MODEL_ROOT="${AGENT_007_DRIVE_IMAGE_MODELS:-${AGENT_007_IMAGE_MODEL_ROOT:-}}"
    export AGENT_007_IMAGE_OUTPUT_DIR="${AGENT_007_DRIVE_OUTPUTS:-${AGENT_007_IMAGE_OUTPUT_DIR:-}}"
    export AGENT_007_OUTPUT_DIR="${AGENT_007_DRIVE_OUTPUTS:-${AGENT_007_OUTPUT_DIR:-}}"

    export GOAT_DATA_ROOT="${AGENT_007_DRIVE_GOAT_DATA:-${GOAT_DATA_ROOT:-}}"
    export GOAT_DOWNLOAD_DIR="${AGENT_007_DRIVE_DOWNLOADS:-${GOAT_DOWNLOAD_DIR:-}}"

    export AGENT_007_LOG_DIR="${AGENT_007_DRIVE_LOGS:-${AGENT_007_LOG_DIR:-}}"
    export AGENT_007_IMAGE_LOG_DIR="${AGENT_007_DRIVE_LOGS:-${AGENT_007_IMAGE_LOG_DIR:-}}"

    export AGENT_007_RUNTIME_DIR="${AGENT_007_DRIVE_RUNTIME:-${AGENT_007_RUNTIME_DIR:-}}"
    export AGENT_007_RUNTIME_HOME="${AGENT_007_DRIVE_RUNTIME:-${AGENT_007_RUNTIME_HOME:-}}"
    export OLLAMA_HOME="${AGENT_007_DRIVE_RUNTIME:-${OLLAMA_HOME:-}}"
    export OLLAMA_RUNNERS_DIR="${AGENT_007_DRIVE_RUNTIME:-${OLLAMA_RUNNERS_DIR:-}}/runners"
    export OLLAMA_TMPDIR="${AGENT_007_DRIVE_RUNTIME:-${OLLAMA_TMPDIR:-}}/tmp"

    export HF_HOME="${AGENT_007_DRIVE_CACHE:-${HF_HOME:-}}/huggingface"
    export TRANSFORMERS_CACHE="${AGENT_007_DRIVE_CACHE:-}/huggingface/transformers"
    export HUGGINGFACE_HUB_CACHE="${AGENT_007_DRIVE_CACHE:-}/huggingface/hub"
    export XDG_CACHE_HOME="${AGENT_007_DRIVE_CACHE:-}/xdg"
    export TORCH_HOME="${AGENT_007_DRIVE_CACHE:-}/torch"
    export PIP_CACHE_DIR="${AGENT_007_DRIVE_CACHE:-}/pip"
    export TMPDIR="${AGENT_007_DRIVE_CACHE:-}/tmp"

    # Ensure key dirs exist.
    local d
    for d in \
      "$OLLAMA_MODELS" "$AGENT_007_GGUF_STORE" \
      "$AGENT_007_IMAGE_OUTPUT_DIR" "$AGENT_007_LOG_DIR" \
      "$AGENT_007_RUNTIME_DIR" "$GOAT_DOWNLOAD_DIR" \
      "$HF_HOME" "$TMPDIR"; do
      [ -n "$d" ] && mkdir -p "$d" 2>/dev/null || true
    done

    export AGENT_007_STORAGE_LOADED=1
    return 0
  fi

  # No config file found — fall back to one-folder env or FKD1 detection.
  local one_folder_env="${AGENT_007_HOME:-$(pwd)}/.agent-007-one-folder.env"
  if [ -f "$one_folder_env" ]; then
    # shellcheck disable=SC1090
    . "$one_folder_env"
    export AGENT_007_STORAGE_LOADED=1
    return 0
  fi

  return 1
}

# ── auto-load on source ─────────────────────────────────────────────
_oscar_load_storage_config 2>/dev/null || true
