const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

// Core config
const aiConfig = require('./lib/ai/ai-config');

// Security & Logging
const {
    globalLimiter, aiLimiter, authLimiter,
    validate, apiKeyAuth, jwtAuth,
    sanitizeError, requestEnhancer, securityHeaders
} = require('./lib/middleware/security');
const { logger, metrics, requestLogger } = require('./lib/utils/logger');

// AI & ML Components
const nvidiaClient = require('./lib/nvidia/nvidia-nim-client');
const lightningClient = require('./lib/lightning/lightning-ai-client');
const hfClient = require('./lib/huggingface/hf-inference-client');
const modelRegistry = require('./lib/models/model-registry');
const ragSystem = require('./lib/rag/rag-system');
const agentManager = require('./lib/agents/autonomous-agent-manager');
const ascapCatalog = require('./lib/catalog/ascap-catalog');
const {
    RevenueData, NFTPortfolio, CollaborationHub, MarketAnalysis
} = require('./lib/models/data-models');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;
const VERSION = '4.0.0';

// ==================== DATA INITIALIZATION ====================

const revenueData = new RevenueData();
const nftPortfolio = new NFTPortfolio();
const collaborationHub = new CollaborationHub();
const marketAnalysis = new MarketAnalysis();

async function initializeSampleData() {
    revenueData.update('spotify', 89200, { streams: 2500000, growth: 15.2 });
    revenueData.update('appleMusic', 67800, { streams: 1800000, growth: 18.7 });
    revenueData.update('youtube', 45300, { streams: 3200000, growth: 22.3 });
    revenueData.update('tidal', 12400, { streams: 450000, growth: 8.9 });
    revenueData.update('amazonMusic', 18900, { streams: 560000, growth: 12.4 });
    revenueData.growthRate = 23.5;

    nftPortfolio.addItem({ name: 'Genesis Track NFT', value: 45000, chain: 'Ethereum', description: 'First ever release as NFT' });
    nftPortfolio.addItem({ name: 'Album Art Collection', value: 32000, chain: 'Polygon', description: 'Complete album artwork series' });
    nftPortfolio.addItem({ name: 'Exclusive Beat Pack', value: 28000, chain: 'Solana', description: '10 exclusive beats' });
    nftPortfolio.addItem({ name: 'Limited Edition Single', value: 51000, chain: 'Ethereum', description: 'Limited to 100 copies' });

    collaborationHub.addMember({ name: 'Producer Mike', role: 'producer', email: 'mike@example.com' });
    collaborationHub.addMember({ name: 'Sarah Vocals', role: 'vocalist', email: 'sarah@example.com' });
    collaborationHub.addMember({ name: 'DJ Alex', role: 'dj', email: 'alex@example.com' });
    collaborationHub.createProject({ name: 'New Album Production', description: '2025 Album Project', members: ['Producer Mike', 'Sarah Vocals'] });

    marketAnalysis.updateGenreTrends('Hip-Hop', { growth: 25.4, streams: '1.2B', audience: '18-35' });
    marketAnalysis.updateGenreTrends('Pop', { growth: 18.7, streams: '980M', audience: '16-40' });
    marketAnalysis.updateGenreTrends('R&B', { growth: 22.1, streams: '650M', audience: '20-45' });

    await ragSystem.initializeIndustryKnowledge();

    // Load ASCAP catalogs
    const catalogFiles = [
        path.join(__dirname, '..', 'WorksCatalog2 HARVEY L MILLER WRITERS.csv'),
        path.join(__dirname, '..', 'WorksCatalogFASTASSMAN PUBLISHING INC ASCAP.csv')
    ];
    const existingFiles = catalogFiles.filter(f => fs.existsSync(f));
    if (existingFiles.length > 0) {
        const catalogStats = await ascapCatalog.loadFromFiles(existingFiles);
        logger.info(`ASCAP Catalog loaded: ${catalogStats.totalWorks} works, ${catalogStats.totalWriters} writers`);

        // Feed catalog to RAG
        const ragDocs = ascapCatalog.toRAGDocuments();
        for (const doc of ragDocs) {
            await ragSystem.addDocument(doc.id, doc.content, doc.metadata);
        }
        logger.info(`ASCAP catalog fed to RAG: ${ragDocs.length} documents`);
    }

    logger.info('All data initialized successfully');
}

initializeSampleData();

// ==================== MIDDLEWARE STACK ====================

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "blob:", "https:"],
            mediaSrc: ["'self'", "blob:", "data:"],
            connectSrc: ["'self'", "ws:", "wss:", "https:"],
            workerSrc: ["'self'", "blob:"]
        }
    },
    crossOriginEmbedderPolicy: false
}));
app.use(securityHeaders);

// CORS with whitelist
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(compression());
app.use(requestEnhancer);
app.use(requestLogger);
app.use(globalLimiter);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure directories exist
const logsDir = path.join(__dirname, 'logs');
const dawProjectsDir = path.join(__dirname, 'data', 'daw-projects');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
if (!fs.existsSync(dawProjectsDir)) fs.mkdirSync(dawProjectsDir, { recursive: true });

// ==================== WEBSOCKET SYSTEM ====================

const wsClients = new Map();
let wsIdCounter = 0;

wss.on('connection', (ws, req) => {
    const clientId = ++wsIdCounter;
    wsClients.set(clientId, { ws, subscriptions: new Set(), connectedAt: Date.now() });
    logger.info(`WebSocket client connected: #${clientId}`);

    ws.send(JSON.stringify({
        type: 'connection',
        clientId,
        message: 'Connected to SUPER GOAT ROYALTIES v' + VERSION,
        channels: ['royalties', 'market', 'agents', 'daw', 'catalog', 'notifications']
    }));

    ws.on('message', (raw) => {
        try {
            const data = JSON.parse(raw);
            handleWebSocketMessage(clientId, data);
        } catch (err) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
    });

    ws.on('close', () => {
        wsClients.delete(clientId);
        logger.info(`WebSocket client disconnected: #${clientId}`);
    });

    ws.on('error', (err) => {
        logger.error(`WebSocket error for client #${clientId}: ${err.message}`);
    });
});

function handleWebSocketMessage(clientId, data) {
    const client = wsClients.get(clientId);
    if (!client) return;

    switch (data.type) {
        case 'subscribe':
            (data.channels || []).forEach(ch => client.subscriptions.add(ch));
            client.ws.send(JSON.stringify({ type: 'subscribed', channels: Array.from(client.subscriptions) }));
            break;
        case 'unsubscribe':
            (data.channels || []).forEach(ch => client.subscriptions.delete(ch));
            client.ws.send(JSON.stringify({ type: 'unsubscribed', channels: Array.from(client.subscriptions) }));
            break;
        case 'ping':
            client.ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;
        case 'daw-sync':
            // Broadcast DAW state to other connected clients (collaboration)
            broadcast('daw', { type: 'daw-sync', data: data.payload, from: clientId }, clientId);
            break;
    }
}

function broadcast(channel, message, excludeClientId = null) {
    wsClients.forEach((client, id) => {
        if (id === excludeClientId) return;
        if (client.ws.readyState === WebSocket.OPEN) {
            if (client.subscriptions.size === 0 || client.subscriptions.has(channel)) {
                client.ws.send(JSON.stringify({ channel, timestamp: Date.now(), ...message }));
            }
        }
    });
}

// Periodic market updates
setInterval(() => {
    const update = {
        type: 'market-update',
        data: {
            totalRevenue: revenueData.totalRevenue,
            growthRate: revenueData.growthRate + (Math.random() * 2 - 1),
            timestamp: Date.now()
        }
    };
    broadcast('market', update);
}, 30000);

// Periodic agent status
setInterval(() => {
    broadcast('agents', {
        type: 'agent-status',
        data: agentManager.getMetrics()
    });
}, 15000);

function getCategoryIcon(category) {
    const icons = { 'text-generation': '💬', 'code': '💻', 'vision': '👁️', 'multimodal': '🌐', 'audio': '🎵', 'embedding': '📊' };
    return icons[category] || '🤖';
}

// ==================== HEALTH & STATUS ENDPOINTS ====================

app.get('/api/health', (req, res) => {
    const memUsage = process.memoryUsage();
    const catalogStats = ascapCatalog.getStats();
    res.json({
        status: 'healthy',
        version: VERSION,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: {
            rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
            heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
            heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
            external: Math.round(memUsage.external / 1024 / 1024) + 'MB'
        },
        services: {
            lightning: { active: !!aiConfig.lightning.apiKey, models: Object.keys(aiConfig.lightning.models).length },
            nvidia: { active: !aiConfig.demoMode, models: Object.keys(aiConfig.nvidia.models).length },
            huggingface: { active: !!aiConfig.huggingface?.token, providers: hfClient.getAvailableProviders().length },
            modelRegistry: { active: true, models: modelRegistry.getStats().totalModels },
            rag: { active: true, ...ragSystem.getStats() },
            agents: { active: true, ...agentManager.getMetrics() },
            catalog: { active: ascapCatalog.loaded, works: catalogStats.totalWorks || 0 },
            websocket: { active: true, clients: wsClients.size },
            daw: { active: true }
        },
        metrics: metrics.getSnapshot()
    });
});

app.get('/api/status', (req, res) => {
    const registryStats = modelRegistry.getStats();
    const hfProviders = hfClient.getAvailableProviders();
    const catalogStats = ascapCatalog.getStats();
    res.json({
        status: 'online',
        message: 'SUPER GOAT ROYALTIES API is running',
        version: VERSION,
        app: 'SUPER GOAT Royalties',
        mode: aiConfig.demoMode ? 'demo' : 'live',
        uptime: process.uptime(),
        features: {
            ai: true, nvidia: !aiConfig.demoMode, lightning: !!aiConfig.lightning.apiKey,
            huggingface: !!aiConfig.huggingface?.token, rag: true, agents: true,
            websocket: true, modelRegistry: true, ascapCatalog: ascapCatalog.loaded,
            dawStudio: true, healthMonitoring: true
        },
        counts: {
            lightningModels: Object.keys(aiConfig.lightning.models).length,
            nvidiaModels: Object.keys(aiConfig.nvidia.models).length,
            hfProviders: hfProviders.length,
            registryModels: registryStats.totalModels,
            registryCategories: registryStats.categories,
            catalogWorks: catalogStats.totalWorks || 0,
            catalogWriters: catalogStats.totalWriters || 0,
            wsClients: wsClients.size,
            totalModels: Object.keys(aiConfig.lightning.models).length + Object.keys(aiConfig.nvidia.models).length + registryStats.totalModels
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/api/metrics', (req, res) => { res.json(metrics.getSnapshot()); });

// ==================== DASHBOARD ====================

app.get('/api/dashboard', async (req, res) => {
    try {
        const registryStats = modelRegistry.getStats();
        const hfProviders = hfClient.getAvailableProviders();
        const catalogStats = ascapCatalog.getStats();
        res.json({
            totalRevenue: revenueData.totalRevenue,
            growthRate: revenueData.growthRate,
            platforms: revenueData.platforms,
            contentStats: { protectedTracks: catalogStats.totalWorks || 156, totalStreams: 3400000, downloads: 78000 },
            nftPortfolio: { totalValue: nftPortfolio.totalValue, items: nftPortfolio.items.length, chains: Object.keys(nftPortfolio.chains) },
            collaboration: { teamMembers: collaborationHub.members.length, sharedFiles: collaborationHub.files.length, activeProjects: collaborationHub.getActiveProjects().length },
            catalog: catalogStats,
            aiFeatures: {
                ragEnabled: true,
                agentsRunning: agentManager.getMetrics().activeAgents,
                autonomousMode: agentManager.getMetrics().autonomousMode,
                lightningModels: Object.keys(aiConfig.lightning.models).length,
                nvidiaModels: Object.keys(aiConfig.nvidia.models).length,
                hfProviders: hfProviders.length,
                registryModels: registryStats.totalModels,
                totalModels: Object.keys(aiConfig.lightning.models).length + Object.keys(aiConfig.nvidia.models).length + registryStats.totalModels
            }
        });
    } catch (error) {
        logger.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to load dashboard data' });
    }
});

// ==================== ASCAP CATALOG ENDPOINTS ====================

app.get('/api/catalog/works', validate('catalogSearch', 'query'), (req, res) => {
    const { q, title, writer, role, status, page, limit, sort, order } = req.query;
    const searchQuery = q || title || writer || '';
    const results = ascapCatalog.search(searchQuery, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        sort: sort || 'title',
        order: order || 'asc',
        role: role || null,
        status: status || null
    });
    res.json(results);
});

app.get('/api/catalog/works/:workId', (req, res) => {
    const work = ascapCatalog.getWork(req.params.workId);
    if (!work) return res.status(404).json({ error: 'Work not found' });
    res.json(work);
});

app.get('/api/catalog/stats', (req, res) => {
    res.json(ascapCatalog.getStats());
});

app.get('/api/catalog/writers', (req, res) => {
    const { page, limit } = req.query;
    res.json(ascapCatalog.getWriters(parseInt(page) || 1, parseInt(limit) || 20));
});

app.get('/api/catalog/timeline', (req, res) => {
    res.json(ascapCatalog.getTimeline());
});

// ==================== LIGHTNING AI ENDPOINTS ====================

app.get('/api/lightning/models', (req, res) => {
    const { provider, sortBy, order } = req.query;
    let models = lightningClient.getAllModels();
    if (provider) models = models.filter(m => m.provider.toLowerCase() === provider.toLowerCase());
    if (sortBy) {
        const ascending = order !== 'desc';
        models.sort((a, b) => ascending ? (a[sortBy] || 0) - (b[sortBy] || 0) : (b[sortBy] || 0) - (a[sortBy] || 0));
    }
    res.json({ total: models.length, mode: aiConfig.demoMode ? 'demo' : 'live', models });
});

app.get('/api/lightning/models/:key', (req, res) => {
    const model = lightningClient.getModel(req.params.key);
    if (!model) return res.status(404).json({ error: `Model "${req.params.key}" not found` });
    res.json(model);
});

app.post('/api/lightning/chat', aiLimiter, validate('chat'), async (req, res) => {
    try {
        const { messages, model, options } = req.body;
        const result = await lightningClient.chatCompletion(messages, model || 'llama-3.3-70b', options || {});
        metrics.recordAIRequest('lightning', model || 'llama-3.3-70b', Date.now() - req.startTime, true);
        res.json(result);
    } catch (error) {
        metrics.recordAIRequest('lightning', req.body.model, Date.now() - req.startTime, false);
        res.status(500).json({ error: 'AI request failed' });
    }
});

app.post('/api/lightning/generate', aiLimiter, validate('generate'), async (req, res) => {
    try {
        const { prompt, model, options } = req.body;
        const content = await lightningClient.generateText(prompt, model || 'llama-3.3-70b', options || {});
        res.json({ content, model: model || 'llama-3.3-70b' });
    } catch (error) { res.status(500).json({ error: 'Generation failed' }); }
});

app.post('/api/lightning/smart-route', aiLimiter, validate('autoRoute'), async (req, res) => {
    try {
        const { prompt, taskType, options } = req.body;
        const content = await lightningClient.smartRoute(prompt, taskType || 'general', options || {});
        res.json({ content, taskType: taskType || 'general' });
    } catch (error) { res.status(500).json({ error: 'Smart routing failed' }); }
});

app.post('/api/lightning/compare', aiLimiter, async (req, res) => {
    try {
        const { prompt, models, options } = req.body;
        if (!prompt) return res.status(400).json({ error: 'prompt is required' });
        const results = await lightningClient.compareModels(prompt, models || [], options || {});
        res.json({ results });
    } catch (error) { res.status(500).json({ error: 'Comparison failed' }); }
});

app.get('/api/lightning/usage', (req, res) => { res.json(lightningClient.getUsageStats()); });

// ==================== HUGGING FACE INFERENCE ENDPOINTS ====================

app.get('/api/hf/providers', (req, res) => {
    const providers = hfClient.getAvailableProviders();
    res.json({ total: providers.length, mode: aiConfig.demoMode ? 'demo' : 'live', providers });
});

app.get('/api/hf/providers/:providerId', (req, res) => {
    const provider = hfClient.getProviderInfo(req.params.providerId);
    if (!provider) return res.status(404).json({ error: `Provider "${req.params.providerId}" not found` });
    res.json(provider);
});

app.post('/api/hf/chat', aiLimiter, validate('chat'), async (req, res) => {
    try {
        const { messages, model, provider, options } = req.body;
        const result = await hfClient.chatCompletion(messages, model || 'meta-llama/Llama-3.3-70B-Instruct', provider || 'groq', options || {});
        metrics.recordAIRequest(provider || 'groq', model, Date.now() - req.startTime, true);
        res.json(result);
    } catch (error) {
        metrics.recordAIRequest(req.body.provider || 'groq', req.body.model, Date.now() - req.startTime, false);
        res.status(500).json({ error: 'HF chat request failed' });
    }
});

app.post('/api/hf/generate', aiLimiter, validate('generate'), async (req, res) => {
    try {
        const { prompt, model, provider, options } = req.body;
        const messages = [
            { role: 'system', content: options?.systemPrompt || 'You are an AI assistant for the GOAT Royalties platform.' },
            { role: 'user', content: prompt }
        ];
        const result = await hfClient.chatCompletion(messages, model || 'meta-llama/Llama-3.3-70B-Instruct', provider || 'groq', options || {});
        res.json(result);
    } catch (error) { res.status(500).json({ error: 'HF generation failed' }); }
});

app.post('/api/hf/auto-route', aiLimiter, validate('chat'), async (req, res) => {
    try {
        const { messages, model, options } = req.body;
        const result = await hfClient.autoRoute(messages, model || 'meta-llama/Llama-3.3-70B-Instruct', options || {});
        res.json(result);
    } catch (error) { res.status(500).json({ error: 'Auto-route failed' }); }
});

app.post('/api/hf/compare', aiLimiter, validate('compareModels'), async (req, res) => {
    try {
        const { prompt, model, providers, options } = req.body;
        const messages = [
            { role: 'system', content: options?.systemPrompt || 'You are an AI assistant.' },
            { role: 'user', content: prompt }
        ];
        const targetProviders = providers || ['groq', 'cerebras', 'together'];
        const targetModel = model || 'meta-llama/Llama-3.3-70B-Instruct';
        const results = await Promise.allSettled(
            targetProviders.map(async (prov) => {
                const result = await hfClient.chatCompletion(messages, targetModel, prov, options || {});
                return { provider: prov, ...result };
            })
        );
        res.json({
            model: targetModel,
            results: results.map((r, i) => ({
                provider: targetProviders[i],
                status: r.status,
                ...(r.status === 'fulfilled' ? r.value : { error: r.reason?.message })
            }))
        });
    } catch (error) { res.status(500).json({ error: 'Comparison failed' }); }
});

app.get('/api/hf/usage', (req, res) => { res.json(hfClient.getUsageStats()); });

// ==================== LOCAL RUNNER DETECTION ====================

app.get('/api/local/ollama', async (req, res) => {
    try { res.json(await hfClient.checkOllamaStatus()); }
    catch (error) { res.json({ running: false }); }
});

app.get('/api/local/vllm', async (req, res) => {
    try { res.json(await hfClient.checkVLLMStatus()); }
    catch (error) { res.json({ running: false }); }
});

app.get('/api/local/status', async (req, res) => {
    try {
        const [ollama, vllm] = await Promise.allSettled([hfClient.checkOllamaStatus(), hfClient.checkVLLMStatus()]);
        res.json({
            ollama: ollama.status === 'fulfilled' ? ollama.value : { running: false },
            vllm: vllm.status === 'fulfilled' ? vllm.value : { running: false }
        });
    } catch (error) { res.json({ ollama: { running: false }, vllm: { running: false } }); }
});

// ==================== MODEL REGISTRY ENDPOINTS ====================

app.get('/api/models', (req, res) => {
    const { category, provider, trending, search, family } = req.query;
    let models;
    if (search) models = modelRegistry.searchModels(search);
    else if (category) models = modelRegistry.getModelsByCategory(category);
    else if (provider) models = modelRegistry.getModelsByProvider(provider);
    else if (family) models = modelRegistry.getModelsByFamily(family);
    else if (trending === 'true') models = modelRegistry.getTrendingModels();
    else models = modelRegistry.getAllModels();
    res.json({ total: models.length, models });
});

app.get('/api/models/stats', (req, res) => { res.json(modelRegistry.getStats()); });

app.get('/api/models/categories', (req, res) => {
    const stats = modelRegistry.getStats();
    const categories = Object.entries(stats.byCategory).map(([name, count]) => ({ name, count, icon: getCategoryIcon(name) }));
    res.json({ categories });
});

app.get('/api/models/trending', (req, res) => {
    const trending = modelRegistry.getTrendingModels();
    res.json({ total: trending.length, models: trending });
});

app.get('/api/models/families', (req, res) => {
    const stats = modelRegistry.getStats();
    const families = Object.entries(stats.byFamily).map(([name, count]) => ({ name, count }));
    families.sort((a, b) => b.count - a.count);
    res.json({ families });
});

app.get('/api/models/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query "q" is required' });
    const results = modelRegistry.searchModels(q);
    res.json({ query: q, total: results.length, models: results });
});

app.get('/api/models/:id(*)', (req, res) => {
    const model = modelRegistry.getModel(req.params.id);
    if (!model) return res.status(404).json({ error: `Model "${req.params.id}" not found` });
    res.json(model);
});

// ==================== UNIFIED AI CHAT ENDPOINT ====================

app.post('/api/ai/chat', aiLimiter, validate('chat'), async (req, res) => {
    try {
        const { messages, model, provider, taskType, options } = req.body;

        const chatMessages = messages || [
            { role: 'system', content: options?.systemPrompt || 'You are an AI assistant for the GOAT Royalties platform.' },
            { role: 'user', content: req.body.prompt }
        ];

        let result;
        const hfProviderList = ['groq', 'cerebras', 'sambanova', 'together', 'fireworks', 'novita',
            'replicate', 'cohere', 'scaleway', 'hyperbolic', 'fal', 'featherless',
            'nscale', 'hf-inference', 'ollama', 'vllm'];

        if (provider === 'nvidia' || model?.startsWith('nvidia/')) {
            const lastMsg = chatMessages[chatMessages.length - 1]?.content || '';
            const nvidiaModel = model?.replace('nvidia/', '') || 'mixtral-8x7b';
            const content = await nvidiaClient.generateText(lastMsg, nvidiaModel, options || {});
            result = { content, model: nvidiaModel, provider: 'nvidia' };
        } else if (provider === 'hf' || provider === 'huggingface' || hfProviderList.includes(provider)) {
            const hfProvider = (provider === 'hf' || provider === 'huggingface') ? 'groq' : provider;
            result = await hfClient.chatCompletion(chatMessages, model || 'meta-llama/Llama-3.3-70B-Instruct', hfProvider, options || {});
        } else if (provider === 'hf-auto') {
            result = await hfClient.autoRoute(chatMessages, model || 'meta-llama/Llama-3.3-70B-Instruct', options || {});
        } else if (taskType) {
            const lastMsg = chatMessages[chatMessages.length - 1]?.content || '';
            const content = await lightningClient.smartRoute(lastMsg, taskType, options || {});
            result = { content, provider: 'lightning', taskType };
        } else {
            result = await lightningClient.chatCompletion(chatMessages, model || 'llama-3.3-70b', options || {});
        }

        res.json(result);
    } catch (error) { res.status(500).json({ error: 'Chat request failed' }); }
});

// ==================== AI STATS ====================

app.get('/api/ai/stats', (req, res) => {
    const registryStats = modelRegistry.getStats();
    const hfProviders = hfClient.getAvailableProviders();
    const catalogStats = ascapCatalog.getStats();
    res.json({
        platform: 'SUPER GOAT Royalties',
        version: VERSION,
        providers: {
            lightning: { models: Object.keys(aiConfig.lightning.models).length, usage: lightningClient.getUsageStats() },
            nvidia: { models: Object.keys(aiConfig.nvidia.models).length },
            huggingface: { providers: hfProviders.length, providerList: hfProviders.map(p => p.name), usage: hfClient.getUsageStats() }
        },
        modelRegistry: registryStats,
        catalog: catalogStats,
        totalModels: Object.keys(aiConfig.lightning.models).length + Object.keys(aiConfig.nvidia.models).length + registryStats.totalModels,
        capabilities: ['text-generation', 'code', 'vision', 'multimodal', 'audio', 'embedding', 'rag', 'autonomous-agents', 'smart-routing', 'multi-provider', 'local-runners', 'ascap-catalog', 'daw-studio', 'film-scoring']
    });
});

// ==================== AI & LLM ENHANCED ENDPOINTS ====================

app.get('/api/ai/revenue-analysis', async (req, res) => {
    try {
        const { model, provider } = req.query;
        const revenueInfo = { totalRevenue: revenueData.totalRevenue, growthRate: revenueData.growthRate, platforms: revenueData.platforms };
        let analysis;
        if (provider && ['groq', 'cerebras', 'together', 'fireworks'].includes(provider)) {
            const messages = [{ role: 'user', content: `Analyze this music royalty revenue data and provide insights:\n${JSON.stringify(revenueInfo)}` }];
            const result = await hfClient.chatCompletion(messages, model || 'meta-llama/Llama-3.3-70B-Instruct', provider, {});
            analysis = result.content;
        } else if (model && aiConfig.lightning.models[model]) {
            analysis = await lightningClient.analyzeRevenue(revenueInfo, model);
        } else {
            analysis = await nvidiaClient.analyzeRoyaltyData(revenueInfo);
        }
        res.json({ analysis, model: model || 'default', provider: provider || 'default' });
    } catch (error) { res.status(500).json({ error: 'Revenue analysis failed' }); }
});

app.get('/api/ai/market-predictions', async (req, res) => {
    try {
        const { genre, platform, timeframe, model, provider } = req.query;
        let predictions;
        if (provider && ['groq', 'cerebras', 'together', 'fireworks'].includes(provider)) {
            const messages = [{ role: 'user', content: `Predict market trends for ${genre || 'Hip-Hop'} music on ${platform || 'Spotify'} over the next ${timeframe || '6 months'}. Provide specific predictions with data.` }];
            const result = await hfClient.chatCompletion(messages, model || 'meta-llama/Llama-3.3-70B-Instruct', provider, {});
            predictions = result.content;
        } else if (model && aiConfig.lightning.models[model]) {
            predictions = await lightningClient.predictMarketTrends(genre || 'Hip-Hop', platform || 'Spotify', timeframe || '6 months', model);
        } else {
            predictions = await nvidiaClient.predictMarketTrends(genre || 'Hip-Hop', platform || 'Spotify', timeframe || '6 months');
        }
        res.json({ predictions });
    } catch (error) { res.status(500).json({ error: 'Market prediction failed' }); }
});

app.post('/api/ai/content-recommendations', aiLimiter, validate('contentRecommendation'), async (req, res) => {
    try {
        const { artistProfile, currentContent, model, provider } = req.body;
        let recommendations;
        if (provider && ['groq', 'cerebras', 'together', 'fireworks'].includes(provider)) {
            const messages = [{ role: 'user', content: `Generate content strategy recommendations for this artist:\n${JSON.stringify({ artistProfile, currentContent })}` }];
            const result = await hfClient.chatCompletion(messages, model || 'meta-llama/Llama-3.3-70B-Instruct', provider, {});
            recommendations = result.content;
        } else if (model && aiConfig.lightning.models[model]) {
            recommendations = await lightningClient.generateContentStrategy(artistProfile, currentContent, model);
        } else {
            recommendations = await nvidiaClient.generateContentRecommendations(artistProfile, currentContent);
        }
        res.json({ recommendations });
    } catch (error) { res.status(500).json({ error: 'Content recommendation failed' }); }
});

app.post('/api/ai/generate-contract', aiLimiter, validate('contractGeneration'), async (req, res) => {
    try {
        const { contractType, parties, terms, model, provider } = req.body;
        let contract;
        if (provider && ['groq', 'cerebras', 'together', 'fireworks'].includes(provider)) {
            const messages = [{ role: 'user', content: `Generate a ${contractType || 'music licensing'} contract for:\nParties: ${JSON.stringify(parties)}\nTerms: ${JSON.stringify(terms)}` }];
            const result = await hfClient.chatCompletion(messages, model || 'meta-llama/Llama-3.3-70B-Instruct', provider, {});
            contract = result.content;
        } else if (model && aiConfig.lightning.models[model]) {
            contract = await lightningClient.generateContract(contractType, parties, terms, model);
        } else {
            contract = await nvidiaClient.generateContractTerms(contractType, parties, terms);
        }
        res.json({ contract });
    } catch (error) { res.status(500).json({ error: 'Contract generation failed' }); }
});

// ==================== RAG ENDPOINTS ====================

app.post('/api/rag/query', aiLimiter, validate('ragQuery'), async (req, res) => {
    try { const { query } = req.body; res.json({ response: await ragSystem.generateResponse(query) }); }
    catch (error) { res.status(500).json({ error: 'RAG query failed' }); }
});

app.post('/api/rag/document', async (req, res) => {
    try { const { id, content, metadata } = req.body; res.json({ success: true, ...(await ragSystem.addDocument(id, content, metadata)) }); }
    catch (error) { res.status(500).json({ error: 'Document ingestion failed' }); }
});

app.get('/api/rag/stats', (req, res) => { res.json(ragSystem.getStats()); });

// ==================== AGENT ENDPOINTS ====================

app.post('/api/agents/execute', aiLimiter, async (req, res) => {
    try {
        const { agentId, task, context } = req.body;
        const result = await agentManager.executeAgent(agentId, task, context);
        broadcast('agents', { type: 'agent-complete', agentId, task });
        res.json({ success: true, result });
    } catch (error) { res.status(500).json({ error: 'Agent execution failed' }); }
});

app.post('/api/agents/queue', (req, res) => {
    const { agentId, task, context } = req.body;
    agentManager.queueTask(agentId, task, context);
    res.json({ success: true, message: 'Task queued' });
});

app.get('/api/agents/status', (req, res) => {
    res.json({ agents: agentManager.getAgentStatus(), metrics: agentManager.getMetrics() });
});

app.post('/api/agents/autonomous', (req, res) => {
    const { enabled } = req.body;
    agentManager.setAutonomousMode(enabled);
    res.json({ success: true, autonomousMode: enabled });
});

// ==================== NVIDIA NIM ENDPOINTS ====================

app.post('/api/nvidia/generate', aiLimiter, validate('generate'), async (req, res) => {
    try { const { prompt, model, options } = req.body; res.json({ result: await nvidiaClient.generateText(prompt, model, options) }); }
    catch (error) { res.status(500).json({ error: 'NVIDIA generation failed' }); }
});

app.get('/api/nvidia/models', (req, res) => { res.json(nvidiaClient.getModelCapabilities()); });

// ==================== REVENUE ENDPOINTS ====================

app.get('/api/revenue/predictions', async (req, res) => {
    try {
        const aiAnalysis = await nvidiaClient.analyzeRoyaltyData({ totalRevenue: revenueData.totalRevenue, growthRate: revenueData.growthRate, platforms: revenueData.platforms });
        res.json({
            nextMonth: { predicted: revenueData.totalRevenue * 1.23, increase: revenueData.totalRevenue * 0.23, confidence: 95 },
            opportunities: [
                { platform: 'TikTok', potential: 25000, priority: 'high' },
                { platform: 'Spotify Playlists', potential: 18000, priority: 'high' },
                { platform: 'YouTube Sync', potential: 15000, priority: 'medium' }
            ],
            aiAnalysis: typeof aiAnalysis === 'string' ? aiAnalysis.substring(0, 500) : JSON.stringify(aiAnalysis).substring(0, 500)
        });
    } catch (error) { res.status(500).json({ error: 'Revenue prediction failed' }); }
});

// ==================== NFT ENDPOINTS ====================

app.get('/api/nft/portfolio', (req, res) => {
    res.json({ totalValue: nftPortfolio.totalValue, items: nftPortfolio.items, chains: nftPortfolio.chains, recentSales: nftPortfolio.salesHistory.slice(-5) });
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
        storageUsed: '450GB', storageTotal: '1TB'
    });
});

// ==================== MARKET ANALYSIS ====================

app.get('/api/market/trends', (req, res) => {
    res.json({ trendingGenres: marketAnalysis.getTrendingGenres(), platformInsights: marketAnalysis.platformInsights, lastUpdated: marketAnalysis.lastUpdated });
});

// ==================== DAW STUDIO ENDPOINTS ====================

// DAW project management
app.get('/api/daw/projects', (req, res) => {
    try {
        const projects = [];
        if (fs.existsSync(dawProjectsDir)) {
            const files = fs.readdirSync(dawProjectsDir).filter(f => f.endsWith('.json'));
            for (const file of files) {
                try {
                    const data = JSON.parse(fs.readFileSync(path.join(dawProjectsDir, file), 'utf-8'));
                    projects.push({ id: data.id, name: data.name, bpm: data.bpm, timeSignature: data.timeSignature, createdAt: data.createdAt, updatedAt: data.updatedAt, trackCount: (data.tracks || []).length });
                } catch (e) { /* skip corrupted */ }
            }
        }
        res.json({ projects, total: projects.length });
    } catch (error) { res.status(500).json({ error: 'Failed to list projects' }); }
});

app.post('/api/daw/projects', (req, res) => {
    try {
        const { name, bpm, timeSignature, genre } = req.body;
        const id = require('uuid').v4();
        const project = {
            id, name: name || 'Untitled Project',
            bpm: bpm || 120,
            timeSignature: timeSignature || '4/4',
            genre: genre || 'Hip-Hop',
            sampleRate: 44100,
            bitDepth: 24,
            tracks: [],
            markers: [],
            cueList: [],
            tempoMap: [{ position: 0, bpm: bpm || 120 }],
            timecodeOffset: '01:00:00:00',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        fs.writeFileSync(path.join(dawProjectsDir, `${id}.json`), JSON.stringify(project, null, 2));
        broadcast('daw', { type: 'project-created', project: { id, name: project.name } });
        res.json(project);
    } catch (error) { res.status(500).json({ error: 'Failed to create project' }); }
});

app.get('/api/daw/projects/:id', (req, res) => {
    try {
        const filePath = path.join(dawProjectsDir, `${req.params.id}.json`);
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Project not found' });
        res.json(JSON.parse(fs.readFileSync(filePath, 'utf-8')));
    } catch (error) { res.status(500).json({ error: 'Failed to load project' }); }
});

app.put('/api/daw/projects/:id', (req, res) => {
    try {
        const filePath = path.join(dawProjectsDir, `${req.params.id}.json`);
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Project not found' });
        const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const updated = { ...existing, ...req.body, id: existing.id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() };
        fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
        broadcast('daw', { type: 'project-updated', projectId: existing.id });
        res.json(updated);
    } catch (error) { res.status(500).json({ error: 'Failed to update project' }); }
});

app.delete('/api/daw/projects/:id', (req, res) => {
    try {
        const filePath = path.join(dawProjectsDir, `${req.params.id}.json`);
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Project not found' });
        fs.unlinkSync(filePath);
        res.json({ success: true, message: 'Project deleted' });
    } catch (error) { res.status(500).json({ error: 'Failed to delete project' }); }
});

// DAW AI Composition Assistant
app.post('/api/daw/ai/compose', aiLimiter, async (req, res) => {
    try {
        const { genre, mood, key, scale, bpm, bars, style, instrument } = req.body;
        const prompt = `You are an expert music composer and producer. Generate a ${bars || 8}-bar ${genre || 'Hip-Hop'} ${instrument || 'melody'} composition.

Requirements:
- Genre: ${genre || 'Hip-Hop'}
- Mood: ${mood || 'energetic'}
- Key: ${key || 'C'} ${scale || 'minor'}
- BPM: ${bpm || 120}
- Style: ${style || 'modern trap beat'}

Return a JSON object with:
1. "notes": Array of note objects with {note (e.g. "C4"), startBeat, duration (in beats), velocity (0-127)}
2. "chords": Array of chord objects with {chord (e.g. "Cm7"), startBeat, duration}
3. "description": Brief description of the composition
4. "arrangement": Suggested arrangement/structure`;

        let result;
        try {
            result = await lightningClient.chatCompletion(
                [{ role: 'system', content: 'You are an expert music composer. Always respond with valid JSON.' }, { role: 'user', content: prompt }],
                'llama-3.3-70b', { temperature: 0.8, max_tokens: 2000 }
            );
        } catch (e) {
            // Demo fallback
            result = { content: JSON.stringify(generateDemoComposition(genre, key, scale, bpm, bars)) };
        }

        let composition;
        try {
            const content = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            composition = jsonMatch ? JSON.parse(jsonMatch[0]) : generateDemoComposition(genre, key, scale, bpm, bars);
        } catch (e) {
            composition = generateDemoComposition(genre, key, scale, bpm, bars);
        }

        res.json({ composition, genre, key, scale, bpm, bars, aiPowered: true });
    } catch (error) { res.status(500).json({ error: 'AI composition failed' }); }
});

// DAW AI Mastering suggestions
app.post('/api/daw/ai/master', aiLimiter, async (req, res) => {
    try {
        const { genre, trackInfo, targetLoudness } = req.body;
        const prompt = `As a professional mastering engineer, provide mastering chain recommendations for:
Genre: ${genre || 'Hip-Hop'}
Track Info: ${JSON.stringify(trackInfo || { tracks: 4, duration: '3:30' })}
Target Loudness: ${targetLoudness || '-14 LUFS (streaming standard)'}

Provide JSON with: processingChain (array of effects with parameters), recommendations (array of tips), targetSpecs (object with loudness/dynamics targets)`;

        let result;
        try {
            result = await lightningClient.chatCompletion(
                [{ role: 'system', content: 'You are an expert mastering engineer. Respond with valid JSON.' }, { role: 'user', content: prompt }],
                'llama-3.3-70b', { temperature: 0.3, max_tokens: 1500 }
            );
        } catch (e) {
            result = { content: JSON.stringify(getDemoMasteringChain(genre)) };
        }

        let mastering;
        try {
            const content = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            mastering = jsonMatch ? JSON.parse(jsonMatch[0]) : getDemoMasteringChain(genre);
        } catch (e) {
            mastering = getDemoMasteringChain(genre);
        }

        res.json({ mastering, genre, aiPowered: true });
    } catch (error) { res.status(500).json({ error: 'AI mastering analysis failed' }); }
});

// DAW Sound Library - built-in instruments & presets
app.get('/api/daw/sounds', (req, res) => {
    const { category, search } = req.query;
    let sounds = getBuiltInSounds();
    if (category) sounds = sounds.filter(s => s.category === category);
    if (search) {
        const q = search.toLowerCase();
        sounds = sounds.filter(s => s.name.toLowerCase().includes(q) || s.tags.some(t => t.includes(q)));
    }
    res.json({ total: sounds.length, sounds });
});

app.get('/api/daw/sounds/categories', (req, res) => {
    const sounds = getBuiltInSounds();
    const cats = {};
    sounds.forEach(s => { cats[s.category] = (cats[s.category] || 0) + 1; });
    res.json({ categories: Object.entries(cats).map(([name, count]) => ({ name, count })) });
});

// DAW Film Scoring - Cue Management
app.post('/api/daw/cues', (req, res) => {
    try {
        const { projectId, name, timecodeIn, timecodeOut, description, scene } = req.body;
        const filePath = path.join(dawProjectsDir, `${projectId}.json`);
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Project not found' });
        const project = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const cue = {
            id: require('uuid').v4(),
            name: name || 'New Cue',
            timecodeIn: timecodeIn || '01:00:00:00',
            timecodeOut: timecodeOut || '01:00:30:00',
            description: description || '',
            scene: scene || '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        project.cueList = project.cueList || [];
        project.cueList.push(cue);
        project.updatedAt = new Date().toISOString();
        fs.writeFileSync(filePath, JSON.stringify(project, null, 2));
        res.json(cue);
    } catch (error) { res.status(500).json({ error: 'Failed to create cue' }); }
});

// ==================== HELPER FUNCTIONS ====================

function generateDemoComposition(genre, key, scale, bpm, bars) {
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const minorScale = [0, 2, 3, 5, 7, 8, 10];
    const majorScale = [0, 2, 4, 5, 7, 9, 11];
    const scaleIntervals = (scale || 'minor') === 'minor' ? minorScale : majorScale;
    const rootIdx = notes.indexOf((key || 'C').charAt(0));

    const composition = { notes: [], chords: [], description: '', arrangement: '' };
    const numBars = parseInt(bars) || 8;

    // Generate melody
    for (let bar = 0; bar < numBars; bar++) {
        const notesPerBar = genre === 'Hip-Hop' ? 4 : genre === 'Classical' ? 8 : 4;
        for (let n = 0; n < notesPerBar; n++) {
            const scaleIdx = Math.floor(Math.random() * scaleIntervals.length);
            const semitone = (rootIdx + scaleIntervals[scaleIdx]) % 12;
            const octave = 3 + Math.floor(Math.random() * 2);
            const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            composition.notes.push({
                note: noteNames[semitone] + octave,
                startBeat: bar * 4 + n * (4 / notesPerBar),
                duration: 4 / notesPerBar * 0.9,
                velocity: 60 + Math.floor(Math.random() * 60)
            });
        }
    }

    // Generate chord progression
    const chordPatterns = {
        'Hip-Hop': ['m7', 'm7', '7', 'm7'],
        'Pop': ['maj7', 'min7', 'min7', 'maj7'],
        'R&B': ['maj9', 'min7', '7', 'min9'],
        'Jazz': ['maj7', 'min7', 'dom7', 'dim7'],
        'Classical': ['', 'min', '', 'min'],
        'Electronic': ['min', 'min', 'maj', 'min']
    };
    const pattern = chordPatterns[genre] || chordPatterns['Hip-Hop'];
    for (let bar = 0; bar < numBars; bar++) {
        const chordType = pattern[bar % pattern.length];
        const rootNote = notes[(rootIdx + scaleIntervals[bar % scaleIntervals.length]) % 7];
        composition.chords.push({
            chord: rootNote + chordType,
            startBeat: bar * 4,
            duration: 4
        });
    }

    composition.description = `AI-generated ${numBars}-bar ${genre || 'Hip-Hop'} composition in ${key || 'C'} ${scale || 'minor'} at ${bpm || 120} BPM`;
    composition.arrangement = `Intro (2 bars) → Verse (${numBars - 4} bars) → Hook (2 bars)`;

    return composition;
}

function getDemoMasteringChain(genre) {
    const chains = {
        'Hip-Hop': {
            processingChain: [
                { effect: 'EQ', type: 'Parametric', params: { lowCut: '30Hz', highShelf: '+2dB @ 12kHz', midScoop: '-1.5dB @ 400Hz' } },
                { effect: 'Compressor', type: 'Bus', params: { threshold: '-8dB', ratio: '2:1', attack: '10ms', release: '100ms' } },
                { effect: 'Multiband Compressor', type: '4-band', params: { lowBand: '0-100Hz', midLow: '100-1kHz', midHigh: '1k-8kHz', high: '8k+' } },
                { effect: 'Stereo Widener', params: { width: '110%', mode: 'mid-side' } },
                { effect: 'Limiter', type: 'True Peak', params: { ceiling: '-1dBTP', release: '50ms' } }
            ],
            recommendations: ['Boost sub-bass 40-60Hz for punch', 'Use parallel compression for drums', 'Keep vocals forward with mid-side EQ', 'Reference against Drake/Metro Boomin masters'],
            targetSpecs: { loudness: '-8 to -10 LUFS', truePeak: '-1 dBTP', dynamicRange: '6-8 dB' }
        },
        'default': {
            processingChain: [
                { effect: 'EQ', type: 'Linear Phase', params: { lowCut: '25Hz', corrections: 'genre-dependent' } },
                { effect: 'Compressor', type: 'Glue', params: { threshold: '-6dB', ratio: '2:1', attack: '20ms', release: '200ms' } },
                { effect: 'Stereo Imaging', params: { width: '105%' } },
                { effect: 'Limiter', type: 'True Peak', params: { ceiling: '-1dBTP' } }
            ],
            recommendations: ['Always reference against commercial releases', 'Check on multiple playback systems', 'Leave dynamic range for streaming normalization'],
            targetSpecs: { loudness: '-14 LUFS (streaming)', truePeak: '-1 dBTP', dynamicRange: '8-12 dB' }
        }
    };
    return chains[genre] || chains['default'];
}

function getBuiltInSounds() {
    return [
        // Drums
        { id: 'kick-808', name: '808 Kick', category: 'drums', type: 'synth', params: { oscillator: 'sine', frequency: 55, decay: 0.5 }, tags: ['808', 'kick', 'bass', 'trap'] },
        { id: 'kick-boom', name: 'Boom Kick', category: 'drums', type: 'synth', params: { oscillator: 'sine', frequency: 60, decay: 0.3 }, tags: ['kick', 'boom', 'hip-hop'] },
        { id: 'snare-crack', name: 'Crack Snare', category: 'drums', type: 'noise', params: { filter: 'highpass', frequency: 200, decay: 0.15 }, tags: ['snare', 'crack', 'sharp'] },
        { id: 'snare-rim', name: 'Rim Shot', category: 'drums', type: 'noise', params: { filter: 'bandpass', frequency: 1000, decay: 0.08 }, tags: ['snare', 'rim', 'tight'] },
        { id: 'hihat-closed', name: 'Closed Hi-Hat', category: 'drums', type: 'noise', params: { filter: 'highpass', frequency: 8000, decay: 0.03 }, tags: ['hihat', 'closed', 'tight'] },
        { id: 'hihat-open', name: 'Open Hi-Hat', category: 'drums', type: 'noise', params: { filter: 'highpass', frequency: 6000, decay: 0.2 }, tags: ['hihat', 'open', 'sizzle'] },
        { id: 'clap-layered', name: 'Layered Clap', category: 'drums', type: 'noise', params: { filter: 'bandpass', frequency: 1500, decay: 0.12 }, tags: ['clap', 'layered', 'big'] },
        { id: 'perc-conga', name: 'Conga', category: 'drums', type: 'synth', params: { oscillator: 'sine', frequency: 200, decay: 0.1 }, tags: ['conga', 'percussion', 'latin'] },
        // Bass
        { id: 'bass-sub', name: 'Sub Bass', category: 'bass', type: 'synth', params: { oscillator: 'sine', filter: 'lowpass', cutoff: 200 }, tags: ['sub', 'bass', 'deep'] },
        { id: 'bass-808-long', name: '808 Bass (Long)', category: 'bass', type: 'synth', params: { oscillator: 'sine', glide: true, decay: 2.0 }, tags: ['808', 'bass', 'trap', 'glide'] },
        { id: 'bass-reese', name: 'Reese Bass', category: 'bass', type: 'synth', params: { oscillator: 'saw', detune: 10, filter: 'lowpass' }, tags: ['reese', 'bass', 'dnb', 'dark'] },
        { id: 'bass-acid', name: 'Acid Bass', category: 'bass', type: 'synth', params: { oscillator: 'saw', filter: 'lowpass', resonance: 0.8, envMod: 0.7 }, tags: ['acid', 'bass', 'tb303'] },
        // Synths
        { id: 'synth-pad-warm', name: 'Warm Pad', category: 'synths', type: 'synth', params: { oscillator: 'saw', voices: 4, filter: 'lowpass', cutoff: 2000, attack: 0.5, release: 2.0 }, tags: ['pad', 'warm', 'ambient', 'lush'] },
        { id: 'synth-lead-saw', name: 'Saw Lead', category: 'synths', type: 'synth', params: { oscillator: 'saw', filter: 'lowpass', cutoff: 5000 }, tags: ['lead', 'saw', 'bright'] },
        { id: 'synth-pluck', name: 'Pluck', category: 'synths', type: 'synth', params: { oscillator: 'triangle', decay: 0.2, filter: 'lowpass', envMod: 0.5 }, tags: ['pluck', 'short', 'percussive'] },
        { id: 'synth-strings', name: 'Analog Strings', category: 'synths', type: 'synth', params: { oscillator: 'saw', voices: 8, chorus: true, attack: 0.8 }, tags: ['strings', 'analog', 'lush', 'orchestral'] },
        { id: 'synth-brass', name: 'Brass Stab', category: 'synths', type: 'synth', params: { oscillator: 'saw', voices: 3, decay: 0.3 }, tags: ['brass', 'stab', 'funky'] },
        // Keys
        { id: 'keys-epiano', name: 'Electric Piano', category: 'keys', type: 'fm', params: { algorithm: 'rhodes', harmonics: 4, tremolo: true }, tags: ['epiano', 'rhodes', 'keys', 'warm'] },
        { id: 'keys-organ', name: 'B3 Organ', category: 'keys', type: 'additive', params: { drawbars: [8, 8, 6, 0, 0, 0, 0, 0, 0], leslie: true }, tags: ['organ', 'b3', 'hammond'] },
        { id: 'keys-piano', name: 'Grand Piano', category: 'keys', type: 'sample', params: { velocity: true, sustain: true }, tags: ['piano', 'grand', 'acoustic', 'classical'] },
        // FX
        { id: 'fx-riser', name: 'White Noise Riser', category: 'fx', type: 'noise', params: { filter: 'highpass', sweep: true, duration: 4 }, tags: ['riser', 'transition', 'buildup'] },
        { id: 'fx-impact', name: 'Cinematic Impact', category: 'fx', type: 'noise', params: { filter: 'lowpass', reverb: 2.0, decay: 3.0 }, tags: ['impact', 'cinematic', 'hit', 'film'] },
        { id: 'fx-sweep-down', name: 'Sweep Down', category: 'fx', type: 'noise', params: { filter: 'lowpass', sweep: true, direction: 'down', duration: 2 }, tags: ['sweep', 'down', 'transition'] },
        { id: 'fx-vinyl-crackle', name: 'Vinyl Crackle', category: 'fx', type: 'noise', params: { filter: 'bandpass', density: 0.3 }, tags: ['vinyl', 'lofi', 'texture', 'crackle'] },
        // Scoring
        { id: 'score-tension', name: 'Tension Strings', category: 'scoring', type: 'synth', params: { oscillator: 'saw', voices: 12, dissonance: 0.3, tremolo: true }, tags: ['tension', 'strings', 'film', 'score', 'suspense'] },
        { id: 'score-epic-brass', name: 'Epic Brass Ensemble', category: 'scoring', type: 'synth', params: { oscillator: 'saw', voices: 6, reverb: 1.5 }, tags: ['brass', 'epic', 'film', 'score', 'trailer'] },
        { id: 'score-choir', name: 'Ethereal Choir', category: 'scoring', type: 'synth', params: { oscillator: 'sine', voices: 8, reverb: 3.0, formant: true }, tags: ['choir', 'ethereal', 'film', 'score', 'vocal'] },
        { id: 'score-heartbeat', name: 'Heartbeat Pulse', category: 'scoring', type: 'synth', params: { oscillator: 'sine', frequency: 40, rhythmic: true }, tags: ['heartbeat', 'pulse', 'tension', 'film'] },
        { id: 'score-drone-dark', name: 'Dark Drone', category: 'scoring', type: 'synth', params: { oscillator: 'saw', frequency: 30, filter: 'lowpass', cutoff: 200, reverb: 5.0 }, tags: ['drone', 'dark', 'ambient', 'film', 'horror'] }
    ];
}

// ==================== CATCH-ALL & ERROR HANDLING ====================

app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.use(sanitizeError);

// ==================== START SERVER ====================

server.listen(PORT, '0.0.0.0', () => {
    const registryStats = modelRegistry.getStats();
    const hfProviders = hfClient.getAvailableProviders();
    const catalogStats = ascapCatalog.getStats();

    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║          🐐 SUPER GOAT ROYALTIES v' + VERSION + '                      ║');
    console.log('║          The Greatest Of All Time Music Platform             ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  🚀 Server:        http://localhost:' + PORT + '                     ║');
    console.log('║  📊 Dashboard:     http://localhost:' + PORT + '                     ║');
    console.log('║  🔌 API Status:    http://localhost:' + PORT + '/api/status           ║');
    console.log('║  ❤️  Health:        http://localhost:' + PORT + '/api/health           ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  ⚡ Lightning AI:  ' + String(Object.keys(aiConfig.lightning.models).length).padEnd(3) + ' models loaded                         ║');
    console.log('║  🤗 HuggingFace:   ' + String(hfProviders.length).padEnd(3) + ' inference providers                    ║');
    console.log('║  📦 Model Registry:' + String(registryStats.totalModels).padEnd(3) + ' curated models (' + registryStats.categories + ' categories)    ║');
    console.log('║  🎯 NVIDIA NIM:    Integrated                               ║');
    console.log('║  📚 RAG System:    Active                                   ║');
    console.log('║  🤝 Agents:        Running                                  ║');
    console.log('║  📡 WebSocket:     Connected                                ║');
    console.log('║  📀 ASCAP Catalog: ' + String(catalogStats.totalWorks || 0).padEnd(4) + 'works / ' + String(catalogStats.totalWriters || 0).padEnd(3) + ' writers             ║');
    console.log('║  🎹 DAW Studio:    Active                                   ║');
    console.log('║  🔒 Security:      Rate limiting + validation + CSP         ║');
    console.log('║  📈 Metrics:       Request tracking active                  ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  Total AI Models:  ' + String(Object.keys(aiConfig.lightning.models).length + Object.keys(aiConfig.nvidia.models).length + registryStats.totalModels).padEnd(40) + '║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    wsClients.forEach((client) => {
        client.ws.send(JSON.stringify({ type: 'server-shutdown', message: 'Server is shutting down' }));
        client.ws.close();
    });
    server.close(() => { logger.info('HTTP server closed'); process.exit(0); });
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
});

module.exports = { app, server };