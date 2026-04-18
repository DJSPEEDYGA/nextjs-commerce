// Super GOAT Royalty App — Main Process
// By DJ Speedy / GOAT Force
// "IF YOU CAN THINK IT! You CAN DO IT IN THE APP"

const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    title: 'Super GOAT Royalty App',
    backgroundColor: '#0a0a0f',
    icon: path.join(__dirname, '../../assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Standalone mode — no login menu
  const template = [
    {
      label: 'GOAT',
      submenu: [
        { label: 'About Super GOAT Royalty App', role: 'about' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        { label: 'Royalty Tracker', click: () => mainWindow.webContents.send('nav', 'royalty') },
        { label: 'Blockchain Ledger', click: () => mainWindow.webContents.send('nav', 'blockchain') },
        { label: 'Super LLM (215)', click: () => mainWindow.webContents.send('nav', 'llm') },
        { label: 'Crypto Mining', click: () => mainWindow.webContents.send('nav', 'mining') },
        { label: 'Video Editor', click: () => mainWindow.webContents.send('nav', 'video') },
        { label: 'DSP Distribution', click: () => mainWindow.webContents.send('nav', 'dsp') }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ---------- IPC Handlers ----------

// Save / load data locally (standalone — no server)
const dataDir = path.join(app.getPath('userData'), 'goat-data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

ipcMain.handle('data:save', async (_e, { key, value }) => {
  fs.writeFileSync(path.join(dataDir, `${key}.json`), JSON.stringify(value, null, 2));
  return { ok: true };
});

ipcMain.handle('data:load', async (_e, { key }) => {
  const p = path.join(dataDir, `${key}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
});

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Media', extensions: ['mp4', 'mov', 'mp3', 'wav', 'flac', 'aac'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result.filePaths;
});

ipcMain.handle('shell:openExternal', async (_e, url) => {
  await shell.openExternal(url);
  return { ok: true };
});

ipcMain.handle('app:info', async () => ({
  version: app.getVersion(),
  platform: process.platform,
  arch: process.arch,
  userData: app.getPath('userData')
}));