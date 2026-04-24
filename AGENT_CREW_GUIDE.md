# GOAT Royalty Agent Crew Setup Guide

## 🎯 Overview

The Agent Crew system brings together powerful AI agents to help you manage your GOAT Royalty platform. Each agent specializes in different aspects of your business:

### Meet the Crew

1. **Money Penny** 👩‍💼 - Main Orchestrator
   - Coordinates all agents
   - Manages tasks and priorities
   - Your primary point of contact

2. **GOAT Brain** 🧠 - AI Router
   - Routes AI requests intelligently
   - Selects optimal models (Ollama/Gemini/NVIDIA)
   - Ensures fast, private AI processing

3. **GOAT Intel** 🕵️ - Data Intelligence
   - Scrapes TikTok profiles
   - Pulls Spotify data
   - Searches YouTube
   - Gathers Billboard charts

4. **Legal Agent** ⚖️ - Contract Analyst
   - Analyzes contracts
   - Assesses risks
   - Ensures compliance

5. **Finance Agent** 💰 - Financial Advisor
   - Tracks revenue
   - Calculates royalties
   - Provides financial forecasts

---

## 🚀 Quick Start

### Option 1: Frontend-Only Mode (No Backend Required)

1. Simply open `goat-agent-crew.html` in your browser
2. The interface works with simulated responses
3. Perfect for testing the UI and workflow

### Option 2: Full Backend Integration

#### Step 1: Install Python Dependencies

```bash
pip install flask flask-cors requests yt-dlp aiohttp pyyaml
```

#### Step 2: Start the Python Agent Backend

```bash
# Navigate to the workspace
cd /workspace

# Start GOAT Intel Server
python goat_intel.py
```

This starts the agent backend on `http://localhost:5500`

#### Step 3: Start the Node.js API Server

```bash
cd nextjs-commerce/server

# Start the API server
node api-server.js
```

This starts the API server on `http://localhost:3001`

#### Step 4: Access the Agent Crew

Open your browser to: `http://localhost:3001/app/goat-agent-crew.html`

---

## 💬 How to Use the Agent Crew

### Chatting with Agents

1. **Select an Agent** - Click on any agent card in the left panel
2. **Type Your Message** - Enter your question or request in the chat input
3. **Send Message** - Press Enter or click the Send button
4. **Get Response** - The agent responds with relevant information

### Example Conversations

#### With Money Penny:
```
You: Can you help me analyze my record deal contract
Money Penny: I'll have the Legal Agent analyze that contract for you right away. 
They're reviewing it now and should have a detailed report within minutes.
```

#### With GOAT Intel:
```
You: Pull the latest stats for my TikTok profile @djgoat
GOAT Intel: I'm scraping TikTok data for @djgoat right now. Here's what I found...
```

#### With Finance Agent:
```
You: Calculate my Q4 streaming royalties
Finance Agent: I'm processing your streaming data. Based on your 2.5M streams, 
your estimated royalties are $45,230.50.
```

---

## 🔧 Available Tools

The AI agents can execute these tools:

### Data Gathering Tools
- `scrape_tiktok(username)` - Get TikTok profile data
- `get_spotify_artist(artist_id)` - Pull Spotify artist stats
- `search_youtube(query)` - Find YouTube videos
- `get_billboard_charts()` - Get chart positions
- `lookup_itunes(artist)` - Search iTunes catalog

### Fan Management Tools
- `add_fan(email, name, artist)` - Add fan to database
- `fan_stats()` - Get fan database statistics

### Marketing Tools
- `create_smart_link(slug, urls)` - Create legal Linktree
- `generate_campaign(topic)` - Generate email campaign copy

### Analytics Tools
- `trend_analysis()` - Analyze performance trends
- `competitor_tracking()` - Track competitor metrics

---

## 🌐 API Endpoints

### Agent Management
```
GET  /api/agent-crew/agents              - Get all agents
GET  /api/agent-crew/agents/:id          - Get specific agent
```

### Chat
```
POST /api/agent-crew/chat                - Send message
GET  /api/agent-crew/chat/stream         - Stream response
```

### Task Management
```
GET  /api/agent-crew/tasks               - Get active tasks
POST /api/agent-crew/tasks               - Create new task
DELETE /api/agent-crew/tasks/:id         - Cancel task
```

### Tools
```
GET  /api/agent-crew/tools               - Get available tools
POST /api/agent-crew/tools/:toolName     - Execute tool
```

### Data Intelligence
```
POST /api/agent-crew/search/youtube      - Search YouTube
POST /api/agent-crew/scrape/tiktok       - Scrape TikTok
POST /api/agent-crew/spotify/artist      - Get Spotify data
GET  /api/agent-crew/charts/billboard    - Get Billboard charts
POST /api/agent-crew/itunes/artist       - Search iTunes
```

---

## 🔌 Integrating with Your App

### Example: Making API Calls from JavaScript

```javascript
// Send message to agent
async function sendMessage(agentId, message) {
    const response = await fetch('/api/agent-crew/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            agentId,
            message,
            context: { userId: 'user-123' }
        })
    });
    const data = await response.json();
    return data.response;
}

// Search YouTube
async function searchYouTube(query) {
    const response = await fetch('/api/agent-crew/search/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 5 })
    });
    const data = await response.json();
    return data.results;
}

// Scrape TikTok profile
async function scrapeTikTok(username) {
    const response = await fetch('/api/agent-crew/scrape/tiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    const data = await response.json();
    return data.data;
}
```

---

## 🎨 Customization

### Adding New Agents

1. Create a new agent in `money-penny-agent.py`:

```python
@dataclass
class Agent:
    name: str
    role: str
    model: str
    capabilities: List[str]
```

2. Update the agent list in `goat-agent-crew.html`:

```javascript
const agents = [
    // ... existing agents
    {
        id: 'marketing-agent',
        name: 'Marketing Agent',
        role: 'Campaign Manager',
        avatar: '📢',
        status: 'online',
        model: 'llama3.1:8b',
        capabilities: ['Social Media', 'Email Campaigns', 'Brand Strategy']
    }
];
```

### Adding Custom Responses

Edit the response logic in `goat-agent-crew.html`'s `processQuery()` function:

```javascript
function processQuery(query, agent) {
    const responses = {
        'your-agent-id': {
            'keyword': 'Custom response for this keyword',
            'default': 'Default response'
        }
    };
    // ... rest of logic
}
```

---

## 🐛 Troubleshooting

### Agent Not Responding

**Problem**: Agent shows as "offline" or doesn't respond

**Solutions**:
1. Check if the Python backend is running: `http://localhost:5500`
2. Check if the Node.js API server is running: `http://localhost:3001`
3. Verify the backend URL in `server/agent-api.js`
4. Check browser console for errors

### Tools Not Working

**Problem**: Tools return errors or fail to execute

**Solutions**:
1. Verify API keys are set (for Spotify, etc.)
2. Check internet connection
3. Ensure `yt-dlp` is installed: `pip install yt-dlp`
4. Check tool-specific configuration in `goat_intel.py`

### Chat Messages Not Appearing

**Problem**: Messages don't show in the chat interface

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify the API endpoint is correct
3. Check network requests in browser DevTools
4. Ensure the frontend is served from the same origin or CORS is enabled

---

## 📊 Monitoring Agent Activity

### View Agent Statuses

The agent cards in the left panel show:
- **Status indicator** (online/busy/offline)
- **Current task** (if busy)
- **Model being used** (e.g., llama3.1:8b)
- **Capabilities** (what the agent can do)

### Task Queue

The right panel shows active tasks with:
- Task name and description
- Priority level (URGENT/HIGH/MEDIUM/LOW)
- Assigned agent
- Current status

### System Statistics

The stats cards show:
- Number of active agents
- Tasks completed today
- AI accuracy rate
- System uptime

---

## 🔒 Security & Privacy

- All AI processing runs locally on your machine (Ollama)
- No data is sent to external cloud APIs by default
- API keys are stored locally in `local_keys.json`
- Agent communications are encrypted

---

## 🚀 Advanced Features

### WebSocket Real-time Updates

For real-time agent status updates, use WebSocket connections:

```javascript
const socket = io('http://localhost:3001');

socket.on('agent:update', (data) => {
    console.log('Agent status updated:', data);
    // Update UI with new agent status
});

socket.on('task:complete', (data) => {
    console.log('Task completed:', data);
    // Update task list
});
```

### Custom Tool Integration

Add your own tools by implementing them in `goat_agents.py`:

```python
def tool_your_custom_tool(param1, param2):
    """
    Your custom tool description
    """
    try:
        # Your tool logic here
        result = do_something(param1, param2)
        return {
            "ok": True,
            "summary": f"Operation completed successfully",
            "data": result
        }
    except Exception as e:
        return {
            "ok": False,
            "summary": f"Tool failed: {e}",
            "data": None
        }
```

---

## 📞 Need Help?

If you encounter any issues or need assistance:

1. Check the troubleshooting section above
2. Review the API documentation
3. Check the browser console for errors
4. Verify all services are running correctly

---

## 🎉 Success!

You now have a full AI agent crew integrated into your GOAT Royalty platform! 

Start chatting with Money Penny and let your agents help you manage your music business autonomously.