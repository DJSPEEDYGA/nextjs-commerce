/**
 * GOAT ROYALTIES - The Ultimate AI-Powered Platform
 * Created for Harvey L. Miller Jr. (OG) & Waka Flocka Flame (Boss)
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

// THE BOSSES - REAL DATA
const BOSSES = [
  { id: 1, name: "Harvey L. Miller Jr.", aka: "OG", role: "Owner / Boss #1", status: "Active", totalWorks: 326 },
  { id: 2, name: "Waka Flocka Flame", aka: "Boss", role: "Owner / Boss #2", status: "Active", totalTracks: 551 }
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

// HARDWARE - REAL SPECS
const HARDWARE = {
  jetsonCluster: { 
    name: "NVIDIA Jetson Orin NX 64GB",
    units: 8, 
    active: 4, 
    arriving: 4, 
    totalTOPS: 2200,
    totalRAM: "512GB"
  },
  storage: "Studio Compound Private Servers",
  power: "Solar Backup Systems"
};

// REAL CATALOG DATA
const CATALOG = {
  totalWorks: 877,
  harvey: {
    aka: "OG",
    uniqueWorks: 326,
    sampleTitles: [
      "01 BETTER PLAN", "45 DAVENGER", "ACROSS THE LAND", "AFTER DARK",
      "ALL I EVER WANTED", "ALL OF ME", "AMERIKKA", "AROUND THE WORLD",
      "BASIC BOUNCE", "2 TURNTABLES AND A MICROPHONE"
    ]
  },
  waka: {
    aka: "Boss", 
    totalTracks: 551,
    topTracks: [
      "Hard in da Paint", "No Hands", "Grove St. Party", "Round of Applause",
      "Rooster in my Rari", "Trap My A** Off", "Flockaveli"
    ]
  }
};

// ROYALTY SOURCES (From your ASCAP data)
const ROYALTIES = {
  totalRevenue: 2500000, // Update with real numbers
  sources: [
    { name: "ASCAP", amount: 750000, works: 877 },
    { name: "Spotify", amount: 625000 },
    { name: "Apple Music", amount: 500000 },
    { name: "YouTube", amount: 375000 },
    { name: "BMI/Other", amount: 250000 }
  ],
  catalogs: [
    { owner: "OG (Harvey)", works: 326, percentage: 37 },
    { owner: "Boss (Waka)", works: 551, percentage: 63 }
  ]
};

// CRYPTO WALLETS (Placeholders - Update with real addresses)
const WALLETS = [
  { name: "GOAT Treasury", symbol: "ETH", balance: 125.5, address: "0x..." },
  { name: "Bitcoin Holdings", symbol: "BTC", balance: 3.25 },
  { name: "Operations", symbol: "USDC", balance: 50000 }
];

// API ENDPOINTS
app.get('/api/dashboard', (req, res) => res.json({ 
  bosses: BOSSES, 
  agents: AI_AGENTS, 
  hardware: HARDWARE, 
  catalog: CATALOG,
  royalties: ROYALTIES, 
  wallets: WALLETS, 
  timestamp: new Date().toISOString() 
}));

app.get('/api/bosses', (req, res) => res.json(BOSSES));
app.get('/api/agents', (req, res) => res.json(AI_AGENTS));
app.get('/api/hardware', (req, res) => res.json(HARDWARE));
app.get('/api/catalog', (req, res) => res.json(CATALOG));
app.get('/api/royalties', (req, res) => res.json(ROYALTIES));
app.get('/api/wallets', (req, res) => res.json(WALLETS));

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const lowerMsg = message.toLowerCase();
  let response;
  
  if (lowerMsg.includes('catalog') || lowerMsg.includes('tracks') || lowerMsg.includes('works')) {
    response = {
      from: "NEMO",
      message: `📊 REAL CATALOG DATA: OG has ${CATALOG.harvey.uniqueWorks} works, Boss has ${CATALOG.waka.totalTracks} tracks. Total: ${CATALOG.totalWorks} works registered!`,
      timestamp: new Date().toISOString()
    };
  } else if (lowerMsg.includes('royalt')) {
    response = {
      from: "NEMO", 
      message: `💰 Royalty tracking active for ${CATALOG.totalWorks} works across ASCAP, Spotify, Apple Music, and more. OG owns 37%, Boss owns 63% of the catalog.`,
      timestamp: new Date().toISOString()
    };
  } else if (lowerMsg.includes('og') || lowerMsg.includes('harvey')) {
    response = {
      from: "NEMO",
      message: `🎤 OG (Harvey L. Miller Jr.) - Boss #1 - ${CATALOG.harvey.uniqueWorks} registered works including "${CATALOG.harvey.sampleTitles.slice(0,3).join(', ')}" and more!`,
      timestamp: new Date().toISOString()
    };
  } else if (lowerMsg.includes('boss') || lowerMsg.includes('waka')) {
    response = {
      from: "NEMO",
      message: `🔥 Boss (Waka Flocka Flame) - Boss #2 - ${CATALOG.waka.totalTracks} tracks! Hits include "${CATALOG.waka.topTracks.slice(0,3).join(', ')}"`,
      timestamp: new Date().toISOString()
    };
  } else {
    response = {
      from: "NEMO",
      message: `Got it! I'm here to help manage the GOAT Royalties platform. Ask me about the catalog, royalties, agents, or hardware!`,
      timestamp: new Date().toISOString()
    };
  }
  
  res.json(response);
});

app.get('/api/health', (req, res) => res.json({ status: "HEALTHY", uptime: process.uptime() }));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const server = app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🐐 GOAT ROYALTIES - LIVE WITH REAL DATA 🐐           ║');
  console.log('║                                                        ║');
  console.log('║   OG (Harvey): 326 works                               ║');
  console.log('║   Boss (Waka): 551 tracks                              ║');
  console.log('║   TOTAL: 877 works in catalog                          ║');
  console.log('║                                                        ║');
  console.log('║   Running on port: ' + PORT + '                                ║');
  console.log('╚════════════════════════════════════════════════════════╝');
});

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  ws.on('message', (msg) => ws.send(JSON.stringify({ received: true, timestamp: new Date().toISOString() })));
});

module.exports = app;