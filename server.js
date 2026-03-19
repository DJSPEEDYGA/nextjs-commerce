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

// Multi-Provider & OpenShell Components
const ProviderManager = require('./lib/providers/provider-manager');
const OpenShellClient = require('./lib/nvidia/openshell-client');
const InferenceRouter = require('./lib/nvidia/inference-router');
const SandboxManager = require('./lib/agents/sandbox-manager');

// UE5 CoPilot Components
const UE5CoPilot = require('./lib/ue5/ue5-copilot');
const BlueprintAnalyzer = require('./lib/ue5/blueprint-analyzer');

// Initialize multi-provider system
const providerManager = new ProviderManager();
const openshellClient = new OpenShellClient();
const inferenceRouter = new InferenceRouter({
    providerManager,
    openshellClient,
    demoMode: aiConfig.demoMode
});
const sandboxManager = new SandboxManager(openshellClient);

// Initialize sandbox mappings
sandboxManager.initializeAll().then(results => {
    const deployed = results.filter(r => r.status === 'found').length;
    console.log(`🐚 OpenShell: ${deployed}/${results.length} agent sandboxes mapped`);
}).catch(err => console.warn('OpenShell init:', err.message));

// Initialize UE5 CoPilot
const ue5CoPilot = new UE5CoPilot({ providerManager, demoMode: aiConfig.demoMode });
const blueprintAnalyzer = new BlueprintAnalyzer({ demoMode: aiConfig.demoMode });
console.log(`🔨 UE5 CoPilot: FORGE ready (v${ue5CoPilot.version}) — Featured on FAB by Epic Games`);
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
        version: '3.2.0',
        app: 'SUPER GOAT Royalties',
        mode: aiConfig.demoMode ? 'demo' : 'live',
        uptime: process.uptime(),
        features: {
            ai: true,
            nvidia: aiConfig.activeProviders.nvidia,
            openrouter: aiConfig.activeProviders.openrouter,
            openshell: aiConfig.activeProviders.openshell,
            lightning: aiConfig.activeProviders.lightning,
            huggingface: aiConfig.activeProviders.huggingface,
            rag: true,
            agents: true,
            assistants: true,
            multiProvider: true,
            sandboxes: true,
            inferenceRouting: true,
            websocket: true
        },
        providers: providerManager.getAllProviders().map(p => ({ id: p.id, name: p.name, status: p.status })),
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

// ==================== AI ASSISTANT ENDPOINTS ====================

const assistantManager = require('./lib/agents/assistant-manager');

// Get all assistants
app.get('/api/assistants', (req, res) => {
    res.json({ assistants: assistantManager.getAllAssistants() });
});

// Get assistant by section
app.get('/api/assistants/section/:section', (req, res) => {
    const assistant = assistantManager.getAssistantBySection(req.params.section);
    if (!assistant) return res.status(404).json({ error: 'Assistant not found for this section' });
    res.json(assistant);
});

// Chat with a specific assistant
app.post('/api/assistants/chat', async (req, res) => {
    try {
        const { assistantId, message } = req.body;
        if (!assistantId || !message) {
            return res.status(400).json({ error: 'assistantId and message are required' });
        }
        const result = await assistantManager.chat(assistantId, message);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a contextual tip from an assistant
app.get('/api/assistants/tip/:assistantId', async (req, res) => {
    try {
        const result = await assistantManager.getTip(req.params.assistantId);
        if (!result) return res.status(404).json({ error: 'Assistant not found' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== PROVIDER MANAGEMENT ENDPOINTS ====================

// Get all providers with status
app.get('/api/providers', (req, res) => {
    res.json({ providers: providerManager.getAllProviders() });
});

// Get provider stats
app.get('/api/providers/stats', (req, res) => {
    res.json(providerManager.getStats());
});

// Health check all providers
app.get('/api/providers/health', async (req, res) => {
    const health = await providerManager.healthCheck();
    res.json(health);
});

// Set active provider
app.post('/api/providers/active', (req, res) => {
    try {
        const { providerId } = req.body;
        const result = providerManager.setActiveProvider(providerId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== MODEL CATALOG ENDPOINTS ====================

// Get model catalog (from OpenRouter + all providers)
app.get('/api/models', async (req, res) => {
    try {
        const options = {
            search: req.query.search || null,
            provider: req.query.provider || null,
            category: req.query.category || null,
            sort: req.query.sort || 'popular',
            limit: parseInt(req.query.limit) || 50,
            minContext: req.query.minContext ? parseInt(req.query.minContext) : null
        };
        const catalog = await providerManager.getModelCatalog(options);
        res.json(catalog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Chat with any model via unified routing
app.post('/api/models/chat', async (req, res) => {
    try {
        const { model, messages, options } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'messages array is required' });
        }
        const result = await providerManager.chat(messages, { model, ...options });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get model recommendation for a task
app.get('/api/models/recommend/:taskType', (req, res) => {
    const { taskType } = req.params;
    const costTier = req.query.tier || 'balanced';
    const model = inferenceRouter.getRecommendedModel(taskType, { costTier });
    res.json({ taskType, costTier, recommendedModel: model });
});

// Inference routing — route through best provider
app.post('/api/inference/route', async (req, res) => {
    try {
        const { model, messages, options } = req.body;
        const result = await inferenceRouter.route({ model, messages, options });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inference routing analytics
app.get('/api/inference/analytics', (req, res) => {
    res.json(inferenceRouter.getAnalytics());
});

// ==================== NVIDIA OPENSHELL ENDPOINTS ====================

// Gateway status
app.get('/api/openshell/status', async (req, res) => {
    const status = await openshellClient.getGatewayStatus();
    res.json(status);
});

// List all sandboxes
app.get('/api/openshell/sandboxes', async (req, res) => {
    const sandboxes = await openshellClient.listSandboxes();
    res.json({ sandboxes, total: sandboxes.length });
});

// Get sandbox for specific agent
app.get('/api/openshell/sandboxes/agent/:agent', async (req, res) => {
    const sandbox = await sandboxManager.getAgentSandbox(req.params.agent);
    if (!sandbox) return res.status(404).json({ error: 'No sandbox profile for this agent' });
    res.json(sandbox);
});

// Get sandbox dashboard (all agents + security)
app.get('/api/openshell/dashboard', async (req, res) => {
    const dashboard = await sandboxManager.getDashboard();
    res.json(dashboard);
});

// Get security metrics
app.get('/api/openshell/security', async (req, res) => {
    const metrics = await openshellClient.getSecurityMetrics();
    res.json(metrics);
});

// Get inference routing config
app.get('/api/openshell/inference', async (req, res) => {
    const config = await openshellClient.getInferenceConfig();
    res.json(config);
});

// Get sandbox profiles
app.get('/api/openshell/profiles', (req, res) => {
    res.json({ profiles: sandboxManager.getProfiles() });
});

// Create sandbox for agent
app.post('/api/openshell/sandboxes', async (req, res) => {
    try {
        const { agent } = req.body;
        if (!agent) return res.status(400).json({ error: 'agent is required' });
        const sandbox = await sandboxManager.deployAgent(agent);
        res.json(sandbox);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Destroy sandbox
app.delete('/api/openshell/sandboxes/:sandboxId', async (req, res) => {
    const result = await openshellClient.destroySandbox(req.params.sandboxId);
    res.json(result);
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

// ==================== UE5 COPILOT ENDPOINTS ====================

// Plugin info — version, features, FAB listing
app.get('/api/ue5/info', (req, res) => {
    res.json(ue5CoPilot.getPluginInfo());
});

// Generate a Blueprint from natural language
app.post('/api/ue5/blueprint/generate', async (req, res) => {
    try {
        const { prompt, language, complexity, category, selectedNode, model } = req.body;
        if (!prompt) return res.status(400).json({ error: 'prompt is required' });
        const result = await ue5CoPilot.generateBlueprint(prompt, { language, complexity, category, selectedNode, model });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Build a complete scene from a command
app.post('/api/ue5/scene/build', async (req, res) => {
    try {
        const { command, options } = req.body;
        if (!command) return res.status(400).json({ error: 'command is required' });
        const result = await ue5CoPilot.buildScene(command, options || {});
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Analyze project architecture
app.post('/api/ue5/project/analyze', async (req, res) => {
    try {
        const { projectData, options } = req.body;
        const result = await ue5CoPilot.analyzeProject(projectData || {}, options || {});
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Refactor a Blueprint
app.post('/api/ue5/blueprint/refactor', async (req, res) => {
    try {
        const { blueprint, instruction, options } = req.body;
        if (!blueprint || !instruction) return res.status(400).json({ error: 'blueprint and instruction are required' });
        const result = await ue5CoPilot.refactorBlueprint(blueprint, instruction, options || {});
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Chat with FORGE (conversational co-pilot)
app.post('/api/ue5/chat', async (req, res) => {
    try {
        const { message, options } = req.body;
        if (!message) return res.status(400).json({ error: 'message is required' });
        const result = await ue5CoPilot.chat(message, options || {});
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Blueprint template library
app.get('/api/ue5/templates', (req, res) => {
    const filter = {
        category: req.query.category || null,
        complexity: req.query.complexity || null
    };
    const templates = ue5CoPilot.getTemplates(filter);
    res.json({ templates, total: templates.length });
});

// Get a single template by ID
app.get('/api/ue5/templates/:id', (req, res) => {
    const templates = ue5CoPilot.getTemplates({});
    const template = templates.find(t => t.id === req.params.id || t.name === req.params.id);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json({ template });
});

// Analyze a Blueprint for quality/performance
app.post('/api/ue5/blueprint/analyze', (req, res) => {
    const { blueprint } = req.body;
    if (!blueprint) return res.status(400).json({ error: 'blueprint text is required' });
    const result = blueprintAnalyzer.analyze(blueprint);
    res.json(result);
});

// Blueprint quick tips
app.get('/api/ue5/tips', (req, res) => {
    res.json({ tips: blueprintAnalyzer.getQuickTips() });
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
    console.log('🚀 SUPER GOAT ROYALTIES Server v3.2.0 running on port', PORT);
    console.log('📊 Dashboard: http://localhost:' + PORT);
    console.log('🔌 API Status: http://localhost:' + PORT + '/api/status');
    console.log('🤖 AI Assistants: 9 agents active');
    console.log('🎯 NVIDIA NIM: Integrated');
    console.log('🌐 OpenRouter: 653+ models available');
    console.log('🐚 NVIDIA OpenShell: Sandboxed agent execution');
    console.log('⚡ Lightning AI: Model APIs');
    console.log('🤗 Hugging Face: Open models');
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