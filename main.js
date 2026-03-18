const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const express = require('express');
const http = require('http');

let mainWindow;
let server;
const PORT = 3942;

function startExpressServer() {
  const expressApp = express();
  const staticPath = path.join(__dirname, 'static');
  
  expressApp.use(express.static(staticPath));

  // Serve index.html for all unmatched routes (SPA fallback)
  expressApp.get('*', (req, res) => {
    const filePath = path.join(staticPath, req.path);
    const fs = require('fs');
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.sendFile(filePath);
    } else {
      res.sendFile(path.join(staticPath, 'index.html'));
    }
  });

  server = http.createServer(expressApp);
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`Local server running on http://127.0.0.1:${PORT}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'E-Commerce Store',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Wait a moment for the server to be ready then load
  setTimeout(() => {
    mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
  }, 500);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startExpressServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (server) server.close();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (server) server.close();
});