/**
 * GOAT Royalty - Agent Crew Communication
 * Handles real-time communication with AI agents using secret codes
 */

class AgentCrewCommunication {
    constructor(config = {}) {
        this.config = {
            apiUrl: config.apiUrl || '/api/agent-crew',
            secretCodes: config.secretCodes || {}
        };
        
        this.selectedAgent = 'money-penny';
        this.messageHistory = [];
        this.activeStreams = new Map();
    }

    /**
     * Send message to agent
     */
    async sendMessage(agentId, message, options = {}) {
        try {
            const secretCode = this.config.secretCodes[agentId] || 
                             localStorage.getItem(`agent_code_${agentId}`);
            
            const response = await fetch(`${this.config.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    agentId,
                    message,
                    context: options.context || {},
                    secretCode
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Add to history
                this.messageHistory.push({
                    type: 'user',
                    agent: agentId,
                    message,
                    timestamp: new Date().toISOString()
                });
                
                this.messageHistory.push({
                    type: 'agent',
                    agent: agentId,
                    message: data.response,
                    timestamp: data.timestamp
                });
                
                return data.response;
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Communication error:', error);
            throw error;
        }
    }

    /**
     * Stream message response
     */
    async streamMessage(agentId, message, onToken, options = {}) {
        try {
            const secretCode = this.config.secretCodes[agentId] || 
                             localStorage.getItem(`agent_code_${agentId}`);
            
            const eventSource = new EventSource(
                `${this.config.apiUrl}/chat/stream?agentId=${agentId}&message=${encodeURIComponent(message)}&secretCode=${secretCode}`
            );
            
            let fullResponse = '';
            
            return new Promise((resolve, reject) => {
                eventSource.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    fullResponse += data.content;
                    onToken(data.content);
                };
                
                eventSource.onerror = (error) => {
                    eventSource.close();
                    reject(error);
                };
                
                // Set timeout
                setTimeout(() => {
                    eventSource.close();
                    resolve(fullResponse);
                }, 60000);
            });
        } catch (error) {
            console.error('Stream error:', error);
            throw error;
        }
    }

    /**
     * Execute tool
     */
    async executeTool(toolName, params, agentId = 'goat-intel') {
        try {
            const secretCode = this.config.secretCodes[agentId] || 
                             localStorage.getItem(`agent_code_${agentId}`);
            
            const response = await fetch(`${this.config.apiUrl}/tools/${toolName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    agentId,
                    secretCode,
                    ...params
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data.result;
            } else {
                throw new Error(data.error || 'Tool execution failed');
            }
        } catch (error) {
            console.error('Tool execution error:', error);
            throw error;
        }
    }

    /**
     * Search YouTube
     */
    async searchYouTube(query, limit = 5) {
        return this.executeTool('search-youtube', { query, limit });
    }

    /**
     * Scrape TikTok profile
     */
    async scrapeTikTok(username) {
        return this.executeTool('scrape-tiktok', { username });
    }

    /**
     * Get Spotify artist data
     */
    async getSpotifyArtist(artistId) {
        return this.executeTool('spotify-artist', { artistId });
    }

    /**
     * Get Billboard charts
     */
    async getBillboardCharts() {
        const response = await fetch(`${this.config.apiUrl}/charts/billboard`);
        const data = await response.json();
        return data.charts;
    }

    /**
     * Get agent status
     */
    async getAgentStatus(agentId) {
        try {
            const response = await fetch(`${this.config.apiUrl}/agents/${agentId}`);
            const data = await response.json();
            return data.agent;
        } catch (error) {
            console.error('Failed to get agent status:', error);
            return null;
        }
    }

    /**
     * Get all agents
     */
    async getAllAgents() {
        try {
            const response = await fetch(`${this.config.apiUrl}/agents`);
            const data = await response.json();
            return data.agents || [];
        } catch (error) {
            console.error('Failed to get agents:', error);
            return [];
        }
    }

    /**
     * Save secret code for agent
     */
    saveSecretCode(agentId, code) {
        localStorage.setItem(`agent_code_${agentId}`, code);
    }

    /**
     * Get secret code for agent
     */
    getSecretCode(agentId) {
        return this.config.secretCodes[agentId] || 
               localStorage.getItem(`agent_code_${agentId}`);
    }

    /**
     * Get message history
     */
    getHistory() {
        return this.messageHistory;
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.messageHistory = [];
    }
}

// Global instance
const agentCrew = new AgentCrewCommunication();