const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();
const aiConfig = require('./lib/ai/ai-config');

// AI & ML Components
const nvidiaClient = require('./lib/nvidia/nvidia-nim-client');
const ragSystem = require('./lib/rag/rag-system');
const agentManager = require('./lib/agents/autonomous-agent-manager');
const {
    RevenueData,
    NFTPortfolio,
    CollaborationHub,
    MarketAnalysis
} = require('./lib/models/data-models');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Initialize data models
const revenueData = new RevenueData();
const nftPortfolio = new NFTPortfolio();
const collaborationHub = new CollaborationHub();
const marketAnalysis = new MarketAnalysis();

// Initialize sample data
initializeSampleData();

async function initializeSampleData() {
    // Initialize revenue data
    revenueData.update('spotify', 89200, { streams: 2500000, growth: 15.2 });
    revenueData.update('appleMusic', 67800, { streams: 1800000, growth: 18.7 });
    revenueData.update('youtube', 45300, { streams: 3200000, growth: 22.3 });
    revenueData.update('tidal', 12400, { streams: 450000, growth: 8.9 });
    revenueData.update('amazonMusic', 18900, { streams: 560000, growth: 12.4 });
    
    revenueData.growthRate = 23.5;

    // Initialize NFT portfolio
    nftPortfolio.addItem({
        name: 'Genesis Track NFT',
        value: 45000,
        chain: 'Ethereum',
        description: 'First ever release as NFT'
    });
    nftPortfolio.addItem({
        name: 'Album Art Collection',
        value: 32000,
        chain: 'Polygon',
        description: 'Complete album artwork series'
    });
    nftPortfolio.addItem({
        name: 'Exclusive Beat Pack',
        value: 28000,
        chain: 'Solana',
        description: '10 exclusive beats'
    });
    nftPortfolio.addItem({
        name: 'Limited Edition Single',
        value: 51000,
        chain: 'Ethereum',
        description: 'Limited to 100 copies'
    });

    // Initialize collaboration hub
    collaborationHub.addMember({ name: 'Producer Mike', role: 'producer', email: 'mike@example.com' });
    collaborationHub.addMember({ name: 'Sarah Vocals', role: 'vocalist', email: 'sarah@example.com' });
    collaborationHub.addMember({ name: 'DJ Alex', role: 'dj', email: 'alex@example.com' });

    collaborationHub.createProject({
        name: 'New Album Production',
        description: '2025 Album Project',
        members: ['Producer Mike', 'Sarah Vocals']
    });

    // Initialize market analysis
    marketAnalysis.updateGenreTrends('Hip-Hop', { growth: 25.4, streams: '1.2B', audience: '18-35' });
    marketAnalysis.updateGenreTrends('Pop', { growth: 18.7, streams: '980M', audience: '16-40' });
    marketAnalysis.updateGenreTrends('R&B', { growth: 22.1, streams: '650M', audience: '20-45' });

    // Initialize RAG knowledge base
    await ragSystem.initializeIndustryKnowledge();
    
    console.log('Sample data initialized successfully');
}

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket for real-time updates
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    
    ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to SUPER GOAT ROYALTIES real-time updates'
    }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleWebSocketMessage(ws, data);
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

function handleWebSocketMessage(ws, data) {
    switch (data.type) {
        case 'subscribe':
            ws.subscriptions = data.channels || [];
            break;
        case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
    }
}

function broadcast(channel, message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            if (!client.subscriptions || client.subscriptions.includes(channel)) {
                client.send(JSON.stringify({ channel, ...message }));
            }
        }
    });
}

// ==================== API ROUTES ====================

// Health & Status
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        message: 'SUPER GOAT ROYALTIES API is running',
        version: '3.0.0',
        app: 'SUPER GOAT Royalties',
        mode: aiConfig.demoMode ? 'demo' : 'live',
        uptime: process.uptime(),
        features: {
            ai: true,
            nvidia: !aiConfig.demoMode,
            rag: true,
            agents: true,
            websocket: true
        },
        timestamp: new Date().toISOString()
    });
});

// Dashboard
app.get('/api/dashboard', async (req, res) => {
    try {
        const dashboardData = {
            totalRevenue: revenueData.totalRevenue,
            growthRate: revenueData.growthRate,
            platforms: revenueData.platforms,
            contentStats: {
                protectedTracks: 156,
                totalStreams: 3400000,
                downloads: 78000
            },
            nftPortfolio: {
                totalValue: nftPortfolio.totalValue,
                items: nftPortfolio.items.length,
                chains: Object.keys(nftPortfolio.chains)
            },
            collaboration: {
                teamMembers: collaborationHub.members.length,
                sharedFiles: collaborationHub.files.length,
                activeProjects: collaborationHub.getActiveProjects().length
            },
            aiFeatures: {
                ragEnabled: true,
                agentsRunning: agentManager.getMetrics().activeAgents,
                autonomousMode: agentManager.getMetrics().autonomousMode
            }
        };

        res.json(dashboardData);
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== AI & LLM ENDPOINTS ====================

// AI-powered revenue analysis
app.get('/api/ai/revenue-analysis', async (req, res) => {
    try {
        const analysis = await nvidiaClient.analyzeRoyaltyData({
            totalRevenue: revenueData.totalRevenue,
            growthRate: revenueData.growthRate,
            platforms: revenueData.platforms
        });

        res.json({ analysis });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI market predictions
app.get('/api/ai/market-predictions', async (req, res) => {
    try {
        const { genre, platform, timeframe } = req.query;
        const predictions = await nvidiaClient.predictMarketTrends(
            genre || 'Hip-Hop',
            platform || 'Spotify',
            timeframe || '6 months'
        );

        res.json({ predictions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI content recommendations
app.post('/api/ai/content-recommendations', async (req, res) => {
    try {
        const { artistProfile, currentContent } = req.body;
        const recommendations = await nvidiaClient.generateContentRecommendations(
            artistProfile,
            currentContent
        );

        res.json({ recommendations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI contract generation
app.post('/api/ai/generate-contract', async (req, res) => {
    try {
        const { contractType, parties, terms } = req.body;
        const contract = await nvidiaClient.generateContractTerms(
            contractType,
            parties,
            terms
        );

        res.json({ contract });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== RAG ENDPOINTS ====================

// RAG query endpoint
app.post('/api/rag/query', async (req, res) => {
    try {
        const { query } = req.body;
        const response = await ragSystem.generateResponse(query);
        
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add document to knowledge base
app.post('/api/rag/document', async (req, res) => {
    try {
        const { id, content, metadata } = req.body;
        const result = await ragSystem.addDocument(id, content, metadata);
        
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// RAG stats
app.get('/api/rag/stats', (req, res) => {
    res.json(ragSystem.getStats());
});

// ==================== AGENT ENDPOINTS ====================

// Execute agent task
app.post('/api/agents/execute', async (req, res) => {
    try {
        const { agentId, task, context } = req.body;
        const result = await agentManager.executeAgent(agentId, task, context);
        
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Queue agent task
app.post('/api/agents/queue', (req, res) => {
    const { agentId, task, context } = req.body;
    agentManager.queueTask(agentId, task, context);
    
    res.json({ success: true, message: 'Task queued' });
});

// Agent status
app.get('/api/agents/status', (req, res) => {
    res.json({
        agents: agentManager.getAgentStatus(),
        metrics: agentManager.getMetrics()
    });
});

// Toggle autonomous mode
app.post('/api/agents/autonomous', (req, res) => {
    const { enabled } = req.body;
    agentManager.setAutonomousMode(enabled);
    
    res.json({ success: true, autonomousMode: enabled });
});

// ==================== NVIDIA NIM ENDPOINTS ====================

// Generate text with NVIDIA NIM
app.post('/api/nvidia/generate', async (req, res) => {
    try {
        const { prompt, model, options } = req.body;
        const result = await nvidiaClient.generateText(prompt, model, options);
        
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get model capabilities
app.get('/api/nvidia/models', (req, res) => {
    res.json(nvidiaClient.getModelCapabilities());
});

// ==================== REVENUE ENDPOINTS ====================

// Revenue predictions
app.get('/api/revenue/predictions', async (req, res) => {
    try {
        // Use AI for enhanced predictions
        const aiAnalysis = await nvidiaClient.analyzeRoyaltyData({
            totalRevenue: revenueData.totalRevenue,
            growthRate: revenueData.growthRate,
            platforms: revenueData.platforms
        });

        res.json({
            nextMonth: {
                predicted: revenueData.totalRevenue * 1.23,
                increase: revenueData.totalRevenue * 0.23,
                confidence: 95
            },
            opportunities: [
                { platform: 'TikTok', potential: 25000, priority: 'high' },
                { platform: 'Spotify Playlists', potential: 18000, priority: 'high' },
                { platform: 'YouTube Sync', potential: 15000, priority: 'medium' }
            ],
            aiAnalysis: aiAnalysis.substring(0, 500) + '...'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== NFT ENDPOINTS ====================

app.get('/api/nft/portfolio', (req, res) => {
    res.json({
        totalValue: nftPortfolio.totalValue,
        items: nftPortfolio.items,
        chains: nftPortfolio.chains,
        recentSales: nftPortfolio.salesHistory.slice(-5)
    });
});

// ==================== COLLABORATION ENDPOINTS ====================

app.get('/api/collaboration/status', (req, res) => {
    res.json({
        activeMembers: collaborationHub.getActiveMembers().length,
        totalMembers: collaborationHub.members.length,
        sharedFiles: collaborationHub.files.length,
        activeProjects: collaborationHub.getActiveProjects().length,
        recentActivity: [
            { user: 'Producer Mike', action: 'uploaded new beat', time: '5 min ago' },
            { user: 'Sarah Vocals', action: 'commented on track', time: '12 min ago' },
            { user: 'DJ Alex', action: 'shared mix', time: '1 hour ago' }
        ],
        storageUsed: '450GB',
        storageTotal: '1TB'
    });
});

// ==================== MARKET ANALYSIS ENDPOINTS ====================

app.get('/api/market/trends', (req, res) => {
    res.json({
        trendingGenres: marketAnalysis.getTrendingGenres(),
        platformInsights: marketAnalysis.platformInsights,
        lastUpdated: marketAnalysis.lastUpdated
    });
});

// Catch-all route - serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 SUPER GOAT ROYALTIES Server running on port', PORT);
    console.log('📊 Dashboard: http://localhost:' + PORT);
    console.log('🔌 API Status: http://localhost:' + PORT + '/api/status');
    console.log('🤖 AI Features: Enabled');
    console.log('🎯 NVIDIA NIM: Integrated');
    console.log('📚 RAG System: Active');
    console.log('🤝 Autonomous Agents: Running');
    console.log('📡 WebSocket: Connected');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

module.exports = { app, server };