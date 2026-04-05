/**
 * GOAT ROYALTIES - The Ultimate AI-Powered Platform
 * Created for Harvey L. Miller Jr. (DJ Speedy) & Waka Flocka Flame
 * "Stay Paid and Play Harder"
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// THE BOSSES
const BOSSES = [
  { id: 1, name: "Harvey L. Miller Jr.", aka: "DJ Speedy", role: "Owner / Boss #1", status: "Active" },
  { id: 2, name: "Waka Flocka Flame", aka: "Waka", role: "Owner / Boss #2", status: "Active" }
];

// AI AGENT CREW
const AI_AGENTS = [
  { id: 1, name: "NEMO", role: "Project Architect", status: "Online", tier: 1 },
  { id: 2, name: "MONEYPENNY", role: "Assistant Specialist", status: "Ready", tier: 1 },
  { id: 3, name: "CODEX", role: "Code Specialist", status: "Ready", tier: 1 },
  { id: 4, name: "NEXUS", role: "Integration Specialist", status: "Ready", tier: 2 },
  { id: 5, name: "APEX", role: "Performance Specialist", status: "Ready", tier: 2 },
  { id: 6, name: "GEMMA", role: "Data Specialist", status: "Ready", tier: 2 },
  { id: 7, name: "MS. VANESSA", role: "Security & Vault", status: "Ready", tier: 1 }
];

// HARDWARE
const HARDWARE = {
  jetsonCluster: { units: 8, active: 4, arriving: 4, totalTOPS: 2200 },
  storage: "Studio Compound Private Servers",
  power: "Solar Backup Systems"
};

// ROYALTY DATA
const ROYALTIES = {
  totalRevenue: 2500000,
  sources: [
    { name: "Spotify", amount: 875000 },
    { name: "Apple Music", amount: 625000 },
    { name: "YouTube", amount: 500000 },
    { name: "ASCAP", amount: 300000 },
    { name: "BMI", amount: 200000 }
  ]
};

// CRYPTO WALLETS
const WALLETS = [
  { name: "Main Treasury", symbol: "ETH", balance: 125.5 },
  { name: "Bitcoin Holdings", symbol: "BTC", balance: 3.25 },
  { name: "Operations", symbol: "USDC", balance: 50000 }
];

// API ENDPOINTS
app.get('/api/dashboard', (req, res) => res.json({ bosses: BOSSES, agents: AI_AGENTS, hardware: HARDWARE, royalties: ROYALTIES, wallets: WALLETS, timestamp: new Date().toISOString() }));
app.get('/api/bosses', (req, res) => res.json(BOSSES));
app.get('/api/agents', (req, res) => res.json(AI_AGENTS));
app.get('/api/hardware', (req, res) => res.json(HARDWARE));
app.get('/api/royalties', (req, res) => res.json(ROYALTIES));
app.get('/api/wallets', (req, res) => res.json(WALLETS));

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  res.json({
    from: "NEMO",
    message: `Got it Boss! Processing: "${message}". How can I help you further?`,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => res.json({ status: "HEALTHY", uptime: process.uptime() }));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const server = app.listen(PORT, () => {
  console.log('🐐 GOAT ROYALTIES running on port ' + PORT);
  console.log('💪 Stay Paid and Play Harder!');
});

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  console.log('📡 WebSocket connected');
  ws.on('message', (msg) => ws.send(JSON.stringify({ received: true, timestamp: new Date().toISOString() })));
});

module.exports = app;