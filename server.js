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
const lightningClient = require('./lib/lightning/lightning-ai-client');
const hfClient = require('./lib/huggingface/hf-inference-client');
const modelRegistry = require('./lib/models/model-registry');
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
    console.log('Sample data initialized successfully');
}

// Middleware
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket for real-time updates
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    ws.send(JSON.stringify({ type: 'connection', message: 'Connected to SUPER GOAT ROYALTIES real-time updates' }));
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleWebSocketMessage(ws, data);
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });
    ws.on('close', () => { console.log('WebSocket connection closed'); });
});

function handleWebSocketMessage(ws, data) {
    switch (data.type) {
        case 'subscribe': ws.subscriptions = data.channels || []; break;
        case 'ping': ws.send(JSON.stringify({ type: 'pong' })); break;
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

function getCategoryIcon(category) {
    const icons = { 'text-generation': '💬', 'code': '💻', 'vision': '👁️', 'multimodal': '🌐', 'audio': '🎵', 'embedding': '📊' };
    return icons[category] || '🤖';
}

// ==================== API ROUTES ====================

// Health & Status
app.get('/api/status', (req, res) => {
    const registryStats = modelRegistry.getStats();
    const hfProviders = hfClient.getAvailableProviders();
    res.json({
        status: 'online',
        message: 'SUPER GOAT ROYALTIES API is running',
        version: '3.2.0',
        app: 'SUPER GOAT Royalties',
        mode: aiConfig.demoMode ? 'demo' : 'live',
        uptime: process.uptime(),
        features: {
            ai: true, nvidia: !aiConfig.demoMode, lightning: !!aiConfig.lightning.apiKey,
            huggingface: !!aiConfig.huggingface.token, rag: true, agents: true,
            websocket: true, modelRegistry: true
        },
        counts: {
            lightningModels: Object.keys(aiConfig.lightning.models).length,
            nvidiaModels: Object.keys(aiConfig.nvidia.models).length,
            hfProviders: hfProviders.length,
            registryModels: registryStats.totalModels,
            registryCategories: registryStats.categories,
            totalModels: Object.keys(aiConfig.lightning.models).length + Object.keys(aiConfig.nvidia.models).length + registryStats.totalModels
        },
        timestamp: new Date().toISOString()
    });
});

// Dashboard
app.get('/api/dashboard', async (req, res) => {
    try {
        const registryStats = modelRegistry.getStats();
        const hfProviders = hfClient.getAvailableProviders();
        res.json({
            totalRevenue: revenueData.totalRevenue,
            growthRate: revenueData.growthRate,
            platforms: revenueData.platforms,
            contentStats: { protectedTracks: 156, totalStreams: 3400000, downloads: 78000 },
            nftPortfolio: { totalValue: nftPortfolio.totalValue, items: nftPortfolio.items.length, chains: Object.keys(nftPortfolio.chains) },
            collaboration: { teamMembers: collaborationHub.members.length, sharedFiles: collaborationHub.files.length, activeProjects: collaborationHub.getActiveProjects().length },
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
        console.error('Dashboard error:', error);
        res.status(500).json({ error: error.message });
    }
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

app.post('/api/lightning/chat', async (req, res) => {
    try {
        const { messages, model, options } = req.body;
        if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array is required' });
        const result = await lightningClient.chatCompletion(messages, model || 'llama-3.3-70b', options || {});
        res.json(result);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/lightning/generate', async (req, res) => {
    try {
        const { prompt, model, options } = req.body;
        if (!prompt) return res.status(400).json({ error: 'prompt is required' });
        const content = await lightningClient.generateText(prompt, model || 'llama-3.3-70b', options || {});
        res.json({ content, model: model || 'llama-3.3-70b' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/lightning/smart-route', async (req, res) => {
    try {
        const { prompt, taskType, options } = req.body;
        if (!prompt) return res.status(400).json({ error: 'prompt is required' });
        const content = await lightningClient.smartRoute(prompt, taskType || 'general', options || {});
        res.json({ content, taskType: taskType || 'general' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/lightning/compare', async (req, res) => {
    try {
        const { prompt, models, options } = req.body;
        if (!prompt) return res.status(400).json({ error: 'prompt is required' });
        const results = await lightningClient.compareModels(prompt, models || [], options || {});
        res.json({ results });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/lightning/usage', (req, res) => { res.json(lightningClient.getUsageStats()); });

// ==================== HUGGING FACE INFERENCE ENDPOINTS ====================

// Get all available HF inference providers
app.get('/api/hf/providers', (req, res) => {
    const providers = hfClient.getAvailableProviders();
    res.json({ total: providers.length, mode: aiConfig.demoMode ? 'demo' : 'live', providers });
});

// Get a specific provider's details and models
app.get('/api/hf/providers/:providerId', (req, res) => {
    const provider = hfClient.getProviderInfo(req.params.providerId);
    if (!provider) return res.status(404).json({ error: `Provider "${req.params.providerId}" not found` });
    res.json(provider);
});

// HF chat completion with specific provider
app.post('/api/hf/chat', async (req, res) => {
    try {
        const { messages, model, provider, options } = req.body;
        if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array is required' });
        const result = await hfClient.chatCompletion(messages, model || 'meta-llama/Llama-3.3-70B-Instruct', provider || 'groq', options || {});
        res.json(result);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// HF text generation
app.post('/api/hf/generate', async (req, res) => {
    try {
        const { prompt, model, provider, options } = req.body;
        if (!prompt) return res.status(400).json({ error: 'prompt is required' });
        const messages = [
            { role: 'system', content: options?.systemPrompt || 'You are an AI assistant for the GOAT Royalties platform.' },
            { role: 'user', content: prompt }
        ];
        const result = await hfClient.chatCompletion(messages, model || 'meta-llama/Llama-3.3-70B-Instruct', provider || 'groq', options || {});
        res.json(result);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// HF auto-route - finds best provider for a model
app.post('/api/hf/auto-route', async (req, res) => {
    try {
        const { messages, model, options } = req.body;
        if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array is required' });
        const result = await hfClient.autoRoute(messages, model || 'meta-llama/Llama-3.3-70B-Instruct', options || {});
        res.json(result);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// HF multi-provider compare
app.post('/api/hf/compare', async (req, res) => {
    try {
        const { prompt, model, providers, options } = req.body;
        if (!prompt) return res.status(400).json({ error: 'prompt is required' });
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
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// HF usage stats
app.get('/api/hf/usage', (req, res) => { res.json(hfClient.getUsageStats()); });

// ==================== LOCAL RUNNER DETECTION ====================

app.get('/api/local/ollama', async (req, res) => {
    try { res.json(await hfClient.checkOllamaStatus()); }
    catch (error) { res.json({ running: false, error: error.message }); }
});

app.get('/api/local/vllm', async (req, res) => {
    try { res.json(await hfClient.checkVLLMStatus()); }
    catch (error) { res.json({ running: false, error: error.message }); }
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

// Get all models (with filters)
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

// Model registry stats
app.get('/api/models/stats', (req, res) => { res.json(modelRegistry.getStats()); });

// Available categories
app.get('/api/models/categories', (req, res) => {
    const stats = modelRegistry.getStats();
    const categories = Object.entries(stats.byCategory).map(([name, count]) => ({ name, count, icon: getCategoryIcon(name) }));
    res.json({ categories });
});

// Trending models
app.get('/api/models/trending', (req, res) => {
    const trending = modelRegistry.getTrendingModels();
    res.json({ total: trending.length, models: trending });
});

// Model families
app.get('/api/models/families', (req, res) => {
    const stats = modelRegistry.getStats();
    const families = Object.entries(stats.byFamily).map(([name, count]) => ({ name, count }));
    families.sort((a, b) => b.count - a.count);
    res.json({ families });
});

// Search models
app.get('/api/models/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query "q" is required' });
    const results = modelRegistry.searchModels(q);
    res.json({ query: q, total: results.length, models: results });
});

// Get specific model by ID
app.get('/api/models/:id(*)', (req, res) => {
    const model = modelRegistry.getModel(req.params.id);
    if (!model) return res.status(404).json({ error: `Model "${req.params.id}" not found` });
    res.json(model);
});

// ==================== UNIFIED AI CHAT ENDPOINT ====================

app.post('/api/ai/chat', async (req, res) => {
    try {
        const { messages, model, provider, taskType, options } = req.body;
        if (!messages && !req.body.prompt) return res.status(400).json({ error: 'messages array or prompt is required' });

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
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== MEGA STATS ENDPOINT ====================

app.get('/api/ai/stats', (req, res) => {
    const registryStats = modelRegistry.getStats();
    const hfProviders = hfClient.getAvailableProviders();
    res.json({
        platform: 'SUPER GOAT Royalties',
        version: '3.2.0',
        providers: {
            lightning: { models: Object.keys(aiConfig.lightning.models).length, usage: lightningClient.getUsageStats() },
            nvidia: { models: Object.keys(aiConfig.nvidia.models).length },
            huggingface: { providers: hfProviders.length, providerList: hfProviders.map(p => p.name), usage: hfClient.getUsageStats() }
        },
        modelRegistry: registryStats,
        totalModels: Object.keys(aiConfig.lightning.models).length + Object.keys(aiConfig.nvidia.models).length + registryStats.totalModels,
        capabilities: ['text-generation', 'code', 'vision', 'multimodal', 'audio', 'embedding', 'rag', 'autonomous-agents', 'smart-routing', 'multi-provider', 'local-runners']
    });
});

// ==================== AI & LLM ENDPOINTS (Enhanced) ====================

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
    } catch (error) { res.status(500).json({ error: error.message }); }
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
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/ai/content-recommendations', async (req, res) => {
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
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/ai/generate-contract', async (req, res) => {
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
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==================== RAG ENDPOINTS ====================

app.post('/api/rag/query', async (req, res) => {
    try { const { query } = req.body; res.json({ response: await ragSystem.generateResponse(query) }); }
    catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/rag/document', async (req, res) => {
    try { const { id, content, metadata } = req.body; res.json({ success: true, ...(await ragSystem.addDocument(id, content, metadata)) }); }
    catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/rag/stats', (req, res) => { res.json(ragSystem.getStats()); });

// ==================== AGENT ENDPOINTS ====================

app.post('/api/agents/execute', async (req, res) => {
    try { const { agentId, task, context } = req.body; res.json({ success: true, result: await agentManager.executeAgent(agentId, task, context) }); }
    catch (error) { res.status(500).json({ error: error.message }); }
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

app.post('/api/nvidia/generate', async (req, res) => {
    try { const { prompt, model, options } = req.body; res.json({ result: await nvidiaClient.generateText(prompt, model, options) }); }
    catch (error) { res.status(500).json({ error: error.message }); }
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
            aiAnalysis: aiAnalysis.substring(0, 500) + '...'
        });
    } catch (error) { res.status(500).json({ error: error.message }); }
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

// ==================== MARKET ANALYSIS ENDPOINTS ====================

app.get('/api/market/trends', (req, res) => {
    res.json({ trendingGenres: marketAnalysis.getTrendingGenres(), platformInsights: marketAnalysis.platformInsights, lastUpdated: marketAnalysis.lastUpdated });
});

// Catch-all route
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
    const registryStats = modelRegistry.getStats();
    const hfProviders = hfClient.getAvailableProviders();
    console.log('🚀 SUPER GOAT ROYALTIES Server running on port', PORT);
    console.log('📊 Dashboard: http://localhost:' + PORT);
    console.log('🔌 API Status: http://localhost:' + PORT + '/api/status');
    console.log('🤖 AI Features: Enabled');
    console.log('⚡ Lightning AI: ' + Object.keys(aiConfig.lightning.models).length + ' models loaded');
    console.log('🤗 HuggingFace: ' + hfProviders.length + ' inference providers');
    console.log('📦 Model Registry: ' + registryStats.totalModels + ' curated models across ' + registryStats.categories + ' categories');
    console.log('🎯 NVIDIA NIM: Integrated');
    console.log('📚 RAG System: Active');
    console.log('🤝 Autonomous Agents: Running');
    console.log('📡 WebSocket: Connected');
    console.log('────────────────────────────────────────');
    console.log('Total AI Models Available: ' + (Object.keys(aiConfig.lightning.models).length + Object.keys(aiConfig.nvidia.models).length + registryStats.totalModels));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => { console.log('HTTP server closed'); });
});

module.exports = { app, server };