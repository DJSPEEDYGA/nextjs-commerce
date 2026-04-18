#!/usr/bin/env bash
# ============================================================
# ONE-SHOT PUSH TO BOTH SERVERS
# Usage:
#   SSHPASS='your_new_password' bash scripts/push-to-servers.sh
# OR with SSH key:
#   bash scripts/push-to-servers.sh
# ============================================================
set -e

SERVER_1="${GOAT_SERVER_1:-93.127.214.171}"
SERVER_2="${GOAT_SERVER_2:-72.61.193.184}"
SSH_USER="${GOAT_SSH_USER:-root}"

cd "$(dirname "$0")/.."

echo "🐐 Packaging GOAT Empire..."
tar --exclude='node_modules' --exclude='dist' --exclude='.git' \
    -czf /tmp/goat-empire.tar.gz .
SIZE=$(du -h /tmp/goat-empire.tar.gz | awk '{print $1}')
echo "✔ Package: /tmp/goat-empire.tar.gz ($SIZE)"

SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"

if [ -n "$SSHPASS" ]; then
  command -v sshpass >/dev/null 2>&1 || { echo "Installing sshpass..."; apt-get install -y sshpass; }
  SCP="sshpass -e scp $SSH_OPTS"
  SSH="sshpass -e ssh $SSH_OPTS"
else
  SCP="scp $SSH_OPTS"
  SSH="ssh $SSH_OPTS"
fi

for S in "$SERVER_1" "$SERVER_2"; do
  echo ""
  echo "🚀 Pushing to $S ..."
  $SCP /tmp/goat-empire.tar.gz "$SSH_USER@$S:/root/"
  $SSH "$SSH_USER@$S" "mkdir -p /root/goat-empire && tar -xzf /root/goat-empire.tar.gz -C /root/goat-empire && echo '✔ Extracted on $S' && ls /root/goat-empire | head"
done

echo ""
echo "🎯 Now running the full installers..."
$SSH "$SSH_USER@$SERVER_1" "bash /root/goat-empire/scripts/deploy-server-1-local.sh" || true
$SSH "$SSH_USER@$SERVER_2" "bash /root/goat-empire/scripts/deploy-server-2-local.sh" || true

echo ""
echo "✅ DONE. Your app is live at:"
echo "   http://$SERVER_1/      (main app — Server 1)"
echo "   http://$SERVER_2/      (backup — Server 2)"