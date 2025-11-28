import consts from './consts'
import { Log } from './log'
import util from './utilty'
import image from './image'
// Node.js modules are not available in renderer process
// const crypto = require('crypto')
// const puppeteer = require('puppeteer')
// var fs = require('fs')
// const base64url = require("base64url")
// const sha256 = require("js-sha256")
// require('date-utils') // ネイティブAPIに置き換え
// request-promiseはIPCに置き換え

export class PaypayApi {
  constructor () {
    this.log = new Log()
  }
  
  // HTTPリクエスト用のヘルパー関数
  async httpRequest(method, url, data = null, headers = {}, formData = null) {
    try {
      let result
      if (formData) {
        result = await window.electronAPI.httpPostFormData(url, formData, headers)
      } else {
        switch (method.toLowerCase()) {
          case 'get':
            result = await window.electronAPI.httpGet(url, headers)
            break
          case 'post':
            result = await window.electronAPI.httpPost(url, data, headers)
            break
          case 'put':
            result = await window.electronAPI.httpPut(url, data, headers)
            break
          case 'delete':
            result = await window.electronAPI.httpDelete(url, headers)
            break
          default:
            throw new Error(`Unsupported HTTP method: ${method}`)
        }
      }
      
      if (result.success) {
        return result.data
      } else {
        throw new Error(`HTTP ${method} failed: ${result.error}`)
      }
    } catch (error) {
      this.log.error(`HTTP ${method} error: ${error.message}`)
      throw error
    }
  }
  
  // 日付フォーマット関数（date-utilsの代替）
  formatDate(date, format) {
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
  // Logフォルダ内を削除
  async clearLog () {
    try {
      // IPC経由でユーザーデータパスを取得
      if (window.electronAPI && window.electronAPI.getUserDataPath) {
        const userDataPath = await window.electronAPI.getUserDataPath()
        // ファイルシステム操作はIPC経由で実行
        await window.electronAPI.clearLogFiles(userDataPath + '/log')
      } else {
        console.log('clearLog: IPC not available')
      }
    } catch (error) {
      this.log.error('clearLog error: ' + error.message)
    }
  }
  // ScreenShot保存
  async screenshot(page, name){
    try {
      var datetime = this.formatDate(new Date(), 'YYYYMMDDHH24MISS')
      // IPC経由でユーザーデータパスを取得
      if (window.electronAPI && window.electronAPI.getUserDataPath) {
        const userDataPath = await window.electronAPI.getUserDataPath()
        const screenshotPath = userDataPath + '/log/' + datetime + '-' + name + '.png'
        // PuppeteerのスクリーンショットはIPC経由で実行
        await window.electronAPI.takeScreenshot(page, screenshotPath)
      } else {
        console.log('screenshot: IPC not available')
      }
    } catch (error) {
      this.log.error('screenshot error: ' + error.message)
    }
  }
  // HTML保存
  async saveHtml(page, name){
    var html = await page.content()
    this.log.html(name, html)
  }
  // NEW ログイン
  async login(email, password, callback) {
    // 余分な余白を削除
    email = email.replace(' ', '')
    var url = ''
    var pwFlg = false
    try {
      // フォルダ内を削除
      this.clearLog()
      // puppeteerはIPC経由で実行
      const browser = await window.electronAPI.launchPuppeteer({
        ignoreDefaultArgs: ['--disable-extensions'],
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      const page = await window.electronAPI.createPage(browser)
      // UA設定
      await window.electronAPI.setUserAgent(page, consts.paypay_user_agent)
      // データ作成
      const code_verifier = this.get_code_verifier();
      const code_challenge = this.get_code_challenge(code_verifier);
      const nonce = this.get_randam_str(64);
      const state = this.get_randam_str(64);
      const snonce = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      // オプション設定
      url = 'https://yjapp.auth.login.yahoo.co.jp/yconnect/v2/authorization' +
      '?client_id=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-' +
      '&code_challenge=' + code_challenge +
      '&code_challenge_method=S256' +
      '&display=inapp' +
      '&nonce=' + nonce +
      '&prompt=select_account' +
      '&redirect_uri=yj-paypay-fleamarket:/' +
      '&response_type=code%20id_token' +
      '&scope=openid%20profile' +
      '&state=' + state +
      '&c_auth=1' +
      '&login_type=suggest' +
      'snonce=' + snonce
      // GET
      await window.electronAPI.navigateTo(page, url)
      await window.electronAPI.waitFor(page, 3000)
      // ログ
      this.saveHtml(page, 'paypay_login_1')
      this.screenshot(page, 'paypay_login_1')
      // IDチェック
      // 古いPuppeteerバージョンでの確実な入力方法
      await window.electronAPI.waitForSelector(page, 'input[name="handle"]')
      
      // 入力フィールドをクリアしてから入力
      await window.electronAPI.evaluate(page, () => {
        const input = document.querySelector('input[name="handle"]')
        input.focus()
        input.value = ''
        input.dispatchEvent(new Event('input', { bubbles: true }))
      })
      
      // 1文字ずつ入力（より自然な入力）
      for (let i = 0; i < email.length; i++) {
        await window.electronAPI.typeText(page, email[i])
        await window.electronAPI.waitFor(page, 100) // 各文字の間に少し待機
      }
      
      // 最終的なイベント発火
      await window.electronAPI.evaluate(page, () => {
        const input = document.querySelector('input[name="handle"]')
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
        input.dispatchEvent(new Event('blur', { bubbles: true }))
      })

      await window.electronAPI.waitFor(page, 2000)
      
      // 次へボタンをクリック（より確実なセレクタ）
      var nextButton = await window.electronAPI.querySelector(page, 'button[data-cl_cl_index="2"]')
      if (!nextButton) {
        // フォールバック: テキストで検索
        nextButton = await window.electronAPI.querySelector(page, 'button')
      }
      if (!nextButton) {
        // さらにフォールバック: クラス名で検索
        nextButton = await window.electronAPI.querySelector(page, 'button.riff-Clickable__root')
      }
      await window.electronAPI.clickElement(nextButton)
      await window.electronAPI.waitFor(page, 7000)
      // ログ
      this.screenshot(page, 'paypay_login_2')
      this.saveHtml(page, 'paypay_login_2')
      // 確認コード送信ボタンチェック
      const textExists = await window.electronAPI.evaluateSelector(page, 'p.riff-text-small', el =>
      el.textContent.includes('ログインするため携帯電話番号へ確認コードを送信してください。')
      ).catch(() => false)
      if(textExists){
        const buttons = await window.electronAPI.querySelectorAll(page, 'button');
        for (const btn of buttons) {
          const text = await window.electronAPI.evaluateElement(btn, node => node.innerText.trim());
          if (text === '確認コードを送信') {
            await window.electronAPI.clickElement(btn)
            await window.electronAPI.waitFor(page, 5000)
            break
          }
        }
        // ログ
        this.screenshot(page, 'paypay_login_3')
        this.saveHtml(page, 'paypay_login_3')
      }
      /** パスワードか判定 **/
      var passwordDom = await page.$('input[id="password"]')
      if(passwordDom){
        pwFlg = true
      }

      // 情報を保存
      let accountData = {
        'email': email,
        'password': password,
        'browser': browser,
        'page': page,
        'pwFlg': pwFlg,
        'code_verifier': code_verifier
      }
      if (callback) {
        callback(accountData)
      } else {
        return accountData
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // SMS認証
  async verifyCode (accountData, verifyCode, callback) {
    // 変数
    // var browser = accountData.browser
    var page = accountData.page
    var code_verifier = accountData.code_verifier
    var pwFlg = accountData.pwFlg
    var postFlg = accountData.postFlg
    var kind = accountData.kind
    var url = 'verifyYahoo'
    // パラメータ取得
    var bodyHandle = await page.$('body');                                                                             
    var html = await page.evaluate(body => body.innerHTML, bodyHandle)
    // ログ
    this.screenshot(page, 'paypay_verify_1')
    this.saveHtml(page, 'paypay_verify_1')

    var params = this.getParamData(html)
    try {
      // 認証フラグ
      var verifyFlg = false
      
      page.on('response', async (response) => {
          // ログ
          this.log.error('Paypay-Debug:response')
          // レスポンス取得
          var location = ''
          if (response._headers.location) {
            location = response._headers.location
            this.log.error('Paypay-Debug:location:'+location)
          } else {
            // デバッグ
            const text = await response.text()
            this.log.error('Paypay-Debug:response:'+text)
          }
          // last 302
          if (location.indexOf('yj-paypay-fleamarket:/')>=0) {
            // ログ
            this.log.error('Paypay-Debug:302redirect last ')

            var code = this.getCode(location)
            var postData = 'grant_type=authorization_code&redirect_uri=yj-paypay-fleamarket:/'
            postData += '&client_id=' + params['ckey']
            postData += code
            postData += '&code_verifier=' + code_verifier
            await page.setRequestInterception(true)
            page.removeAllListeners('request')
            page.on('request', request => {
              const overrides = {}
              overrides.method = 'POST'
              overrides.headers = {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              }
              overrides.postData = postData
              request.continue(overrides)
            })
            // URLアクセス
            url = 'https://yjapp.auth.login.yahoo.co.jp/yconnect/v2/token'
            await page.goto(url)
            await page.waitFor(1000)
            //var preHandle = await page.$('pre')
            //html = await page.evaluate(pre => pre.innerHTML, preHandle)
            html = await page.content()
            html = await this.getJson(html)

            this.log.error('Paypay-Debug:html2:'+html)
            this.screenshot(page, 'paypay_verify_2')
            this.saveHtml(page, 'paypay_verify_2')

            let json = JSON.parse(html)
            if (!json.access_token) {
              if (callback) {
                callback(null)
              } else {
                return null
              }
            }
            // 返却データ作成
            accountData.token = json.access_token
            accountData.refresh_token = json.refresh_token
            var dt = new Date()
            accountData.created_at = this.formatDate(dt, 'YYYY-MM-DD HH24:MI:SS')
            var expires_in = json.expires_in
            dt.setSeconds(dt.getSeconds() + expires_in)
            accountData.expires_token = this.formatDate(dt, 'YYYY-MM-DD HH24:MI:SS')
            dt.setSeconds(dt.getSeconds() - expires_in)
            dt.setDate(dt.getDate() + 28)
            accountData.expires_refresh_token = this.formatDate(dt, 'YYYY-MM-DD HH24:MI:SS')
            // ユーザー情報取得
            page.removeAllListeners('request')
            page.on('request', request => {
              const overrides = {}
              overrides.method = 'GET'
              overrides.headers = {
                'authorization': 'Bearer ' + accountData.token
              }
              request.continue(overrides)
            })
            // URLアクセス
            url = 'https://sparkle.yahooapis.jp/v2/users/self?appid=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-&useCache=true&needPaypay=false&optional=status'
            await page.goto(url)
            await page.waitFor(1000)
            // preHandle = await page.$('pre');
            // html = await page.evaluate(pre => pre.innerHTML, preHandle)
            html = await page.content()
            html = await this.getJson(html)

            // デバッグ
            this.log.error('Paypay-Debug:html:'+html)
            this.screenshot(page, 'paypay_verify_3')
            this.saveHtml(page, 'paypay_verify_3')

            json = JSON.parse(html)
            if (!json.id) {
              if (callback) {
                callback(null)
              } else {
                return null
              }
            }
            this.log.error('Paypay-Debug:json.id:'+json.id)
            this.log.error('Paypay-Debug:json.nickname:'+json.nickname)
            // アカウントデータ
            delete accountData.browser
            delete accountData.page
            delete accountData.code_verifier
            accountData.site = 'p'
            accountData.userId = json.id
            accountData.name = json.nickname
            accountData.thumbnail = json.image.url
            this.log.error('Paypay-Debug:accountData.userId:'+accountData.userId)
            this.log.error('Paypay-Debug:accountData.name:'+accountData.name)
            verifyFlg = true
          }
      })
  
      // IDチェック
      if(pwFlg===true){
        await page.type('#password', verifyCode)
      } else if(postFlg===true) {
        // 種類を選択
        if(kind==0){
          await page.click('input[value="mail_address"]')
        }else{
          await page.click('input[value="post_code"]')
        }
        // データを登録
        await page.type('input[name="aq_answer"]', verifyCode)
      }else{
        await page.type('input[name="code"][placeholder="確認コード"]', verifyCode)
      }
      await page.waitFor(3000)
      this.screenshot(page, 'paypay_verify_4')
      this.saveHtml(page, 'paypay_verify_4')
      /*
      if(postFlg===true){
        // 追加情報の場合
        form = await page.$('form')
      }*/
      const loginButton = await page.$x("//button[contains(., 'ログイン')]")
      if (loginButton.length > 0) {
        await loginButton[0].evaluate(b => b.click())
        await page.waitFor(10000)
      }
      // デバッグ
      this.screenshot(page, 'paypay_verify_5')
      this.saveHtml(page, 'paypay_verify_5')
      // エラーかどうか判断
      html = await page.content()
      if (verifyFlg===true || html.indexOf('普段利用していない端末でのログインや、特殊なIPアドレスの利用、複数回のアクセスなどの場合に表示されます。')>=0){
        if (callback) {
          callback(accountData)
        } else {
          return accountData
        }
      } else {
        if (callback) {
          callback(null)
        } else {
          return null
        }
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // 追加情報で認証
  async postDataConfirm (accountData, kind, data, callback) {
    // 変数
    var page = accountData.page
    var code_verifier = accountData.code_verifier
    var url = 'verifyYahoo'
    // パラメータ取得
    var bodyHandle = await page.$('body');
    var html = await page.evaluate(body => body.innerHTML, bodyHandle)
    // ログ
    this.screenshot(page, 'paypay_postData_1')
    this.saveHtml(page, 'paypay_postData_1')

    var params = this.getParamData(html)
    try {
      // 認証フラグ
      var verifyFlg = false
      page.on('response', async (response) => {
          // ログ
          this.log.error('Paypay-Debug:response')
          // レスポンス取得
          var location = ''
          if (response._headers.location) {
            location = response._headers.location
            this.log.error('Paypay-Debug:location:'+location)
          } else {
            // デバッグ
            const text = await response.text()
            this.log.error('Paypay-Debug:response:'+text)
          }
          // last 302
          if (location.indexOf('yj-paypay-fleamarket:/')>=0) {
            // ログ
            this.log.error('Paypay-Debug:302redirect last ')

            var code = this.getCode(location)
            var postData = 'grant_type=authorization_code&redirect_uri=yj-paypay-fleamarket:/'
            postData += '&client_id=' + params['ckey']
            postData += code
            postData += '&code_verifier=' + code_verifier
            await page.setRequestInterception(true)
            page.removeAllListeners('request')
            page.on('request', request => {
              const overrides = {}
              overrides.method = 'POST'
              overrides.headers = {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              }
              overrides.postData = postData
              request.continue(overrides)
            })
            // URLアクセス
            url = 'https://yjapp.auth.login.yahoo.co.jp/yconnect/v2/token'
            await page.goto(url)
            await page.waitFor(1000)
            //var preHandle = await page.$('pre')
            //html = await page.evaluate(pre => pre.innerHTML, preHandle)
            html = await page.content()
            html = await this.getJson(html)

            this.log.error('Paypay-Debug:html2:'+html)
            this.screenshot(page, 'paypay_postData_2')
            this.saveHtml(page, 'paypay_postData_2')

            let json = JSON.parse(html)
            if (!json.access_token) {
              if (callback) {
                callback(null)
              } else {
                return null
              }
            }
            // 返却データ作成
            accountData.token = json.access_token
            accountData.refresh_token = json.refresh_token
            var dt = new Date()
            accountData.created_at = this.formatDate(dt, 'YYYY-MM-DD HH24:MI:SS')
            var expires_in = json.expires_in
            dt.setSeconds(dt.getSeconds() + expires_in)
            accountData.expires_token = this.formatDate(dt, 'YYYY-MM-DD HH24:MI:SS')
            dt.setSeconds(dt.getSeconds() - expires_in)
            dt.setDate(dt.getDate() + 28)
            accountData.expires_refresh_token = this.formatDate(dt, 'YYYY-MM-DD HH24:MI:SS')
            // ユーザー情報取得
            page.removeAllListeners('request')
            page.on('request', request => {
              const overrides = {}
              overrides.method = 'GET'
              overrides.headers = {
                'authorization': 'Bearer ' + accountData.token
              }
              request.continue(overrides)
            })
            // URLアクセス
            url = 'https://sparkle.yahooapis.jp/v2/users/self?appid=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-&useCache=true&needPaypay=false&optional=status'
            await page.goto(url)
            await page.waitFor(1000)
            // preHandle = await page.$('pre');
            // html = await page.evaluate(pre => pre.innerHTML, preHandle)
            html = await page.content()
            html = await this.getJson(html)

            // デバッグ
            this.log.error('Paypay-Debug:html:'+html)
            this.screenshot(page, 'paypay_postData_3')
            this.saveHtml(page, 'paypay_postData_3')

            json = JSON.parse(html)
            if (!json.id) {
              if (callback) {
                callback(null)
              } else {
                return null
              }
            }
            this.log.error('Paypay-Debug:json.id:'+json.id)
            this.log.error('Paypay-Debug:json.nickname:'+json.nickname)
            // アカウントデータ
            delete accountData.browser
            delete accountData.page
            delete accountData.code_verifier
            accountData.site = 'p'
            accountData.userId = json.id
            accountData.name = json.nickname
            accountData.thumbnail = json.image.url
            this.log.error('Paypay-Debug:accountData.userId:'+accountData.userId)
            this.log.error('Paypay-Debug:accountData.name:'+accountData.name)
            // ブラウザクローズ
            // await browser.close()
            verifyFlg = true
            /*
            if (callback) {
              callback(accountData)
            } else {
              return accountData
            }
            */
          }
      })
      // 種類を選択
      if(kind==0){
        await page.click('input[value="mail_address"]')
      }else{
        await page.click('input[value="post_code"]')
      }
      // データを登録
      await page.type('input[name="aq_answer"]', data)
      // クリック
      await page.waitFor(1000)
      var form = await page.$('form')
      var nextButton = await form.$('button[type=submit]')
      await nextButton.click()
      await page.waitFor(10000)
      // デバッグ
      this.screenshot(page, 'paypay_postData_4')
      this.saveHtml(page, 'paypay_postData_4')
      // エラーかどうか判断
      if (verifyFlg===false) {
        // ブラウザクローズ
        // await browser.close()
        if (callback) {
          callback(null)
        } else {
          return null
        }
      } else {
        if (callback) {
          callback(accountData)
        } else {
          return accountData
        }
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // htmlからjsonを取得
  async getJson(html){
    var sidx = 0
    var eidx = 0
    sidx = html.indexOf('>{', sidx) + 1
    eidx = html.indexOf('}<', sidx) + 1
    const json = html.substring(sidx, eidx)
    return json
  }
  // Token再取得
  async updateToken (account_id, flg) {
    try {
      // Accountを取得
      var account = await util.getAccount(account_id)
      if (!account) {
        this.log.error('アカウントが見つかりません: ' + account_id)
        return null
      }
      // Token期限を確認
      var dt = new Date()
      var now_date = this.formatDate(dt, 'YYYY-MM-DD HH24:MI:SS')
      if (!flg && account.expires_token > now_date) {
        return account
      }
      // パラメータ作成
      var formData = {}
      formData.client_id = 'dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-'
      formData.grant_type = 'refresh_token'
      formData.refresh_token = account.refresh_token
      var url = 'https://yjapp.auth.login.yahoo.co.jp/yconnect/v2/token'
      const optionsExhibition = {
        url: url,
        method: 'post',
        headers: {
          'user-agent': consts.rakuma_user_agent,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        form: formData
      }
      // Token取得
      var html = ''
      var status = '200'
      try {
        html = await this.httpRequest('post', url, formData, optionsExhibition.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      let json = JSON.parse(html)
      if (!json.access_token) {
        return null
      } else {
        // DBを更新
        account.token = json.access_token
        dt.setSeconds(dt.getSeconds() + 43200)
        account.expires_token = this.formatDate(dt, 'YYYY-MM-DD HH24:MI:SS')
        var accountDB = util.getDatastore('account.db')
        await accountDB.update({_id: account._id}, {$set: account})
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // 出品
  async exhibition (exhibitionData, callback) {
    var url = ''
    try {
      // Accountを取得
      var account = await util.getAccount(exhibitionData.account_id)
      if (!account) {
        this.log.error('アカウントが存在しません。:' + exhibitionData.account_id)
        return null
      }
      // Itemを取得
      var itemDB = util.getDatastore('items.db')
      var item = await itemDB.findOne({ _id: exhibitionData.item_id })
      if (!item) {
        this.log.error('アイテムが存在しません。:' + exhibitionData.item_id)
        return null
      }
      // 画像の存在チェック
      for(var p=1; p<=10; p++){
        if (item['image'+p]) {
          try {
            const imagePath = util.getImgPath(item['image'+p])
            // 画像ファイルの存在確認はIPC経由で実行
            const imageExists = await window.electronAPI.fileExists(imagePath)
            if (!imageExists) {
              this.log.error('画像' + p + 'が存在しません。:' + exhibitionData.item_id + ' path:' + imagePath)
          return null
            }
          } catch (error) {
            this.log.error('画像' + p + 'のパスチェックエラー。:' + exhibitionData.item_id + ' error:' + error.message)
            return null
          }
        }
      }
      // 画像リスト
      var imageList = []
      for(var r=1; r<=10; r++){
        if (item['image'+r]) {
          imageList.push(item['image'+r])
        }
      }
      // 画像分繰り返し
      // var jar = request.jar() // IPCに置き換え
      var imageUrl = []
      for (var i = 0; i < imageList.length; i++) {
        try {
        // formData
        let path = await image.compositeForExcel(imageList[i])
          // 画像ファイルの存在確認はIPC経由で実行
          const pathExists = await window.electronAPI.fileExists(path)
          if (!pathExists) {
            this.log.error('画像ファイルが存在しません: ' + path)
            return null
          }
          // ファイルアップロードはIPC経由で実行
          const formData = {
            'need_thumbnail': '1',
            'file': {
              path: path,
                filename: 'files[0]',
                contentType: 'image/jpg'
            }
        }
        url = 'https://image.auctions.yahooapis.jp/paypayflea/v1/images'
          // ファイルアップロードはIPC経由で実行
        var html = ''
        var status = '200'
          try {
            html = await window.electronAPI.uploadImage(url, formData, {
              'authorization': 'Bearer ' + account.token
          })
          } catch (err) {
            status = err.status || 500
            html = ''
          }
        this.log.request('access info:url->' + url + ' status->' + status)
        var json = JSON.parse(html)
        if (!json) {
          return null
        } else {
          var images = json.images
          for (var s=0; s<images.length; s++) {
            var uri = images[s].url.replace(/\//g,'\\/')
            imageUrl.push(uri)
          }
          }
        } catch (error) {
          this.log.error('画像アップロードエラー: ' + error.message)
          return null
        }
      }

      // 出品
      var imageJson = ''
      for (var t=0; t<imageUrl.length; t++) {
        if (t!==0) {
          imageJson += ','
        }
        imageJson += '"' + imageUrl[t] + '"'
      }
      // 商品説明の改行を変換
      item.desc = item.desc.replace(/\r?\n/g, '\\n')
      while (item.desc.indexOf('\\n\\n\\n') >= 0) {
        item.desc = item.desc.replace(/\\n\\n\\n/g, '\\n\\n')
      }
      // 商品説明のタブを変換
      item.desc = item.desc.replace(/\t/g, '')
      // 商品説明の"を変換
      item.desc = item.desc.replace(/"/g,'\\"')

      // 出品パラメータ作成
      var jsonData = ''
      const ids = item.paypayCategoryId.split('>')
      jsonData += '"productCategoryId":' + Number(ids[ids.length-1])
      jsonData += ', "shipVendor":"' + item.paypay_shipping_methods + '"'
      jsonData += ', "images":[' + imageJson + ']'
      jsonData += ', "shippingPref":"' + item.paypay_shipping_from_areas + '"'
      jsonData += ', "price":' + item.price
      jsonData += ', "title":"' + item.name + '"'
      // サイズ
      if (item.paypaySize) {
        var specs = '[{'+
          '"id":' + item.paypaySpecsId +
          ', "specRefs":[' + Number(item.paypaySize) + ']' +
          '}]'
        jsonData += ', "specs":' + specs
      } else {
        jsonData += ', "specs":[]'
      }
      // ブランド
      if (item.paypayBrand){
        jsonData += ', "brandId":' +item.paypayBrand
      }

      jsonData += ', "timeToShip":"' +item.paypay_shipping_durations + '"'
      // jsonData += ', "preview":false'
      jsonData += ', "noPriceItem":false'
      jsonData += ', "description":"' + item.desc + '"'
      jsonData += ', "itemStatus":"' + item.paypayCondition + '"'
      jsonData += ', "hashtags":[]'
      jsonData = '{' + jsonData + '}'
      const uuid = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      url = 'https://sparkle.yahooapis.jp/item/v2/items'
      const optionsExhibition = {
        url: url,
        // jar: jar, // IPCに置き換え
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'user-agent': consts.paypay_app_user_agent,
          'os': consts.paypay_os,
          'accept': '*/*',
          // 'x-bcookie': bcookie,
          'accept-language': 'ja-jp',
          'accept-encoding': 'gzip, deflate, br',
          'app-version': consts.paypay_app_version,
          'os-version': consts.paypay_os_version,
          'x-uuid': uuid,
          'authorization': 'Bearer ' + account.token
        },
        body: jsonData
      }
      // 出品
      html = ''
      status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, optionsExhibition.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      json = JSON.parse(html)
      if (!json.id) {
        this.log.error('出品できませんでした。item_id:' + item._id + ' item_name:' + item.name)
        return null
      }
      // 商品IDを取得
      let exhibitionItemId = json.id
      // 値を返却
      if (callback) {
        callback(exhibitionItemId)
      } else {
        return exhibitionItemId
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
      return null
    }
  }
  // 出品中商品の取得
  async getOnSale (accountId, callback) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // データ取得
      var onSaleList = []
      let offset = 0
      url = `https://sparkle.yahooapis.jp/v1/users/self/items/selling?offset=${offset}&limit=100`
      let itemCount = await this.requestOnSale(url, onSaleList, consts.paypay_app_user_agent, account)
      offset += 100
      while (itemCount >= offset) {
        url = `https://sparkle.yahooapis.jp/v1/users/self/items/selling?offset=${offset}&limit=100`
        await this.requestOnSale(url, onSaleList, consts.paypay_app_user_agent, account)
        offset += 100
      }
      if (callback) {
        callback(onSaleList)
      } else {
        return onSaleList
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // onSaleリクエスト
  async requestOnSale(url, onSaleList, userAgent, account){
    // オプション設定
    const options = {
      url: url,
      method: 'get',
      headers: {
        'user-agent': userAgent,
        'authorization': 'Bearer ' + account.token
      }
    }
    // リクエスト
    let html = ''
    let status = '200'
    try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
    } catch (err) {
      status = err.status || 500
      html = ''
    }
    this.log.request('access info:url->' + url + ' status->' + status)
    if (!html) {
      return null
    }
    let json = JSON.parse(html)
    if (!json.items) {
      return null
    }
    // データ追加
    var jsonItems = json.items
    for (var i = 0; i < jsonItems.length; i++) {
      // OPEN以外は不要
      if (jsonItems[i].sellStatus !== 'OPEN') {
        continue
      }
      // サイト
      jsonItems[i].site = 'p'
      jsonItems[i].site_name = 'PayPay'
      // 画像
      jsonItems[i].img_url = jsonItems[i].image.url
      // 商品id
      jsonItems[i].item_id = jsonItems[i].id
      // 商品名
      jsonItems[i].item_name = jsonItems[i].title
      // アカウントIDを付与
      jsonItems[i].account_id = account._id
      // アカウント名を付与
      jsonItems[i].screen_name = account.name
      // 購入申請を取得
      jsonItems[i].request = '-'
      // いいね数
      jsonItems[i].like_count = jsonItems[i].likeCount
      // コメント数
      jsonItems[i].comment_count = jsonItems[i].request
      // 日付を変更
      var exhibitionDt = new Date(jsonItems[i].openTime)
      jsonItems[i].created_at = exhibitionDtthis.formatDate(dt, 'YYYY-MM-DD HH24:MI:SS')
      onSaleList.push(jsonItems[i])
    }
    // 数返却
    return json.totalResultsAvailable
  }
  // 出品取消
  async deleteOnSale (accountId, itemId, callback) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // 取消
      const uuid = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      url = 'https://sparkle.yahooapis.jp/v1/items/' + itemId
      const options = {
        url: url,
        method: 'delete',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'os': consts.paypay_os,
          'accept': '*/*',
          // 'x-bcookie': bcookie,
          'accept-language': 'ja-jp',
          'accept-encoding': 'gzip, deflate, br',
          'app-version': consts.paypay_app_version,
          'os-version': consts.paypay_os_version,
          'x-uuid': uuid,
          'authorization': 'Bearer ' + account.token
        }
      }

      // リクエスト
      let html = ''
      let status = '200'
      try {
        html = await this.httpRequest('delete', url, null, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      var result = null
      if ( html === '{}') {
        result = true
      }
      if (callback) {
        callback(result)
      } else {
        return result
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // 取消チェック
  async checkCancel (accountId, itemId, cancelLikeFlg, cancelCommentFlg) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // オプション設定
      const uuid = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      url = 'https://sparkle.yahooapis.jp/item/v2/items/' + itemId + '?appid=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-'
      const options = {
        url: url,
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'x-uuid': uuid
        }
      }
      // リクエスト
      let html = ''
      let status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      if (!json.id) {
        return null
      }
      // いいね！チェック
      var likeCount = json.likeCount
      // いいねがあったら取り消さない
      if (cancelLikeFlg !== 'true' && likeCount !== 0) {
        return false
      }
      // コメントチェック
      var commentCount = json.questionCount
      // コメントがあったら取り消さない
      if (cancelCommentFlg !== 'true' && commentCount !== 0) {
        return false
      }
      return true
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // 金額変更
  async changePrice (accountId, itemId, changePrice, callback) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // var jar = request.jar() // IPCに置き換え
      // 商品情報取得 //
      // オプション設定
      const uuid = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      url = 'https://sparkle.yahooapis.jp/item/v2/items/' + itemId + '?appid=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-'
      const options = {
        url: url,
        // jar: jar, // IPCに置き換え
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'x-uuid': uuid
        }
      }
      // リクエスト
      let html = ''
      let status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      if (!json.id) {
        return null
      }
      // 画像用JSON
      var imageJson = ''
      for (var i=0 ; i<json.images.length; i++) {
        if (i!==0) {
          imageJson += ','
        }
        var uri = json.images[i].url.replace(/\//g,'\\/')
        imageJson += '"' + uri + '"'
      }
      // SPECS-json
      var specsJson = ''
      for (var t=0; t<json.specs.length; t++) {
        if (t==0) {
          specsJson += '{'
        }else{
          specsJson += ',{'
        }
        specsJson += '"id":' + json.specs[t].id + ',"specRefs":['
        for (var s=0; s<json.specs[t].specRefs.length; s++) {
          if (s!==0) {
            specsJson += ','
          }
          specsJson += json.specs[t].specRefs[s].id
        }
        specsJson += ']'
        specsJson += '}'
      }
      // ハッシュタグ
      var hashtagJson = ''
      for (var h=0; h<json.hashtags.length; h++) {
        if (h!==0) {
          hashtagJson += ','
        }
        hashtagJson += '"' + json.hashtags[h] + '"'
      }
      // 商品説明の改行を変換
      var desc = json.description.replace(/\r?\n/g, '\\n')
      while (desc.indexOf('\\n\\n\\n') >= 0) {
        desc = desc.replace(/\\n\\n\\n/g, '\\n\\n')
      }
      // 金額を変更
      var price = json.price + changePrice
      // 商品用JSON
      var jsonData = '{' +
          '"title":"' + json.title + '"' +
          ', "description":"' + desc + '"' +
          ', "price":' + price +
          ', "images":[' + imageJson + ']' +
          ', "productCategoryId":' + json.productCategory.id +
          ', "shipVendor":"' + json.deliveryMethod.id + '"' +
          ', "shippingPref":"' + json.location + '"' +
          ', "timeToShip":"' + json.deliverySchedule.id + '"' +
          ', "preview":false' +
          ', "noPriceItem":false' +
          ', "itemStatus":"' + json.condition.key.toUpperCase() + '"'
          if (json.brand) {
            jsonData += ', "brandId":' + json.brand.id
          }
          jsonData += ', "specs":[' + specsJson + ']'
          jsonData += ', "hashtags":[' + hashtagJson + ']' +
          '}'
      // 金額変更
      url = 'https://sparkle.yahooapis.jp/item/v2/items/' + itemId
      const optionsExhibition = {
        url: url,
        // jar: jar, // IPCに置き換え
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'put',
        headers: {
          'content-type': 'application/json',
          'user-agent': consts.paypay_app_user_agent,
          'x-uuid': uuid,
          'authorization': 'Bearer ' + account.token
        },
        body: jsonData
      }
      // 変更
      html = ''
      status = '200'
      try {
        html = await this.httpRequest('put', url, jsonData, optionsExhibition.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      json = JSON.parse(html)
      var result = true
      if (!json.id) {
        this.log.error('金額変更できませんでした。item_id:' + itemId + ' item_name:' + json.title)
        result = false
      }
      // 値を返却
      if (callback) {
        callback(result)
      } else {
        return result
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // 質問者取得 V2対応済み
  async getQuestioners (accountId, itemId, callback) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // コメント取得 //
      const uuid = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      url = 'https://sparkle.yahooapis.jp/v1/items/' + itemId + '/contacts/questioners?'
      const options = {
        url: url,
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'x-uuid': uuid
        }
      }
      // リクエスト
      let html = ''
      let status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      if (!json) {
        return null
      }
      var questionerList = []
      for (var i = 0; i < json.length; i++) {
        var questioner = {}
        questioner.id = json[i].questioner.id
        questioner.nickname = json[i].questioner.nickname
        questioner.latestComment = json[i].latestComment
        if (questioner.latestComment.length >= 20) {
          questioner.latestComment = questioner.latestComment.slice(0,20) + '…'
        }
        var latestDate = new Date(json[i].latestDate)
        questioner.latestDate = this.formatDate(latestDate, 'YYYY-MM-DD HH24:MI:SS')
        questionerList.push(questioner)
      }
      if (callback) {
        callback(questionerList)
      } else {
        return questionerList
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // コメント取得 V2対応済み
  async getComments (accountId, itemId, userId, callback) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // コメント取得 //
      const uuid = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      url = 'https://sparkle.yahooapis.jp/v1/items/' + itemId + '/contacts/questioners/' + userId + '/messages?'
      const options = {
        url: url,
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'x-uuid': uuid
        }
      }
      // リクエスト
      let html = ''
      let status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      if (!json) {
        return null
      }
      var commentList = []
      for (var i = 0; i < json.messages.length; i++) {
        var comment = {}
        comment.sender = json.messages[i].sender
        comment.comment = json.messages[i].comment
        var date = new Date(json.messages[i].date)
        comment.date = this.formatDate(date, 'YYYY-MM-DD HH24:MI:SS')
        commentList.push(comment)
      }
      if (callback) {
        callback(commentList)
      } else {
        return commentList
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // コメント送信 V2対応済み
  async addComment (accountId, itemId, userId, comment, callback) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // コメント作成
      comment = comment.replace(/\r?\n/g, '\\n')
      var jsonData = '{"message" :"' + comment + '"}'
      // コメント追加 //
      const uuid = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      url = 'https://sparkle.yahooapis.jp/v1/items/' + itemId + '/contacts/questioners/' + userId + '/messages'
      const options = {
        url: url,
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'x-uuid': uuid
        },
        body: jsonData
      }
      // リクエスト
      let html = ''
      let status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      if (!json) {
        return null
      }
      if (callback) {
        callback(true)
      } else {
        return true
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // 取引中商品の取得
  async getTrading (accountId, callback) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // オプション設定
      url = 'https://sparkle.yahooapis.jp/v1/users/self/items/sold?offset=0&limit=100'
      const options = {
        url: url,
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token
        }
      }
      // リクエスト
      let html = ''
      let status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      if (!json.items) {
        return null
      }
      var jsonItems = json.items
      var tradingList = []
      for (var i = 0; i < jsonItems.length; i++) {
        // SOLD以外は不要
        if (jsonItems[i].sellStatus !== 'SOLD') {
          continue
        }
        // サイト
        jsonItems[i].site = 'p'
        jsonItems[i].site_name = 'PayPay'
        // 画像
        jsonItems[i].img_url = jsonItems[i].image.url
        // 商品id
        jsonItems[i].item_id = jsonItems[i].id
        // 商品名
        jsonItems[i].item_name = jsonItems[i].title
        // アカウントIDを付与
        jsonItems[i].account_id = account._id
        // アカウント名を付与
        jsonItems[i].screen_name = account.name
        // 状況
        jsonItems[i].status = '-'
        // 日付を変更
        var openDt = new Date(jsonItems[i].openTime)
        jsonItems[i].created_at = this.formatDate(openDt, 'YYYY-MM-DD HH24:MI:SS')
        tradingList.push(jsonItems[i])
      }
      if (callback) {
        callback(tradingList)
      } else {
        return tradingList
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // 取引メッセージを取得
  async getMessages (exhibition, callback) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(exhibition.account_id)
      if (!account) {
        return null
      }
      // 商品詳細
      const uuid = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      url = 'https://sparkle.yahooapis.jp/item/v2/items/' + exhibition.item_id + '?appid=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-'
      var options = {
        url: url,
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'x-uuid': uuid
        }
      }
      // リクエスト
      var html = ''
      var status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      var json = JSON.parse(html)
      const buyerId = json.buyerId

      // 取引メッセージ取得
      url = 'https://sparkle-secure.yahooapis.jp/v1/items/' + exhibition.item_id + '/message?sellerId=' + account.userId + '&buyerId=' + buyerId
      options = {
        url: url,
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token
        }
      }
      // リクエスト
      status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      json = JSON.parse(html)
      if (!json.thread) {
        return null
      }
      var messageList = []
      for (var i=0 ; i<json.thread.length ; i++) {
        var message = {}
        if (json.thread[i].userId === account.userId) {
          message.user_name = '出品者'
        } else {
          message.user_name = '購入者'
        }
        message.message = json.thread[i].text
        var dateDt = new Date(json.thread[i].date)
        message.datetime = this.formatDate(dateDt, 'YYYY-MM-DD HH24:MI:SS')
        // リストに追加
        messageList.push(message)
      }
      if (callback) {
        callback(messageList)
      } else {
        return messageList
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // 取引メッセージの送信
  async sendTradingMessage (exhibition, message) {
    var url = ''
    // var jar = request.jar() // IPCに置き換え
    try {
      // アカウントを取得
      var account = await util.getAccount(exhibition.account_id)
      if (!account) {
        return null
      }
      // 商品詳細
      const uuid = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      url = 'https://sparkle.yahooapis.jp/item/v2/items/' + exhibition.item_id + '?appid=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-'
      var options = {
        url: url,
        // jar: jar, // IPCに置き換え
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'x-uuid': uuid
        }
      }
      // リクエスト
      var html = ''
      var status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      var json = JSON.parse(html)
      const buyerId = json.buyerId
      // 取引画面
      url = 'https://sparkle-secure.yahooapis.jp/v1/items/' + exhibition.item_id + '/seller?itemId=' + exhibition.item_id + '&sellerId=' + account.userId + '&buyerId=' + buyerId
      options = {
        url: url,
        // jar: jar, // IPCに置き換え
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'os': consts.paypay_os,
          'x-uuid': uuid
        }
      }
      // リクエスト
      html = ''
      status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      json = JSON.parse(html)
      var thumbnailImageUrl = json.item.thumbnailImageUrl.replace(/\//g,'\\/')
      message = message.replace(/\r?\n/g, '\\n')
      // 取引データ作成
      var jsonData = '{"itemName":"' + json.item.title + '"' +
                      ',"orderId":"' + json.order.id + '"' +
                      ',"sellerId":"' + account.userId + '"' +
                      ',"buyerId":"' + buyerId + '"' +
                      ',"itemImageUrl":"' + thumbnailImageUrl + '"' +
                      ',"text":"' + message + '"}'

      // 取引メッセージ送信
      url = 'https://sparkle-secure.yahooapis.jp/v1/items/' + exhibition.item_id + '/message'
      options = {
        url: url,
        // jar: jar, // IPCに置き換え
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'os': consts.paypay_os,
          'x-uuid': uuid
        },
        body: jsonData
      }
      // リクエスト
      html = ''
      status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      return true
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
      return null
    }
  }
  // 配送方法を取得
  async getPostMethod (exhibition, callback) {
    var url = ''
    var returnData = {}
    try {
      // アカウントを取得
      var account = await util.getAccount(exhibition.account_id)
      if (!account) {
        return null
      }
      // 商品詳細
      const uuid = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      url = 'https://sparkle.yahooapis.jp/item/v2/items/' + exhibition.item_id + '?appid=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-'
      var options = {
        url: url,
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'os': consts.paypay_os,
          'x-uuid': uuid
        }
      }
      // リクエスト
      var html = ''
      var status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      var json = JSON.parse(html)
      returnData.buyerId = json.buyerId
      returnData.vendorId = json.deliveryMethod.id
      returnData.vendorName = json.deliveryMethod.name
      if (callback) {
        callback(returnData)
      } else {
        return returnData
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // 配送コードの取得
  async getQrCode (exhibition, postData, callback) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(exhibition.account_id)
      if (!account) {
        return null
      }
      // 商品詳細
      const uuid = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      url = 'https://sparkle-secure.yahooapis.jp/v1/items/' + exhibition.item_id + '/seller?itemId=' + exhibition.item_id + '&sellerId=' + account.userId + '&buyerId=' + postData.buyerId
      var options = {
        url: url,
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'os': consts.paypay_os,
          'x-uuid': uuid
        }
      }
      // リクエスト
      var html = ''
      var status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      var json = JSON.parse(html)
      // POSTデータ作成
      var jsonData = '{"orderId":"' + json.order.id + '"' +
                      ',"sellerId":"' + account.userId + '"' +
                      ',"buyerId":"' + postData.buyerId + '"' +
                      ',"postage":{' +
                      '"vendor":"' + json.order.vendor + '"' +
                      ',"method":"' + postData.method + '"' +
                      ',"contentsGroupName":"' + json.order.contentsGroupName + '"}' +
                      '}'
      // QRコード取得
      url = 'https://sparkle-secure.yahooapis.jp/v1/items/' + exhibition.item_id + '/shipcode'
      options = {
        url: url,
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'os': consts.paypay_os,
          'x-uuid': uuid
        },
        body: jsonData
      }
      // リクエスト
      html = ''
      status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      json = JSON.parse(html)
      var qrList = []
      for (var i=0; i<json.shipCodeImageList.length ; i++){
        var qr = {}
        const from = consts.post_from.filter((item) => { return (item.id === json.shipCodeImageList[i].from) })
        qr.from = from[0].name
        if (json.shipCodeImageList[i].image === '') {
          qr.img = ''
        } else {
          qr.img = 'data:image/png;base64,' + json.shipCodeImageList[i].image
        }
        qrList.push(qr)
      }
      if (callback) {
        callback(qrList)
      } else {
        return qrList
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // 発送通知の送信
  async shipped (exhibition) {
    var url = ''
    // var jar = request.jar() // IPCに置き換え
    try {
      // アカウントを取得
      var account = await util.getAccount(exhibition.account_id)
      if (!account) {
        return null
      }
      // 商品詳細
      const uuid = this.get_randam_str(8) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(4) + '-' + this.get_randam_str(12);
      url = 'https://sparkle.yahooapis.jp/item/v2/items/' + exhibition.item_id + '?appid=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-'
      var options = {
        url: url,
        // jar: jar, // IPCに置き換え
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'os': consts.paypay_os,
          'x-uuid': uuid
        }
      }
      // リクエスト
      var html = ''
      var status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      var json = JSON.parse(html)
      const buyerId = json.buyerId
      // 取引画面
      url = 'https://sparkle-secure.yahooapis.jp/v1/items/' + exhibition.item_id + '/seller?itemId=' + exhibition.item_id + '&sellerId=' + account.userId + '&buyerId=' + buyerId
      options = {
        url: url,
        // jar: jar, // IPCに置き換え
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'os': consts.paypay_os,
          'x-uuid': uuid
        }
      }
      // リクエスト
      html = ''
      status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      json = JSON.parse(html)
      var thumbnailImageUrl = json.item.thumbnailImageUrl.replace(/\//g,'\\/')
      // 取引データ作成
      var jsonData = '{"itemName":"' + json.item.title + '"' +
                      ',"orderId":"' + json.order.id + '"' +
                      ',"sellerId":"' + account.userId + '"' +
                      ',"buyerId":"' + buyerId + '"' +
                      ',"itemImageUrl":"' + thumbnailImageUrl + '"}'
      // 発送通知を送信
      url = 'https://sparkle-secure.yahooapis.jp/v1/items/' + exhibition.item_id + '/shipping'
      options = {
        url: url,
        // jar: jar, // IPCに置き換え
        // proxy: 'http://localhost:8888/',
        // ca: fs.readFileSync('/Users/shinya/Documents/cer.pem'),
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'user-agent': consts.paypay_app_user_agent,
          'authorization': 'Bearer ' + account.token,
          'os': consts.paypay_os,
          'x-uuid': uuid
        },
        body: jsonData
      }
      // リクエスト
      html = ''
      status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      return true
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
      return null
    }
  }
  // カテゴリー取得
  async getCategory ( id ) {
    var url = ''
    try{
      if (!id) {
        id = '1'
      }
      // オプション設定
      url = 'https://sparkle.yahooapis.jp/v1/categories/' + id + '/children?appid=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-'
      const options = {
        url: url,
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent
        }
      }
      // リクエスト
      let html = ''
      let status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      let json = JSON.parse(html)
      return json
    } catch (error) {
      this.log.error('not found paypay category id=' + id)
    }
  }
  // サイズ取得
  async getSize ( id ) {
    var url = ''
    try{
      if (!id) {
        id = '1'
      }
      // オプション設定
      url = 'https://sparkle.yahooapis.jp/v1/categories/' + id + '?appid=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-'
      const options = {
        url: url,
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent
        }
      }
      // リクエスト
      let html = ''
      let status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      var json = JSON.parse(html)
      return json
    } catch (error) {
      this.log.error('not found paypay category id=' + id)
    }
  }
  // ブランド取得
  async getBrand (id) {
    var url = ''
    try{
      // オプション設定
      // url = 'https://sparkle.yahooapis.jp/v1/brands?appid=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-'
      url = 'https://sparkle.yahooapis.jp/v1/brands/groups/all?appid=dj00aiZpPXh3SHJEZkRzd0ZNVSZzPWNvbnN1bWVyc2VjcmV0Jng9N2Y-&genreCategoryId=' + id
      const options = {
        url: url,
        method: 'get',
        headers: {
          'user-agent': consts.paypay_app_user_agent
        }
      }
      // リクエスト
      let html = ''
      let status = '200'
      try {
        html = await this.httpRequest('post', url, jsonData, options.headers)
      } catch (err) {
        status = err.status || 500
        html = ''
      }
      this.log.request('access info:url->' + url + ' status->' + status)
      let json = JSON.parse(html)
      for (var i=0 ; i<json.length ; i++) {
        json[i].id = String(json[i].id)
      }
      return json
    } catch (error) {
      this.log.error('not found paypay brand')
    }
  }
  // code_verifier
  get_code_verifier() {
    // BufferはIPC経由で実行
    return window.electronAPI.generateCodeVerifier()
  }
  // code_challenge
  get_code_challenge(str) {
    // SHA256ハッシュはIPC経由で実行
    return window.electronAPI.generateCodeChallenge(str)
  }
  // ランダム文字列生成
  get_randam_str (count) {
    // ランダム文字列生成はIPC経由で実行
    return window.electronAPI.generateRandomString(count)
  }
  // HTMLから必要なパラメータを取得
  getParamData (html) {
    try{
      // HTMLパラメータ抽出はIPC経由で実行
      return window.electronAPI.extractHtmlParams(html)
    } catch (error) {
      this.log.request('access error:' + error.stack)
      return {}
    }
  }
  // URLからcodeを取得
  getCode (url) {
    // URLコード抽出はIPC経由で実行
    return window.electronAPI.extractCodeFromUrl(url)
  }
}
