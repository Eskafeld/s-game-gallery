
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveHTMLFile: (htmlContent, filename) => ipcRenderer.invoke('save-html-file', htmlContent, filename)
});
