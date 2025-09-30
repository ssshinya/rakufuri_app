const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
const { fileURLToPath } = require('node:url')
const path = require('node:path')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const axios = require('axios')

// アプリケーション名を設定（データ保存場所の決定に使用）
app.setName('rakufuri_app')

// データベースインスタンスの管理
const dbInstances = new Map()

// データベースパス取得
function getDbPath(tableName: string): string {
  const userDataPath = app.getPath('userData')
  const dbDir = path.join(userDataPath, 'databases')
  
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
  
  return path.join(dbDir, `${tableName}.db`)
}

// データベースインスタンス取得または作成
function getDatabase(tableName: string): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    if (dbInstances.has(tableName)) {
      resolve(dbInstances.get(tableName))
      return
    }

    const dbPath = getDbPath(tableName)
    console.log(`🔧 Creating SQLite database: ${dbPath}`)
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(`❌ Error opening database: ${err.message}`)
        reject(err)
        return
      }
      
      console.log(`🔧 Database created successfully: ${dbPath}`)
      
      // テーブル作成（NeDB風のドキュメント形式）
      db.exec(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          _id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE,
          value TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error(`❌ Error creating table: ${err.message}`)
          reject(err)
          return
        }
        
        // インデックス作成
        db.exec(`
          CREATE INDEX IF NOT EXISTS idx_${tableName}_key ON ${tableName}(key)
        `, (err) => {
          if (err) {
            console.error(`❌ Error creating index: ${err.message}`)
            reject(err)
            return
          }
          
          dbInstances.set(tableName, db)
          console.log(`✅ Database ${tableName} initialized successfully`)
          resolve(db)
        })
      })
    })
  })
}

// 行データをパース（NeDB形式に変換）
function parseRow(row: any) {
  try {
    const doc = JSON.parse(row.value)
    doc._id = row._id
    return doc
  } catch (e) {
    // パースできない場合は基本形式で返す
    return {
      _id: row._id,
      name: row.key,
      value: row.value
    }
  }
}

const currentDir = path.dirname(__filename)

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(currentDir, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

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
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPCハンドラーを設定
ipcMain.handle('get-user-data-path', () => {
  return app.getPath('userData')
})

ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-app-name', () => {
  return app.getName()
})

// データベース操作のIPCハンドラー
ipcMain.handle('db-find-one', async (_event: any, tableName: string, query: any) => {
  try {
    const db = await getDatabase(tableName)
    
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM ${tableName} WHERE 1=1`
      const params = []
      
      if (query._id) {
        sql += ' AND _id = ?'
        params.push(query._id)
      } else if (query.name) {
        sql += ' AND key = ?'
        params.push(query.name)
      } else {
        // その他のクエリ条件はJSON検索で実装
        db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
          if (err) {
            console.error('db-find-one error:', err)
            resolve(null)
            return
          }
          
          const found = rows.find((row: any) => {
            try {
              const doc = JSON.parse(row.value)
              return Object.keys(query).every(key => doc[key] === query[key])
            } catch {
              return false
            }
          })
          resolve(found ? parseRow(found) : null)
        })
        return
      }
      
      db.get(sql, params, (err, row) => {
        if (err) {
          console.error('db-find-one error:', err)
          resolve(null)
          return
        }
        resolve(row ? parseRow(row) : null)
      })
    })
  } catch (error) {
    console.error('db-find-one error:', error)
    return null
  }
})

ipcMain.handle('db-find', async (_event: any, tableName: string, query: any = {}) => {
  try {
    const db = await getDatabase(tableName)
    
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
        if (err) {
          console.error('db-find error:', err)
          resolve([])
          return
        }
        
        const results = rows
          .map((row: any) => parseRow(row))
          .filter((doc: any) => {
            if (!query || Object.keys(query).length === 0) return true
            return Object.keys(query).every(key => doc[key] === query[key])
          })
        
        resolve(results)
      })
    })
  } catch (error) {
    console.error('db-find error:', error)
    return []
  }
})

ipcMain.handle('db-insert', async (_event: any, tableName: string, doc: any) => {
  try {
    const db = await getDatabase(tableName)
    const key = doc.name || doc._id || Date.now().toString()
    const value = JSON.stringify(doc)
    
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO ${tableName} (key, value, created_at, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `
      
      db.run(sql, [key, value], function(err) {
        if (err) {
          console.error('db-insert error:', err)
          resolve(null)
          return
        }
        
        console.log(`🔧 Insert executed: lastInsertRowid=${this.lastID}, changes=${this.changes}`)
        resolve({ ...doc, _id: this.lastID })
      })
    })
  } catch (error) {
    console.error('db-insert error:', error)
    return null
  }
})

ipcMain.handle('db-update', async (_event: any, tableName: string, query: any, updateDoc: any, _options: any = {}) => {
  try {
    const db = await getDatabase(tableName)
    
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
        if (err) {
          console.error('db-update error:', err)
          resolve({ modifiedCount: 0 })
          return
        }
        
        let modifiedCount = 0
        let completed = 0
        
        if (rows.length === 0) {
          resolve({ modifiedCount: 0 })
          return
        }
        
        rows.forEach((row: any) => {
          const doc = parseRow(row)
          let shouldUpdate = false
          
          if (query._id && doc._id === query._id) {
            shouldUpdate = true
          } else if (query.name && doc.name === query.name) {
            shouldUpdate = true
          } else if (Object.keys(query).every(key => doc[key] === query[key])) {
            shouldUpdate = true
          }
          
          if (shouldUpdate) {
            if (updateDoc.$set) {
              Object.assign(doc, updateDoc.$set)
            } else {
              Object.assign(doc, updateDoc)
            }
            
            db.run(`
              UPDATE ${tableName} SET value = ?, updated_at = CURRENT_TIMESTAMP 
              WHERE _id = ?
            `, [JSON.stringify(doc), row._id], function(err) {
              if (err) {
                console.error('db-update error:', err)
              } else {
                modifiedCount += this.changes
              }
              
              completed++
              if (completed === rows.length) {
                resolve({ modifiedCount })
              }
            })
          } else {
            completed++
            if (completed === rows.length) {
              resolve({ modifiedCount })
            }
          }
        })
      })
    })
  } catch (error) {
    console.error('db-update error:', error)
    return { modifiedCount: 0 }
  }
})

ipcMain.handle('db-remove', async (_event: any, tableName: string, query: any) => {
  try {
    const db = await getDatabase(tableName)
    
    return new Promise((resolve, reject) => {
      if (query._id) {
        db.run(`DELETE FROM ${tableName} WHERE _id = ?`, [query._id], function(err) {
          if (err) {
            console.error('db-remove error:', err)
            resolve({ deletedCount: 0 })
            return
          }
          resolve({ deletedCount: this.changes })
        })
      } else if (query.name) {
        db.run(`DELETE FROM ${tableName} WHERE key = ?`, [query.name], function(err) {
          if (err) {
            console.error('db-remove error:', err)
            resolve({ deletedCount: 0 })
            return
          }
          resolve({ deletedCount: this.changes })
        })
      } else {
        // 複雑なクエリの場合は全件検索
        db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
          if (err) {
            console.error('db-remove error:', err)
            resolve({ deletedCount: 0 })
            return
          }
          
          const idsToDelete = rows
            .map((row: any) => parseRow(row))
            .filter((doc: any) => Object.keys(query).every(key => doc[key] === query[key]))
            .map((doc: any) => doc._id)
          
          if (idsToDelete.length === 0) {
            resolve({ deletedCount: 0 })
            return
          }
          
          // 複数の削除を順次実行
          let completed = 0
          let totalDeleted = 0
          
          idsToDelete.forEach((id: number) => {
            db.run(`DELETE FROM ${tableName} WHERE _id = ?`, [id], function(err) {
              if (err) {
                console.error('db-remove error:', err)
              } else {
                totalDeleted += this.changes
              }
              
              completed++
              if (completed === idsToDelete.length) {
                resolve({ deletedCount: totalDeleted })
              }
            })
          })
        })
      }
    })
  } catch (error) {
    console.error('db-remove error:', error)
    return { deletedCount: 0 }
  }
})

// データベースを閉じる
ipcMain.handle('db-close', async (_event: any, tableName: string) => {
  try {
    if (dbInstances.has(tableName)) {
      const db = dbInstances.get(tableName)
      db.close()
      dbInstances.delete(tableName)
      console.log(`✅ Database ${tableName} closed successfully`)
    }
    return true
  } catch (error) {
    console.error(`❌ Error closing database ${tableName}:`, error)
    return false
  }
})

// すべてのデータベースを閉じる
ipcMain.handle('db-close-all', async () => {
  try {
    console.log('🔄 Closing all databases...')
    dbInstances.forEach((db, tableName) => {
      try {
        db.close()
        console.log(`✅ Database ${tableName} closed`)
      } catch (error) {
        console.error(`❌ Error closing database ${tableName}:`, error)
      }
    })
    dbInstances.clear()
    console.log('✅ All databases closed')
    return true
  } catch (error) {
    console.error('❌ Error closing all databases:', error)
    return false
  }
})

// UPSERT操作のIPCハンドラー
ipcMain.handle('db-upsert', async (_event: any, tableName: string, doc: any) => {
  try {
    console.log(`🔧 UPSERT request: table=${tableName}, doc=`, doc)
    const db = await getDatabase(tableName)
    const key = doc.name || doc._id || Date.now().toString()
    const value = JSON.stringify(doc)
    
    console.log(`🔧 UPSERT params: key=${key}, value=${value}`)

    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO ${tableName} (key, value, created_at, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = CURRENT_TIMESTAMP
      `
      
      db.run(sql, [key, value], function(err) {
        if (err) {
          console.error('db-upsert error:', err)
          resolve(null)
          return
        }
        
        console.log(`🔧 Upsert executed: lastInsertRowid=${this.lastID}, changes=${this.changes}`)
        console.log(`🔧 Upsert result: key=${key}, value=${value}`)
        resolve({ ...doc, _id: this.lastID })
      })
    })
  } catch (error) {
    console.error('db-upsert error:', error)
    return null
  }
})

// HTTP API呼び出しのIPCハンドラー
ipcMain.handle('http-post', async (_event: any, url: string, data: any, headers: any = {}) => {
  try {
    console.log(`🌐 HTTP POST request to: ${url}`)
    const response = await axios.post(url, data, { headers })
    console.log(`✅ HTTP POST response: ${response.status}`)
    return {
      success: true,
      status: response.status,
      data: response.data,
      headers: response.headers
    }
  } catch (error: any) {
    console.error(`❌ HTTP POST error:`, error.message)
    return {
      success: false,
      status: error.response?.status || 0,
      data: error.response?.data || null,
      error: error.message
    }
  }
})

ipcMain.handle('http-get', async (_event: any, url: string, headers: any = {}) => {
  try {
    console.log(`🌐 HTTP GET request to: ${url}`)
    const response = await axios.get(url, { headers })
    console.log(`✅ HTTP GET response: ${response.status}`)
    return {
      success: true,
      status: response.status,
      data: response.data,
      headers: response.headers
    }
  } catch (error: any) {
    console.error(`❌ HTTP GET error:`, error.message)
    return {
      success: false,
      status: error.response?.status || 0,
      data: error.response?.data || null,
      error: error.message
    }
  }
})

app.whenReady().then(createWindow)

// アプリ終了時にデータベースを閉じる
app.on('before-quit', () => {
  console.log('🔄 App is quitting, closing databases...')
  // メインプロセスで直接データベースを閉じる
  dbInstances.forEach((db, tableName) => {
    try {
      db.close()
      console.log(`✅ Database ${tableName} closed`)
    } catch (error) {
      console.error(`❌ Error closing database ${tableName}:`, error)
    }
  })
  dbInstances.clear()
})

// ウィンドウが閉じられた時の処理
app.on('window-all-closed', () => {
  console.log('🔄 All windows closed, closing databases...')
  // メインプロセスで直接データベースを閉じる
  dbInstances.forEach((db, tableName) => {
    try {
      db.close()
      console.log(`✅ Database ${tableName} closed`)
    } catch (error) {
      console.error(`❌ Error closing database ${tableName}:`, error)
    }
  })
  dbInstances.clear()
  
  // macOS以外ではアプリを終了
  if (process.platform !== 'darwin') {
    app.quit()
  }
})