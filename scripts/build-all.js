/**
 * SUPER GOAT ROYALTIES APP - Master Build Script
 * Creates all installer packages for all platforms
 * 
 * Usage: node scripts/build-all.js [options]
 * Options:
 *   --win        Build Windows installer
 *   --mac        Build macOS DMG
 *   --linux      Build Linux packages
 *   --portable   Build portable version
 *   --all        Build everything
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const APP_NAME = 'SUPER GOAT ROYALTIES APP';
const APP_VERSION = '3.0.0';
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Parse command line arguments
const args = process.argv.slice(2);
const buildAll = args.includes('--all');
const buildWin = buildAll || args.includes('--win');
const buildMac = buildAll || args.includes('--mac');
const buildLinux = buildAll || args.includes('--linux');
const buildPortable = buildAll || args.includes('--portable');

// If no specific flags, build all
const shouldBuild = buildWin || buildMac || buildLinux || buildPortable;
if (!shouldBuild) {
    console.log('Usage: node scripts/build-all.js [options]');
    console.log('Options:');
    console.log('  --win        Build Windows installer');
    console.log('  --mac        Build macOS DMG');
    console.log('  --linux      Build Linux packages');
    console.log('  --portable   Build portable version');
    console.log('  --all        Build everything');
    process.exit(1);
}

// Current platform
const platform = os.platform();
const isWindows = platform === 'win32';
const isMac = platform === 'darwin';
const isLinux = platform === 'linux';

// Console colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, options = {}) {
    try {
        log(`\n🔧 Running: ${command}`, 'cyan');
        execSync(command, {
            stdio: 'inherit',
            cwd: ROOT_DIR,
            ...options
        });
        return true;
    } catch (error) {
        log(`❌ Command failed: ${command}`, 'red');
        if (options.ignoreError) {
            return false;
        }
        throw error;
    }
}

// Ensure dist directory exists
function ensureDistDir() {
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }
}

// Build Windows installer
async function buildWindows() {
    log('\n🪟 Building Windows Installer...', 'yellow');
    
    if (!isWindows && !process.env.FORCE_BUILD) {
        log('⚠️  Cross-compiling Windows builds from non-Windows platform', 'yellow');
        log('   For best results, build on Windows or use CI/CD', 'yellow');
    }
    
    try {
        // Build with electron-builder
        runCommand('npx electron-builder --win --x64 --config', { ignoreError: false });
        
        log('✅ Windows build complete!', 'green');
        
        // List generated files
        const winDir = path.join(DIST_DIR, 'win-unpacked');
        if (fs.existsSync(winDir)) {
            log(`   Output: ${winDir}`, 'blue');
        }
        
        return true;
    } catch (error) {
        log('❌ Windows build failed!', 'red');
        log(`   Error: ${error.message}`, 'red');
        return false;
    }
}

// Build macOS DMG
async function buildMacOS() {
    log('\n🍎 Building macOS DMG...', 'yellow');
    
    if (!isMac && !process.env.FORCE_BUILD) {
        log('⚠️  Cross-compiling macOS builds from non-Mac platform', 'yellow');
        log('   For best results, build on macOS or use CI/CD', 'yellow');
        log('   Note: DMG notarization requires macOS', 'yellow');
    }
    
    try {
        // Build with electron-builder
        runCommand('npx electron-builder --mac --x64 --arm64 --config', { ignoreError: false });
        
        log('✅ macOS build complete!', 'green');
        
        // List generated files
        const macDir = path.join(DIST_DIR, 'mac');
        if (fs.existsSync(macDir)) {
            log(`   Output: ${macDir}`, 'blue');
        }
        
        return true;
    } catch (error) {
        log('❌ macOS build failed!', 'red');
        log(`   Error: ${error.message}`, 'red');
        return false;
    }
}

// Build Linux packages
async function buildLinux() {
    log('\n🐧 Building Linux Packages...', 'yellow');
    
    try {
        // Build all Linux formats
        runCommand('npx electron-builder --linux --x64 --config', { ignoreError: false });
        
        log('✅ Linux build complete!', 'green');
        
        // List generated files
        const linuxDir = path.join(DIST_DIR, 'linux-unpacked');
        if (fs.existsSync(linuxDir)) {
            log(`   Output: ${linuxDir}`, 'blue');
        }
        
        // Check for specific outputs
        const outputs = ['deb', 'appimage', 'tar.gz'];
        outputs.forEach(ext => {
            const files = fs.readdirSync(DIST_DIR).filter(f => f.endsWith(ext));
            files.forEach(file => {
                log(`   Generated: ${file}`, 'blue');
            });
        });
        
        return true;
    } catch (error) {
        log('❌ Linux build failed!', 'red');
        log(`   Error: ${error.message}`, 'red');
        return false;
    }
}

// Build portable version
async function buildPortableVersion() {
    log('\n📦 Building Portable Version...', 'yellow');
    
    try {
        // Run the portable build script
        require('./build-portable.js');
        
        log('✅ Portable build complete!', 'green');
        log(`   Output: ${DIST_DIR}/portable`, 'blue');
        
        return true;
    } catch (error) {
        log('❌ Portable build failed!', 'red');
        log(`   Error: ${error.message}`, 'red');
        return false;
    }
}

// Create a summary report
function createSummary(results) {
    log('\n' + '='.repeat(60), 'cyan');
    log('📊 BUILD SUMMARY', 'cyan');
    log('='.repeat(60), 'cyan');
    
    log(`\nApplication: ${APP_NAME}`, 'blue');
    log(`Version: ${APP_VERSION}`, 'blue');
    log(`Build Date: ${new Date().toISOString()}`, 'blue');
    log(`Platform: ${platform}`, 'blue');
    
    log('\n📦 Build Results:', 'blue');
    
    const icons = {
        windows: results.windows ? '✅' : '❌',
        macos: results.macos ? '✅' : '❌',
        linux: results.linux ? '✅' : '❌',
        portable: results.portable ? '✅' : '❌'
    };
    
    if (buildWin) log(`   ${icons.windows} Windows Installer`, results.windows ? 'green' : 'red');
    if (buildMac) log(`   ${icons.macos} macOS DMG`, results.macos ? 'green' : 'red');
    if (buildLinux) log(`   ${icons.linux} Linux Packages`, results.linux ? 'green' : 'red');
    if (buildPortable) log(`   ${icons.portable} Portable Version`, results.portable ? 'green' : 'red');
    
    // List output files
    log('\n📁 Output Directory:', 'blue');
    log(`   ${DIST_DIR}`, 'cyan');
    
    if (fs.existsSync(DIST_DIR)) {
        const files = fs.readdirSync(DIST_DIR);
        files.forEach(file => {
            const filePath = path.join(DIST_DIR, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
                log(`   ${file} (${sizeMB} MB)`, 'cyan');
            } else if (stats.isDirectory()) {
                log(`   ${file}/`, 'cyan');
            }
        });
    }
    
    log('\n' + '='.repeat(60), 'cyan');
}

// Main build function
async function main() {
    log('\n🐐 SUPER GOAT ROYALTIES APP - Build System', 'green');
    log('   Version: ' + APP_VERSION, 'blue');
    log('   Platform: ' + platform, 'blue');
    
    ensureDistDir();
    
    const results = {
        windows: false,
        macos: false,
        linux: false,
        portable: false
    };
    
    // Run requested builds
    if (buildPortable) {
        results.portable = await buildPortableVersion();
    }
    
    if (buildWin) {
        results.windows = await buildWindows();
    }
    
    if (buildMac) {
        results.macos = await buildMacOS();
    }
    
    if (buildLinux) {
        results.linux = await buildLinux();
    }
    
    // Create summary
    createSummary(results);
    
    // Exit with appropriate code
    const allSuccess = Object.values(results).filter(v => v !== null).every(v => v);
    process.exit(allSuccess ? 0 : 1);
}

// Run main
main().catch(error => {
    log(`\n❌ Build failed with error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});