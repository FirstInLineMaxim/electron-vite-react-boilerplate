"use strict";
const electron = require("electron");
const path = require("node:path");
const createWindow = () => {
  const win = new electron.BrowserWindow({
    title: "Main window",
    width: 800,
    height: 600,
    show: false,
    // Initially hide the main window
    icon: path.join(__dirname, "trayIcon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile("dist/index.html");
  }
  const iconPath = path.join(__dirname, "trayIcon.png");
  const appIcon = new electron.Tray(iconPath);
  appIcon.on("click", () => {
    win.show();
  });
  win.once("ready-to-show", () => {
    win.show();
  });
  win.on("close", (event) => {
    event.preventDefault();
    win.hide();
  });
};
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
      electron.app.quit();
  });
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
