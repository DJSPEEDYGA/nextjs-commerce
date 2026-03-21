/**
 * GOAT Datasets App - Electron Main Process
 * NO API KEYS | NO LOGINS | DOWNLOAD & GO
 * Desktop wrapper for standalone operation
 * 
 * DJ Speedy / Harvey Lee Miller Jr.
 */

const { app, BrowserWindow, Tray, Menu, shell, nativeImage } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow = null;
let tray = null;
let serverProcess = null;
const PORT = 4002;

// ─── START EXPRESS SERVER ─────────────────────────
function startServer() {
  return new Promise((resolve) => {
    serverProcess = fork(path.join(__dirname, 'server.js'), [], {
      env: { ...process.env, PORT: String(PORT) },
      silent: true
    });
    
    serverProcess.stdout.on('data', (data) => {
      const msg = data.toString();
      console.log('[Server]', msg);
      if (msg.includes('GOAT DATASETS APP')) resolve();
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error('[Server Error]', data.toString());
    });
    
    // Fallback resolve after 3s
    setTimeout(resolve, 3000);
  });
}

// ─── CREATE WINDOW ────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: '🐐 GOAT Datasets - DJ Speedy Edition',
    backgroundColor: '#0a0a0f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    autoHideMenuBar: true,
    show: false
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

// ─── SYSTEM TRAY ──────────────────────────────────
function createTray() {
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: '🐐 GOAT Datasets', enabled: false },
    { type: 'separator' },
    { label: 'Open App', click: () => { if (mainWindow) mainWindow.show(); else createWindow(); }},
    { label: 'Open in Browser', click: () => shell.openExternal(`http://localhost:${PORT}`) },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.isQuitting = true; app.quit(); }}
  ]);
  
  tray.setToolTip('GOAT Datasets App');
  tray.setContextMenu(contextMenu);
}

// ─── APP LIFECYCLE ────────────────────────────────
app.whenReady().then(async () => {
  await startServer();
  createWindow();
  createTray();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Keep running in tray on Windows/Linux
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
});

// Single instance lock
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