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
  httpPut: (url: string, data: any, headers: any = {}) => ipcRenderer.invoke('http-put', url, data, headers),
  httpDelete: (url: string, headers: any = {}) => ipcRenderer.invoke('http-delete', url, headers),
  httpPostFormData: (url: string, formData: any, headers: any = {}) => ipcRenderer.invoke('http-post-formdata', url, formData, headers),
  
  // ファイルシステム操作
  clearLogFiles: (logPath: string) => ipcRenderer.invoke('clear-log-files', logPath),
  takeScreenshot: (page: any, screenshotPath: string) => ipcRenderer.invoke('take-screenshot', page, screenshotPath),
  fileExists: (path: string) => ipcRenderer.invoke('file-exists', path),
  
  // 画像アップロード
  uploadImage: (url: string, formData: any, headers: any = {}) => ipcRenderer.invoke('upload-image', url, formData, headers),
  
  // 暗号化・ハッシュ機能
  generateCodeVerifier: () => ipcRenderer.invoke('generate-code-verifier'),
  generateCodeChallenge: (str: string) => ipcRenderer.invoke('generate-code-challenge', str),
  generateRandomString: (count: number) => ipcRenderer.invoke('generate-random-string', count),
  
  // HTMLパーサー機能
  extractHtmlParams: (html: string) => ipcRenderer.invoke('extract-html-params', html),
  extractCodeFromUrl: (url: string) => ipcRenderer.invoke('extract-code-from-url', url),
  
  // Puppeteer操作
  launchPuppeteer: (options: any) => ipcRenderer.invoke('launch-puppeteer', options),
  createPage: (browserId: string) => ipcRenderer.invoke('create-page', browserId),
  setUserAgent: (pageId: string, userAgent: string) => ipcRenderer.invoke('set-user-agent', pageId, userAgent),
  navigateTo: (pageId: string, url: string) => ipcRenderer.invoke('navigate-to', pageId, url),
  waitFor: (pageId: string, timeout: number) => ipcRenderer.invoke('wait-for', pageId, timeout),
  waitForSelector: (pageId: string, selector: string) => ipcRenderer.invoke('wait-for-selector', pageId, selector),
  evaluate: (pageId: string, fn: Function) => ipcRenderer.invoke('evaluate', pageId, fn),
  typeText: (pageId: string, text: string) => ipcRenderer.invoke('type-text', pageId, text),
  querySelector: (pageId: string, selector: string) => ipcRenderer.invoke('query-selector', pageId, selector),
  querySelectorAll: (pageId: string, selector: string) => ipcRenderer.invoke('query-selector-all', pageId, selector),
  clickElement: (elementId: string) => ipcRenderer.invoke('click-element', elementId),
  evaluateSelector: (pageId: string, selector: string, fn: Function) => ipcRenderer.invoke('evaluate-selector', pageId, selector, fn),
  evaluateElement: (elementId: string, fn: Function) => ipcRenderer.invoke('evaluate-element', elementId, fn),
}

// contextBridgeを使用してAPIを安全に公開
contextBridge.exposeInMainWorld('electronAPI', electronAPI)
console.log('🔧 electronAPI exposed via contextBridge:', electronAPI)