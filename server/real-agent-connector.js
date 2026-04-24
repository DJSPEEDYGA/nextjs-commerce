/**
 * GOAT Royalty - Real Agent Connector
 * Connects web interface to actual Python agent backend with secret codes
 */

const axios = require('axios');
const { EventEmitter } = require('events');
const WebSocket = require('ws');

class RealAgentConnector extends EventEmitter {
    constructor(config = {}) {
        super();
        this.config = {
            backendUrl: config.backendUrl || process.env.AGENT_BACKEND_URL || 'http://localhost:5500',
            timeout: config.timeout || 60000,
            secretCodes: config.secretCodes || {}
        };
        
        this.agents = new Map();
        this.activeConnections = new Map();
        this.agentSockets = new Map();
        this.initialized = false;
    }

    /**
     * Initialize connection to agent backend
     */
    async initialize() {
        try {
            console.log('🔌 Connecting to Agent Backend...');
            
            // Check if backend is running
            const healthCheck = await axios.get(`${this.config.backendUrl}/`, {
                timeout: 10000
            });
            
            if (healthCheck.status === 200) {
                console.log('✅ Agent Backend Connected!');
                this.initialized = true;
                this.emit('connected');
                
                // Load available agents
                await this.loadAgents();
                
                // Establish WebSocket connections
                await this.connectWebSocket();
                
                return true;
            }
        } catch (error) {
            console.error('❌ Failed to connect to Agent Backend:', error.message);
            this.emit('error', error);
            return false;
        }
    }

    /**
     * Load all available agents from backend
     */
    async loadAgents() {
        try {
            const response = await axios.get(`${this.config.backendUrl}/api/agents`, {
                timeout: 10000
            });
            
            if (response.data && response.data.agents) {
                response.data.agents.forEach(agent => {
                    this.agents.set(agent.id, agent);
                });
                console.log(`👥 Loaded ${this.agents.size} agents from backend`);
            }
        } catch (error) {
            console.warn('⚠️  Could not load agents:', error.message);
        }
    }

    /**
     * Establish WebSocket connection for real-time updates
     */
    async connectWebSocket() {
        try {
            const wsUrl = this.config.backendUrl.replace('http', 'ws');
            const ws = new WebSocket(`${wsUrl}/ws`);
            
            ws.on('open', () => {
                console.log('📡 WebSocket Connected');
                this.emit('websocket-connected');
            });
            
            ws.on('message', (data) => {
                const message = JSON.parse(data);
                this.handleAgentMessage(message);
            });
            
            ws.on('error', (error) => {
                console.error('WebSocket Error:', error);
                this.emit('websocket-error', error);
            });
            
            ws.on('close', () => {
                console.log('WebSocket Closed');
                this.emit('websocket-closed');
            });
            
            this.agentSockets.set('main', ws);
        } catch (error) {
            console.warn('⚠️  WebSocket connection failed:', error.message);
        }
    }

    /**
     * Handle messages from agents
     */
    handleAgentMessage(message) {
        switch (message.type) {
            case 'agent_status':
                this.emit('agent-status', message.data);
                break;
            case 'task_update':
                this.emit('task-update', message.data);
                break;
            case 'agent_response':
                this.emit('agent-response', message.data);
                break;
            default:
                this.emit('agent-message', message);
        }
    }

    /**
     * Summon agent with secret code
     */
    async summonAgent(agentId, secretCode) {
        if (!this.initialized) {
            throw new Error('Agent backend not initialized');
        }
        
        // Verify secret code
        const validCode = this.config.secretCodes[agentId];
        if (!validCode || validCode !== secretCode) {
            throw new Error('Invalid secret code for agent');
        }
        
        try {
            const response = await axios.post(`${this.config.backendUrl}/api/summon`, {
                agent_id: agentId,
                secret_code: secretCode
            }, {
                timeout: this.config.timeout
            });
            
            console.log(`✅ Agent ${agentId} summoned successfully`);
            return response.data;
        } catch (error) {
            console.error(`❌ Failed to summon agent ${agentId}:`, error.message);
            throw error;
        }
    }

    /**
     * Send message to specific agent
     */
    async sendMessage(agentId, message, options = {}) {
        if (!this.initialized) {
            throw new Error('Agent backend not initialized');
        }
        
        const agent = this.agents.get(agentId);
        if (!agent) {
            throw new Error(`Agent ${agentId} not found`);
        }
        
        try {
            const response = await axios.post(`${this.config.backendUrl}/api/chat`, {
                agent_id: agentId,
                message,
                context: options.context || {},
                secret_code: options.secretCode,
                stream: options.stream || false
            }, {
                timeout: this.config.timeout
            });
            
            // Update agent status
            agent.status = 'busy';
            this.agents.set(agentId, agent);
            
            return {
                success: true,
                response: response.data.message || response.data.response,
                agent: agent,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            // Update agent status to error
            agent.status = 'error';
            this.agents.set(agentId, agent);
            
            console.error(`❌ Failed to send message to ${agentId}:`, error.message);
            throw error;
        }
    }

    /**
     * Stream message response
     */
    async streamMessage(agentId, message, options, onToken) {
        if (!this.initialized) {
            throw new Error('Agent backend not initialized');
        }
        
        const wsUrl = this.config.backendUrl.replace('http', 'ws');
        const ws = new WebSocket(`${wsUrl}/ws/chat`);
        
        return new Promise((resolve, reject) => {
            let fullResponse = '';
            
            ws.on('open', () => {
                ws.send(JSON.stringify({
                    agent_id: agentId,
                    message,
                    secret_code: options.secretCode,
                    context: options.context || {}
                }));
            });
            
            ws.on('message', (data) => {
                const parsed = JSON.parse(data);
                
                if (parsed.type === 'token') {
                    fullResponse += parsed.content;
                    onToken(parsed.content);
                } else if (parsed.type === 'complete') {
                    ws.close();
                    resolve(fullResponse);
                } else if (parsed.type === 'error') {
                    ws.close();
                    reject(new Error(parsed.error));
                }
            });
            
            ws.on('error', reject);
            
            // Timeout
            setTimeout(() => {
                ws.close();
                reject(new Error('Stream timeout'));
            }, this.config.timeout);
        });
    }

    /**
     * Execute agent tool
     */
    async executeTool(agentId, toolName, params, secretCode = null) {
        if (!this.initialized) {
            throw new Error('Agent backend not initialized');
        }
        
        try {
            const response = await axios.post(
                `${this.config.backendUrl}/api/tools/${toolName}`,
                {
                    agent_id: agentId,
                    secret_code: secretCode,
                    ...params
                },
                {
                    timeout: this.config.timeout + 30000 // Extra time for tools
                }
            );
            
            return {
                success: true,
                tool: toolName,
                result: response.data.data || response.data.result,
                message: response.data.summary
            };
        } catch (error) {
            console.error(`❌ Tool execution failed:`, error.message);
            return {
                success: false,
                tool: toolName,
                error: error.message
            };
        }
    }

    /**
     * Get agent status
     */
    getAgentStatus(agentId) {
        return this.agents.get(agentId);
    }

    /**
     * Get all agents
     */
    getAllAgents() {
        return Array.from(this.agents.values());
    }

    /**
     * Disconnect agent
     */
    async disconnectAgent(agentId) {
        try {
            await axios.post(`${this.config.backendUrl}/api/agents/${agentId}/disconnect`, {
                timeout: 10000
            });
            
            const agent = this.agents.get(agentId);
            if (agent) {
                agent.status = 'offline';
                this.agents.set(agentId, agent);
            }
            
            console.log(`Agent ${agentId} disconnected`);
        } catch (error) {
            console.error(`Failed to disconnect agent ${agentId}:`, error.message);
        }
    }

    /**
     * Shutdown all connections
     */
    async shutdown() {
        console.log('🔌 Shutting down agent connections...');
        
        // Close all WebSocket connections
        this.agentSockets.forEach((ws, key) => {
            ws.close();
        });
        this.agentSockets.clear();
        
        this.initialized = false;
        this.emit('disconnected');
        
        console.log('✅ Agent connections shut down');
    }
}

module.exports = RealAgentConnector;