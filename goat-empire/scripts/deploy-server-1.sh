#!/usr/bin/env bash
# ============================================================
# Deploy GOAT Empire to Server 1 (Main App)
# Target: 93.127.214.171 (Ubuntu 24.04 LTS, KVM 8)
# ============================================================
set -e

SERVER="${GOAT_SERVER_1:-93.127.214.171}"
SSH_USER="${GOAT_SSH_USER:-root}"
TARGET_DIR="/root/goat-empire"

echo "🐐 Deploying GOAT Empire to Server 1 ($SERVER)..."

# 1) Package the goat-empire folder
cd "$(dirname "$0")/.."
echo "📦 Packaging..."
tar --exclude='node_modules' --exclude='dist' --exclude='.git' \
    -czf /tmp/goat-empire.tar.gz .

echo "📤 Uploading to $SERVER..."
scp -o StrictHostKeyChecking=no /tmp/goat-empire.tar.gz "$SSH_USER@$SERVER:/root/"

echo "🛠  Installing on server..."
ssh -o StrictHostKeyChecking=no "$SSH_USER@$SERVER" bash <<'REMOTE'
set -e
apt-get update -y
apt-get install -y curl wget nginx ufw unzip build-essential

# Node 20
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# PM2
npm install -g pm2

# Extract package
mkdir -p /root/goat-empire
tar -xzf /root/goat-empire.tar.gz -C /root/goat-empire
cd /root/goat-empire/apps/super-goat-desktop
npm install --production --no-audit --no-fund || true

# Serve the renderer as a static site via Nginx on port 80
cat > /etc/nginx/sites-available/goat-empire <<'NGX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    root /root/goat-empire/apps/super-goat-desktop/src/renderer;
    index index.html;
    location / { try_files $uri $uri/ =404; }
    location /downloads/ { alias /root/goat-empire/apps/; autoindex on; }
    location /docs/ { alias /root/goat-empire/docs/; autoindex on; }
    location /data/ { alias /root/goat-empire/data/; autoindex on; }
}
NGX
ln -sf /etc/nginx/sites-available/goat-empire /etc/nginx/sites-enabled/goat-empire
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
ufw allow 80/tcp || true
ufw allow 443/tcp || true
ufw allow 22/tcp  || true
echo "✅ GOAT Empire deployed to Server 1"
echo "🌐 http://$(hostname -I | awk '{print $1}')/"
REMOTE

echo "✅ Server 1 deployment complete"