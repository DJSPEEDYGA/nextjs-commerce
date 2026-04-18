#!/usr/bin/env bash
# Runs ON Server 2 after package is extracted to /root/goat-empire
set -e
echo "🎮 Installing GOAT Empire backup + gaming scaffold on Server 2..."

apt-get update -y
apt-get install -y curl wget ca-certificates unzip

# Docker (likely pre-installed)
command -v docker >/dev/null 2>&1 || curl -fsSL https://get.docker.com | sh

# FiveM / txAdmin scaffold (idle — awaits license key)
mkdir -p /root/gaming/fivem/{server-data,txData}
cat > /root/gaming/docker-compose.yml <<'YML'
version: "3.8"
services:
  txadmin:
    image: tgrmdev/fivem:latest
    container_name: fivem-txadmin
    restart: unless-stopped
    ports:
      - "30120:30120/tcp"
      - "30120:30120/udp"
      - "40120:40120"
    volumes:
      - ./fivem/server-data:/opt/cfx-server-data
      - ./fivem/txData:/opt/cfx-server/txData
    environment:
      - LICENSE_KEY=${FIVEM_LICENSE_KEY:-replace_me}
YML

cat > /root/gaming/README.txt <<'TXT'
GOAT Gaming Server — Server 2
==============================
1. Get a FiveM license key:  https://keymaster.fivem.net/
2. Edit /root/gaming/docker-compose.yml → replace FIVEM_LICENSE_KEY
3. Start:  cd /root/gaming && docker compose up -d
4. txAdmin panel: http://<this-server>:40120
5. Game connect:  connect <this-server>:30120
TXT

IP=$(hostname -I | awk '{print $1}')
echo ""
echo "✅ =========================================="
echo "✅  SERVER 2 READY"
echo "✅  /root/goat-empire/   (backup copy)"
echo "✅  /root/gaming/        (FiveM stack — awaits license key)"
echo "✅  IP: $IP"
echo "✅ =========================================="