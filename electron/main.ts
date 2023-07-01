import { app, BrowserWindow, Tray } from "electron";
import path from "node:path";

const createWindow = () => {
  const win = new BrowserWindow({
    title: "Main window",
    width: 800,
    height: 600,
    show: false, // Initially hide the main window
    icon: path.join(__dirname, "trayIcon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Load your file
    win.loadFile("dist/index.html");
  }

  // Create a tray icon
  const iconPath = path.join(__dirname, "trayIcon.png");
  const appIcon = new Tray(iconPath);
  // Show the main window when the tray icon is clicked
  appIcon.on("click", () => {
    win.show();
  });
  // Show the main window when it's ready to be displayed
  win.once("ready-to-show", () => {
    win.show();
  });
  win.on("close", (event) => {
    event.preventDefault();
    win.hide();
  });
};
app.whenReady().then(() => {
  createWindow();
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
