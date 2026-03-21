/**
 * 🐐 SUPER GOAT ROYALTY APP — ULTIMATE EDITION v5.0.0
 * Electron Main Process — Desktop Application Shell
 * © 2024 Harvey L Miller Jr / Juaquin J Malphurs / Kevin W Hallingquest
 */

const { app, BrowserWindow, Menu, Tray, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;
let tray;
let serverProcess;
const SERVER_PORT = 4001;

// ==================== SINGLE INSTANCE LOCK ====================
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

// ==================== START SERVER ====================
function startServer() {
    return new Promise((resolve, reject) => {
        try {
            process.env.PORT = SERVER_PORT;
            serverProcess = fork(path.join(__dirname, 'server.js'), [], {
                env: { ...process.env, PORT: SERVER_PORT, ELECTRON: 'true' },
                silent: true
            });
            
            serverProcess.stdout.on('data', (data) => {
                console.log(`[Server] ${data.toString().trim()}`);
                if (data.toString().includes('Running on port')) {
                    resolve();
                }
            });
            
            serverProcess.stderr.on('data', (data) => {
                console.error(`[Server Error] ${data.toString().trim()}`);
            });
            
            serverProcess.on('error', reject);
            
            // Resolve after 3 seconds even if no message
            setTimeout(resolve, 3000);
        } catch(e) {
            console.error('Server start error:', e);
            resolve(); // Continue anyway
        }
    });
}

// ==================== WINDOW CREATION ====================
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1024,
        minHeight: 700,
        title: '🐐 SUPER GOAT ROYALTY — ULTIMATE EDITION v5.0',
        icon: path.join(__dirname, 'public', 'favicon.ico'),
        backgroundColor: '#0a0a0f',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false
        },
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#12121a',
            symbolColor: '#ffd700',
            height: 32
        },
        show: false
    });

    mainWindow.loadURL(`http://localhost:${SERVER_PORT}`);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Open external links in browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

// ==================== APPLICATION MENU ====================
function createMenu() {
    const template = [
        {
            label: '🐐 GOAT Royalty',
            submenu: [
                { label: 'About GOAT Royalty v5.0', click: showAbout },
                { type: 'separator' },
                { label: 'Dashboard', accelerator: 'CmdOrCtrl+1', click: () => navigateTo('dashboard') },
                { label: 'AI Suite', accelerator: 'CmdOrCtrl+2', click: () => navigateTo('ai') },
                { label: 'Music Studio', accelerator: 'CmdOrCtrl+3', click: () => navigateTo('music') },
                { label: 'Song Catalog', accelerator: 'CmdOrCtrl+4', click: () => navigateTo('catalog') },
                { type: 'separator' },
                { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
            ]
        },
        {
            label: 'View',
            submenu: [
                { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => mainWindow && mainWindow.reload() },
                { label: 'Developer Tools', accelerator: 'F12', click: () => mainWindow && mainWindow.webContents.toggleDevTools() },
                { type: 'separator' },
                { label: 'Zoom In', accelerator: 'CmdOrCtrl+=', role: 'zoomIn' },
                { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
                { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
                { type: 'separator' },
                { label: 'Full Screen', accelerator: 'F11', role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                { label: 'Website', click: () => shell.openExternal('https://www.goatroyaltyapp.org') },
                { label: 'GitHub', click: () => shell.openExternal('https://github.com/DJSPEEDYGA/nextjs-commerce') },
                { type: 'separator' },
                { label: `Server: http://localhost:${SERVER_PORT}`, enabled: false }
            ]
        }
    ];
    
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function navigateTo(tab) {
    if (mainWindow) {
        mainWindow.webContents.executeJavaScript(`
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const tab = document.querySelector('[data-tab="${tab}"]');
            if (tab) { tab.classList.add('active'); }
            const content = document.getElementById('tab-${tab}');
            if (content) { content.classList.add('active'); }
            if (typeof loadTabData === 'function') loadTabData('${tab}');
        `);
    }
}

function showAbout() {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: '🐐 SUPER GOAT ROYALTY APP',
        message: 'SUPER GOAT ROYALTY — ULTIMATE EDITION v5.0.0',
        detail: `The Most Complete Music Industry App Ever Built

242 API Endpoints | 13 Dashboard Tabs | 28 Library Modules

🤖 AI: NVIDIA NIM + OpenRouter + Gemini + ACE SteerLM
🎵 Music: 3,077 Songs | DAW Suite | Distribution Hub
💕 Social: AI Dating + Celebrity Network
🛡️ Security: 6-Engine AV + Cyber Warfare
🎮 Gaming: UE5 CoPilot + FiveM

© 2024 Harvey L Miller Jr (DJ Speedy)
Juaquin J Malphurs (Waka Flocka)
Kevin W Hallingquest
www.goatroyaltyapp.org`,
        buttons: ['OK']
    });
}

// ==================== APP LIFECYCLE ====================
app.whenReady().then(async () => {
    console.log('🐐 Starting SUPER GOAT ROYALTY APP v5.0...');
    
    await startServer();
    console.log(`🐐 Server running on port ${SERVER_PORT}`);
    
    createWindow();
    createMenu();
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (serverProcess) serverProcess.kill();
        app.quit();
    }
});

app.on('before-quit', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
});

// ==================== IPC HANDLERS ====================
ipcMain.handle('get-app-info', () => ({
    name: 'SUPER GOAT ROYALTY APP',
    version: '5.0.0',
    serverPort: SERVER_PORT,
    platform: process.platform,
    arch: process.arch
}));

ipcMain.handle('get-server-status', async () => {
    try {
        const http = require('http');
        return new Promise((resolve) => {
            http.get(`http://localhost:${SERVER_PORT}/api/status`, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
            }).on('error', () => resolve({ status: 'offline' }));
        });
    } catch(e) { return { status: 'error', message: e.message }; }
});