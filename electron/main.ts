import {
  app,
  BrowserWindow,
  desktopCapturer,
  dialog,
  ipcMain,
  Menu,
  Tray,
} from "electron";
import { writeFile } from "fs-extra";
import path from "node:path";
let win;

const createWindow = () => {
  win = new BrowserWindow({
    title: "Main window",
    width: 800,
    height: 600,
    show: false, // Initially hide the main window
    icon: path.join(__dirname, "trayIcon.png"),
    webPreferences: {
      nodeIntegration: true,
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

  
  ipcMain.handle("openMenu", async (event) => {
    console.log(event);
    const inputSources = await desktopCapturer.getSources({
      types: ["window", "screen"],
    });
    const videoOptionsMenu = Menu.buildFromTemplate(
      inputSources.map((source) => {
        return {
          label: source.name,
          click: () => selectSource(source),
        };
      })
    );
    videoOptionsMenu.popup();
  });

  ipcMain.handle("open-file-dialog", async (event, bufferData) => {
    console.log(event);
    const { filePath } = await dialog.showSaveDialog({
      buttonLabel: "Save video",
      defaultPath: `vid-${Date.now()}.webm`,
    });

    writeFile(filePath, bufferData, (error) => console.log(error));
  });
});

function selectSource(source: Electron.DesktopCapturerSource): any {
  console.log("run");
  win.webContents.send("source", source);
}
// ipcMain.handle("sources", async (event, path) => {
//   console.log(event, path);
// });
