// Electron環境の検出関数（preloadスクリプト経由）
function isElectronEnvironment() {
  return !!(window.electronAPI && window.electronAPI.getUserDataPath)
}

// NeDB風のAPIを提供するSQLiteラッパークラス（IPC経由）
export class SQLiteWrapper {
  constructor(tableName) {
    this.tableName = tableName
    this.isElectron = isElectronEnvironment()
    
    if (this.isElectron) {
      console.log(`💾 Database ${tableName}: Using IPC-based SQLite (Electron environment)`)
    } else {
      console.log(`📱 Database ${tableName}: Using LocalStorage (browser environment)`)
    }
  }

  // NeDBのfindOneメソッド互換
  async findOne(query) {
    if (!this.isElectron) {
      return this.localStorageFindOne(query)
    }
    
    try {
      console.log(`🔍 Finding one document:`, query)
      const result = await window.electronAPI.dbFindOne(this.tableName, query)
      console.log(`✅ FindOne result:`, result)
      return result
    } catch (error) {
      console.error('findOne error:', error)
      return null
    }
  }

  // NeDBのfindメソッド互換
  async find(query = {}) {
    if (!this.isElectron) {
      return this.localStorageFind(query)
    }
    
    try {
      console.log(`🔍 Finding documents:`, query)
      const result = await window.electronAPI.dbFind(this.tableName, query)
      console.log(`✅ Find result:`, result)
      return result
    } catch (error) {
      console.error('find error:', error)
      return []
    }
  }

  // NeDBのinsertメソッド互換
  async insert(doc) {
    if (!this.isElectron) {
      return this.localStorageInsert(doc)
    }
    
    try {
      console.log(`🔧 Inserting document:`, doc)
      const result = await window.electronAPI.dbInsert(this.tableName, doc)
      console.log(`✅ Insert result:`, result)
      return result
    } catch (error) {
      console.error('insert error:', error)
      return null
    }
  }

  // NeDBのupdateメソッド互換
  async update(query, updateDoc, options = {}) {
    if (!this.isElectron) {
      return this.localStorageUpdate(query, updateDoc)
    }
    
    try {
      console.log(`🔧 Updating document:`, query, updateDoc)
      const result = await window.electronAPI.dbUpdate(this.tableName, query, updateDoc, options)
      console.log(`✅ Update result:`, result)
      return result
    } catch (error) {
      console.error('update error:', error)
      return { modifiedCount: 0 }
    }
  }

  // NeDBのremoveメソッド互換
  async remove(query) {
    if (!this.isElectron) {
      return this.localStorageRemove(query)
    }
    
    try {
      console.log(`🔧 Removing document:`, query)
      const result = await window.electronAPI.dbRemove(this.tableName, query)
      console.log(`✅ Remove result:`, result)
      return result
    } catch (error) {
      console.error('remove error:', error)
      return { deletedCount: 0 }
    }
  }

  // UPSERT操作（存在すれば更新、なければ挿入）
  async upsert(doc) {
    if (!this.isElectron) {
      // ブラウザ環境では既存のロジックを使用
      const existing = await this.localStorageFindOne({ name: doc.name })
      if (existing) {
        return this.localStorageUpdate({ _id: existing._id }, { $set: doc })
      } else {
        return this.localStorageInsert(doc)
      }
    }
    
    try {
      console.log(`🔧 Upserting document:`, doc)
      const result = await window.electronAPI.dbUpsert(this.tableName, doc)
      console.log(`✅ Upsert result:`, result)
      return result
    } catch (error) {
      console.error('upsert error:', error)
      return null
    }
  }

  // データベースの状態を確認
  isOpen() {
    return this.isElectron
  }
  
  // データベースを閉じる
  async close() {
    if (this.isElectron) {
      try {
        await window.electronAPI.dbClose(this.tableName)
        console.log(`✅ Database ${this.tableName} closed successfully`)
      } catch (error) {
        console.error(`❌ Error closing database ${this.tableName}:`, error)
      }
    }
  }

  // ブラウザ環境用のローカルストレージ操作
  async localStorageFindOne(query) {
    try {
      const data = localStorage.getItem(`db_${this.tableName}`)
      if (!data) return null
      
      const records = JSON.parse(data)
      return records.find(record => {
        if (query._id) return record._id === query._id
        if (query.name) return record.name === query.name
        return Object.keys(query).every(key => record[key] === query[key])
      }) || null
    } catch (e) {
      return null
    }
  }

  async localStorageFind(query = {}) {
    try {
      const data = localStorage.getItem(`db_${this.tableName}`)
      if (!data) return []
      
      const records = JSON.parse(data)
      return records.filter(record => {
        if (!query || Object.keys(query).length === 0) return true
        if (query._id) return record._id === query._id
        if (query.name) return record.name === query.name
        return Object.keys(query).every(key => record[key] === query[key])
      })
    } catch (e) {
      return []
    }
  }

  async localStorageInsert(doc) {
    try {
      const data = localStorage.getItem(`db_${this.tableName}`)
      const records = data ? JSON.parse(data) : []
      
      const newDoc = {
        ...doc,
        _id: doc._id || Date.now().toString()
      }
      
      records.push(newDoc)
      localStorage.setItem(`db_${this.tableName}`, JSON.stringify(records))
      return newDoc
    } catch (e) {
      return null
    }
  }

  async localStorageUpdate(query, updateDoc) {
    try {
      const data = localStorage.getItem(`db_${this.tableName}`)
      if (!data) return { modifiedCount: 0 }
      
      let records = JSON.parse(data)
      let modifiedCount = 0
      
      records.forEach(record => {
        let shouldUpdate = false
        
        if (query._id && record._id === query._id) {
          shouldUpdate = true
        } else if (query.name && record.name === query.name) {
          shouldUpdate = true
        } else {
          shouldUpdate = Object.keys(query).every(key => record[key] === query[key])
        }
        
        if (shouldUpdate) {
          if (updateDoc.$set) {
            Object.assign(record, updateDoc.$set)
          } else {
            Object.assign(record, updateDoc)
          }
          modifiedCount++
        }
      })
      
      localStorage.setItem(`db_${this.tableName}`, JSON.stringify(records))
      return { modifiedCount }
    } catch (e) {
      return { modifiedCount: 0 }
    }
  }

  async localStorageRemove(query) {
    try {
      const data = localStorage.getItem(`db_${this.tableName}`)
      if (!data) return { deletedCount: 0 }
      
      let records = JSON.parse(data)
      const initialLength = records.length
      
      records = records.filter(record => {
        if (query._id) return record._id !== query._id
        if (query.name) return record.name !== query.name
        return !Object.keys(query).every(key => record[key] === query[key])
      })
      
      localStorage.setItem(`db_${this.tableName}`, JSON.stringify(records))
      return { deletedCount: initialLength - records.length }
    } catch (e) {
      return { deletedCount: 0 }
    }
  }
}

// データベースインスタンスの管理
const dbInstances = new Map()

// NeDB風のgetDatastore関数
export function getDatastore(tableName) {
  if (!dbInstances.has(tableName)) {
    dbInstances.set(tableName, new SQLiteWrapper(tableName))
  }
  return dbInstances.get(tableName)
}

// すべてのデータベースを閉じる
export async function closeAllDatabases() {
  console.log('🔄 Closing all databases...')
  
  if (isElectronEnvironment()) {
    try {
      await window.electronAPI.dbCloseAll()
    } catch (error) {
      console.error('Error closing all databases:', error)
    }
  }
  
  dbInstances.clear()
  console.log('✅ All databases closed')
}

// アプリ終了時のデータベースクローズ処理
if (typeof window !== 'undefined') {
  // ページがアンロードされる時にもデータベースを閉じる
  window.addEventListener('beforeunload', () => {
    console.log('🔄 Page unloading, closing databases...')
    closeAllDatabases()
  })
}

// デバッグ用：データベースの中身を表示
export async function debugDatabase(tableName) {
  if (isElectronEnvironment()) {
    try {
      const records = await window.electronAPI.dbFind(tableName, {})
      console.log(`📊 Database ${tableName} contents:`, records)
      return records
    } catch (error) {
      console.error(`❌ Error reading database ${tableName}:`, error)
      return null
    }
  } else {
    try {
      const data = localStorage.getItem(`db_${tableName}`)
      const records = data ? JSON.parse(data) : []
      console.log(`📊 Database ${tableName} contents:`, records)
      return records
    } catch (error) {
      console.error(`❌ Error reading database ${tableName}:`, error)
      return null
    }
  }
}

// デバッグ用：直接SQLiteでテスト挿入
export async function testInsert(tableName, key, value) {
  if (isElectronEnvironment()) {
    try {
      const doc = { name: key, value: value }
      return await window.electronAPI.dbInsert(tableName, doc)
    } catch (error) {
      console.error(`❌ Error in test insert:`, error)
      return null
    }
  } else {
    try {
      const data = localStorage.getItem(`db_${tableName}`)
      const records = data ? JSON.parse(data) : []
      
      const newDoc = {
        _id: Date.now().toString(),
        name: key,
        value: value
      }
      
      records.push(newDoc)
      localStorage.setItem(`db_${tableName}`, JSON.stringify(records))
      return newDoc
    } catch (error) {
      console.error(`❌ Error in test insert:`, error)
      return null
    }
  }
}