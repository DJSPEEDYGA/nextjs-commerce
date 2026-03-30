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

// Structured logger (winston is already a project dependency)
let logger;
try {
    const winston = require('winston');
    logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`)
        ),
        transports: [new winston.transports.Console()]
    });
} catch {
    // Fallback if winston is unavailable
    logger = {
        info: (...a) => console.log('[INFO]', ...a),
        warn: (...a) => console.warn('[WARN]', ...a),
        error: (...a) => console.error('[ERROR]', ...a)
    };
}

// AI & ML Components
const nvidiaClient = require('./lib/nvidia/nvidia-nim-client');
const ragSystem = require('./lib/rag/rag-system');
const agentManager = require('./lib/agents/autonomous-agent-manager');
const rateLimit = require('express-rate-limit');
const {
    RevenueData,
    NFTPortfolio,
    CollaborationHub,
    MarketAnalysis
} = require('./lib/models/data-models');

// New Feature Modules
const cryptoMining = require('./lib/mining/crypto-mining');
const videoEditor = require('./lib/video/video-editor');
const dspDistribution = require('./lib/dsp/dsp-distribution');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Rate limiter: max 100 requests per minute per IP for API routes
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

// Stricter rate limiter for AI/compute-heavy endpoints
const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many AI requests, please wait before retrying.' }
});

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
    // Enable Content Security Policy with a policy that allows the app's own
    // assets and the Chart.js CDN used by the dashboard UI.
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",  // required for inline scripts in public/index.html
                'https://cdn.jsdelivr.net'
            ],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'ws:', 'wss:'],
            fontSrc: ["'self'", 'data:'],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
        }
    },
    crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Apply rate limiting to all /api/* routes
app.use('/api/', apiLimiter);
// Tighter limits on compute-heavy AI/RAG/agent endpoints
app.use('/api/ai/', aiLimiter);
app.use('/api/rag/query', aiLimiter);
app.use('/api/nvidia/generate', aiLimiter);
app.use('/api/agents/execute', aiLimiter);

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
        const metrics = agentManager.getMetrics() || {};
        const dashboardData = {
            totalRevenue: revenueData.totalRevenue ?? 0,
            growthRate: revenueData.growthRate ?? 0,
            platforms: revenueData.platforms ?? {},
            contentStats: {
                protectedTracks: 156,
                totalStreams: 3400000,
                downloads: 78000
            },
            nftPortfolio: {
                totalValue: nftPortfolio.totalValue ?? 0,
                items: nftPortfolio.items?.length ?? 0,
                chains: Object.keys(nftPortfolio.chains ?? {})
            },
            collaboration: {
                teamMembers: collaborationHub.members?.length ?? 0,
                sharedFiles: collaborationHub.files?.length ?? 0,
                activeProjects: collaborationHub.getActiveProjects?.()?.length ?? 0
            },
            aiFeatures: {
                ragEnabled: true,
                agentsRunning: metrics.activeAgents ?? 0,
                autonomousMode: metrics.autonomousMode ?? false
            }
        };

        res.json(dashboardData);
    } catch (error) {
        logger.error(`Dashboard error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// ==================== AI & LLM ENDPOINTS ====================

// AI-powered revenue analysis
app.get('/api/ai/revenue-analysis', async (req, res) => {
    try {
        const analysis = await nvidiaClient.analyzeRoyaltyData({
            totalRevenue: revenueData.totalRevenue ?? 0,
            growthRate: revenueData.growthRate ?? 0,
            platforms: revenueData.platforms ?? {}
        });

        res.json({ analysis });
    } catch (error) {
        logger.error(`AI revenue-analysis failed: ${error.message}`);
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
        logger.error(`AI market-predictions failed: ${error.message}`);
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
        logger.error(`AI content-recommendations failed: ${error.message}`);
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
        logger.error(`AI generate-contract failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// ==================== RAG ENDPOINTS ====================

// RAG query endpoint
app.post('/api/rag/query', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query || typeof query !== 'string' || query.trim() === '') {
            return res.status(400).json({ error: 'query is required and must be a non-empty string' });
        }
        const response = await ragSystem.generateResponse(query);
        
        res.json({ response });
    } catch (error) {
        logger.error(`RAG query failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Add document to knowledge base
app.post('/api/rag/document', async (req, res) => {
    try {
        const { id, content, metadata } = req.body;
        if (!id || !content) {
            return res.status(400).json({ error: 'id and content are required' });
        }
        const result = await ragSystem.addDocument(id, content, metadata);
        
        res.json({ success: true, ...result });
    } catch (error) {
        logger.error(`RAG add-document failed: ${error.message}`);
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
        logger.error(`Agent execute failed (agent=${req.body?.agentId}): ${error.message}`);
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
        if (!prompt) {
            return res.status(400).json({ error: 'prompt is required' });
        }
        const result = await nvidiaClient.generateText(prompt, model, options);
        
        res.json({ result });
    } catch (error) {
        logger.error(`NVIDIA generate failed: ${error.message}`);
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
            totalRevenue: revenueData.totalRevenue ?? 0,
            growthRate: revenueData.growthRate ?? 0,
            platforms: revenueData.platforms ?? {}
        });
        const totalRev = revenueData.totalRevenue ?? 0;

        res.json({
            nextMonth: {
                predicted: totalRev * 1.23,
                increase: totalRev * 0.23,
                confidence: 95
            },
            opportunities: [
                { platform: 'TikTok', potential: 25000, priority: 'high' },
                { platform: 'Spotify Playlists', potential: 18000, priority: 'high' },
                { platform: 'YouTube Sync', potential: 15000, priority: 'medium' }
            ],
            aiAnalysis: typeof aiAnalysis === 'string' ? aiAnalysis.substring(0, 500) + '...' : ''
        });
    } catch (error) {
        logger.error(`Revenue predictions failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// ==================== NFT ENDPOINTS ====================

app.get('/api/nft/portfolio', (req, res) => {
    res.json({
        totalValue: nftPortfolio.totalValue ?? 0,
        items: nftPortfolio.items ?? [],
        chains: nftPortfolio.chains ?? {},
        recentSales: nftPortfolio.salesHistory?.slice(-5) ?? []
    });
});

// ==================== CRYPTO MINING ENDPOINTS ====================

// Get mining stats
app.get('/api/mining/stats', (req, res) => {
    res.json(cryptoMining.getStats());
});

// Get hardware recommendations
app.get('/api/mining/hardware', (req, res) => {
    res.json(cryptoMining.getHardwareRecommendations());
});

// Create miner
app.post('/api/mining/create', (req, res) => {
    try {
        const { coin, type, threads, walletAddress, poolIndex } = req.body;
        const minerId = cryptoMining.createMiner({
            coin,
            type: type || 'cpu',
            threads: threads || 4,
            walletAddress,
            poolIndex
        });
        res.json({ success: true, minerId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start mining
app.post('/api/mining/start', (req, res) => {
    try {
        const { minerId } = req.body;
        const result = cryptoMining.startMining(minerId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Stop mining
app.post('/api/mining/stop', (req, res) => {
    try {
        const { minerId } = req.body;
        const result = cryptoMining.stopMining(minerId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Calculate earnings
app.get('/api/mining/earnings/:minerId', (req, res) => {
    try {
        const earnings = cryptoMining.calculateEarnings(req.params.minerId);
        res.json(earnings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== VIDEO EDITOR ENDPOINTS ====================

// Get effects library
app.get('/api/video/effects', (req, res) => {
    res.json(videoEditor.getEffects());
});

// Get transitions
app.get('/api/video/transitions', (req, res) => {
    res.json(videoEditor.getTransitions());
});

// Get templates
app.get('/api/video/templates', (req, res) => {
    res.json(videoEditor.getTemplates());
});

// Create video project
app.post('/api/video/project', (req, res) => {
    try {
        const project = videoEditor.createProject(req.body);
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get project
app.get('/api/video/project/:projectId', (req, res) => {
    const project = videoEditor.getProject(req.params.projectId);
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
});

// Add media to project
app.post('/api/video/project/:projectId/media', (req, res) => {
    try {
        const media = videoEditor.addMedia(req.params.projectId, req.body);
        res.json(media);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Apply effect
app.post('/api/video/effect', (req, res) => {
    try {
        const { projectId, clipId, effectId, params } = req.body;
        const effect = videoEditor.applyEffect(projectId, clipId, effectId, params);
        res.json(effect);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Render project
app.post('/api/video/render', (req, res) => {
    try {
        const { projectId, settings } = req.body;
        const job = videoEditor.renderProject(projectId, settings);
        res.json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get music video presets
app.get('/api/video/presets/music-video', (req, res) => {
    res.json(videoEditor.getMusicVideoPresets());
});

// ==================== DSP DISTRIBUTION ENDPOINTS ====================

// Get all platforms
app.get('/api/dsp/platforms', (req, res) => {
    res.json(dspDistribution.getPlatformStats());
});

// Get all releases
app.get('/api/dsp/releases', (req, res) => {
    res.json(dspDistribution.getReleases());
});

// Get single release
app.get('/api/dsp/releases/:releaseId', (req, res) => {
    const release = dspDistribution.getRelease(req.params.releaseId);
    if (!release) {
        return res.status(404).json({ error: 'Release not found' });
    }
    res.json(release);
});

// Create new release
app.post('/api/dsp/releases', (req, res) => {
    try {
        const release = dspDistribution.createRelease(req.body);
        res.json(release);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Submit to platforms
app.post('/api/dsp/submit/:releaseId', (req, res) => {
    try {
        const { platforms } = req.body;
        const result = dspDistribution.submitToPlatforms(req.params.releaseId, platforms);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Check delivery status
app.get('/api/dsp/status/:releaseId', (req, res) => {
    try {
        const status = dspDistribution.checkDeliveryStatus(req.params.releaseId);
        res.json(status);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get distribution recommendations
app.post('/api/dsp/recommendations', (req, res) => {
    const recommendations = dspDistribution.getDistributionRecommendations(req.body);
    res.json(recommendations);
});

// Configure Google Sheets
app.post('/api/dsp/google-sheets/config', (req, res) => {
    try {
        const result = dspDistribution.configureGoogleSheets(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Sync from Google Sheets
app.post('/api/dsp/google-sheets/sync', async (req, res) => {
    try {
        const result = await dspDistribution.syncFromGoogleSheets();
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Export to Google Sheets
app.post('/api/dsp/google-sheets/export', async (req, res) => {
    try {
        const result = await dspDistribution.exportToGoogleSheets();
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== COLLABORATION ENDPOINTS ====================

app.get('/api/collaboration/status', (req, res) => {
    res.json({
        activeMembers: collaborationHub.getActiveMembers?.()?.length ?? 0,
        totalMembers: collaborationHub.members?.length ?? 0,
        sharedFiles: collaborationHub.files?.length ?? 0,
        activeProjects: collaborationHub.getActiveProjects?.()?.length ?? 0,
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
        trendingGenres: marketAnalysis.getTrendingGenres?.() ?? [],
        platformInsights: marketAnalysis.platformInsights ?? {},
        lastUpdated: marketAnalysis.lastUpdated ?? null
    });
});

// Catch-all route - serve index.html for client-side routing
// Rate limited to prevent file-system abuse
const staticLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please slow down.'
});
app.get('*', staticLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    logger.error(err.stack || err.message);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 SUPER GOAT ROYALTIES Server running on port ${PORT}`);
    logger.info(`📊 Dashboard: http://localhost:${PORT}`);
    logger.info(`🔌 API Status: http://localhost:${PORT}/api/status`);
    logger.info(`🤖 AI Features: Enabled | Mode: ${aiConfig.demoMode ? 'DEMO' : 'LIVE'}`);
    logger.info('📚 RAG System: Active');
    logger.info('🤝 Autonomous Agents: Running');
    logger.info('📡 WebSocket: Connected');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
    });
});

module.exports = { app, server };