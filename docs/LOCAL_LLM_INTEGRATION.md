# SUPER GOAT ROYALTIES - Local LLM Integration Guide

## Overview

This guide covers the complete local LLM integration for the SUPER GOAT ROYALTIES platform, including:

1. **Local LLM Client** - Connect to Ollama, LM Studio, or other local servers
2. **VPS Deployment** - Set up a production server with local LLM
3. **Custom AI Model** - Create a specialized royalty tracking assistant
4. **RAG System** - Query your catalog data with AI

---

## Quick Start

### 1. Install Ollama

```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama
ollama serve
```

### 2. Download Models

```bash
# Pull recommended models
ollama pull llama3.3          # Best for reasoning
ollama pull mistral:7b         # Fast and capable
ollama pull nomic-embed-text   # For RAG embeddings
```

### 3. Create Custom GOAT Model

```bash
# From the project root
ollama create goat-royalty-agent -f models/goat-royalty-agent.Modelfile

# Run the custom model
ollama run goat-royalty-agent
```

### 4. Start the App

```bash
npm install --legacy-peer-deps
npm start
```

---

## API Endpoints

### Local LLM Status
```
GET /api/llm/status
```

Response:
```json
{
  "success": true,
  "connected": true,
  "provider": "ollama",
  "providerUrl": "http://localhost:11434",
  "models": ["llama3.3", "mistral:7b"],
  "defaultModel": "llama3.3"
}
```

### Chat Completion
```
POST /api/llm/chat
```

Body:
```json
{
  "messages": [
    {"role": "user", "content": "What are my top earning tracks?"}
  ],
  "model": "llama3.3",
  "temperature": 0.7,
  "maxTokens": 2000
}
```

### Royalty Query with RAG
```
POST /api/llm/royalty-query
```

Body:
```json
{
  "query": "Show me works by Harvey L Miller"
}
```

### List Available Models
```
GET /api/llm/models
```

### Pull New Model
```
POST /api/llm/pull
```

Body:
```json
{
  "modelName": "codellama:7b"
}
```

---

## VPS Deployment (Hostinger)

### Automated Setup

1. Copy the setup script to your VPS:
```bash
scp scripts/setup-local-llm-vps.sh root@your-vps-ip:/root/
```

2. Run the script:
```bash
chmod +x /root/setup-local-llm-vps.sh
./setup-local-llm-vps.sh
```

### Manual Setup

#### Install Ollama
```bash
curl -fsSL https://ollama.ai/install.sh | sh
systemctl enable ollama
systemctl start ollama
```

#### Configure for Network Access
```bash
mkdir -p /etc/systemd/system/ollama.service.d
cat > /etc/systemd/system/ollama.service.d/override.conf << EOF
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_ORIGINS=*"
EOF

systemctl daemon-reload
systemctl restart ollama
```

#### Pull Models
```bash
ollama pull llama3.3
ollama pull nomic-embed-text
```

#### Deploy the App
```bash
cd /opt/goat-royalties
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git app
cd app
npm install --legacy-peer-deps
pm2 start server.js --name goat-royalties
```

---

## Custom Model: GOAT Royalty Agent

### Features

- Specialized in music royalty tracking
- Knowledge of ASCAP, BMI, SESAC processes
- Revenue optimization strategies
- Catalog management expertise
- NFT and blockchain monetization

### Creating the Model

```bash
ollama create goat-royalty-agent -f models/goat-royalty-agent.Modelfile
```

### Using the Model

```bash
# Interactive chat
ollama run goat-royalty-agent

# Via API
curl http://localhost:11434/api/chat -d '{
  "model": "goat-royalty-agent",
  "messages": [{"role": "user", "content": "How can I maximize my streaming revenue?"}]
}'
```

---

## RAG System for Catalog Data

### How It Works

1. **Load Catalog**: Parses `GOAT_FORCE_MASTER_WORKS_CATALOG.csv`
2. **Create Chunks**: Groups works by title for efficient retrieval
3. **Generate Embeddings**: Uses Ollama's embedding API
4. **Semantic Search**: Finds relevant works for queries
5. **AI Response**: Generates informed responses with context

### Example Queries

```bash
# Search for works
curl -X POST http://localhost:3000/api/llm/royalty-query \
  -H "Content-Type: application/json" \
  -d '{"query": "What works are registered with ASCAP?"}'

# Get catalog stats
curl http://localhost:3000/api/llm/catalog/stats
```

---

## Environment Variables

Add to your `.env` file:

```env
# Local LLM Configuration
OLLAMA_URL=http://localhost:11434
LM_STUDIO_URL=http://localhost:1234
LOCAL_LLM_PROVIDER=ollama
LOCAL_LLM_MODEL=llama3.3

# Optional: External AI APIs
NVIDIA_API_KEY=your-nvidia-api-key
GOOGLE_AI_STUDIO_KEY=your-google-api-key
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER GOAT ROYALTIES                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Browser   │───▶│  Express    │───▶│  Local LLM  │     │
│  │   Client    │    │   Server    │    │   Client    │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                            │                      │         │
│                            ▼                      ▼         │
│                     ┌─────────────┐    ┌─────────────┐     │
│                     │  RAG System │    │   Ollama    │     │
│                     │  (Catalog)  │    │   Server    │     │
│                     └─────────────┘    └─────────────┘     │
│                            │                               │
│                            ▼                               │
│                     ┌─────────────┐                        │
│                     │   Catalog   │                        │
│                     │    CSV      │                        │
│                     └─────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Ollama Not Connecting

```bash
# Check if Ollama is running
curl localhost:11434

# Check logs
journalctl -u ollama -f

# Restart Ollama
systemctl restart ollama
```

### Model Not Found

```bash
# List available models
ollama list

# Pull missing model
ollama pull llama3.3
```

### Slow Response Times

```bash
# Use smaller model for faster responses
LOCAL_LLM_MODEL=mistral:7b

# Or quantized version
ollama pull llama3.3:q4_K_M
```

### Out of Memory

```bash
# Use smaller quantization
ollama pull llama3.3:q4_K_M

# Or use a smaller model
ollama pull phi3:mini
```

---

## Security Considerations

1. **Network Access**: Ollama binds to localhost by default. For network access, configure `OLLAMA_HOST=0.0.0.0`

2. **Firewall**: Always use a firewall when exposing services:
   ```bash
   ufw allow 11434/tcp  # Only if needed
   ```

3. **Reverse Proxy**: Use Nginx with SSL for production:
   ```nginx
   location /ollama/ {
       proxy_pass http://127.0.0.1:11434/;
   }
   ```

4. **Authentication**: Add API key authentication for production:
   ```javascript
   app.use('/api/llm', (req, res, next) => {
       const apiKey = req.headers['x-api-key'];
       if (apiKey !== process.env.API_KEY) {
           return res.status(401).json({ error: 'Unauthorized' });
       }
       next();
   });
   ```

---

## Support

For issues or questions:
- GitHub: https://github.com/DJSPEEDYGA/nextjs-commerce
- Email: djspeedyga@lifeimitatesart.org

---

*GOAT Royalties - "IF YOU CAN THINK IT! You CAN DO IT IN THE APP"*