'use strict';
// ============================================================
// GOAT Connect — Local Storage Engine
// Zero cloud. Zero tracking. 100% YOUR data.
// ============================================================

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class LocalStorageEngine {
    constructor() {
        // Default storage root — can be overridden via env or config
        this.storageRoot = process.env.GOAT_STORAGE_PATH || path.join(__dirname, '..', '..', 'local-data');
        
        // Storage directories
        this.dirs = {
            root: this.storageRoot,
            profiles: path.join(this.storageRoot, 'profiles'),
            matches: path.join(this.storageRoot, 'matches'),
            messages: path.join(this.storageRoot, 'messages'),
            music: path.join(this.storageRoot, 'music'),
            beats: path.join(this.storageRoot, 'music', 'beats'),
            scripts: path.join(this.storageRoot, 'scripts'),
            exports: path.join(this.storageRoot, 'exports'),
            security: path.join(this.storageRoot, 'security'),
            business: path.join(this.storageRoot, 'business'),
            web3: path.join(this.storageRoot, 'web3'),
            intel: path.join(this.storageRoot, 'intel'),
            avatars: path.join(this.storageRoot, 'avatars'),
            media: path.join(this.storageRoot, 'media'),
            backups: path.join(this.storageRoot, 'backups'),
            logs: path.join(this.storageRoot, 'logs'),
            config: path.join(this.storageRoot, 'config'),
        };

        // Initialize all directories
        this._initDirs();

        // Load or create master config
        this.config = this._loadConfig();

        // Stats tracking
        this.stats = {
            totalFiles: 0,
            totalSize: 0,
            lastSave: null,
            lastBackup: null,
            created: new Date().toISOString()
        };

        this._updateStats();

        console.log(`💾 Local Storage Engine initialized`);
        console.log(`📂 Storage root: ${this.storageRoot}`);
        console.log(`📊 ${this.stats.totalFiles} files, ${this._formatSize(this.stats.totalSize)}`);
    }

    // ==================== DIRECTORY MANAGEMENT ====================
    
    _initDirs() {
        Object.values(this.dirs).forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    // ==================== CONFIG ====================
    
    _loadConfig() {
        const configPath = path.join(this.dirs.config, 'goat-config.json');
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        const defaultConfig = {
            version: '3.0.0-OFFLINE',
            appName: 'GOAT Connect OFFLINE EDITION',
            owner: 'Harvey L. Miller Jr. (DJ Speedy)',
            storagePath: this.storageRoot,
            maxStorageGB: 10000, // 10TB
            autoSave: true,
            autoBackup: true,
            backupInterval: 86400000, // 24 hours
            encryptLocal: false,
            offlineMode: true,
            noTracking: true,
            noAnalytics: true,
            noExternalCalls: true,
            created: new Date().toISOString()
        };
        this._writeJSON(configPath, defaultConfig);
        return defaultConfig;
    }

    getConfig() {
        return { success: true, config: this.config };
    }

    updateConfig(updates) {
        Object.assign(this.config, updates);
        this._writeJSON(path.join(this.dirs.config, 'goat-config.json'), this.config);
        return { success: true, config: this.config };
    }

    setStoragePath(newPath) {
        if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, { recursive: true });
        }
        this.storageRoot = newPath;
        this.config.storagePath = newPath;
        // Rebuild dirs with new root
        Object.keys(this.dirs).forEach(key => {
            if (key === 'root') {
                this.dirs[key] = newPath;
            } else {
                this.dirs[key] = path.join(newPath, key);
            }
        });
        this._initDirs();
        this._writeJSON(path.join(this.dirs.config, 'goat-config.json'), this.config);
        return { success: true, storagePath: newPath, message: `Storage moved to ${newPath}` };
    }

    // ==================== SAVE / LOAD / DELETE ====================
    
    save(category, id, data) {
        const dir = this.dirs[category] || path.join(this.storageRoot, category);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        const record = {
            id: id || uuidv4(),
            data: data,
            savedAt: new Date().toISOString(),
            category: category
        };

        const filePath = path.join(dir, `${record.id}.json`);
        this._writeJSON(filePath, record);
        this.stats.lastSave = new Date().toISOString();
        
        return { success: true, id: record.id, path: filePath, savedAt: record.savedAt };
    }

    load(category, id) {
        const filePath = path.join(this.dirs[category] || path.join(this.storageRoot, category), `${id}.json`);
        if (!fs.existsSync(filePath)) {
            return { success: false, error: 'Not found' };
        }
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return { success: true, ...data };
    }

    loadAll(category) {
        const dir = this.dirs[category] || path.join(this.storageRoot, category);
        if (!fs.existsSync(dir)) return { success: true, items: [], total: 0 };
        
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
        const items = files.map(f => {
            try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); }
            catch(e) { return null; }
        }).filter(Boolean);

        return { success: true, items, total: items.length };
    }

    delete(category, id) {
        const filePath = path.join(this.dirs[category] || path.join(this.storageRoot, category), `${id}.json`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return { success: true, deleted: id };
        }
        return { success: false, error: 'Not found' };
    }

    // ==================== EXPORT / IMPORT ====================
    
    exportAll() {
        const exportData = {};
        Object.keys(this.dirs).forEach(cat => {
            if (cat === 'root' || cat === 'config') return;
            const result = this.loadAll(cat);
            if (result.total > 0) exportData[cat] = result.items;
        });

        const exportId = `goat-export-${Date.now()}`;
        const exportPath = path.join(this.dirs.exports, `${exportId}.json`);
        this._writeJSON(exportPath, {
            exportId,
            exportedAt: new Date().toISOString(),
            version: this.config.version,
            data: exportData
        });

        return { success: true, exportId, path: exportPath, categories: Object.keys(exportData) };
    }

    importData(importPath) {
        if (!fs.existsSync(importPath)) {
            return { success: false, error: 'Import file not found' };
        }
        const importData = JSON.parse(fs.readFileSync(importPath, 'utf8'));
        let imported = 0;

        Object.entries(importData.data || {}).forEach(([category, items]) => {
            items.forEach(item => {
                this.save(category, item.id, item.data);
                imported++;
            });
        });

        return { success: true, imported, categories: Object.keys(importData.data || {}) };
    }

    // ==================== BACKUP ====================
    
    backup() {
        const backupId = `backup-${Date.now()}`;
        const backupDir = path.join(this.dirs.backups, backupId);
        fs.mkdirSync(backupDir, { recursive: true });

        Object.entries(this.dirs).forEach(([key, dir]) => {
            if (key === 'root' || key === 'backups') return;
            const destDir = path.join(backupDir, key);
            if (fs.existsSync(dir)) {
                this._copyDir(dir, destDir);
            }
        });

        this.stats.lastBackup = new Date().toISOString();
        return { success: true, backupId, path: backupDir, backedUpAt: this.stats.lastBackup };
    }

    // ==================== STORAGE STATS ====================
    
    _updateStats() {
        let totalFiles = 0;
        let totalSize = 0;

        const walk = (dir) => {
            if (!fs.existsSync(dir)) return;
            try {
                fs.readdirSync(dir).forEach(item => {
                    const full = path.join(dir, item);
                    const stat = fs.statSync(full);
                    if (stat.isDirectory()) walk(full);
                    else { totalFiles++; totalSize += stat.size; }
                });
            } catch(e) {}
        };
        walk(this.storageRoot);

        this.stats.totalFiles = totalFiles;
        this.stats.totalSize = totalSize;
    }

    getStats() {
        this._updateStats();
        return {
            success: true,
            stats: {
                storagePath: this.storageRoot,
                totalFiles: this.stats.totalFiles,
                totalSize: this._formatSize(this.stats.totalSize),
                totalSizeBytes: this.stats.totalSize,
                maxStorage: `${this.config.maxStorageGB} GB`,
                usedPercent: ((this.stats.totalSize / (this.config.maxStorageGB * 1073741824)) * 100).toFixed(4) + '%',
                lastSave: this.stats.lastSave,
                lastBackup: this.stats.lastBackup,
                offlineMode: true,
                noTracking: true,
                categories: Object.keys(this.dirs).filter(k => k !== 'root')
            }
        };
    }

    getStorageInfo() {
        this._updateStats();
        return {
            success: true,
            storage: {
                root: this.storageRoot,
                offline: true,
                noCloud: true,
                noTracking: true,
                noAnalytics: true,
                directories: Object.entries(this.dirs).map(([name, dir]) => {
                    let fileCount = 0;
                    let size = 0;
                    try {
                        if (fs.existsSync(dir)) {
                            const files = fs.readdirSync(dir).filter(f => !fs.statSync(path.join(dir, f)).isDirectory());
                            fileCount = files.length;
                            files.forEach(f => size += fs.statSync(path.join(dir, f)).size);
                        }
                    } catch(e) {}
                    return { name, path: dir, files: fileCount, size: this._formatSize(size) };
                }),
                totalFiles: this.stats.totalFiles,
                totalSize: this._formatSize(this.stats.totalSize)
            }
        };
    }

    // ==================== HELPERS ====================
    
    _writeJSON(filePath, data) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }

    _formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
    }

    _copyDir(src, dest) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(item => {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            if (fs.statSync(srcPath).isDirectory()) {
                this._copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
    }
}

module.exports = new LocalStorageEngine();