#!/bin/bash
# GOAT Royalty - Start Python Agent Backend
# Starts all Python agent services

set -e

echo "========================================"
echo "  GOAT Royalty Agent Backend Startup"
echo "========================================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found!"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

# Get the workspace directory
WORKSPACE_DIR="/workspace"
cd "$WORKSPACE_DIR"

echo "📂 Workspace: $WORKSPACE_DIR"
echo ""

# Check for required files
if [ ! -f "goat_intel.py" ]; then
    echo "❌ goat_intel.py not found!"
    echo "Make sure you're in the correct directory"
    exit 1
fi

if [ ! -f "goat_brain.py" ]; then
    echo "❌ goat_brain.py not found!"
    exit 1
fi

if [ ! -f "money-penny-agent.py" ]; then
    echo "❌ money-penny-agent.py not found!"
    exit 1
fi

echo "✅ All agent files found"
echo ""

# Create logs directory
mkdir -p logs

echo "🚀 Starting GOAT Intel Server..."
echo "   URL: http://localhost:5500"
echo ""

# Start goat_intel.py in background
nohup python3 goat_intel.py > logs/goat_intel.log 2>&1 &
INTEL_PID=$!
echo "✅ GOAT Intel started (PID: $INTEL_PID)"

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if curl -s http://localhost:5500/ > /dev/null; then
    echo "✅ Server is running!"
    echo ""
    echo "========================================"
    echo "  Agent Backend Successfully Started!"
    echo "========================================"
    echo ""
    echo "Endpoints:"
    echo "  • Health Check: http://localhost:5500/"
    echo "  • Chat API:     http://localhost:5500/api/chat"
    echo "  • Tools API:    http://localhost:5500/api/tools"
    echo "  • Agents API:   http://localhost:5500/api/agents"
    echo ""
    echo "Log files:"
    echo "  • goat_intel.log: logs/goat_intel.log"
    echo ""
    echo "To stop the server:"
    echo "  kill $INTEL_PID"
    echo ""
    
    # Save PID for later use
    echo $INTEL_PID > .agent_backend.pid
    echo "PID saved to: .agent_backend.pid"
else
    echo "❌ Server failed to start!"
    echo "Check logs: logs/goat_intel.log"
    exit 1
fi