const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
const { fileURLToPath } = require('node:url')
const path = require('node:path')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const axios = require('axios')

// sqlite3の型定義
interface Database {
  run(sql: string, params: any[], callback: (this: { lastID: number; changes: number }, err: Error | null) => void): void
  get(sql: string, params: any[], callback: (err: Error | null, row: any) => void): void
  all(sql: string, callback: (err: Error | null, rows: any[]) => void): void
  exec(sql: string, callback: (err: Error | null) => void): void
  close(): void
}

interface DatabaseConstructor {
  new (filename: string, callback?: (err: Error | null) => void): Database
}

const Database = sqlite3.Database as DatabaseConstructor

// アプリケーション名を設定（データ保存場所の決定に使用）
app.setName('rakufuri_app')

// データベースインスタンスの管理
const dbInstances = new Map<string, Database>()

// データベースパス取得
function getDbPath(tableName: string): string {
  const userDataPath = app.getPath('userData')
  const dbDir = path.join(userDataPath, 'databases')
  
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
  
  // 既に.db拡張子が付いている場合はそのまま、そうでなければ.dbを追加
  const fileName = tableName.endsWith('.db') ? tableName : `${tableName}.db`
  return path.join(dbDir, fileName)
}

// データベースインスタンス取得または作成
function getDatabase(tableName: string): Promise<Database> {
  return new Promise((resolve, reject) => {
    if (dbInstances.has(tableName)) {
      const existingDb = dbInstances.get(tableName)
      if (existingDb) {
        resolve(existingDb)
        return
      }
    }

    const dbPath = getDbPath(tableName)
    const db = new Database(dbPath, (err) => {
      if (err) {
        console.error(`❌ Database ${tableName} initialization error:`, err)
        reject(err)
        return
      }
      console.log(`✅ Database ${tableName} initialized successfully`)
      
      // テーブル作成
      initializeTable(db, tableName)
      
      dbInstances.set(tableName, db)
      resolve(db)
    })
  })
}

// テーブル初期化
function initializeTable(db: Database, tableName: string) {
  const createTableSQL = getCreateTableSQL(tableName)
  if (createTableSQL) {
    db.exec(createTableSQL, (err) => {
      if (err) {
        console.error(`❌ Table ${tableName} creation error:`, err)
      } else {
        console.log(`✅ Table ${tableName} created successfully`)
        
        // constテーブルの場合、カラムの存在確認と追加
        if (tableName === 'const') {
          checkAndAddColumns(db, tableName)
        }
      }
    })
  }
}

// カラムの存在確認と追加
function checkAndAddColumns(db: Database, tableName: string) {
  if (tableName === 'const') {
    // nameカラムの存在確認
    db.get("PRAGMA table_info(const)", (err, row) => {
      if (err) {
        console.error('❌ Error checking table info:', err)
        return
      }
      
      // テーブル構造を確認
      db.all("PRAGMA table_info(const)", (err, columns) => {
        if (err) {
          console.error('❌ Error getting table columns:', err)
          return
        }
        
        const columnNames = columns.map((col: any) => col.name)
        console.log(`📋 Current columns in ${tableName}:`, columnNames)
        
        // nameカラムがない場合は追加
        if (!columnNames.includes('name')) {
          console.log('🔧 Adding name column to const table')
          db.exec("ALTER TABLE const ADD COLUMN name TEXT", (err) => {
            if (err) {
              console.error('❌ Error adding name column:', err)
            } else {
              console.log('✅ name column added successfully')
            }
          })
        }
        
        // valueカラムがない場合は追加
        if (!columnNames.includes('value')) {
          console.log('🔧 Adding value column to const table')
          db.exec("ALTER TABLE const ADD COLUMN value TEXT", (err) => {
            if (err) {
              console.error('❌ Error adding value column:', err)
            } else {
              console.log('✅ value column added successfully')
            }
          })
        }
        
        // created_atカラムがない場合は追加
        if (!columnNames.includes('created_at')) {
          console.log('🔧 Adding created_at column to const table')
          db.exec("ALTER TABLE const ADD COLUMN created_at TEXT", (err) => {
            if (err) {
              console.error('❌ Error adding created_at column:', err)
            } else {
              console.log('✅ created_at column added successfully')
            }
          })
        }
        
        // updated_atカラムがない場合は追加
        if (!columnNames.includes('updated_at')) {
          console.log('🔧 Adding updated_at column to const table')
          db.exec("ALTER TABLE const ADD COLUMN updated_at TEXT", (err) => {
            if (err) {
              console.error('❌ Error adding updated_at column:', err)
            } else {
              console.log('✅ updated_at column added successfully')
            }
          })
        }
      })
    })
  }
}

// テーブル作成SQLを取得
function getCreateTableSQL(tableName: string): string | null {
  switch (tableName) {
    case 'items':
      return `
        CREATE TABLE IF NOT EXISTS items (
          _id TEXT PRIMARY KEY,
          name TEXT,
          price INTEGER,
          description TEXT,
          image1 TEXT,
          image2 TEXT,
          image3 TEXT,
          image4 TEXT,
          image5 TEXT,
          image6 TEXT,
          image7 TEXT,
          image8 TEXT,
          image9 TEXT,
          image10 TEXT,
          rakumaCategory TEXT,
          paypayCategory TEXT,
          rakumaCondition TEXT,
          paypayCondition TEXT,
          rakuma_shipping_payers TEXT,
          rakuma_shipping_methods TEXT,
          paypay_shipping_methods TEXT,
          rakuma_shipping_durations TEXT,
          rakuma_shipping_from_areas TEXT,
          rakuma_request_required TEXT,
          created_at TEXT,
          updated_at TEXT
        )
      `
    case 'accounts':
      return `
        CREATE TABLE IF NOT EXISTS accounts (
          _id TEXT PRIMARY KEY,
          name TEXT,
          email TEXT,
          token TEXT,
          refresh_token TEXT,
          created_at TEXT,
          expires_token TEXT,
          expires_refresh_token TEXT,
          site TEXT
        )
      `
    case 'exhibitions':
      return `
        CREATE TABLE IF NOT EXISTS exhibitions (
          _id TEXT PRIMARY KEY,
          item_id TEXT,
          account_id TEXT,
          site TEXT,
          status TEXT,
          created_at TEXT,
          updated_at TEXT
        )
      `
    case 'const':
      return `
        CREATE TABLE IF NOT EXISTS const (
          _id TEXT PRIMARY KEY,
          name TEXT,
            value TEXT,
          created_at TEXT,
          updated_at TEXT
        )
      `
    default:
      return null
  }
}

// データベース操作関数
async function dbFindOne(tableName: string, query: any): Promise<any> {
  try {
    const db = await getDatabase(tableName)
    return new Promise((resolve, reject) => {
      const keys = Object.keys(query)
      const values = Object.values(query)
      const whereClause = keys.map(key => `${key} = ?`).join(' AND ')
      const sql = `SELECT * FROM ${tableName} WHERE ${whereClause} LIMIT 1`
      
      db.get(sql, values, (err, row) => {
        if (err) {
          console.error(`❌ Database ${tableName} findOne error:`, err)
          reject(err)
          return
        }
        resolve(row || null)
      })
    })
  } catch (error) {
    console.error(`❌ Database ${tableName} findOne error:`, error)
    throw error
  }
}

async function dbFind(tableName: string, query: any = {}): Promise<any[]> {
  try {
    const db = await getDatabase(tableName)
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM ${tableName}`
      let values: any[] = []
      
      if (Object.keys(query).length > 0) {
        const keys = Object.keys(query)
        const whereClause = keys.map(key => `${key} = ?`).join(' AND ')
        sql += ` WHERE ${whereClause}`
        values = Object.values(query)
      }
      
      db.all(sql, values, (err, rows) => {
          if (err) {
          console.error(`❌ Database ${tableName} find error:`, err)
            reject(err)
            return
          }
        resolve(rows || [])
      })
    })
  } catch (error) {
    console.error(`❌ Database ${tableName} find error:`, error)
    throw error
  }
}

async function dbInsert(tableName: string, doc: any): Promise<any> {
  try {
    const db = await getDatabase(tableName)
    return new Promise((resolve, reject) => {
      const keys = Object.keys(doc)
      const values = Object.values(doc)
      const placeholders = keys.map(() => '?').join(', ')
      const sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`
      
      db.run(sql, values, function(err) {
        if (err) {
          console.error(`❌ Database ${tableName} insert error:`, err)
          reject(err)
          return
        }
        resolve({ id: this.lastID, changes: this.changes })
        })
      })
  } catch (error) {
    console.error(`❌ Database ${tableName} insert error:`, error)
    throw error
  }
}

async function dbUpdate(tableName: string, query: any, updateDoc: any, options: any = {}): Promise<any> {
  try {
    const db = await getDatabase(tableName)
    return new Promise((resolve, reject) => {
      const queryKeys = Object.keys(query)
      const updateKeys = Object.keys(updateDoc)
      const whereClause = queryKeys.map(key => `${key} = ?`).join(' AND ')
      const setClause = updateKeys.map(key => `${key} = ?`).join(', ')
      const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`
      const values = [...Object.values(updateDoc), ...Object.values(query)]
      
      db.run(sql, values, function(err) {
        if (err) {
          console.error(`❌ Database ${tableName} update error:`, err)
          reject(err)
          return
        }
        resolve({ changes: this.changes })
      })
    })
  } catch (error) {
    console.error(`❌ Database ${tableName} update error:`, error)
    throw error
    }
  }

async function dbRemove(tableName: string, query: any): Promise<any> {
  try {
    const db = await getDatabase(tableName)
    return new Promise((resolve, reject) => {
      const keys = Object.keys(query)
      const values = Object.values(query)
      const whereClause = keys.map(key => `${key} = ?`).join(' AND ')
      const sql = `DELETE FROM ${tableName} WHERE ${whereClause}`
      
      db.run(sql, values, function(err) {
        if (err) {
          console.error(`❌ Database ${tableName} remove error:`, err)
          reject(err)
          return
        }
        resolve({ changes: this.changes })
      })
    })
  } catch (error) {
    console.error(`❌ Database ${tableName} remove error:`, error)
    throw error
  }
}

async function dbUpsert(tableName: string, doc: any): Promise<any> {
  try {
    // まず既存のレコードを検索
    const existing = await dbFindOne(tableName, { _id: doc._id })
    
    if (existing) {
      // 既存のレコードを更新
      return await dbUpdate(tableName, { _id: doc._id }, doc)
    } else {
      // 新しいレコードを挿入
      return await dbInsert(tableName, doc)
    }
  } catch (error) {
    console.error(`❌ Database ${tableName} upsert error:`, error)
    throw error
  }
}

// Viteの開発サーバーURL
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const APP_ROOT = process.env.APP_ROOT || __dirname
const RENDERER_DIST = path.join(APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(APP_ROOT, 'public') : RENDERER_DIST

let win: any

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,     // セキュリティのためfalseに変更
      contextIsolation: true,     // セキュリティのためtrueに変更
      webSecurity: true,          // セキュリティのためtrueに変更
    },
  })

  // メニューを削除
  win.removeMenu()

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    // 開発モードではDevToolsを自動で開く
    win.webContents.openDevTools()
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Exit cleanly on request from parent process in development mode.
if (VITE_DEV_SERVER_URL) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// IPCハンドラーを設定
ipcMain.handle('get-user-data-path', async () => {
  try {
  return app.getPath('userData')
  } catch (error) {
    console.error('Error getting user data path:', error)
    return null
  }
})

ipcMain.handle('get-app-version', async () => {
  try {
  return app.getVersion()
  } catch (error) {
    console.error('Error getting app version:', error)
    return '1.0.0'
  }
})

ipcMain.handle('get-app-name', async () => {
  try {
  return app.getName()
  } catch (error) {
    console.error('Error getting app name:', error)
    return 'rakufuri_app'
  }
})

ipcMain.handle('get-computer-name', async () => {
  try {
    const os = require('os')
    return os.hostname()
  } catch (error) {
    console.error('Error getting computer name:', error)
    return 'unknown'
  }
})

// データベース操作のIPCハンドラー
ipcMain.handle('db-find-one', async (_event: any, tableName: string, query: any) => {
  try {
    return await dbFindOne(tableName, query)
  } catch (error) {
    console.error(`❌ IPC db-find-one error for ${tableName}:`, error)
    throw error
  }
})

ipcMain.handle('db-find', async (_event: any, tableName: string, query: any = {}) => {
  try {
    return await dbFind(tableName, query)
  } catch (error) {
    console.error(`❌ IPC db-find error for ${tableName}:`, error)
    throw error
  }
})

ipcMain.handle('db-insert', async (_event: any, tableName: string, doc: any) => {
  try {
    return await dbInsert(tableName, doc)
  } catch (error) {
    console.error(`❌ IPC db-insert error for ${tableName}:`, error)
    throw error
  }
})

ipcMain.handle('db-update', async (_event: any, tableName: string, query: any, updateDoc: any, options: any = {}) => {
  try {
    return await dbUpdate(tableName, query, updateDoc, options)
  } catch (error) {
    console.error(`❌ IPC db-update error for ${tableName}:`, error)
    throw error
  }
})

ipcMain.handle('db-remove', async (_event: any, tableName: string, query: any) => {
  try {
    return await dbRemove(tableName, query)
  } catch (error) {
    console.error(`❌ IPC db-remove error for ${tableName}:`, error)
    throw error
  }
})

ipcMain.handle('db-upsert', async (_event: any, tableName: string, doc: any) => {
  try {
    return await dbUpsert(tableName, doc)
  } catch (error) {
    console.error(`❌ IPC db-upsert error for ${tableName}:`, error)
    throw error
  }
})

ipcMain.handle('db-close', async (_event: any, tableName: string) => {
  try {
      const db = dbInstances.get(tableName)
      if (db) {
        db.close()
        dbInstances.delete(tableName)
      console.log(`✅ Database ${tableName} closed`)
    }
  } catch (error) {
    console.error(`❌ IPC db-close error for ${tableName}:`, error)
    throw error
  }
})

ipcMain.handle('db-close-all', async () => {
  try {
    for (const [tableName, db] of dbInstances) {
          db.close()
          console.log(`✅ Database ${tableName} closed`)
        }
    dbInstances.clear()
  } catch (error) {
    console.error('❌ IPC db-close-all error:', error)
    throw error
  }
})

// HTTPリクエスト用のIPCハンドラー
ipcMain.handle('http-post', async (_event: any, url: string, data: any, headers: any = {}) => {
  try {
    const response = await axios.post(url, data, { headers, validateStatus: () => true })
    return {
      success: response.status >= 200 && response.status < 400,
      status: response.status,
      data: response.data,
      headers: response.headers
    }
  } catch (error: any) {
    console.error('HTTP POST error:', error)
    return {
      success: false,
      status: error.response?.status || 500,
      data: error.response?.data || null,
      headers: error.response?.headers || {}
    }
  }
})

ipcMain.handle('http-get', async (_event: any, url: string, headers: any = {}) => {
  try {
    const response = await axios.get(url, { headers, validateStatus: () => true })
    return {
      success: response.status >= 200 && response.status < 400,
      status: response.status,
      data: response.data,
      headers: response.headers
    }
  } catch (error: any) {
    console.error('HTTP GET error:', error)
    return {
      success: false,
      status: error.response?.status || 500,
      data: error.response?.data || null,
      headers: error.response?.headers || {}
    }
  }
})

ipcMain.handle('http-put', async (_event: any, url: string, data: any, headers: any = {}) => {
  try {
    const response = await axios.put(url, data, { headers })
    return {
      success: true,
      status: response.status,
      data: response.data
    }
  } catch (error: any) {
    console.error('HTTP PUT error:', error)
    return {
      success: false,
      status: error.response?.status || 500,
      data: null
    }
  }
})

ipcMain.handle('http-delete', async (_event: any, url: string, headers: any = {}) => {
  try {
    const response = await axios.delete(url, { headers })
    return {
      success: true,
      status: response.status,
      data: response.data
    }
  } catch (error: any) {
    console.error('HTTP DELETE error:', error)
    return {
      success: false,
      status: error.response?.status || 500,
      data: null
    }
  }
})

ipcMain.handle('http-post-formdata', async (_event: any, url: string, formData: any, headers: any = {}) => {
  try {
    const FormData = require('form-data')
    const form = new FormData()
    
    // formDataオブジェクトの各プロパティをフォームに追加
    for (const [key, value] of Object.entries(formData)) {
      form.append(key, value)
    }
    
    const response = await axios.post(url, form, {
      headers: {
        ...headers,
        ...form.getHeaders()
      }
    })
    return {
      success: true,
      status: response.status,
      data: response.data
      }
  } catch (error: any) {
    console.error('HTTP POST FormData error:', error)
    return {
      success: false,
      status: error.response?.status || 500,
      data: null
    }
  }
})

// アプリケーション終了時のクリーンアップ
app.on('before-quit', () => {
  console.log('🔄 Closing all database connections...')
  for (const [tableName, db] of dbInstances) {
    try {
        db.close()
        console.log(`✅ Database ${tableName} closed`)
    } catch (error) {
      console.error(`❌ Error closing database ${tableName}:`, error)
    }
  }
  dbInstances.clear()
  
  // macOS以外ではアプリを終了
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ファイルシステム操作のIPCハンドラー
ipcMain.handle('clear-log-files', async (_event: any, logPath: string) => {
  try {
    const fs = require('fs')
    if (fs.existsSync(logPath)) {
      const files = fs.readdirSync(logPath)
      for (const file of files) {
        fs.unlinkSync(logPath + '/' + file)
      }
    }
    return { success: true }
  } catch (error) {
    console.error('Error clearing log files:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('take-screenshot', async (_event: any, page: any, screenshotPath: string) => {
  try {
    // Puppeteerのスクリーンショット機能は別途実装が必要
    // 現在はプレースホルダー
    console.log('Screenshot requested:', screenshotPath)
    return { success: true }
  } catch (error) {
    console.error('Error taking screenshot:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('file-exists', async (_event: any, path: string) => {
  try {
    const fs = require('fs')
    return fs.existsSync(path)
  } catch (error) {
    console.error('Error checking file existence:', error)
    return false
  }
})

// 画像アップロードのIPCハンドラー
ipcMain.handle('upload-image', async (_event: any, url: string, formData: any, headers: any) => {
  try {
    const axios = require('axios')
    const FormData = require('form-data')
    const fs = require('fs')
    
    const form = new FormData()
    form.append('need_thumbnail', formData.need_thumbnail || '1')
    
    if (formData.file && formData.file.path) {
      const fileStream = fs.createReadStream(formData.file.path)
      form.append('files[0]', fileStream, {
        filename: formData.file.filename || 'files[0]',
        contentType: formData.file.contentType || 'image/jpg'
      })
    }
    
    const response = await axios.post(url, form, {
      headers: {
        ...headers,
        ...form.getHeaders()
      }
    })
    
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { success: false, error: error.message }
  }
})

// 暗号化・ハッシュ機能のIPCハンドラー
ipcMain.handle('generate-code-verifier', async () => {
  try {
    const crypto = require('crypto')
    const base64url = require('base64url')
    
    const buf = Buffer.alloc(32)
    for (let i = 0; i < buf.length; i++) {
      const random_num = Math.floor(Math.random() * 256)
      buf.writeUInt8(random_num, i)
    }
    return base64url(buf)
  } catch (error) {
    console.error('Error generating code verifier:', error)
    return null
  }
})

ipcMain.handle('generate-code-challenge', async (_event: any, str: string) => {
  try {
    const sha256 = require('js-sha256')
    const base64url = require('base64url')
    
    const hash = sha256.arrayBuffer(str)
    return base64url(hash)
  } catch (error) {
    console.error('Error generating code challenge:', error)
    return null
  }
})

ipcMain.handle('generate-random-string', async (_event: any, count: number) => {
  try {
    const crypto = require('crypto')
    const S = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const randomString = Array.from(crypto.randomFillSync(new Uint8Array(count)))
      .map((n) => S[n % S.length]).join('')
    return randomString
  } catch (error) {
    console.error('Error generating random string:', error)
    return null
  }
})

// HTMLパーサー機能のIPCハンドラー
ipcMain.handle('extract-html-params', async (_event: any, html: string) => {
  try {
    const params = {}
    let sidx = 0
    let eidx = 0
    
    sidx = html.indexOf('<form ', sidx)
    eidx = html.indexOf('</form>', sidx)
    if (sidx === -1 || eidx === -1) return params
    
    const formTag = html.substring(sidx, eidx)
    sidx = 0
    eidx = 0
    
    while (formTag.indexOf('<input ', sidx) >= 0) {
      sidx = formTag.indexOf('<input ', sidx)
      eidx = formTag.indexOf('>', sidx) + '>'.length
      const hiddenTag = formTag.substring(sidx, eidx)
      sidx = eidx
      
      // データ取得
      let hsidx = 0
      let heidx = 0
      
      hsidx = hiddenTag.indexOf('name="') + 'name="'.length
      if (hsidx === -1) continue
      heidx = hiddenTag.indexOf('"', hsidx)
      const name = hiddenTag.substring(hsidx, heidx)
      
      hsidx = hiddenTag.indexOf('value="') + 'value="'.length
      if (hsidx === -1) continue
      heidx = hiddenTag.indexOf('"', hsidx)
      const value = hiddenTag.substring(hsidx, heidx)
      
      // 追加
      params[name] = value
    }
    
    return params
  } catch (error) {
    console.error('Error extracting HTML params:', error)
    return {}
  }
})

ipcMain.handle('extract-code-from-url', async (_event: any, url: string) => {
  try {
    const sidx = url.indexOf('&code=')
    if (sidx === -1) return ''
    return url.substring(sidx + '&code='.length)
  } catch (error) {
    console.error('Error extracting code from URL:', error)
    return ''
  }
})

// Puppeteer操作のIPCハンドラー
ipcMain.handle('launch-puppeteer', async (_event: any, options: any) => {
  try {
    const puppeteer = require('puppeteer')
    
    // Electron環境でのパス調整
    let executablePath = puppeteer.executablePath()
    if (executablePath.includes('app.asar')) {
      executablePath = executablePath.replace('app.asar', 'app.asar.unpacked')
    }
    
    const browser = await puppeteer.launch({
      ...options,
      executablePath
    })
    
    // ブラウザインスタンスを保存（実際の実装では適切な管理が必要）
    return { success: true, browserId: 'browser_' + Date.now() }
  } catch (error) {
    console.error('Error launching puppeteer:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('create-page', async (_event: any, browserId: string) => {
  try {
    // 実際の実装ではブラウザインスタンスを管理する必要がある
    // 現在はプレースホルダー
    return { success: true, pageId: 'page_' + Date.now() }
  } catch (error) {
    console.error('Error creating page:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('set-user-agent', async (_event: any, pageId: string, userAgent: string) => {
  try {
    // 実際の実装ではページインスタンスを管理する必要がある
    console.log('Setting user agent:', userAgent)
    return { success: true }
  } catch (error) {
    console.error('Error setting user agent:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('navigate-to', async (_event: any, pageId: string, url: string) => {
  try {
    // 実際の実装ではページインスタンスを管理する必要がある
    console.log('Navigating to:', url)
    return { success: true }
  } catch (error) {
    console.error('Error navigating to URL:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('wait-for', async (_event: any, pageId: string, timeout: number) => {
  try {
    // 実際の実装ではページインスタンスを管理する必要がある
    await new Promise(resolve => setTimeout(resolve, timeout))
    return { success: true }
  } catch (error) {
    console.error('Error waiting:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('wait-for-selector', async (_event: any, pageId: string, selector: string) => {
  try {
    // 実際の実装ではページインスタンスを管理する必要がある
    console.log('Waiting for selector:', selector)
    return { success: true }
  } catch (error) {
    console.error('Error waiting for selector:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('evaluate', async (_event: any, pageId: string, fn: Function) => {
  try {
    // 実際の実装ではページインスタンスを管理する必要がある
    console.log('Evaluating function on page')
    return { success: true }
  } catch (error) {
    console.error('Error evaluating function:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('type-text', async (_event: any, pageId: string, text: string) => {
  try {
    // 実際の実装ではページインスタンスを管理する必要がある
    console.log('Typing text:', text)
    return { success: true }
  } catch (error) {
    console.error('Error typing text:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('query-selector', async (_event: any, pageId: string, selector: string) => {
  try {
    // 実際の実装ではページインスタンスを管理する必要がある
    console.log('Querying selector:', selector)
    return { success: true, elementId: 'element_' + Date.now() }
  } catch (error) {
    console.error('Error querying selector:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('query-selector-all', async (_event: any, pageId: string, selector: string) => {
  try {
    // 実際の実装ではページインスタンスを管理する必要がある
    console.log('Querying all selectors:', selector)
    return { success: true, elements: [] }
  } catch (error) {
    console.error('Error querying all selectors:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('click-element', async (_event: any, elementId: string) => {
  try {
    // 実際の実装では要素インスタンスを管理する必要がある
    console.log('Clicking element:', elementId)
    return { success: true }
  } catch (error) {
    console.error('Error clicking element:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('evaluate-selector', async (_event: any, pageId: string, selector: string, fn: Function) => {
  try {
    // 実際の実装ではページインスタンスを管理する必要がある
    console.log('Evaluating selector:', selector)
    return { success: true, result: false }
  } catch (error) {
    console.error('Error evaluating selector:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('evaluate-element', async (_event: any, elementId: string, fn: Function) => {
  try {
    // 実際の実装では要素インスタンスを管理する必要がある
    console.log('Evaluating element:', elementId)
    return { success: true, result: '' }
  } catch (error) {
    console.error('Error evaluating element:', error)
    return { success: false, error: error.message }
  }
})