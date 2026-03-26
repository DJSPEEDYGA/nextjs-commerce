#!/bin/bash
clear
echo ""
echo "================================================"
echo "   SUPER GOAT ROYALTIES APP v3.0.0"
echo "   AI-Powered Music Royalty Management Platform"
echo "================================================"
echo ""
echo "Starting server on port 4001..."
echo "Open your browser to: http://localhost:4001"
echo "Press Ctrl+C to stop"
echo "================================================"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
chmod +x super-goat-royalties-linux
./super-goat-royalties-linux
