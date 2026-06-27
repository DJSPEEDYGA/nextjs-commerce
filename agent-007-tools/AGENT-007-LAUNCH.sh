#!/usr/bin/env bash
# ╔═══════════════════════════════════════════════════════════════════╗
# ║                    AGENT-007  MAIN LAUNCHER                      ║
# ║                                                                   ║
# ║  The ONE script to rule them all. Detects your setup, mounts      ║
# ║  NAS if needed, loads storage config, and starts all services.    ║
# ╚═══════════════════════════════════════════════════════════════════╝
#
# Usage:
#   bash AGENT-007-LAUNCH.sh               # full auto — detect & launch
#   bash AGENT-007-LAUNCH.sh --storage     # just open storage chooser
#   bash AGENT-007-LAUNCH.sh --nas-setup   # just set up NAS folders
#   bash AGENT-007-LAUNCH.sh --test        # launch + run tests
#   bash AGENT-007-LAUNCH.sh --status      # just show status of services
#   bash AGENT-007-LAUNCH.sh --stop        # stop all services
set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Colors & helpers ──────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'
RED='\033[0;31m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'
GOLD='\033[33m'

info()  { printf '%b[INFO]%b %s\n' "$CYAN" "$NC" "$*"; }
ok()    { printf '%b[OK]%b   %s\n' "$GREEN" "$NC" "$*"; }
warn()  { printf '%b[WARN]%b %s\n' "$YELLOW" "$NC" "$*"; }
fail()  { printf '%b[FAIL]%b %s\n' "$RED" "$NC" "$*"; }

# ── Banner ────────────────────────────────────────────────────────
banner() {
  printf '\n'
  printf '%b' "$GOLD"
  printf '     ╔═══════════════════════════════════════════╗\n'
  printf '     ║                                           ║\n'
  printf '     ║       █████   ██████  ███████ ███    ██   ║\n'
  printf '     ║      ██   ██ ██       ██      ████   ██   ║\n'
  printf '     ║      ███████ ██   ███ █████   ██ ██  ██   ║\n'
  printf '     ║      ██   ██ ██    ██ ██      ██  ██ ██   ║\n'
  printf '     ║      ██   ██  ██████  ███████ ██   ████   ║\n'
  printf '     ║                                           ║\n'
  printf '     ║               ██████  ██████  ███████     ║\n'
  printf '     ║              ██  ████ ██  ████     ██     ║\n'
  printf '     ║              ██ ██ ██ ██ ██ ██    ██      ║\n'
  printf '     ║              ████  ██ ████  ██   ██       ║\n'
  printf '     ║               ██████   ██████    ██       ║\n'
  printf '     ║                                           ║\n'
  printf '     ║         LOCAL AI OPERATIONS CENTER        ║\n'
  printf '     ╚═══════════════════════════════════════════╝\n'
  printf '%b\n' "$NC"
}

# ── Load storage config ──────────────────────────────────────────
load_config() {
  local common="$SCRIPT_DIR/agent-007-storage-common.sh"
  if [ -f "$common" ]; then
    . "$common"
    ok "Storage config loaded"
  else
    warn "agent-007-storage-common.sh not found — using defaults"
  fi
}

# ── Detect NAS ────────────────────────────────────────────────────
detect_and_mount_nas() {
  local os nas_ip mount_point
  os="$(uname -s 2>/dev/null || echo unknown)"
  nas_ip="${AGENT_007_NAS_IP:-169.254.24.18}"
  mount_point="${AGENT_007_NAS_MOUNT:-/Volumes/SPEEDYSCLOUD}"

  # Check if NAS is already mounted
  if [ -d "$mount_point" ] && mount 2>/dev/null | grep -q "$mount_point"; then
    ok "NAS already mounted: $mount_point"
    return 0
  fi

  # Try to reach NAS
  if ! ping -c 1 -W 2 "$nas_ip" >/dev/null 2>&1; then
    info "NAS at $nas_ip not reachable — running without NAS"
    return 1
  fi

  # Auto-mount on macOS
  if [ "$os" = "Darwin" ]; then
    info "NAS detected at $nas_ip — attempting mount..."
    local share="${AGENT_007_NAS_SHARE:-Public}"
    mkdir -p "$mount_point" 2>/dev/null || true
    if mount_smbfs -N "//$nas_ip/$share" "$mount_point" 2>/dev/null; then
      ok "NAS mounted: $mount_point"
      return 0
    else
      warn "Could not auto-mount NAS. Run: bash AGENT-007-AUTOMOUNT-NAS.sh"
      return 1
    fi
  fi

  return 1
}

# ── Check NAS health ─────────────────────────────────────────────
check_nas_health() {
  local mount_point="${AGENT_007_NAS_MOUNT:-/Volumes/SPEEDYSCLOUD}"
  [ -d "$mount_point" ] || return 0

  local free_kb free_gb
  free_kb="$(df -Pk "$mount_point" 2>/dev/null | awk 'NR==2{print $4}')"
  free_gb=$(( ${free_kb:-0} / 1048576 ))

  if [ "$free_gb" -lt 50 ]; then
    warn "NAS free space: ${free_gb} GB — running low!"
  else
    ok "NAS free space: ${free_gb} GB"
  fi
}

# ── Show status of all services ───────────────────────────────────
show_status() {
  printf '\n%b── Service Status ──%b\n\n' "$BOLD" "$NC"

  local services=(
    "Ollama|${OLLAMA_HOST:-127.0.0.1:11434}|/api/tags"
    "Agent-007 Bridge|127.0.0.1:${AGENT_007_CHAT_PORT:-3333}|/api/tools"
    "Drawing Bridge|127.0.0.1:${AGENT_007_DRAW_PORT:-3344}|/health"
    "GOAT Intel|127.0.0.1:${GOAT_INTEL_PORT:-5500}|/"
    "GOAT Web App|127.0.0.1:${GOAT_WEB_PORT:-8765}|/"
    "Image Runtimes (ComfyUI)|127.0.0.1:${AGENT_007_COMFY_PORT:-8188}|/"
    "Image Runtimes (A1111)|127.0.0.1:${AGENT_007_A1111_PORT:-7860}|/"
    "Image Runtimes (Forge)|127.0.0.1:${AGENT_007_FORGE_PORT:-7861}|/"
  )

  for svc in "${services[@]}"; do
    IFS='|' read -r name host path <<< "$svc"
    if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 2 "http://${host}${path}" >/dev/null 2>&1; then
      printf '  %b●%b %-25s %bhttp://%s%b\n' "$GREEN" "$NC" "$name" "$DIM" "$host" "$NC"
    else
      printf '  %b○%b %-25s %bnot running%b\n' "$RED" "$NC" "$name" "$DIM" "$NC"
    fi
  done

  printf '\n'

  # NAS status
  local mount_point="${AGENT_007_NAS_MOUNT:-/Volumes/SPEEDYSCLOUD}"
  if [ -d "$mount_point" ] && mount 2>/dev/null | grep -q "$mount_point"; then
    local free_kb free_gb
    free_kb="$(df -Pk "$mount_point" 2>/dev/null | awk 'NR==2{print $4}')"
    free_gb=$(( ${free_kb:-0} / 1048576 ))
    printf '  %b●%b %-25s %b%s (%d GB free)%b\n' "$GREEN" "$NC" "NAS" "$DIM" "$mount_point" "$free_gb" "$NC"
  else
    printf '  %b○%b %-25s %bnot mounted%b\n' "$RED" "$NC" "NAS" "$DIM" "$NC"
  fi

  printf '\n'
}

# ── Storage check ─────────────────────────────────────────────────
check_storage_config() {
  local config="$SCRIPT_DIR/.agent-007-storage-config.env"
  if [ -f "$config" ]; then
    ok "Storage config: $config"
  else
    warn "No storage config found. Run: bash AGENT-007-CHOOSE-STORAGE.sh"
    printf '     This lets you pick which drive stores each type of data.\n'
  fi
}

# ── Launch all services ───────────────────────────────────────────
launch_all() {
  # Prefer one-folder launcher if env exists
  if [ -f "$SCRIPT_DIR/.agent-007-one-folder.env" ] || [ -f "$SCRIPT_DIR/START-AGENT-007-ONE-FOLDER.sh" ]; then
    info "Launching via START-AGENT-007-ONE-FOLDER.sh..."
    bash "$SCRIPT_DIR/START-AGENT-007-ONE-FOLDER.sh"
    return $?
  fi

  # Otherwise start individual services
  info "Starting services individually..."

  # Ollama
  if [ -f "$SCRIPT_DIR/AGENT-007-START-ALL-LLM-DOWNLOADS.sh" ]; then
    info "LLM model store configured at: ${OLLAMA_MODELS:-unknown}"
  fi

  # Drawing bridge
  if [ -f "$SCRIPT_DIR/AGENT-007-FKD1-START-DRAWING-BRIDGE.sh" ]; then
    bash "$SCRIPT_DIR/AGENT-007-FKD1-START-DRAWING-BRIDGE.sh" &
  fi

  # Image runtimes
  if [ -f "$SCRIPT_DIR/START-AGENT-007-IMAGE-RUNTIMES.sh" ]; then
    bash "$SCRIPT_DIR/START-AGENT-007-IMAGE-RUNTIMES.sh" &
  fi

  # Local graphics
  if [ -f "$SCRIPT_DIR/START-AGENT-007-LOCAL-GRAPHICS.sh" ]; then
    bash "$SCRIPT_DIR/START-AGENT-007-LOCAL-GRAPHICS.sh" &
  fi

  wait
  ok "All available services started"
}

# ── Stop all services ─────────────────────────────────────────────
stop_all() {
  info "Stopping all Agent-007 services..."

  if [ -f "$SCRIPT_DIR/STOP-AGENT-007-ONE-FOLDER.sh" ]; then
    bash "$SCRIPT_DIR/STOP-AGENT-007-ONE-FOLDER.sh"
  fi

  if [ -f "$SCRIPT_DIR/STOP-AGENT-007-LOCAL-GRAPHICS.sh" ]; then
    bash "$SCRIPT_DIR/STOP-AGENT-007-LOCAL-GRAPHICS.sh"
  fi

  ok "Services stopped"
}

# ── Run tests ─────────────────────────────────────────────────────
run_tests() {
  info "Running Agent-007 tests..."

  if [ -f "$SCRIPT_DIR/TEST-AGENT-007-ONE-FOLDER.sh" ]; then
    bash "$SCRIPT_DIR/TEST-AGENT-007-ONE-FOLDER.sh"
  fi

  if [ -f "$SCRIPT_DIR/TEST-AGENT-007-IMAGE-RUNTIMES.sh" ]; then
    bash "$SCRIPT_DIR/TEST-AGENT-007-IMAGE-RUNTIMES.sh"
  fi

  if [ -f "$SCRIPT_DIR/TEST-AGENT-007-LOCAL-GRAPHICS.sh" ]; then
    bash "$SCRIPT_DIR/TEST-AGENT-007-LOCAL-GRAPHICS.sh"
  fi
}

# ══════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════

MODE="${1:-launch}"

banner

case "$MODE" in
  --storage|-s)
    load_config
    bash "$SCRIPT_DIR/AGENT-007-CHOOSE-STORAGE.sh"
    ;;
  --nas-setup|-n)
    load_config
    bash "$SCRIPT_DIR/AGENT-007-SETUP-NAS.sh"
    ;;
  --test|-t)
    load_config
    detect_and_mount_nas || true
    check_storage_config
    launch_all
    printf '\n'
    run_tests
    ;;
  --status)
    load_config
    check_storage_config
    show_status
    ;;
  --stop)
    load_config
    stop_all
    ;;
  --help|-h)
    printf 'AGENT-007 Main Launcher\n\n'
    printf 'Usage:\n'
    printf '  bash %s                # full auto — detect & launch everything\n' "$0"
    printf '  bash %s --storage      # open storage drive chooser\n' "$0"
    printf '  bash %s --nas-setup    # set up NAS folders\n' "$0"
    printf '  bash %s --test         # launch + run tests\n' "$0"
    printf '  bash %s --status       # show status of all services\n' "$0"
    printf '  bash %s --stop         # stop all services\n' "$0"
    printf '\n'
    ;;
  launch|*)
    load_config
    detect_and_mount_nas || true
    check_nas_health
    check_storage_config

    printf '\n%b── Launching Agent-007 ──%b\n\n' "$BOLD" "$NC"
    launch_all

    printf '\n'
    show_status

    printf '%b── Quick Commands ──%b\n\n' "$BOLD" "$NC"
    printf '  %bbash %s --status%b    Check all services\n' "$CYAN" "$0" "$NC"
    printf '  %bbash %s --stop%b      Stop everything\n' "$CYAN" "$0" "$NC"
    printf '  %bbash %s --test%b      Run all tests\n' "$CYAN" "$0" "$NC"
    printf '  %bbash %s --storage%b   Change drive assignments\n' "$CYAN" "$0" "$NC"
    printf '\n'
    ;;
esac
