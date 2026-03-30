#!/bin/bash
#==============================================================================
# SUPER GOAT ROYALTIES - Master Build Script for All Platforms
# Generates EXE, DMG, AppImage, DEB, Portable versions
#==============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

APP_NAME="SUPER GOAT ROYALTIES"
VERSION="5.1.0"
BUILD_DIR="./dist"

echo -e "${PURPLE}========================================${NC}"
echo -e "${PURPLE}   SUPER GOAT ROYALTIES BUILD SYSTEM   ${NC}"
echo -e "${PURPLE}========================================${NC}"
echo ""

# Clean previous builds
echo -e "${YELLOW}Cleaning previous builds...${NC}"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install --legacy-peer-deps

# Build for current platform
echo -e "${GREEN}Building for current platform (Linux)...${NC}"
npm run electron:build:linux

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   BUILD COMPLETE!   ${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# List built files
echo -e "${YELLOW}Built files:${NC}"
ls -lh $BUILD_DIR/*.AppImage 2>/dev/null || echo "No AppImage found"
ls -lh $BUILD_DIR/*.deb 2>/dev/null || echo "No DEB found"
ls -lh $BUILD_DIR/*.exe 2>/dev/null || echo "No EXE found (use GitHub Actions for Windows)"
ls -lh $BUILD_DIR/*.dmg 2>/dev/null || echo "No DMG found (use GitHub Actions for macOS)"

echo ""
echo -e "${GREEN}For Windows EXE and macOS DMG builds:${NC}"
echo -e "  1. Push this code to GitHub"
echo -e "  2. Go to Actions tab"
echo -e "  3. Run the 'Build GOAT App - All Platforms' workflow"
echo -e "  4. Download artifacts or release"
echo ""
echo -e "${GREEN}For Docker deployment:${NC}"
echo -e "  docker-compose up -d"
echo ""