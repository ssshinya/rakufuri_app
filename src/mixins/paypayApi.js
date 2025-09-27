import consts from './consts'
import { Log } from './log'
import util from './utilty'
import image from './image'
// import { remote } from 'electron'
// const crypto = require('crypto')
// const puppeteer = require('puppeteer')
// var request = require('request-promise')
// var fs = require('fs')
// const base64url = require("base64url")
// const sha256 = require("js-sha256")
// require('date-utils')

export class PaypayApi {
  constructor () {
    this.log = new Log()
  }
  // Logフォルダ内を削除
  async clearLog () {
    // if (fs.existsSync(remote.app.getPath('userData') + '/log')) {
    //   var files = fs.readdirSync(remote.app.getPath('userData') + '/log')
    //   for (let file in files) {
    //     fs.unlinkSync(remote.app.getPath('userData') + '/log/' + files[file])
    //   }
    // }
    console.log('clearLog called')
  }
  // ScreenShot保存
  async screenshot(page, name){
    // var datetime = new Date().toFormat('YYYYMMDDHH24MISS')
    // await page.screenshot({path: remote.app.getPath('userData') + '/log/' + datetime + '-' + name + '.png', fullPage: false})
    console.log('screenshot called for:', name)
  }
  // HTML保存
  async saveHtml(page, name){
    // var html = await page.content()
    // this.log.html(name, html)
    console.log('saveHtml called for:', name)
  }
  // NEW ログイン
  async login(email, password, callback) {
    console.log('PaypayApi login called with email:', email)
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback(null)
    } else {
      return null
    }
  }
  // SMS認証
  async verifyCode (accountData, verifyCode, callback) {
    console.log('PaypayApi verifyCode called')
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback(null)
    } else {
      return null
    }
  }
  // 追加情報で認証
  async postDataConfirm (accountData, kind, data, callback) {
    console.log('PaypayApi postDataConfirm called')
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback(null)
    } else {
      return null
    }
  }
  // htmlからjsonを取得
  async getJson(html){
    console.log('PaypayApi getJson called')
    // 実装は省略
    return '{}'
  }
  // Token再取得
  async updateToken (account_id, flg) {
    console.log('PaypayApi updateToken called for account:', account_id)
    // 実装は省略（Electron依存のため）
  }
  // 出品
  async exhibition (exhibitionData, callback) {
    console.log('PaypayApi exhibition called')
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback(null)
    } else {
      return null
    }
  }
  // 出品中商品の取得
  async getOnSale (accountId, callback) {
    console.log('PaypayApi getOnSale called for account:', accountId)
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback([])
    } else {
      return []
    }
  }
  // onSaleリクエスト
  async requestOnSale(url, onSaleList, userAgent, account){
    console.log('PaypayApi requestOnSale called')
    // 実装は省略（Electron依存のため）
    return 0
  }
  // 出品取消
  async deleteOnSale (accountId, itemId, callback) {
    console.log('PaypayApi deleteOnSale called')
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback(false)
    } else {
      return false
    }
  }
  // 取消チェック
  async checkCancel (accountId, itemId, cancelLikeFlg, cancelCommentFlg) {
    console.log('PaypayApi checkCancel called')
    // 実装は省略（Electron依存のため）
    return false
  }
  // 金額変更
  async changePrice (accountId, itemId, changePrice, callback) {
    console.log('PaypayApi changePrice called')
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback(false)
    } else {
      return false
    }
  }
  // 質問者取得 V2対応済み
  async getQuestioners (accountId, itemId, callback) {
    console.log('PaypayApi getQuestioners called')
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback([])
    } else {
      return []
    }
  }
  // コメント取得 V2対応済み
  async getComments (accountId, itemId, userId, callback) {
    console.log('PaypayApi getComments called')
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback([])
    } else {
      return []
    }
  }
  // コメント送信 V2対応済み
  async addComment (accountId, itemId, userId, comment, callback) {
    console.log('PaypayApi addComment called')
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback(false)
    } else {
      return false
    }
  }
  // 取引中商品の取得
  async getTrading (accountId, callback) {
    console.log('PaypayApi getTrading called')
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback([])
    } else {
      return []
    }
  }
  // 取引メッセージを取得
  async getMessages (exhibition, callback) {
    console.log('PaypayApi getMessages called')
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback([])
    } else {
      return []
    }
  }
  // 取引メッセージの送信
  async sendTradingMessage (exhibition, message) {
    console.log('PaypayApi sendTradingMessage called')
    // 実装は省略（Electron依存のため）
    return false
  }
  // 配送方法を取得
  async getPostMethod (exhibition, callback) {
    console.log('PaypayApi getPostMethod called')
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback({})
    } else {
      return {}
    }
  }
  // 配送コードの取得
  async getQrCode (exhibition, postData, callback) {
    console.log('PaypayApi getQrCode called')
    // 実装は省略（Electron依存のため）
    if (callback) {
      callback([])
    } else {
      return []
    }
  }
  // 発送通知の送信
  async shipped (exhibition) {
    console.log('PaypayApi shipped called')
    // 実装は省略（Electron依存のため）
    return false
  }
  // カテゴリー取得
  async getCategory ( id ) {
    console.log('PaypayApi getCategory called for id:', id)
    // 実装は省略（Electron依存のため）
    return []
  }
  // サイズ取得
  async getSize ( id ) {
    console.log('PaypayApi getSize called for id:', id)
    // 実装は省略（Electron依存のため）
    return {}
  }
  // ブランド取得
  async getBrand (id) {
    console.log('PaypayApi getBrand called for id:', id)
    // 実装は省略（Electron依存のため）
    return []
  }
  // code_verifier
  get_code_verifier() {
    console.log('PaypayApi get_code_verifier called')
    // 実装は省略（crypto依存のため）
    return 'dummy_code_verifier'
  }
  // code_challenge
  get_code_challenge(str) {
    console.log('PaypayApi get_code_challenge called')
    // 実装は省略（crypto依存のため）
    return 'dummy_code_challenge'
  }
  // ランダム文字列生成
  get_randam_str (count) {
    console.log('PaypayApi get_randam_str called')
    // 実装は省略（crypto依存のため）
    return 'dummy_random_string'
  }
  // HTMLから必要なパラメータを取得
  getParamData (html) {
    console.log('PaypayApi getParamData called')
    // 実装は省略
    return {}
  }
  // URLからcodeを取得
  getCode (url) {
    console.log('PaypayApi getCode called')
    // 実装は省略
    return 'dummy_code'
  }
}
