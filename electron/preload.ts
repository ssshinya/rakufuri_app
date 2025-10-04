import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

// --------- Expose Electron APIs ---------
console.log('🔧 Preload script loaded')
console.log('🔧 process.contextIsolated =', process.contextIsolated)

// contextIsolation: true の場合、contextBridgeを使用
const electronAPI = {
  getUserDataPath: () => {
    console.log('🔧 getUserDataPath called')
    // レンダラープロセスではapp.getPathは使用できないため、IPCで取得
    return ipcRenderer.invoke('get-user-data-path')
  },
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppName: () => ipcRenderer.invoke('get-app-name'),
  getComputerName: () => ipcRenderer.invoke('get-computer-name'),
  
  // データベース操作API
  dbFindOne: (tableName: string, query: any) => ipcRenderer.invoke('db-find-one', tableName, query),
  dbFind: (tableName: string, query: any = {}) => ipcRenderer.invoke('db-find', tableName, query),
  dbInsert: (tableName: string, doc: any) => ipcRenderer.invoke('db-insert', tableName, doc),
  dbUpdate: (tableName: string, query: any, updateDoc: any, options: any = {}) => ipcRenderer.invoke('db-update', tableName, query, updateDoc, options),
  dbRemove: (tableName: string, query: any) => ipcRenderer.invoke('db-remove', tableName, query),
  dbClose: (tableName: string) => ipcRenderer.invoke('db-close', tableName),
  dbCloseAll: () => ipcRenderer.invoke('db-close-all'),
  dbUpsert: (tableName: string, doc: any) => ipcRenderer.invoke('db-upsert', tableName, doc),
  
  // HTTP API呼び出し
  httpPost: (url: string, data: any, headers: any = {}) => ipcRenderer.invoke('http-post', url, data, headers),
  httpGet: (url: string, headers: any = {}) => ipcRenderer.invoke('http-get', url, headers),
}

// contextBridgeを使用してAPIを安全に公開
contextBridge.exposeInMainWorld('electronAPI', electronAPI)
console.log('🔧 electronAPI exposed via contextBridge:', electronAPI)