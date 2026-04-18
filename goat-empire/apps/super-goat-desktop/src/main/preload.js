// Super GOAT — Preload (secure bridge between main & renderer)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('goat', {
  save: (key, value) => ipcRenderer.invoke('data:save', { key, value }),
  load: (key) => ipcRenderer.invoke('data:load', { key }),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
  appInfo: () => ipcRenderer.invoke('app:info'),
  onNav: (cb) => ipcRenderer.on('nav', (_e, view) => cb(view))
});