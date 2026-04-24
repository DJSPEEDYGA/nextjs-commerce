/**
 * GOAT Royalty Agent Crew API Integration
 * Connects the web interface with the Python agent backend
 */

const express = require('express');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');
const RealAgentConnector = require('./real-agent-connector');

const router = express.Router();

// Initialize real agent connector
const agentConnector = new RealAgentConnector({
    backendUrl: process.env.AGENT_BACKEND_URL || 'http://localhost:5500',
    secretCodes: {
        'money-penny': process.env.MONEY_PENNY_CODE || 'MP-007-GOAT',
        'goat-brain': process.env.GOAT_BRAIN_CODE || 'GB-BRAIN-111',
        'goat-intel': process.env.GOAT_INTEL_CODE || 'GI-INTEL-007',
        'legal-agent': process.env.LEGAL_AGENT_CODE || 'LA-LAW-999',
        'finance-agent': process.env.FINANCE_AGENT_CODE || 'FA-CASH-777'
    }
});

// Auto-initialize on module load
agentConnector.initialize().catch(err => {
    console.log('⚠️  Agent backend not available, using fallback mode');
});

// Configuration
const AGENT_BACKEND_URL = process.env.AGENT_BACKEND_URL || 'http://localhost:5500';
const TIMEOUT = 60000; // 60 second timeout

// ==================== Agent Management Routes ====================

// Get all agents status
router.get('/agents', async (req, res) => {
    try {
        const response = await axios.get(`${AGENT_BACKEND_URL}/api/agents`, {
            timeout: TIMEOUT
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get agents',
            message: error.message,
            fallback: getFallbackAgents()
        });
    }
});

// Get specific agent status
router.get('/agents/:agentId', async (req, res) => {
    try {
        const agentId = req.params.agentId;
        const response = await axios.get(`${AGENT_BACKEND_URL}/api/agents/${agentId}`, {
            timeout: TIMEOUT
        });
        res.json(response.data);
    } catch (error) {
        // Return fallback agent data if backend is unavailable
        res.json(getFallbackAgent(req.params.agentId));
    }
});

// ==================== Chat Routes ====================

// Send message to agent
router.post('/chat', async (req, res) => {
    try {
        const { agentId, message, context, secretCode } = req.body;
        
        // Try to use real agent connector
        if (agentConnector.initialized) {
            const result = await agentConnector.sendMessage(
                agentId || 'money-penny',
                message,
                {
                    context,
                    secretCode: secretCode || agentConnector.config.secretCodes[agentId]
                }
            );
            
            res.json(result);
            return;
        }
        
        // Fallback to direct backend call if connector not initialized
        const response = await axios.post(`${AGENT_BACKEND_URL}/api/chat`, {
            agent_id: agentId || 'money-penny',
            message,
            context,
            secret_code: secretCode || process.env[`AGENT_${agentId.toUpperCase()}_CODE`]
        }, {
            timeout: TIMEOUT
        });
        
        res.json({
            success: true,
            response: response.data.message || response.data.response,
            agent: response.data.agent,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        // Fallback to local mock response if backend is unavailable
        console.log('Backend unavailable, using fallback:', error.message);
        const mockResponse = getMockChatResponse(req.body.message, req.body.agentId);
        res.json(mockResponse);
    }
});

// Stream chat response (Server-Sent Events)
router.get('/chat/stream', async (req, res) => {
    const { agentId, message } = req.query;
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const response = await axios.post(`${AGENT_BACKEND_URL}/api/chat/stream`, {
            agent: agentId || 'money-penny',
            message
        }, {
            responseType: 'stream',
            timeout: TIMEOUT
        });

        response.data.on('data', (chunk) => {
            res.write(`data: ${chunk}\n\n`);
        });

        response.data.on('end', () => {
            res.end();
        });
    } catch (error) {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

// ==================== Task Management Routes ====================

// Get active tasks
router.get('/tasks', async (req, res) => {
    try {
        const response = await axios.get(`${AGENT_BACKEND_URL}/api/tasks`, {
            timeout: TIMEOUT
        });
        res.json(response.data);
    } catch (error) {
        res.json({ tasks: getFallbackTasks() });
    }
});

// Create new task
router.post('/tasks', async (req, res) => {
    try {
        const { task, agentId, priority } = req.body;
        
        const response = await axios.post(`${AGENT_BACKEND_URL}/api/tasks`, {
            task,
            agent: agentId,
            priority: priority || 'medium'
        }, {
            timeout: TIMEOUT
        });
        
        res.json({
            success: true,
            taskId: response.data.taskId,
            status: response.data.status
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
});

// Cancel task
router.delete('/tasks/:taskId', async (req, res) => {
    try {
        const response = await axios.delete(
            `${AGENT_BACKEND_URL}/api/tasks/${req.params.taskId}`,
            { timeout: TIMEOUT }
        );
        res.json(response.data);
    } catch (error) {
        res.json({ error: error.message });
    }
});

// ==================== Tool Execution Routes ====================

// Execute agent tool
router.post('/tools/:toolName', async (req, res) => {
    try {
        const toolName = req.params.toolName;
        const params = req.body;
        
        const response = await axios.post(`${AGENT_BACKEND_URL}/api/tools/${toolName}`, params, {
            timeout: TIMEOUT
        });
        
        res.json({
            success: true,
            result: response.data
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
            message: `Failed to execute tool: ${toolName}`
        });
    }
});

// Get available tools
router.get('/tools', async (req, res) => {
    try {
        const response = await axios.get(`${AGENT_BACKEND_URL}/api/tools`, {
            timeout: TIMEOUT
        });
        res.json(response.data);
    } catch (error) {
        res.json({ tools: getFallbackTools() });
    }
});

// ==================== Data Intelligence Routes ====================

// Search YouTube
router.post('/search/youtube', async (req, res) => {
    try {
        const { query, limit } = req.body;
        
        const response = await axios.post(`${AGENT_BACKEND_URL}/api/tools/search_youtube`, {
            query,
            limit: limit || 5
        }, {
            timeout: TIMEOUT
        });
        
        res.json({
            success: true,
            results: response.data.data
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
            results: []
        });
    }
});

// Scrape TikTok profile
router.post('/scrape/tiktok', async (req, res) => {
    try {
        const { username } = req.body;
        
        const response = await axios.post(`${AGENT_BACKEND_URL}/api/tools/tool_scrape_tiktok`, {
            username
        }, {
            timeout: TIMEOUT
        });
        
        res.json({
            success: true,
            data: response.data.data
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
            data: null
        });
    }
});

// Get Spotify artist data
router.post('/spotify/artist', async (req, res) => {
    try {
        const { artistId } = req.body;
        
        const response = await axios.post(`${AGENT_BACKEND_URL}/api/tools/tool_get_spotify_artist`, {
            artist_id: artistId
        }, {
            timeout: TIMEOUT
        });
        
        res.json({
            success: true,
            artist: response.data.data
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
            artist: null
        });
    }
});

// Get Billboard charts
router.get('/charts/billboard', async (req, res) => {
    try {
        const response = await axios.get(`${AGENT_BACKEND_URL}/api/charts/billboard`, {
            timeout: TIMEOUT
        });
        res.json(response.data);
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
            charts: []
        });
    }
});

// Get iTunes artist data
router.post('/itunes/artist', async (req, res) => {
    try {
        const { artist } = req.body;
        
        const response = await axios.post(`${AGENT_BACKEND_URL}/api/tools/tool_lookup_itunes`, {
            artist
        }, {
            timeout: TIMEOUT
        });
        
        res.json({
            success: true,
            data: response.data.data
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
            data: null
        });
    }
});

// ==================== Fallback Functions ====================

function getFallbackAgents() {
    return {
        agents: [
            {
                id: 'money-penny',
                name: 'Money Penny',
                role: 'Main Orchestrator',
                status: 'online',
                model: 'llama3.1:8b',
                capabilities: ['Task Orchestration', 'Agent Coordination']
            },
            {
                id: 'goat-brain',
                name: 'GOAT Brain',
                role: 'AI Router',
                status: 'online',
                model: 'gemma3:4b',
                capabilities: ['AI Routing', 'Model Selection']
            },
            {
                id: 'goat-intel',
                name: 'GOAT Intel',
                role: 'Data Intelligence',
                status: 'online',
                model: 'llama3.1:8b',
                capabilities: ['Data Scraping', 'Analytics']
            },
            {
                id: 'legal-agent',
                name: 'Legal Agent',
                role: 'Contract Analyst',
                status: 'busy',
                model: 'mistral-nemo:12b',
                capabilities: ['Contract Analysis', 'Risk Assessment']
            },
            {
                id: 'finance-agent',
                name: 'Finance Agent',
                role: 'Financial Advisor',
                status: 'online',
                model: 'qwen2.5:14b',
                capabilities: ['Revenue Tracking', 'Royalty Calculation']
            }
        ]
    };
}

function getFallbackAgent(agentId) {
    const agents = getFallbackAgents().agents;
    return agents.find(a => a.id === agentId) || agents[0];
}

function getFallbackTasks() {
    return [
        {
            id: 'task-1',
            name: 'Contract Analysis',
            description: 'Analyze new record deal contract',
            status: 'in-progress',
            priority: 'high',
            assignedTo: 'legal-agent'
        },
        {
            id: 'task-2',
            name: 'Royalty Calculation',
            description: 'Calculate Q4 streaming royalties',
            status: 'pending',
            priority: 'medium',
            assignedTo: 'finance-agent'
        },
        {
            id: 'task-3',
            name: 'Fan Data Sync',
            description: 'Sync Spotify fan data',
            status: 'pending',
            priority: 'low',
            assignedTo: 'goat-intel'
        }
    ];
}

function getFallbackTools() {
    return [
        { name: 'search_youtube', description: 'Search YouTube videos' },
        { name: 'scrape_tiktok', description: 'Scrape TikTok profiles' },
        { name: 'spotify_artist', description: 'Get Spotify artist data' },
        { name: 'billboard_charts', description: 'Get Billboard chart data' },
        { name: 'itunes_lookup', description: 'Search iTunes catalog' },
        { name: 'fan_stats', description: 'Get fan database statistics' },
        { name: 'create_smart_link', description: 'Create smart link for releases' },
        { name: 'generate_campaign', description: 'Generate marketing campaign' }
    ];
}

function getMockChatResponse(message, agentId = 'money-penny') {
    const responses = [
        "I'm processing your request through our AI network. Let me coordinate with the appropriate agents.",
        "I've received your message and am working on it. Our team is gathering the information you need.",
        "Great question! I'm routing this through our intelligent systems to provide you with the best answer.",
        "I'm on it! Let me analyze this and get back to you with detailed insights.",
        "I understand what you need. I'm coordinating with our specialized agents to handle this request."
    ];
    
    const agentResponses = {
        'legal-agent': "I'm analyzing the legal aspects of your request. I can review contracts and ensure compliance.",
        'finance-agent': "I'm processing financial data for your request. I'll provide accurate calculations and forecasts.",
        'goat-intel': "I'm gathering intelligence from our data sources. Let me pull the latest information for you.",
        'goat-brain': "I'm routing your query through the optimal AI engine for the best results."
    };
    
    return {
        success: true,
        response: agentResponses[agentId] || responses[Math.floor(Math.random() * responses.length)],
        agent: agentId,
        timestamp: new Date().toISOString()
    };
}

module.exports = router;