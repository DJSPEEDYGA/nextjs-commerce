/**
 * SUPER GOAT ROYALTIES APP - Electron Main Process
 * Production-ready desktop application shell
 * 
 * Features:
 * - System tray integration
 * - Auto-updater ready
 * - Self-healing server management
 * - Secure IPC bridge
 * - Cross-platform support
 */

const { app, BrowserWindow, Menu, Tray, ipcMain, shell, dialog, nativeImage } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

let mainWindow;
let tray;
let serverProcess;
let isQuitting = false;

const SERVER_PORT = process.env.PORT || 3000;
const APP_NAME = 'SUPER GOAT Royalties';
const APP_VERSION = '4.0.0';

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

// ==================== SERVER MANAGEMENT ====================
class ServerManager {
    constructor() {
        this.process = null;
        this.isRunning = false;
        this.restartAttempts = 0;
        this.maxRestarts = 3;
    }

    start() {
        return new Promise((resolve, reject) => {
            console.log('Starting internal server...');
            
            // In packaged app, server.js is in resources
            const serverPath = app.isPackaged 
                ? path.join(process.resourcesPath, 'server.js')
                : path.join(__dirname, 'server.js');

            // Check if server file exists
            if (!fs.existsSync(serverPath)) {
                console.error('Server file not found:', serverPath);
                // Try alternative locations
                const altPath = path.join(__dirname, 'server.js');
                if (fs.existsSync(altPath)) {
                    console.log('Found server at alternative path:', altPath);
                } else {
                    reject(new Error('Server file not found'));
                    return;
                }
            }

            // Set environment variables
            process.env.PORT = SERVER_PORT;
            process.env.NODE_ENV = 'production';

            // Start the server
            try {
                this.process = spawn(process.execPath, [serverPath], {
                    cwd: app.isPackaged ? process.resourcesPath : __dirname,
                    env: { ...process.env, PORT: SERVER_PORT, NODE_ENV: 'production' },
                    stdio: ['ignore', 'pipe', 'pipe']
                });

                this.process.stdout.on('data', (data) => {
                    console.log(`[Server] ${data.toString().trim()}`);
                });

                this.process.stderr.on('data', (data) => {
                    console.error(`[Server Error] ${data.toString().trim()}`);
                });

                this.process.on('close', (code) => {
                    console.log(`Server process exited with code ${code}`);
                    this.isRunning = false;
                    
                    // Auto-restart on crash (self-healing)
                    if (!isQuitting && this.restartAttempts < this.maxRestarts) {
                        this.restartAttempts++;
                        console.log(`Attempting restart ${this.restartAttempts}/${this.maxRestarts}...`);
                        setTimeout(() => this.start(), 2000);
                    }
                });

                this.isRunning = true;
                this.restartAttempts = 0;
                
                // Wait for server to be ready
                this.waitForServer().then(resolve).catch(reject);
                
            } catch (error) {
                console.error('Failed to start server:', error);
                reject(error);
            }
        });
    }

    waitForServer(maxAttempts = 30) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const checkServer = () => {
                attempts++;
                http.get(`http://localhost:${SERVER_PORT}/api/status`, (res) => {
                    if (res.statusCode === 200) {
                        console.log('Server is ready!');
                        resolve();
                    } else {
                        setTimeout(checkServer, 500);
                    }
                }).on('error', () => {
                    if (attempts < maxAttempts) {
                        setTimeout(checkServer, 500);
                    } else {
                        reject(new Error('Server failed to start within timeout'));
                    }
                });
            };
            setTimeout(checkServer, 1000);
        });
    }

    stop() {
        if (this.process) {
            this.process.kill();
            this.process = null;
            this.isRunning = false;
        }
    }
}

const serverManager = new ServerManager();

// ==================== WINDOW CREATION ====================
function createWindow() {
    const iconPath = app.isPackaged 
        ? path.join(process.resourcesPath, 'build', 'icon.ico')
        : path.join(__dirname, 'build', 'icon.ico');

    let icon;
    try {
        icon = nativeImage.createFromPath(iconPath);
    } catch (e) {
        console.warn('Could not load icon:', e.message);
    }

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        icon: icon,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            preload: path.join(__dirname, 'preload.js')
        },
        backgroundColor: '#0a0a1a',
        title: `${APP_NAME} - AI-Powered Creator Platform`,
        show: false,
        frame: true
    });

    // Show when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    // Load the app
    mainWindow.loadURL(`http://localhost:${SERVER_PORT}`);

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Minimize to tray on close (Windows/Linux)
    mainWindow.on('close', (event) => {
        if (process.platform !== 'darwin' && tray && !isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
}

// ==================== SYSTEM TRAY ====================
function createTray() {
    const iconPath = app.isPackaged 
        ? path.join(process.resourcesPath, 'build', 'icon.ico')
        : path.join(__dirname, 'build', 'icon.ico');

    try {
        const icon = nativeImage.createFromPath(iconPath);
        tray = new Tray(icon.resize({ width: 16, height: 16 }));
    } catch (e) {
        console.warn('Could not create tray icon:', e.message);
        return;
    }

    const contextMenu = Menu.buildFromTemplate([
        {
            label: `Show ${APP_NAME}`,
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Dashboard',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.loadURL(`http://localhost:${SERVER_PORT}`);
                }
            }
        },
        {
            label: 'AI Chat',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.loadURL(`http://localhost:${SERVER_PORT}#ai-chat`);
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Open in Browser',
            click: () => {
                shell.openExternal(`http://localhost:${SERVER_PORT}`);
            }
        },
        { type: 'separator' },
        {
            label: `Version ${APP_VERSION}`,
            enabled: false
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip(APP_NAME);
    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });
}

// ==================== APPLICATION MENU ====================
function createMenu() {
    const isMac = process.platform === 'darwin';

    const template = [
        ...(isMac ? [{
            label: app.getName(),
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        {
            label: 'File',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
                { type: 'separator' },
                { role: 'toggleDevTools' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' }
                ] : [
                    { role: 'close' }
                ])
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: `About ${APP_NAME}`,
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: `About ${APP_NAME}`,
                            message: `${APP_NAME} v${APP_VERSION}`,
                            detail: `AI-Powered Creator Platform for Music Royalties\n\nFeaturing:\n• 10 AI Assistants\n• NVIDIA NIM Integration\n• RAG Knowledge System\n• UE5 CoPilot (FORGE)\n• Multi-Provider AI Routing\n\n© 2024 DJSPEEDYGA`,
                            buttons: ['OK']
                        });
                    }
                },
                { type: 'separator' },
                {
                    label: 'Open in Browser',
                    click: () => {
                        shell.openExternal(`http://localhost:${SERVER_PORT}`);
                    }
                },
                {
                    label: 'View Documentation',
                    click: () => {
                        shell.openExternal('https://github.com/DJSPEEDYGA/nextjs-commerce');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// ==================== IPC HANDLERS ====================
ipcMain.handle('get-app-info', () => ({
    version: APP_VERSION,
    name: APP_NAME,
    platform: process.platform,
    electron: process.versions.electron,
    node: process.versions.node,
    serverRunning: serverManager.isRunning
}));

ipcMain.on('get-app-version', (event) => {
    event.reply('app-version', APP_VERSION);
});

ipcMain.on('minimize-window', () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});

ipcMain.on('close-window', () => {
    if (mainWindow) mainWindow.close();
});

ipcMain.on('restart-server', async () => {
    serverManager.stop();
    await serverManager.start();
});

// ==================== APP LIFECYCLE ====================
app.on('ready', async () => {
    console.log(`Starting ${APP_NAME} v${APP_VERSION}...`);
    
    try {
        // Start the internal server first
        await serverManager.start();
        
        // Create window and UI
        createWindow();
        createMenu();
        createTray();
        
        console.log(`${APP_NAME} is ready!`);
    } catch (error) {
        console.error('Failed to start application:', error);
        dialog.showErrorBox('Startup Error', `Failed to start server: ${error.message}`);
        app.quit();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    } else {
        mainWindow.show();
    }
});

app.on('before-quit', () => {
    isQuitting = true;
    serverManager.stop();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    dialog.showErrorBox('Error', `An unexpected error occurred: ${error.message}`);
});

module.exports = { createWindow, serverManager };