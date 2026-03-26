/**
 * SUPER GOAT ROYALTIES APP - Portable Build Script
 * Creates a cross-platform portable version that runs without installation
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Configuration
const APP_NAME = 'SUPER GOAT ROYALTIES APP';
const APP_VERSION = '3.0.0';
const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'portable');
const SOURCE_DIR = path.join(__dirname, '..');

// Files to include in portable package
const INCLUDE_FILES = [
    'server.js',
    'package.json',
    'package-lock.json'
];

const INCLUDE_DIRS = [
    'lib',
    'public',
    'local-data'
];

// Platform-specific launcher scripts
const launchers = {
    windows: `@echo off
title SUPER GOAT ROYALTIES APP v${APP_VERSION}
color 0A
echo.
echo ================================================
echo    SUPER GOAT ROYALTIES APP v${APP_VERSION}
echo    AI-Powered Music Royalty Management Platform
echo ================================================
echo.
echo Starting server on port 4001...
echo.
echo Open your browser to: http://localhost:4001
echo.
echo Press Ctrl+C to stop the server
echo ================================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install --production
    echo.
)

:: Start the server
node server.js

pause
`,
    
    macLinux: `#!/bin/bash
# SUPER GOAT ROYALTIES APP v${APP_VERSION}
# AI-Powered Music Royalty Management Platform

clear
echo ""
echo "================================================"
echo "   SUPER GOAT ROYALTIES APP v${APP_VERSION}"
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
`,
    
    readme: `# SUPER GOAT ROYALTIES APP - Portable Edition v${APP_VERSION}

## 🐐 The Ultimate AI-Powered Music Royalty Management Platform

### Quick Start

#### Windows
1. Double-click \`START-WINDOWS.bat\`
2. Open your browser to http://localhost:4001
3. Enjoy! 🎉

#### macOS / Linux
1. Open Terminal
2. Navigate to this folder
3. Run: \`chmod +x start-mac-linux.sh && ./start-mac-linux.sh\`
4. Open your browser to http://localhost:4001
5. Enjoy! 🎉

### System Requirements
- **Node.js** 18.x or higher (https://nodejs.org/)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 200MB for app + dependencies
- **Browser**: Chrome, Firefox, Safari, or Edge (latest version)

### Features
✅ 242+ API Endpoints
✅ 6 AI Engines Integrated
✅ Voice Commands & Text-to-Speech
✅ Real-time Analytics Dashboard
✅ Self-Healing System
✅ Celebrity Database (30+ profiles)
✅ Music Catalog Management
✅ Royalty Tracking & Analytics
✅ Maximum Cybersecurity
✅ 100% Offline Capable

### Ports Used
- **4001**: Main Application Server

### Troubleshooting

**"Node.js is not installed"**
- Download and install Node.js from https://nodejs.org/
- Restart your terminal/command prompt after installation

**"Port 4001 is already in use"**
- Another instance may be running
- Change the port: set PORT=4002 in environment variables

**"Permission denied" (macOS/Linux)**
- Run: \`chmod +x start-mac-linux.sh\`

### Support
- Website: https://www.goatroyaltyapp.org
- Email: contact@goatroyaltyapp.org
- GitHub: https://github.com/DJSPEEDYGA/nextjs-commerce

### License
Copyright © 2024 HARVEY L MILLER JR. All Rights Reserved.

---
Made with ❤️ by the GOAT Royalty Team
`,
    
    version: JSON.stringify({
        name: APP_NAME,
        version: APP_VERSION,
        buildDate: new Date().toISOString(),
        platform: 'portable',
        features: {
            endpoints: '242+',
            aiEngines: 6,
            offlineCapable: true,
            selfHealing: true
        }
    }, null, 2)
};

// Build the portable package
async function buildPortable() {
    console.log('🐐 Building SUPER GOAT ROYALTIES APP - Portable Edition...\n');
    
    // Clean output directory
    console.log('📁 Preparing output directory...');
    if (fs.existsSync(OUTPUT_DIR)) {
        fs.rmSync(OUTPUT_DIR, { recursive: true });
    }
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    
    // Copy application files
    console.log('📦 Copying application files...');
    
    for (const file of INCLUDE_FILES) {
        const src = path.join(SOURCE_DIR, file);
        const dest = path.join(OUTPUT_DIR, file);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`   ✓ ${file}`);
        }
    }
    
    for (const dir of INCLUDE_DIRS) {
        const src = path.join(SOURCE_DIR, dir);
        const dest = path.join(OUTPUT_DIR, dir);
        if (fs.existsSync(src)) {
            fs.cpSync(src, dest, { recursive: true });
            console.log(`   ✓ ${dir}/`);
        }
    }
    
    // Create launcher scripts
    console.log('\n🚀 Creating launcher scripts...');
    
    fs.writeFileSync(path.join(OUTPUT_DIR, 'START-WINDOWS.bat'), launchers.windows);
    console.log('   ✓ START-WINDOWS.bat');
    
    fs.writeFileSync(path.join(OUTPUT_DIR, 'start-mac-linux.sh'), launchers.macLinux);
    fs.chmodSync(path.join(OUTPUT_DIR, 'start-mac-linux.sh'), '755');
    console.log('   ✓ start-mac-linux.sh');
    
    // Create documentation
    console.log('\n📝 Creating documentation...');
    
    fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), launchers.readme);
    console.log('   ✓ README.md');
    
    fs.writeFileSync(path.join(OUTPUT_DIR, 'version.json'), launchers.version);
    console.log('   ✓ version.json');
    
    // Create package.json for npm install
    const pkgJson = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, 'package.json')));
    pkgJson.scripts = {
        start: 'node server.js'
    };
    fs.writeFileSync(path.join(OUTPUT_DIR, 'package.json'), JSON.stringify(pkgJson, null, 2));
    
    // Calculate total size
    console.log('\n📊 Calculating package size...');
    let totalSize = 0;
    
    function getDirSize(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                getDirSize(filePath);
            } else {
                totalSize += stats.size;
            }
        }
    }
    
    getDirSize(OUTPUT_DIR);
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    
    console.log('\n✅ Portable build complete!');
    console.log(`\n📋 Build Summary:`);
    console.log(`   Location: ${OUTPUT_DIR}`);
    console.log(`   Size: ${sizeMB} MB`);
    console.log(`   Files: ${INCLUDE_FILES.length} files, ${INCLUDE_DIRS.length} directories`);
    console.log('\n💡 Next Steps:');
    console.log('   1. Navigate to dist/portable');
    console.log('   2. Run START-WINDOWS.bat (Windows) or ./start-mac-linux.sh (Mac/Linux)');
    console.log('   3. The app will auto-install dependencies on first run');
    console.log('   4. Open browser to http://localhost:4001');
    
    return OUTPUT_DIR;
}

// Run the build
buildPortable().catch(console.error);