/**
 * GOAT Royalty Enhanced API Server
 * Full backend for AI-powered royalty management platform
 * Uses local Ollama for all AI processing
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { EventEmitter } = require('events');

// Import modules
const IdpModule = require('../src/modules/idp/IdpModule');
const NlpModule = require('../src/modules/nlp/NlpModule');
const AnalyticsModule = require('../src/modules/analytics/AnalyticsModule');
const MultiAgentOrchestrator = require('../src/agents/MultiAgentOrchestrator');

const app = express();
const PORT = process.env.PORT || 3001;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Initialize modules
let idpModule, nlpModule, analyticsModule, agentOrchestrator;

// Event Bus for real-time updates
const eventBus = new EventEmitter();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const axios = require('axios');
    const ollamaHealth = await axios.get(`${OLLAMA_URL}/api/tags`).catch(() => null);
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'running',
        ollama: ollamaHealth ? 'connected' : 'disconnected',
        modules: {
          idp: idpModule ? 'initialized' : 'not initialized',
          nlp: nlpModule ? 'initialized' : 'not initialized',
          analytics: analyticsModule ? 'initialized' : 'not initialized',
          agents: agentOrchestrator ? 'initialized' : 'not initialized'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==================== IDP Endpoints ====================

// Analyze contract
app.post('/api/idp/analyze', async (req, res) => {
  try {
    const { text, document } = req.body;
    const result = await idpModule.analyzeContract(text, document);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Extract clauses
app.post('/api/idp/extract-clauses', async (req, res) => {
  try {
    const { text, clauseTypes } = req.body;
    const result = await idpModule.extractClauses(text, clauseTypes);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assess risks
app.post('/api/idp/assess-risks', async (req, res) => {
  try {
    const { text, contractData } = req.body;
    const result = await idpModule.assessRisks(text, contractData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process document (upload + analysis)
app.post('/api/idp/process', async (req, res) => {
  try {
    const { document, options } = req.body;
    const result = await idpModule.processDocument(document, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== NLP Endpoints ====================

// Semantic search
app.post('/api/nlp/search', async (req, res) => {
  try {
    const { query, documents, options } = req.body;
    const result = await nlpModule.semanticSearch(query, documents, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Extract entities
app.post('/api/nlp/extract-entities', async (req, res) => {
  try {
    const { text, entityTypes } = req.body;
    const result = await nlpModule.extractEntities(text, entityTypes);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Compare contracts
app.post('/api/nlp/compare', async (req, res) => {
  try {
    const { contract1, contract2 } = req.body;
    const result = await nlpModule.compareContracts(contract1, contract2);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate summary
app.post('/api/nlp/summarize', async (req, res) => {
  try {
    const { text, maxLength } = req.body;
    const result = await nlpModule.summarize(text, maxLength);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Analytics Endpoints ====================

// Revenue prediction
app.post('/api/analytics/predict-revenue', async (req, res) => {
  try {
    const { historicalData, options } = req.body;
    const result = await analyticsModule.predictRevenue(historicalData, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Territory analysis
app.post('/api/analytics/territory', async (req, res) => {
  try {
    const { territory, data } = req.body;
    const result = await analyticsModule.analyzeTerritory(territory, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Performance forecast
app.post('/api/analytics/forecast', async (req, res) => {
  try {
    const { artistId, period, data } = req.body;
    const result = await analyticsModule.forecastPerformance(artistId, period, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get insights
app.get('/api/analytics/insights', async (req, res) => {
  try {
    const result = await analyticsModule.generateInsights();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Multi-Agent Endpoints ====================

// Get agent status
app.get('/api/agents/status', (req, res) => {
  try {
    const status = agentOrchestrator.getAgentStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit task to agents
app.post('/api/agents/task', async (req, res) => {
  try {
    const { task } = req.body;
    const result = await agentOrchestrator.submitTask(task);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel task
app.delete('/api/agents/task/:taskId', (req, res) => {
  try {
    const result = agentOrchestrator.cancelTask(req.params.taskId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workflow status
app.get('/api/agents/workflow/:workflowId', (req, res) => {
  try {
    const status = agentOrchestrator.getWorkflowStatus(req.params.workflowId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start workflow
app.post('/api/agents/workflow', async (req, res) => {
  try {
    const { workflow } = req.body;
    const result = await agentOrchestrator.startWorkflow(workflow);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Ollama Direct Endpoints ====================

// List available models
app.get('/api/ollama/models', async (req, res) => {
  try {
    const axios = require('axios');
    const response = await axios.get(`${OLLAMA_URL}/api/tags`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Ollama not available. Make sure Ollama is running on ' + OLLAMA_URL });
  }
});

// Generate completion
app.post('/api/ollama/generate', async (req, res) => {
  try {
    const axios = require('axios');
    const { model, prompt, options } = req.body;
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: model || 'llama3.1:8b',
      prompt,
      stream: false,
      ...options
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat completion
app.post('/api/ollama/chat', async (req, res) => {
  try {
    const axios = require('axios');
    const { model, messages, options } = req.body;
    const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
      model: model || 'llama3.1:8b',
      messages,
      stream: false,
      ...options
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Static Files ====================

// Serve web-app folder
app.use('/app', express.static(path.join(__dirname, '../web-app')));

// Redirect root to app
app.get('/', (req, res) => {
  res.redirect('/app');
});

// ==================== WebSocket for Real-time Updates ====================

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Subscribe to agent updates
  socket.on('subscribe:agents', () => {
    eventBus.on('agent:update', (data) => {
      socket.emit('agent:update', data);
    });
  });
  
  // Subscribe to workflow updates
  socket.on('subscribe:workflow', (workflowId) => {
    eventBus.on(`workflow:${workflowId}`, (data) => {
      socket.emit('workflow:update', data);
    });
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ==================== Initialize and Start Server ====================

async function initializeModules() {
  console.log('Initializing AI modules...');
  
  const config = {
    ollamaUrl: OLLAMA_URL,
    model: 'llama3.1:8b',
    fallbackModel: 'mistral-nemo:12b'
  };
  
  try {
    idpModule = new IdpModule(config);
    await idpModule.initialize();
    console.log('✓ IDP Module initialized');
  } catch (error) {
    console.warn('⚠ IDP Module initialization failed:', error.message);
  }
  
  try {
    nlpModule = new NlpModule(config);
    await nlpModule.initialize();
    console.log('✓ NLP Module initialized');
  } catch (error) {
    console.warn('⚠ NLP Module initialization failed:', error.message);
  }
  
  try {
    analyticsModule = new AnalyticsModule(config);
    await analyticsModule.initialize();
    console.log('✓ Analytics Module initialized');
  } catch (error) {
    console.warn('⚠ Analytics Module initialization failed:', error.message);
  }
  
  try {
    agentOrchestrator = new MultiAgentOrchestrator(config);
    await agentOrchestrator.initialize();
    console.log('✓ Multi-Agent Orchestrator initialized');
  } catch (error) {
    console.warn('⚠ Multi-Agent Orchestrator initialization failed:', error.message);
  }
}

async function startServer() {
  await initializeModules();
  
  server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║         GOAT Royalty Enhanced API Server                   ║
╠════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}                 ║
║  Web App:           http://localhost:${PORT}/app            ║
║  Health Check:      http://localhost:${PORT}/api/health     ║
║  Ollama URL:        ${OLLAMA_URL}              ║
╚════════════════════════════════════════════════════════════╝

API Endpoints:
  - POST /api/idp/analyze        - Analyze contracts
  - POST /api/nlp/search         - Semantic search
  - POST /api/analytics/forecast - Revenue forecasting
  - GET  /api/agents/status     - Agent status
  - POST /api/ollama/chat       - Direct AI chat

Press Ctrl+C to stop the server
    `);
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
startServer();

module.exports = { app, server, io };