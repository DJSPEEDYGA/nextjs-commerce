#!/bin/bash
# SUPER GOAT ROYALTIES APP v3.0.0
# AI-Powered Music Royalty Management Platform

clear
echo ""
echo "================================================"
echo "   SUPER GOAT ROYALTIES APP v3.0.0"
echo "   AI-Powered Music Royalty Management Platform"
echo "================================================"
echo ""
echo "Starting server on port 4001..."
echo ""
echo "Open your browser to: http://localhost:4001"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================================"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    read -p "Press Enter to exit..."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --production
    echo ""
fi

# Start the server
node server.js

read -p "Press Enter to exit..."
