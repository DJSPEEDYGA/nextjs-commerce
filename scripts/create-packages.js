/**
 * SUPER GOAT ROYALTIES APP - Package Creator
 * Creates complete distribution packages for all platforms
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Files and directories to include in each package
const INCLUDE_DIRS = ['lib', 'public', 'local-data'];
const INCLUDE_FILES = ['package.json'];

// Platform configurations
const platforms = [
    { name: 'linux', exe: 'super-goat-royalties-linux', pkgDir: 'goat-royalties-linux', ext: '' },
    { name: 'windows', exe: 'super-goat-royalties-win.exe', pkgDir: 'goat-royalties-windows', ext: '.exe' },
    { name: 'macos', exe: 'super-goat-royalties-macos', pkgDir: 'goat-royalties-macos', ext: '' }
];

// Launcher scripts
const launchers = {
    windows: `@echo off
title SUPER GOAT ROYALTIES APP v3.0.0
color 0A
echo.
echo ================================================
echo    SUPER GOAT ROYALTIES APP v3.0.0
echo    AI-Powered Music Royalty Management Platform
echo ================================================
echo.
echo Starting server on port 4001...
echo Open your browser to: http://localhost:4001
echo Press Ctrl+C to stop
echo ================================================
super-goat-royalties-windows.exe
pause
`,
    macos: `#!/bin/bash
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
chmod +x super-goat-royalties-macos
./super-goat-royalties-macos
`,
    linux: `#!/bin/bash
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
`
};

const readme = `# SUPER GOAT ROYALTIES APP v3.0.0

## Quick Start
- **Windows**: Double-click START.bat
- **macOS/Linux**: Run ./start.sh in Terminal
- **Access**: Open http://localhost:4001 in your browser

## Features
- 242+ API Endpoints
- 6 AI Engines
- Voice Commands
- Self-Healing System
- 100% Offline Capable

## Support
- Website: https://www.goatroyaltyapp.org
- Email: contact@goatroyaltyapp.org

Copyright © 2024 HARVEY L MILLER JR. All Rights Reserved.
`;

function createPackages() {
    console.log('📦 Creating distribution packages...\n');
    
    platforms.forEach(platform => {
        console.log(`\n🔧 Creating ${platform.name} package...`);
        
        const pkgDir = path.join(DIST_DIR, platform.pkgDir);
        const exeSource = path.join(DIST_DIR, platform.exe);
        
        // Check if executable exists
        if (!fs.existsSync(exeSource)) {
            console.log(`   ⚠️  Skipping ${platform.name} - executable not found`);
            return;
        }
        
        // Create package directory
        if (fs.existsSync(pkgDir)) {
            fs.rmSync(pkgDir, { recursive: true });
        }
        fs.mkdirSync(pkgDir, { recursive: true });
        
        // Copy executable
        fs.copyFileSync(exeSource, path.join(pkgDir, platform.exe));
        console.log(`   ✓ Executable copied`);
        
        // Copy directories
        INCLUDE_DIRS.forEach(dir => {
            const src = path.join(ROOT_DIR, dir);
            const dest = path.join(pkgDir, dir);
            if (fs.existsSync(src)) {
                fs.cpSync(src, dest, { recursive: true });
                console.log(`   ✓ ${dir}/ copied`);
            }
        });
        
        // Copy files
        INCLUDE_FILES.forEach(file => {
            const src = path.join(ROOT_DIR, file);
            const dest = path.join(pkgDir, file);
            if (fs.existsSync(src)) {
                fs.copyFileSync(src, dest);
                console.log(`   ✓ ${file} copied`);
            }
        });
        
        // Create launcher script
        const launcherName = platform.name === 'windows' ? 'START.bat' : 'start.sh';
        fs.writeFileSync(path.join(pkgDir, launcherName), launchers[platform.name]);
        if (platform.name !== 'windows') {
            fs.chmodSync(path.join(pkgDir, launcherName), '755');
        }
        console.log(`   ✓ ${launcherName} created`);
        
        // Create README
        fs.writeFileSync(path.join(pkgDir, 'README.md'), readme);
        console.log(`   ✓ README.md created`);
        
        // Create datasets directory
        fs.mkdirSync(path.join(pkgDir, 'datasets'), { recursive: true });
        
        // Create tar.gz archive
        const archiveName = `super-goat-royalties-${platform.name}-v3.0.0.tar.gz`;
        const archivePath = path.join(DIST_DIR, archiveName);
        console.log(`   📦 Creating ${archiveName}...`);
        try {
            execSync(`tar -czf "${archivePath}" -C "${DIST_DIR}" ${platform.pkgDir}`, {
                cwd: ROOT_DIR,
                stdio: 'pipe'
            });
            
            // Calculate size
            const stats = fs.statSync(archivePath);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            console.log(`   ✅ ${archiveName} created (${sizeMB} MB)`);
        } catch (e) {
            console.log(`   ⚠️  Could not create archive: ${e.message}`);
        }
    });
    
    // Create ZIP for Windows
    console.log('\n📦 Creating Windows ZIP...');
    try {
        execSync(`cd dist && zip -r super-goat-royalties-windows-v3.0.0.zip goat-royalties-windows/`, {
            cwd: ROOT_DIR,
            stdio: 'pipe'
        });
        console.log('   ✅ Windows ZIP created');
    } catch (e) {
        console.log('   ⚠️  ZIP creation skipped (zip not available)');
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 PACKAGE CREATION COMPLETE');
    console.log('='.repeat(50));
    
    const files = fs.readdirSync(DIST_DIR).filter(f => 
        f.endsWith('.tar.gz') || f.endsWith('.zip')
    );
    
    files.forEach(file => {
        const stats = fs.statSync(path.join(DIST_DIR, file));
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`   📦 ${file} (${sizeMB} MB)`);
    });
}

createPackages();