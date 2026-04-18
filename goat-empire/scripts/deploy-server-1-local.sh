#!/usr/bin/env bash
# Runs ON Server 1 after package is extracted to /root/goat-empire
set -e
echo "🐐 Installing GOAT Empire on Server 1..."

apt-get update -y
apt-get install -y curl wget nginx ufw unzip build-essential ca-certificates

# Node 20
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# PM2
npm install -g pm2 || true

# Nginx site — serves the Super GOAT renderer as a web app
cat > /etc/nginx/sites-available/goat-empire <<'NGX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /root/goat-empire/apps/super-goat-desktop/src/renderer;
    index index.html;

    location / { try_files $uri $uri/ =404; }
    location /downloads/ { alias /root/goat-empire/apps/; autoindex on; }
    location /docs/      { alias /root/goat-empire/docs/; autoindex on; }
    location /data/      { alias /root/goat-empire/data/; autoindex on; }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
NGX
ln -sf /etc/nginx/sites-available/goat-empire /etc/nginx/sites-enabled/goat-empire
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Firewall
ufw --force enable || true
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 11434/tcp   # Ollama (optional)

# Optional: install Ollama (skip if low disk)
FREE_MB=$(df -m / | tail -1 | awk '{print $4}')
if [ "$FREE_MB" -gt 4000 ]; then
  echo "📦 Installing Ollama..."
  curl -fsSL https://ollama.com/install.sh | sh || echo "Ollama install skipped"
  systemctl enable ollama 2>/dev/null || true
  systemctl start  ollama 2>/dev/null || true
fi

IP=$(hostname -I | awk '{print $1}')
echo ""
echo "✅ =========================================="
echo "✅  GOAT EMPIRE LIVE ON SERVER 1"
echo "✅  http://${IP}/"
echo "✅  downloads: http://${IP}/downloads/"
echo "✅  docs:      http://${IP}/docs/"
echo "✅  data:      http://${IP}/data/"
echo "✅ =========================================="