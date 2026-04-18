#!/usr/bin/env bash
# ============================================================
# Deploy GOAT Empire backup + Gaming to Server 2
# Target: 72.61.193.184 (Ubuntu 24.04 + Docker + Traefik, KVM 2)
# ============================================================
set -e

SERVER="${GOAT_SERVER_2:-72.61.193.184}"
SSH_USER="${GOAT_SSH_USER:-root}"

echo "🎮 Deploying GOAT Empire backup + Gaming stack to Server 2 ($SERVER)..."

cd "$(dirname "$0")/.."
tar --exclude='node_modules' --exclude='dist' --exclude='.git' \
    -czf /tmp/goat-empire.tar.gz .

scp -o StrictHostKeyChecking=no /tmp/goat-empire.tar.gz "$SSH_USER@$SERVER:/root/"

ssh -o StrictHostKeyChecking=no "$SSH_USER@$SERVER" bash <<'REMOTE'
set -e
apt-get update -y
apt-get install -y unzip

# Ensure docker is present (should be pre-installed)
command -v docker >/dev/null 2>&1 || { echo "Docker missing — installing..."; curl -fsSL https://get.docker.com | sh; }

# 1) Backup copy of goat-empire
mkdir -p /root/goat-empire
tar -xzf /root/goat-empire.tar.gz -C /root/goat-empire
echo "✅ GOAT Empire backup placed at /root/goat-empire"

# 2) Prepare FiveM/txAdmin container structure (idle until user confirms)
mkdir -p /root/gaming/fivem/{server-data,txData}
cat > /root/gaming/docker-compose.yml <<'YML'
# FiveM + txAdmin stack — start with: docker compose up -d
version: "3.8"
services:
  txadmin:
    image: tgrmdev/fivem:latest
    container_name: fivem-txadmin
    restart: unless-stopped
    ports:
      - "30120:30120/tcp"
      - "30120:30120/udp"
      - "40120:40120"   # txAdmin panel
    volumes:
      - ./fivem/server-data:/opt/cfx-server-data
      - ./fivem/txData:/opt/cfx-server/txData
    environment:
      - LICENSE_KEY=${FIVEM_LICENSE_KEY:-replace_me}
YML
echo "✅ Gaming stack prepped at /root/gaming (not started — needs FIVEM_LICENSE_KEY)"
REMOTE

echo "✅ Server 2 deployment complete"