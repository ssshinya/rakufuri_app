/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  electronAPI: {
    getUserDataPath: () => Promise<string>
    getAppVersion: () => Promise<string>
    getAppName: () => Promise<string>
    dbFindOne: (tableName: string, query: any) => Promise<any>
    dbFind: (tableName: string, query?: any) => Promise<any[]>
    dbInsert: (tableName: string, doc: any) => Promise<any>
    dbUpdate: (tableName: string, query: any, updateDoc: any, options?: any) => Promise<{ modifiedCount: number }>
    dbRemove: (tableName: string, query: any) => Promise<{ deletedCount: number }>
    dbClose: (tableName: string) => Promise<boolean>
    dbCloseAll: () => Promise<boolean>
    httpPost: (url: string, data: any, headers?: any) => Promise<{ success: boolean; status: number; data: any; headers?: any; error?: string }>
    httpGet: (url: string, headers?: any) => Promise<{ success: boolean; status: number; data: any; headers?: any; error?: string }>
  }
}
