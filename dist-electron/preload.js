"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  listner: electron.ipcRenderer.on.bind(electron.ipcRenderer),
  ipcRenderer: electron.ipcRenderer
});
