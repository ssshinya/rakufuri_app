import util from './utilty'
// Sharpとファイルシステム操作はIPCに移行予定
// const sharp = require('sharp');
// const fs = require('fs')
// require('date-utils') // ネイティブAPIに置き換え

// 日付フォーマット関数（date-utilsの代替）
function formatDate(date, format) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH24', hours)
    .replace('MI', minutes)
    .replace('SS', seconds)
}

// イメージを700x700してtmpに保存します
async function composite (filepath, callback) {
  try {
    // IPC経由で画像処理を実行
    if (window.electronAPI && window.electronAPI.processImage) {
      const result = await window.electronAPI.processImage(filepath, {
        width: 700,
        height: 700,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      
      if (callback) {
        callback(result)
      } else {
        return result
      }
    } else {
      // フォールバック: 元のファイルパスを返す
      console.log('composite called for:', filepath, '(IPC not available)')
      if (callback) {
        callback(filepath)
      } else {
        return filepath
      }
    }
  } catch (error) {
    console.error('composite error:', error)
    // フォールバック: 元のファイルパスを返す
  if (callback) {
      callback(filepath)
  } else {
      return filepath
    }
  }
}
// イメージを700x700してtmpに保存します
async function compositeForExcel (filepath, callback) {
  try {
  // 変換不要か判定
    var ext = '.' + util.getExtension(filepath)
    var fileDir = filepath.replace(ext, '')
    fileDir = fileDir.replace('item_', '')
    if (util.isNumber(fileDir)) {
      return util.getImgPath(filepath)
    }
    
    // IPC経由で画像処理を実行
    if (window.electronAPI && window.electronAPI.processImage) {
      const result = await window.electronAPI.processImage(filepath, {
        width: 700,
        height: 700,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      
      if (callback) {
        callback(result)
      } else {
        return result
      }
    } else {
      // フォールバック: 元のファイルパスを返す
      console.log('compositeForExcel called for:', filepath, '(IPC not available)')
      if (callback) {
        callback(filepath)
      } else {
        return filepath
      }
    }
  } catch (error) {
    console.error('compositeForExcel error:', error)
    // フォールバック: 元のファイルパスを返す
  if (callback) {
      callback(filepath)
  } else {
      return filepath
    }
  }
}
export default {composite, compositeForExcel}
