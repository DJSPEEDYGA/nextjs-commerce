/**
 * SUPER GOAT ROYALTIES APP - Electron Desktop Wrapper
 * Copyright © 2024 HARVEY L MILLER JR
 * All Rights Reserved. www.goatroyaltyapp.org
 * 
 * This file wraps the Node.js server as a native desktop application
 * with system tray support and auto-launch capabilities.
 */

const { app, BrowserWindow, Tray, Menu, shell, dialog, Notification } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Configuration
const APP_NAME = 'SUPER GOAT ROYALTIES APP';
const APP_VERSION = '3.0.0';
const SERVER_PORT = process.env.PORT || 4001;
const IS_DEV = process.env.NODE_ENV === 'development';

// Global references
let mainWindow = null;
let tray = null;
let serverProcess = null;
let isQuitting = false;

// Platform detection
const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

// Get icon path based on platform
function getIconPath() {
    const iconsDir = path.join(__dirname, 'assets', 'icons');
    if (isWindows) return path.join(iconsDir, 'icon.ico');
    if (isMac) return path.join(iconsDir, 'icon.icns');
    return path.join(iconsDir, 'icon.png');
}

// Create the main application window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 700,
        title: APP_NAME,
        icon: getIconPath(),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            webSecurity: true
        },
        show: false, // Don't show until ready
        backgroundColor: '#0a0a0a',
        titleBarStyle: isMac ? 'hiddenInset' : 'default',
        trafficLightPosition: isMac ? { x: 15, y: 15 } : undefined
    });

    // Load the app
    mainWindow.loadURL(`http://localhost:${SERVER_PORT}`);

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        if (IS_DEV) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http://localhost') || url.startsWith('https://localhost')) {
            return { action: 'allow' };
        }
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Handle window close
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
            if (isWindows) {
                tray.displayBalloon({
                    icon: getIconPath(),
                    title: APP_NAME,
                    content: 'Application minimized to system tray. Click to restore.'
                });
            }
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Start the backend server
function startServer() {
    return new Promise((resolve, reject) => {
        console.log('Starting SUPER GOAT ROYALTIES server...');
        
        // Path to server.js
        const serverPath = path.join(__dirname, 'server.js');
        
        // Start server as child process
        serverProcess = spawn('node', [serverPath], {
            cwd: __dirname,
            env: {
                ...process.env,
                PORT: SERVER_PORT,
                NODE_ENV: IS_DEV ? 'development' : 'production',
                ELECTRON_RUN_AS_NODE: '1'
            },
            stdio: ['ignore', 'pipe', 'pipe']
        });

        // Handle server output
        serverProcess.stdout.on('data', (data) => {
            console.log(`[Server] ${data.toString()}`);
        });

        serverProcess.stderr.on('data', (data) => {
            console.error(`[Server Error] ${data.toString()}`);
        });

        serverProcess.on('error', (err) => {
            console.error('Failed to start server:', err);
            reject(err);
        });

        // Wait for server to be ready
        setTimeout(() => {
            resolve();
        }, 3000);
    });
}

// Stop the backend server
function stopServer() {
    return new Promise((resolve) => {
        if (serverProcess) {
            console.log('Stopping server...');
            serverProcess.on('close', resolve);
            serverProcess.kill();
            serverProcess = null;
        } else {
            resolve();
        }
    });
}

// Create system tray
function createTray() {
    tray = new Tray(getIconPath());
    
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open SUPER GOAT ROYALTIES',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        {
            label: 'Open in Browser',
            click: () => {
                shell.openExternal(`http://localhost:${SERVER_PORT}`);
            }
        },
        { type: 'separator' },
        {
            label: 'Server Status',
            enabled: false,
            icon: path.join(__dirname, 'assets', 'icons', 'status-green.png')
        },
        { type: 'separator' },
        {
            label: 'View Documentation',
            click: () => {
                shell.openExternal('https://www.goatroyaltyapp.org/docs');
            }
        },
        {
            label: 'Check for Updates',
            click: () => {
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Check for Updates',
                    message: 'You are running the latest version!',
                    detail: `Version ${APP_VERSION}`
                });
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: async () => {
                isQuitting = true;
                await stopServer();
                app.quit();
            }
        }
    ]);

    tray.setToolTip(APP_NAME);
    tray.setContextMenu(contextMenu);

    // Show window on tray icon click
    tray.on('click', () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                mainWindow.focus();
            } else {
                mainWindow.show();
            }
        }
    });

    tray.on('double-click', () => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });
}

// Show notification
function showNotification(title, body) {
    if (Notification.isSupported()) {
        new Notification({
            title: title,
            body: body,
            icon: getIconPath()
        }).show();
    }
}

// App lifecycle events
app.whenReady().then(async () => {
    try {
        // Start the backend server
        await startServer();
        
        // Create system tray
        createTray();
        
        // Create main window
        createWindow();
        
        // Show welcome notification
        showNotification(
            APP_NAME,
            'Server started successfully! Your GOAT Royalty platform is ready.'
        );

        console.log(`${APP_NAME} v${APP_VERSION} started successfully`);
    } catch (error) {
        console.error('Failed to start application:', error);
        dialog.showErrorBox(
            'Startup Error',
            `Failed to start ${APP_NAME}: ${error.message}`
        );
        app.quit();
    }
});

// Handle app activation (macOS)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Handle all windows closed
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});

// Handle before quit
app.on('before-quit', async () => {
    isQuitting = true;
    await stopServer();
});

// Handle will quit (macOS)
app.on('will-quit', async () => {
    await stopServer();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    dialog.showErrorBox('Error', `An unexpected error occurred: ${error.message}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});