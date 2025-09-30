import consts from './consts'
import { AssistantApi } from './assistantApi'
// import { RakumaApi } from './rakumaApi'
// import { PaypayApi } from './paypayApi'
// import { Log } from './log'
// import { remote } from 'electron'
import { getDatastore as getSQLiteDatastore } from './sqliteWrapper'
// require('date-utils')
// const fs = require('fs')
// const dialog = require('electron').remote.dialog

// 情報ダイアログ
function showInfoBox (message) {
  try {
    // 一時的にalertのみを使用（デバッグ用）
    console.log('showInfoBox called with message:', message)
    alert(message)
    
    // TODO: Electron環境でのダイアログ表示を実装
  } catch (error) {
    console.error('showInfoBox error:', error)
    alert(message)
  }
}
// エラーダイアログ
function showErrorBox (message) {
  try {
    // 一時的にalertのみを使用（デバッグ用）
    console.log('showErrorBox called with message:', message)
    alert('エラー: ' + message)
    
    // TODO: Electron環境でのダイアログ表示を実装
    // if (typeof window !== 'undefined' && window.require) {
    //   const electron = window.require('electron')
    //   if (electron && electron.dialog) {
    //     electron.dialog.showMessageBox(null, {
    //       type: 'warning',
    //       buttons: ['OK'],
    //       title: 'エラー',
    //       message: message
    //     })
    //   } else {
    //     alert('エラー: ' + message)
    //   }
    // } else {
    //   alert('エラー: ' + message)
    // }
  } catch (error) {
    console.error('showErrorBox error:', error)
    alert('エラー: ' + message)
  }
}
// システムエラー
function showSystemErrorBox () {
  try {
    // Electron環境でのダイアログ表示
    if (typeof window !== 'undefined' && window.require) {
      const { dialog } = window.require('electron')
      const options = {
        type: 'warning',
        buttons: ['OK'],
        title: 'エラー',
        message: 'エラーが発生しました。システム管理者にお問い合わせください。',
        detail: ''
      }
      // 非同期でダイアログを表示
      dialog.showMessageBox(null, options).catch(error => {
        console.error('Dialog error:', error)
        // フォールバック: アラート表示
        alert('エラー: エラーが発生しました。システム管理者にお問い合わせください。')
      })
    } else {
      // ブラウザ環境ではアラート表示
      alert('エラー: エラーが発生しました。システム管理者にお問い合わせください。')
    }
  } catch (error) {
    console.error('showSystemErrorBox error:', error)
    // フォールバック: アラート表示
    alert('エラー: エラーが発生しました。システム管理者にお問い合わせください。')
  }
}

// Datasorceを取得
function getDatastore (table) {
  try {
    return getSQLiteDatastore(table)
  } catch (error) {
    console.error('Failed to get datastore for table:', table, error)
    // フォールバック: モックオブジェクトを返す
    return {
      findOne: async () => null,
      find: async () => [],
      insert: async () => null,
      update: async () => ({ modifiedCount: 0 }),
      remove: async () => ({ deletedCount: 0 })
    }
  }
}

// フラグを初期化します
function initFlg (name) {
  var flg = sessionStorage.getItem(name)
  if (!flg) {
    sessionStorage.setItem(name, 'false')
  }
}

// フラグの値を返します。
function getFlg (name) {
  var flg = sessionStorage.getItem(name)
  return flg
}

// フラグの値を設定します。
function setFlg (name, value) {
  sessionStorage.setItem(name, value)
}

// 出品中チェック
function checkExhibition () {
  if (this.getFlg('exhibitionFlg') === 'true') {
    alert('現在、出品中です。')
    return true
  }
  return false
}

// エクセル読み込み中チェック
function checkReadExcel () {
  if (this.getFlg('readExcelFlg') === 'true') {
    alert('現在、Excel読込中です。')
    return true
  }
  return false
}

// ライセンスチェック
async function checkLicense (parent, callback) {
  try {
    var constDB = getDatastore('const')
    var token = await constDB.findOne({name: consts.const_assistant_token})
    var result = false
    console.log()
    if (token) {
      result = true
      // 再度ライセンス認証をする
      var assistantApi = new AssistantApi()
      await assistantApi.checkLicense(token.value, (json) => {
        switch (json.result) {
          // 体験版
          case 0 :
            // 体験版フラグをtrueへ
            setFlg('testingFlg', 'true')
            break
          // Rakuma
          case 1 :
            // 体験版フラグをfalseへ
            setFlg('testingFlg', 'false')
            break
          // Gold
          case 6 :
            alert('利用できません')
            result = false
            break
          // Paypay
          case 8 :
            // 体験版フラグをfalseへ
            setFlg('testingFlg', 'false')
            break
          // Deluxe
          case 7 :
            // 体験版フラグをfalseへ
            setFlg('testingFlg', 'false')
            break
          // 入金待ち
          case 2 :
            alert('入金待ちです')
            result = false
            break
          // 利用停止
          case 3 :
            alert('利用できません')
            result = false
            break
          // PC重複
          case 4 :
            alert('他のパソコンでの利用を検知しました')
            result = false
            break
          // 利用者なし
          case 5 :
            alert('利用できません')
            result = false
            break
          // その他
          default :
            alert('利用できません')
            result = false
            break
        }
      })
    } else {
      console.log('No license token found')
      result = false
    }
    
    console.log('checkLicense result:', result)
    if (callback) {
      callback(result)
    } else {
      return result
    }
  } catch (error) {
    console.error('checkLicense error:', error)
    const result = false
    if (callback) {
      callback(result)
    } else {
      return result
    }
  }
}
// サイトライセンスチェック
async function checkSiteLicense (parent, site, callback) {
  // var constDB = this.getDatastore('const.db')
  // var token = await constDB.findOne({name: consts.const_assistant_token})
  var result = null
  // if (token) {
  //   // 再度ライセンス認証をする
  //   var assistantApi = new AssistantApi()
  //   await assistantApi.checkLicense(token.value, (json) => {
  //     if (json.result === 0 ) {
  //       result = true
  //     } else if (site === 'r' && json.result === 1) {
  //       result = true
  //     } else if (site === 'p' && json.result === 8) {
  //       result = true
  //     } else if (json.result === 7) {
  //       result = true
  //     }
  //   })
  // } else {
  //   alert('ライセンス認証をしてください')
  //   parent.$router.push({path: 'license'})
  // }
  console.log('checkSiteLicense called for site:', site)
  if (callback) {
    callback(result)
  } else {
    return result
  }
}
// ライセンスチェック
async function checkGold (parent, callback) {
  // var constDB = this.getDatastore('const.db')
  // var token = await constDB.findOne({name: consts.const_assistant_token})
  var result = false
  // if (token) {
  //   result = true
  //   // 再度ライセンス認証をする
  //   var assistantApi = new AssistantApi()
  //   await assistantApi.checkLicense(token.value, (json) => {
  //     if (json.result===6) {
  //       result = true
  //     } else {
  //       result = false
  //     }
  //   })
  // } else {
  //   alert('ライセンス認証をしてください')
  //   parent.$router.push({path: 'license'})
  // }
  console.log('checkGold called')
  if (callback) {
    callback(result)
  } else {
    return result
  }
}
// アカウントチェック
async function checkAccount (callback) {
  // var accountDB = this.getDatastore('account.db')
  // var docs = await accountDB.find({})
  var result = false
  // if (docs.length >= 1) {
  //   result = true
  // }
  console.log('checkAccount called')
  if (callback) {
    callback(result)
  } else {
    return result
  }
}
// アカウント取得
async function getAccount (accountId) {
  // var accountDB = this.getDatastore('account.db')
  // var account = await accountDB.findOne({_id: accountId})
  // if (account) {
  //   return account
  // } else {
  //   return null
  // }
  console.log('getAccount called for:', accountId)
  return null
}
// 体験版チェック
async function checkTrialCount (count, updateFlg, callback) {
  // tokenを取得
  // var constDB = this.getDatastore('const.db')
  // var token = await constDB.findOne({name: consts.const_assistant_token})
  // if (!token) {
  //   return null
  // }
  // 体験版チェック
  // var assistantApi = new AssistantApi()
  // var result = await assistantApi.checkTrialCount(token.value, count, updateFlg)
  console.log('checkTrialCount called with count:', count, 'updateFlg:', updateFlg)
  var result = null
  if (callback) {
    callback(result)
  } else {
    return result
  }
}
// 自動キャンセル実行
async function runAutoCancel () {
  // 自動キャンセルフラグを確認
  if (this.getFlg('autoCancelId')) {
    this.stopAutoCancel()
  }
  // キャンセル商品を取得
  // var exhibitionDB = this.getDatastore('exhibition.db')
  // var cancelItems = await exhibitionDB.find({exhibition_flg: 'true', cancel_flg: '', cancel_datetime: {$gte: new Date().toFormat('YYYY-MM-DD HH24:MI:SS')}})
  // キャンセル商品がある場合
  // if (cancelItems.length > 0) {
  //   // キャンセル実行
  //   var id = setInterval(async () => {
  //     try {
  //       // キャンセル商品を取得
  //       var cancelNow = new Date().toFormat('YYYY-MM-DD HH24:MI:00')
  //       var cancelItem = await exhibitionDB.findOne({exhibition_flg: 'true', cancel_flg: '', cancel_datetime: cancelNow})
  //       if (cancelItem) {
  //         // DBをキャンセル中に変更
  //         await exhibitionDB.update({_id: cancelItem._id}, {$set: {cancel_flg: 'run'}})
  //         // アカウントを取得
  //         var account = await this.getAccount(cancelItem.account_id)
  //         // サイトを判定
  //         if (account.site === 'r') {
  //           // ラクマ
  //           var rakumaApi = new RakumaApi()
  //           // 削除チェック
  //           var check_rakuma = await rakumaApi.checkCancel(cancelItem.account_id, cancelItem.site_item_id, cancelItem.cancel_like_flg, cancelItem.cancel_comment_flg)
  //           if (check_rakuma) {
  //             var result_rakuma = await rakumaApi.deleteOnSale(cancelItem.account_id, cancelItem.site_item_id)
  //             // 削除成功
  //             if (result_rakuma) {
  //               // DB変更
  //               await exhibitionDB.update({_id: cancelItem._id}, {$set: {cancel_flg: 'true'}})
  //             } else {
  //               // DB変更
  //               await exhibitionDB.update({_id: cancelItem._id}, {$set: {cancel_flg: 'false'}})
  //             }
  //           } else {
  //             // DB変更
  //             await exhibitionDB.update({_id: cancelItem._id}, {$set: {cancel_flg: 'false'}})
  //           }
  //         } else if (account.site === 'p') {
  //           // PayPay
  //           var paypayApi = new PaypayApi()
  //           // Tokenチェック
  //           await paypayApi.updateToken(cancelItem.account_id)
  //           // 削除チェック
  //           var check_paypay = await paypayApi.checkCancel(cancelItem.account_id, cancelItem.site_item_id, cancelItem.cancel_like_flg, cancelItem.cancel_comment_flg)
  //           if (check_paypay) {
  //             let result_paypay = await paypayApi.deleteOnSale(cancelItem.account_id, cancelItem.site_item_id)
  //             // 削除成功
  //             if (result_paypay) {
  //               // DB変更
  //               await exhibitionDB.update({_id: cancelItem._id}, {$set: {cancel_flg: 'true'}})
  //             } else {
  //               // DB変更
  //               await exhibitionDB.update({_id: cancelItem._id}, {$set: {cancel_flg: 'false'}})
  //             }
  //           } else {
  //             // DB変更
  //             await exhibitionDB.update({_id: cancelItem._id}, {$set: {cancel_flg: 'false'}})
  //           }
  //         }
  //         // 対象が無くなったら終了
  //         var cancelList = await exhibitionDB.find({exhibition_flg: 'true', cancel_flg: '', cancel_datetime: {$gte: new Date().toFormat('YYYY-MM-DD HH24:MI:SS')}})
  //         if (cancelList <= 0) {
  //           clearInterval(id)
  //           this.setFlg('autoCancelId', '')
  //         }
  //       }
  //     } catch (error) {
  //       var log = new Log()
  //       log.error(error)
  //     }
  //   }, 9000)
  //   // IDをセット
  //   this.setFlg('autoCancelId', id)
  // }
  console.log('runAutoCancel called')
}
// 自動キャンセルを止める
async function stopAutoCancel () {
  // 自動キャンセルフラグを確認
  var id = this.getFlg('autoCancelId')
  if (id) {
    clearInterval(id)
    this.setFlg('autoCancelId', '')
  }
  console.log('stopAutoCancel called')
}
// 絞り込み
function doFilter (items, targets, keyword) {
  var filterItems = []
  for (var i = 0; i < items.length; i++) {
    var flg = null
    for (var t = 0; t < targets.length; t++) {
      if (!isNaN(items[i][targets[t]])) {
        items[i][targets[t]] = String(items[i][targets[t]])
      }
      if (items[i][targets[t]].indexOf(keyword) >= 0) {
        flg = true
        break
      }
    }
    if (flg) {
      filterItems.push(items[i])
    }
  }
  return filterItems
}
// Domを表示
function showDom (name, type) {
  var element = document.getElementById(name)
  if (element) {
    if (type) {
      element.style.display = 'block'
    } else {
      element.style.display = 'inline-block'
    }
  }
}
// Domを非表示
function noneDom (name) {
  var element = document.getElementById(name)
  if (element) {
    element.style.display = 'none'
  }
}
// DomにHTMLを追加
function innerHtmlDom (name, html) {
  var element = document.getElementById(name)
  if (element) {
    element.innerHTML = html
  }
}
// DomにHTMLを追加
function classInnerHtmlDom (name, html) {
  var element = document.getElementsByClassName(name)
  if (element) {
    element.innerHTML = html
  }
}
// Domのclassを変更
function classDom (name, className) {
  var element = document.getElementById(name)
  if (element) {
    element.className = className
  }
}
// 画像のパスを返します。
function getImgPath (filepath) {
  // var ext = '.' + getExtension(filepath)
  // var filename = filepath.replace(ext, '')
  // filename = filename.replace('item_', '')
  // if (!isNumber(filename)) {
  //   return filepath
  // } else {
  //   return remote.app.getPath('userData') + '/img/' + filepath
  // }
  console.log('getImgPath called for:', filepath)
  return filepath
}

// 拡張子取得
function getExtension (fileName) {
  var ret = ''
  if (!fileName) {
    return ret
  }
  var fileTypes = fileName.split('.')
  var len = fileTypes.length
  if (len === 0) {
    return ret
  }
  ret = fileTypes[len - 1]
  return ret
}
// 数字チェック
function isNumber (numVal) {
  // チェック条件パターン
  var pattern = /^\d*$/
  // 数値チェック
  return pattern.test(numVal)
}

// tmpフォルダをクリア
function clearTmp () {
  // フォルダ内を削除
  // if (fs.existsSync(remote.app.getPath('userData') + '/tmp')) {
  //   var tmpFiles = fs.readdirSync(remote.app.getPath('userData') + '/tmp')
  //   for (var file in tmpFiles) {
  //     fs.unlinkSync(remote.app.getPath('userData') + '/tmp/' + tmpFiles[file])
  //   }
  // // フォルダを作成
  // } else {
  //   fs.mkdirSync(remote.app.getPath('userData') + '/tmp')
  // }
  console.log('clearTmp called')
}

// logファイルのサイズをチェック
function checkLogSize () {
  // フォルダがなければ何もしない
  // if (!fs.existsSync(remote.app.getPath('userData') + '/log')) {
  //   return
  // }
  // リクエストログの存在チェック
  // if (!fs.existsSync(remote.app.getPath('userData') + '/log/' + 'request.log')) {
  //   return
  // }
  // リクエストログのサイズチェック
  // var stat = fs.statSync(remote.app.getPath('userData') + '/log/' + 'request.log')
  // 5Mを超えたら削除
  // if (stat.size >= 5000000) {
  //   fs.unlinkSync(remote.app.getPath('userData') + '/log/' + 'request.log')
  // }
  console.log('checkLogSize called')
}

// ラクマの下層部のリストを取得します
function getRakumaList (list, name, id) {
  var returnList = []
  for (var i=0 ; i<list.length; i++) {
    if (list[i][name] === id) {
      returnList.push(list[i])
    }
  }
  return returnList
}
// ラクマのカテゴリマスタ作成
function getRakumaCategoryMaster () {
  // カテゴリデータ取得
  var categoryRakuma1 = JSON.parse(sessionStorage.getItem('categoryRakuma1'))
  var categoryRakuma2 = JSON.parse(sessionStorage.getItem('categoryRakuma2'))
  var categoryRakuma3 = JSON.parse(sessionStorage.getItem('categoryRakuma3'))
  var sizeRakuma = JSON.parse(sessionStorage.getItem('sizeRakuma'))
  // カテゴリマスタ
  var category = ''
  // ループ
  for (var i=0 ; i<categoryRakuma1.length; i++) {
    // カテゴリ2を取得
    var category2List = this.getRakumaList(categoryRakuma2, 'parentCategoryId', categoryRakuma1[i].id)
    for (var t=0 ; t<category2List.length; t++) {
      // カテゴリ3を取得
      var category3List = this.getRakumaList(categoryRakuma3, 'parentCategoryId', category2List[t].id)
      for (var s=0 ; s<category3List.length; s++) {
        if (category3List[s].sizeType) {
          var sizeList = this.getRakumaList(sizeRakuma, 'type', category3List[s].sizeType)
          for (var v=0 ; v<sizeList.length; v++) {
            category += categoryRakuma1[i].name + ' > ' + category2List[t].name + ' > ' + category3List[s].name + '\t'
            category += categoryRakuma1[i].id + '>' + category2List[t].id + '>' + category3List[s].id + '\t'
            category += sizeList[v].name + '\t'
            category += sizeList[v].id + '\n'
          }
        } else {
          category += categoryRakuma1[i].name + ' > ' + category2List[t].name + ' > ' + category3List[s].name + '\t'
          category += categoryRakuma1[i].id + '>' + category2List[t].id + '>' + category3List[s].id + '\n'
        }
      }
    }
  }
  return category
}
// PayPayのカテゴリマスタ作成
async function getPaypayCategoryMaster () {
  // カテゴリー取得
  // var paypayApi = new PaypayApi()
  // カテゴリマスタ
  var category = ''
  // カテゴリ取得
  // var categoryList = await paypayApi.getCategory()
  // カテゴリ
  // category = await this.getPaypayCategory(categoryList[1], category, null, null)
  /*
  for (var i=5; i<7; i++) {
    console.log((i+1) + '/' + categoryList.length)
    category = await this.getPaypayCategory(categoryList[i], category, null, null)
  }*/
  console.log('getPaypayCategoryMaster called')
  return category
}
// Paypayカテゴリー選択
async function getPaypayCategory (val, category, parantCategoryId, parantCategoryName) {
  // API
  // var paypayApi = new PaypayApi()
  // カテゴリー保存
  if (val.productCategory) {
    // 最終行
    // サイズを取得
    // var json = await paypayApi.getSize(val.productCategory.id)
    // if (json.isBrandAvailable===true) {
    //   var paypaySizes = null
    //   var specsId = null
    //   var specsName = null
    //   for (var s=0 ; s<json.specList.length ; s++ ) {
    //     if (json.specList[s].name.indexOf('サイズ') >= 0) {
    //       specsId = json.specList[s].id
    //       specsName = json.specList[s].name
    //       paypaySizes = json.specList[s].values
    //     }
    //   }
    //   if (paypaySizes) {
    //     for (var t=0 ; t<paypaySizes.length; t++) {
    //       category += parantCategoryName + ' > ' + val.name + '\t'
    //       category += parantCategoryId + '>' + val.productCategory.id + '\t'
    //       category += specsName + '\t'
    //       category += specsId + '\t'
    //       category += paypaySizes[t].name + '\t'
    //       category += paypaySizes[t].id + '\n'
    //     }
    //   } else {
    //     category += parantCategoryName + ' > ' + val.name + '\t'
    //     category += parantCategoryId + '>' + val.productCategory.id + '\n'
    //   }
    // } else {
    //   category += parantCategoryName + ' > ' + val.name + '\t'
    //   category += parantCategoryId + '>' + val.productCategory.id + '\n'
    // }
    console.log('getPaypayCategory called for productCategory:', val.productCategory)
    return category
  }
  // カテゴリー取得
  // var categoryList = await paypayApi.getCategory(val.id)
  // for (var i=0; i<categoryList.length; i++) {
  //   // 親カテゴリ
  //   var newParentCategoryId = ''
  //   var newParentCategoryName = ''
  //   if (parantCategoryId) {
  //     newParentCategoryId = parantCategoryId + '>' + val.id
  //   } else {
  //     newParentCategoryId = val.id
  //   }
  //   if (parantCategoryName) {
  //     newParentCategoryName = parantCategoryName + ' > ' + val.name
  //   } else {
  //     newParentCategoryName = val.name
  //   }
  //   category = await this.getPaypayCategory(categoryList[i], category, newParentCategoryId, newParentCategoryName)
  // }
  console.log('getPaypayCategory called for val:', val)
  return category
}
// ラクマのブランドマスタ作成
function getRakumaBrandMaster () {
  // ブランド取得
  var brandRakuma = JSON.parse(localStorage.getItem('brandRakuma'))
  // ブランドマスタ
  var brand = ''
  // ループ
  for (var i=0 ; i<brandRakuma.length; i++) {
    brand += brandRakuma[i].name + '(' + brandRakuma[i].kana + ')' + '\n'
  }
  return brand
}
// Paypayのブランドマスタ作成
async function getPaypayBrandMaster () {
  // ブランド取得
  // var paypayApi = new PaypayApi()
  // var brandPaypay = await paypayApi.getBrand()
  // ブランドマスタ
  var brand = ''
  // ループ
  // for (var i=0 ; i<brandPaypay.length; i++) {
  //   brand += brandPaypay[i].name + '(' + brandPaypay[i].nameKana + ')' + '\n'
  // }
  console.log('getPaypayBrandMaster called')
  return brand
}

export default {showInfoBox, showErrorBox, showSystemErrorBox, getDatastore, initFlg, getFlg, setFlg, checkExhibition, checkReadExcel, checkLicense, checkSiteLicense, checkGold, checkAccount, getAccount, checkTrialCount, runAutoCancel, stopAutoCancel, doFilter, showDom, noneDom, innerHtmlDom, classInnerHtmlDom, classDom, getImgPath, getExtension, isNumber, clearTmp, checkLogSize, getRakumaList, getRakumaCategoryMaster, getPaypayCategoryMaster, getPaypayCategory, getRakumaBrandMaster, getPaypayBrandMaster}
