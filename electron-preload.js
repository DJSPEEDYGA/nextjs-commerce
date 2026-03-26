/**
 * SUPER GOAT ROYALTIES APP - Electron Preload Script
 * Secure bridge between main and renderer processes
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// specific electron APIs without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Platform info
    platform: process.platform,
    isWindows: process.platform === 'win32',
    isMac: process.platform === 'darwin',
    isLinux: process.platform === 'linux',
    
    // App info
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
    
    // Server controls
    restartServer: () => ipcRenderer.invoke('restart-server'),
    getServerStatus: () => ipcRenderer.invoke('get-server-status'),
    
    // Notifications
    showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
    
    // Shell operations
    openExternal: (url) => ipcRenderer.invoke('open-external', url),
    openPath: (path) => ipcRenderer.invoke('open-path', path),
    
    // Dialog operations
    showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
    showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
    showMessageDialog: (options) => ipcRenderer.invoke('show-message-dialog', options),
    
    // Store operations
    storeGet: (key) => ipcRenderer.invoke('store-get', key),
    storeSet: (key, value) => ipcRenderer.invoke('store-set', key, value),
    storeDelete: (key) => ipcRenderer.invoke('store-delete', key),
    
    // Events
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    onServerStatus: (callback) => ipcRenderer.on('server-status', callback),
    
    // Cleanup
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});