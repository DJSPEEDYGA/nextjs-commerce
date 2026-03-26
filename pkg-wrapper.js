/**
 * SUPER GOAT ROYALTIES APP - PKG Wrapper
 * This wrapper handles the pkg snapshot filesystem limitations
 * by redirecting data storage to an external directory
 */

const path = require('path');
const fs = require('fs');
const os = require('os');

// Detect if running in pkg snapshot
const isPkg = process.pkg !== undefined;

if (isPkg) {
    // Set storage path to user's home directory
    const homeDir = os.homedir();
    const dataDir = path.join(homeDir, '.goat-royalties-app', 'data');
    const datasetsDir = path.join(dataDir, 'datasets');
    
    // Create data directories if they don't exist
    const dirsToCreate = [
        dataDir,
        datasetsDir,
        path.join(dataDir, 'profiles'),
        path.join(dataDir, 'matches'),
        path.join(dataDir, 'messages'),
        path.join(dataDir, 'music'),
        path.join(dataDir, 'beats'),
        path.join(dataDir, 'scripts'),
        path.join(dataDir, 'exports'),
        path.join(dataDir, 'security'),
        path.join(dataDir, 'business'),
        path.join(dataDir, 'web3'),
        path.join(dataDir, 'intel'),
        path.join(dataDir, 'avatars'),
        path.join(dataDir, 'media'),
        path.join(dataDir, 'backups'),
        path.join(dataDir, 'logs'),
        path.join(dataDir, 'config'),
    ];
    
    dirsToCreate.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    
    // Set environment variable for storage path
    process.env.GOAT_STORAGE_PATH = dataDir;
    process.env.DATASETS_DIR = datasetsDir;
    
    // Change working directory to data dir so relative paths work
    process.chdir(dataDir);
    
    console.log('📦 Running in PKG mode');
    console.log('📁 Data directory:', dataDir);
}

// Now require the actual server
require('./server.js');