import { IpcRenderer, contextBridge, ipcRenderer } from "electron";
type IpcRendererEventListener = (
  event: Electron.IpcRendererEvent,
  ...args: any[]
) => void;

// Declare the electron object in the global Window interface
declare global {
  interface Window {
    electron: {
      ipcRenderer: typeof ipcRenderer;
      listner: (
        channel: string,
        listener: IpcRendererEventListener
      ) => IpcRenderer;
    };
  }
}

contextBridge.exposeInMainWorld("electron", {
  listner: ipcRenderer.on.bind(ipcRenderer),
  ipcRenderer: ipcRenderer,
});
