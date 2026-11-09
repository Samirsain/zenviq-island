// Zenviq Island — the only bridge between the island page and the Electron shell.
// The page can ask to start / end a drag and to open the island menu. Nothing else.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('islandHost', {
  dragStart: () => ipcRenderer.send('island:drag-start'),
  dragEnd: () => ipcRenderer.send('island:drag-end'),
  menu: () => ipcRenderer.send('island:menu'),
});
