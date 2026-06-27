#!/usr/bin/env bash
# AGENT-007-AUTOMOUNT-NAS.sh — Set up auto-mount for a WD My Cloud NAS on macOS.
# Creates a macOS LaunchAgent that mounts the NAS share on login.
#
# Usage:
#   bash AGENT-007-AUTOMOUNT-NAS.sh                          # interactive
#   bash AGENT-007-AUTOMOUNT-NAS.sh 169.254.24.18 Public     # explicit
set -euo pipefail

GREEN='\033[0;32m'; CYAN='\033[0;36m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { printf '%b[INFO]%b %s\n' "$CYAN" "$NC" "$*"; }
ok()    { printf '%b[OK]%b   %s\n' "$GREEN" "$NC" "$*"; }
warn()  { printf '%b[WARN]%b %s\n' "$YELLOW" "$NC" "$*"; }
die()   { printf '%b[FAIL]%b %s\n' "$RED" "$NC" "$*"; exit 1; }

OS="$(uname -s 2>/dev/null || echo unknown)"

printf '\n'
printf '%b╔══════════════════════════════════════════════╗%b\n' "$GREEN" "$NC"
printf '%b║    AGENT-007  NAS AUTO-MOUNT SETUP           ║%b\n' "$GREEN" "$NC"
printf '%b╚══════════════════════════════════════════════╝%b\n' "$GREEN" "$NC"
printf '\n'

# ── Gather NAS details ────────────────────────────────────────────
NAS_IP="${1:-}"
NAS_SHARE="${2:-}"
NAS_LABEL="${3:-SPEEDYSCLOUD}"

if [ -z "$NAS_IP" ]; then
  read -r -p "NAS IP address [169.254.24.18]: " NAS_IP
  NAS_IP="${NAS_IP:-169.254.24.18}"
fi

if [ -z "$NAS_SHARE" ]; then
  read -r -p "NAS share name [Public]: " NAS_SHARE
  NAS_SHARE="${NAS_SHARE:-Public}"
fi

read -r -p "Mount label (folder name under /Volumes) [$NAS_LABEL]: " inp
NAS_LABEL="${inp:-$NAS_LABEL}"

MOUNT_POINT="/Volumes/$NAS_LABEL"
info "NAS: //$NAS_IP/$NAS_SHARE → $MOUNT_POINT"

# ── Test connectivity ─────────────────────────────────────────────
if command -v ping >/dev/null 2>&1; then
  if ping -c 1 -W 3 "$NAS_IP" >/dev/null 2>&1; then
    ok "NAS is reachable at $NAS_IP"
  else
    warn "Cannot ping $NAS_IP — NAS may be off or on a different network."
    warn "The auto-mount will retry on each login anyway."
  fi
fi

# ── Platform-specific setup ───────────────────────────────────────
case "$OS" in
Darwin)
  # === macOS: LaunchAgent + mount script ===

  SCRIPT_PATH="$HOME/.agent-007/mount-nas.sh"
  PLIST_PATH="$HOME/Library/LaunchAgents/com.agent007.mount-nas.plist"
  LOG_PATH="$HOME/.agent-007/mount-nas.log"

  mkdir -p "$HOME/.agent-007"
  mkdir -p "$HOME/Library/LaunchAgents"

  # Write the mount script
  cat > "$SCRIPT_PATH" <<MOUNTEOF
#!/usr/bin/env bash
# Agent-007 NAS auto-mount script
LOG="$LOG_PATH"
echo "[\$(date)] Attempting NAS mount: //$NAS_IP/$NAS_SHARE → $MOUNT_POINT" >> "\$LOG"

# Wait for network (up to 30s)
for i in \$(seq 1 30); do
  ping -c 1 -W 1 "$NAS_IP" >/dev/null 2>&1 && break
  sleep 1
done

if ! ping -c 1 -W 2 "$NAS_IP" >/dev/null 2>&1; then
  echo "[\$(date)] NAS not reachable at $NAS_IP — skipping mount" >> "\$LOG"
  exit 0
fi

if mount | grep -q "$MOUNT_POINT"; then
  echo "[\$(date)] Already mounted at $MOUNT_POINT" >> "\$LOG"
  exit 0
fi

mkdir -p "$MOUNT_POINT" 2>/dev/null || true
mount_smbfs -N "//$NAS_IP/$NAS_SHARE" "$MOUNT_POINT" 2>>"\$LOG"

if mount | grep -q "$MOUNT_POINT"; then
  echo "[\$(date)] SUCCESS — mounted $MOUNT_POINT" >> "\$LOG"
else
  echo "[\$(date)] FAILED — could not mount $MOUNT_POINT" >> "\$LOG"
fi
MOUNTEOF
  chmod +x "$SCRIPT_PATH"
  ok "Mount script: $SCRIPT_PATH"

  # Write the LaunchAgent plist
  cat > "$PLIST_PATH" <<PLISTEOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.agent007.mount-nas</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>$SCRIPT_PATH</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>StartInterval</key>
    <integer>300</integer>
    <key>StandardOutPath</key>
    <string>$LOG_PATH</string>
    <key>StandardErrorPath</key>
    <string>$LOG_PATH</string>
</dict>
</plist>
PLISTEOF
  ok "LaunchAgent: $PLIST_PATH"

  # Load the agent
  launchctl unload "$PLIST_PATH" 2>/dev/null || true
  launchctl load -w "$PLIST_PATH" 2>/dev/null || true
  ok "LaunchAgent loaded — NAS will mount on login + every 5 min if disconnected"

  # Try mounting right now
  info "Attempting mount now..."
  bash "$SCRIPT_PATH" 2>/dev/null || true
  if mount | grep -q "$MOUNT_POINT" 2>/dev/null; then
    ok "NAS mounted at $MOUNT_POINT"
  else
    warn "Mount did not succeed right now — will retry on next login or in 5 min."
    warn "You may need to grant Full Disk Access to Terminal in System Settings → Privacy."
  fi
  ;;

Linux)
  # === Linux: fstab + systemd mount ===

  CREDS_FILE="$HOME/.agent-007/.nas-credentials"
  mkdir -p "$HOME/.agent-007"

  info "For Linux, we'll add an fstab entry."
  read -r -p "NAS username (leave blank for guest): " NAS_USER
  NAS_USER="${NAS_USER:-guest}"

  if [ "$NAS_USER" != "guest" ]; then
    read -r -s -p "NAS password: " NAS_PASS
    printf '\n'
    printf 'username=%s\npassword=%s\n' "$NAS_USER" "$NAS_PASS" > "$CREDS_FILE"
    chmod 600 "$CREDS_FILE"
    CRED_OPT="credentials=$CREDS_FILE,"
  else
    CRED_OPT="guest,"
  fi

  sudo mkdir -p "$MOUNT_POINT"

  FSTAB_LINE="//${NAS_IP}/${NAS_SHARE} ${MOUNT_POINT} cifs ${CRED_OPT}iocharset=utf8,nofail,_netdev,x-systemd.automount 0 0"

  if grep -q "$NAS_IP/$NAS_SHARE" /etc/fstab 2>/dev/null; then
    warn "fstab entry for $NAS_IP/$NAS_SHARE already exists."
  else
    echo "$FSTAB_LINE" | sudo tee -a /etc/fstab >/dev/null
    ok "Added fstab entry for auto-mount"
  fi

  sudo mount -a 2>/dev/null || true
  if mount | grep -q "$MOUNT_POINT" 2>/dev/null; then
    ok "NAS mounted at $MOUNT_POINT"
  else
    warn "Mount did not succeed — check credentials and network."
  fi
  ;;

*)
  die "Unsupported OS: $OS. This script supports macOS and Linux."
  ;;
esac

# ── Also update /etc/hosts for easy access ────────────────────────
if ! grep -q "$NAS_IP" /etc/hosts 2>/dev/null; then
  info "Adding $NAS_IP to /etc/hosts as 'speedyscloud'..."
  echo "$NAS_IP  speedyscloud" | sudo tee -a /etc/hosts >/dev/null 2>/dev/null || true
  ok "You can now use 'speedyscloud' as hostname"
fi

printf '\n%bDone!%b Your NAS will auto-mount at %s on every boot.\n' "$GREEN" "$NC" "$MOUNT_POINT"
printf 'Logs: %s\n\n' "${LOG_PATH:-/var/log/syslog}"
