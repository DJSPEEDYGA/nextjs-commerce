#!/bin/bash
# GOAT Royalty Enhanced Platform - Deployment Script
# For Linux servers (Ubuntu/Debian)

set -e

echo "========================================"
echo " GOAT Royalty - Server Deployment"
echo "========================================"
echo ""

# Configuration
DEPLOY_DIR="${DEPLOY_DIR:-/opt/goat-royalty}"
DOMAIN="${DOMAIN:-goat-royalty.local}"
PORT="${PORT:-3001}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}[WARNING] Not running as root. Some operations may fail.${NC}"
fi

echo -e "${YELLOW}[INFO] Installing dependencies...${NC}"

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}[INFO] Installing Node.js 20.x...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install Ollama if not present
if ! command -v ollama &> /dev/null; then
    echo -e "${YELLOW}[INFO] Installing Ollama...${NC}"
    curl -fsSL https://ollama.com/install.sh | sh
fi

# Install PM2 for process management
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}[INFO] Installing PM2...${NC}"
    sudo npm install -g pm2
fi

echo ""
echo -e "${YELLOW}[INFO] Setting up application...${NC}"

# Create deployment directory
sudo mkdir -p "$DEPLOY_DIR"
sudo chown -R $USER:$USER "$DEPLOY_DIR"

# Copy application files
echo -e "${YELLOW}[INFO] Copying application files...${NC}"
cp -r web-app "$DEPLOY_DIR/"
cp -r src "$DEPLOY_DIR/"
cp -r server "$DEPLOY_DIR/"
cp -r scripts "$DEPLOY_DIR/"

# Copy package files
cp package.json "$DEPLOY_DIR/server/" 2>/dev/null || true

# Install npm dependencies
cd "$DEPLOY_DIR/server"
npm install --production

echo ""
echo -e "${YELLOW}[INFO] Downloading AI models...${NC}"

# Start Ollama and pull models
sudo systemctl start ollama || true
sleep 5

for model in llama3.1:8b mistral-nemo:12b qwen2.5:14b; do
    echo -e "${YELLOW}[INFO] Pulling model: $model...${NC}"
    ollama pull $model || echo -e "${RED}[WARNING] Failed to pull $model${NC}"
done

echo ""
echo -e "${YELLOW}[INFO] Setting up PM2 process...${NC}"

# Create PM2 ecosystem file
cat > "$DEPLOY_DIR/ecosystem.config.js" << EOF
module.exports = {
  apps: [{
    name: 'goat-royalty-api',
    script: '$DEPLOY_DIR/server/api-server.js',
    cwd: '$DEPLOY_DIR/server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: $PORT,
      OLLAMA_URL: 'http://localhost:11434'
    }
  }]
};
EOF

# Start with PM2
pm2 delete goat-royalty-api 2>/dev/null || true
pm2 start "$DEPLOY_DIR/ecosystem.config.js"
pm2 save

echo ""
echo -e "${YELLOW}[INFO] Setting up Nginx reverse proxy...${NC}"

# Create Nginx config
cat > /tmp/goat-royalty-nginx.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

if command -v nginx &> /dev/null; then
    sudo cp /tmp/goat-royalty-nginx.conf /etc/nginx/sites-available/goat-royalty
    sudo ln -sf /etc/nginx/sites-available/goat-royalty /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    echo -e "${GREEN}[OK] Nginx configured${NC}"
else
    echo -e "${YELLOW}[WARNING] Nginx not installed. Skipping reverse proxy setup.${NC}"
fi

echo ""
echo -e "${GREEN}========================================"
echo " Deployment Complete!"
echo "========================================${NC}"
echo ""
echo "Application deployed to: $DEPLOY_DIR"
echo "API Server: http://localhost:$PORT"
echo "Web App: http://localhost:$PORT/app"
echo "Health Check: http://localhost:$PORT/api/health"
echo ""
echo "Useful commands:"
echo "  pm2 status           - Check application status"
echo "  pm2 logs goat-royalty-api - View logs"
echo "  pm2 restart goat-royalty-api - Restart application"
echo ""