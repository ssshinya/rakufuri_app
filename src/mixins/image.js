// import { remote } from 'electron'
import util from './utilty'
// const sharp = require('sharp');
// const fs = require('fs')
// require('date-utils')

// イメージを700x700してtmpに保存します
async function composite (filepath, callback) {
  // filepath = filepath.replace('file:', '')
  // var image = await sharp(filepath)
  // var metadata = await image.metadata()
  // 画像の元サイズを取得
  // var imgH = metadata.height
  // var imgW = metadata.width
  // 正方形の場合
  // if (imgH === imgW) {
  //   imgH = 700
  //   imgW = 700
  // // 縦長画像の場合
  // } else if (imgH > imgW) {
  //   imgW = 700 * imgW / imgH
  //   imgH = 700
  // // 横長画像の場合
  // } else if (imgW > imgH) {
  //   imgH = 700 * imgH / imgW
  //   imgW = 700
  // }
  // await image.resize({width:parseInt(imgW), height:parseInt(imgH)})
  // await image.resize({width: 700, height: 700, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 }})
  // 画像ファイル名作成
  // var now = new Date()
  // var filename = now.toFormat('YYYYMMDDHH24MISS') + '.jpg'
  // フォルダチェック
  // if (!fs.existsSync(remote.app.getPath('userData') + '/tmp')) {
  //   fs.mkdirSync(remote.app.getPath('userData') + '/tmp')
  // }
  // 保存
  // await image.toFile(remote.app.getPath('userData') + '/tmp/' + filename)
  // 返却
  console.log('composite called for:', filepath)
  var filename = 'composite_' + Date.now() + '.jpg'
  if (callback) {
    callback(filename)
  } else {
    return filename
  }
}
// イメージを700x700してtmpに保存します
async function compositeForExcel (filepath, callback) {
  // 変換不要か判定
  // var ext = '.' + util.getExtension(filepath)
  // var fileDir = filepath.replace(ext, '')
  // fileDir = fileDir.replace('item_', '')
  // if (util.isNumber(fileDir)) {
  //   return util.getImgPath(filepath)
  // }
  // filepath = filepath.replace('file:', '')
  // 画像ファイル名作成
  // var now = new Date()
  // var filename = now.toFormat('YYYYMMDDHH24MISS') + '.jpg'
  // フォルダチェック
  // if (!fs.existsSync(remote.app.getPath('userData') + '/tmp')) {
  //   fs.mkdirSync(remote.app.getPath('userData') + '/tmp')
  // }
  // var image = await sharp(filepath)
  // var metadata = await image.metadata()
  // 画像の元サイズを取得
  // var imgH = metadata.height
  // var imgW = metadata.width
  // 正方形の場合
  // if (imgH === imgW) {
  //   imgH = 700
  //   imgW = 700
  //   await image.resize({width:parseInt(imgW), height:parseInt(imgH)})
  //   filepath = remote.app.getPath('userData') + '/tmp/' + filename
  //   await image.toFile(filepath)
  //   // 返却
  //   if (callback) {
  //     callback(filepath)
  //   } else {
  //     return filepath
  //   }
  // }
  // 縦長画像の場合
  // if (imgH > imgW) {
  //   imgW = 700 * imgW / imgH
  //   imgH = 700
  // // 横長画像の場合
  // } else if (imgW > imgH) {
  //   imgH = 700 * imgH / imgW
  //   imgW = 700
  // }
  // await image.resize({width:parseInt(imgW), height:parseInt(imgH)})
  // await image.resize({width: 700, height: 700, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 }})
  // 保存
  // filepath = remote.app.getPath('userData') + '/tmp/' + filename
  // await image.toFile(filepath)
  // 返却
  console.log('compositeForExcel called for:', filepath)
  var filename = 'excel_' + Date.now() + '.jpg'
  if (callback) {
    callback(filename)
  } else {
    return filename
  }
}
export default {composite, compositeForExcel}
