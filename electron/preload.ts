import { ipcRenderer, contextBridge } from 'electron';

// 'ipcRenderer' will be available in index.js with the method 'window.electron'
contextBridge.exposeInMainWorld('electron', {
  send: (command: string, payload: any) => {
    ipcRenderer.send(command, payload);
  },
  on: (command: string, func: (...args: any) => any) =>
    ipcRenderer.on(command, (event, args) => {
      func(event, args);
    }),
  invoke: async (command: string, payload: any) =>
    await ipcRenderer.invoke(command, payload),
});
