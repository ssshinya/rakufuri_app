import consts from './consts'
import { Log } from './log'
import util from './utilty'
import image from './image'

export class RakumaApi {
  constructor () {
    this.log = new Log()
  }
  // カテゴリーとサイズ取得
  async getInitialData (callback) {
    // 返却リスト
    var category1List = []
    var category2List = []
    var category3List = []
    var sizeList = []
    var initialData = {}
    var url = ''
    try {
      // オプション設定
      url = 'https://api.fril.jp/api/v3/initial_data'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      // データ取得
      var categories = json.categories
      var keys = Object.keys(categories)
      for (var key in keys) {
        var parentId = categories[key].parent_id
        var childIds = categories[key].child_ids
        // 第1階層
        if (parentId === 0) {
          // 配列の初期化
          var category1Data = {}
          // 配列のkeyに対し値を設定する
          category1Data.id = String(categories[key].id)
          category1Data.name = categories[key].name
          category1List.push(category1Data)
        // 第2階層
        } else if (parentId !== 0 && childIds.length > 0) {
          // 配列の初期化
          var category2Data = {}
          // 配列のkeyに対し値を設定する
          category2Data.id = String(categories[key].id)
          category2Data.name = categories[key].name
          category2Data.parentCategoryId = String(categories[key].parent_id)
          category2List.push(category2Data)
        // 第3階層
        } else if (parentId !== 0 && childIds.length <= 0) {
          // 配列の初期化
          var category3Data = {}
          // 配列のkeyに対し値を設定する
          category3Data.id = String(categories[key].id)
          category3Data.name = categories[key].name
          category3Data.parentCategoryId = String(categories[key].parent_id)
          var sizeType = categories[key].size_group_id
          if (sizeType !== '99') {
            category3Data.sizeType = sizeType
          }
          category3List.push(category3Data)
        }
      }
      // 配列に積み直し
      initialData.category1 = category1List
      initialData.category2 = category2List
      initialData.category3 = category3List
      // サイズを取得
      var sizeGroups = json.size_groups
      var sizeKeys = Object.keys(sizeGroups)
      // サイズグループ
      for (var sizeKey in sizeKeys) {
        var type = sizeGroups[sizeKey].id
        var sizeTypes = sizeGroups[sizeKey].size_types
        var sizeTypesKeys = Object.keys(sizeTypes)
        // サイズタイプ
        for (var sizeTypesKey in sizeTypesKeys) {
          var name = sizeTypes[sizeTypesKey].name
          if (name === 'デフォルト') {
            var sizes = sizeTypes[sizeTypesKey].sizes
            // サイズ
            var sizesKeys = Object.keys(sizes)
            for (var sizesKey in sizesKeys) {
              var sizeModel = {}
              sizeModel.id = String(sizes[sizesKey].id)
              sizeModel.name = sizes[sizesKey].name
              sizeModel.type = type
              sizeList.push(sizeModel)
            }
            break
          }
        }
      }
      initialData.size = sizeList
      if (callback) {
        callback(initialData)
      } else {
        return initialData
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // ブランド取得
  async getBrandData (callback) {
    // 返却リスト
    var brandList = []
    var url = ''
    try {
      // オプション設定
      url = 'https://api.fril.jp/api/v3/brands'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      // データ取得
      var brands = json.brands
      var keys = Object.keys(brands)
      for (var key in keys) {
        var brandData = {}
        // 配列のkeyに対し値を設定する
        brandData.id = String(brands[key].id)
        brandData.name = brands[key].name
        brandData.kana = brands[key].kana_name
        brandList.push(brandData)
      }
      if (callback) {
        callback(brandList)
      } else {
        return brandList
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // ログイン
  async login (email, password, callback) {
    var url = ''
    try {
      var html = ''
      var status = '200'
      this.log.request('[rakuma.login] START')
      // 1.Cookie取得
      // オプション設定
      /*
      url = 'https://fril.jp/cp/otoku_navi?app=true'
      let options = {
        url: url,
        jar: jar,
        followAllRedirects: true,
        method: 'get',
        headers: {
          'user-agent': consts.rakuma_user_agent,
          'x-fril-version': consts.rakuma_version
        }
      }
      // リクエスト
      var html = ''
      var status = '200'
      await request(options)
        .then((htmlString) => {
          html = htmlString
        })
        .catch((err) => {
          status = err.statusCode
        })
      this.log.request('access info:url->' + url + ' status->' + status)
      if (!html) {
        return null
      }
      */
      // ログ初期化
      this.log.clearLog()
      // login表示
      const registrationToken = this.randomString(8) + '-' + this.randomString(4) + '-' + this.randomString(4) + '-' + this.randomString(4) + '-' + this.randomString(12)
      url = 'https://api.fril.jp/api/v4/auth/rakuten/login?registration_token=' + registrationToken
      
      let response = null
      try {
        this.log.request('[rakuma.login] STEP1 GET login page url=' + url)
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent,
            'x-fril-version': consts.rakuma_version
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
            this.log.request('[rakuma.login] STEP1 OK status=' + status + ' html.length=' + (html ? String(html.length) : '0'))
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          const err = new Error('electronAPI not available')
          this.log.error('[rakuma.login] STEP1 NG ' + err.message)
          throw err
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        this.log.error('[rakuma.login] STEP1 EXCEPTION ' + (err?.stack || err))
        return null
      }
      this.log.html('login01',html)
      if (!html) {
        this.log.error('[rakuma.login] STEP1 EMPTY_HTML')
        return null
      }
      // 必要変数を取得
      const cpid = this.getCpid(html)
      const ctid = this.getCtid(html)
      this.log.request('[rakuma.login] STEP1 TOKENS cpid=' + (cpid || '') + ' ctid=' + (ctid || ''))
      if (!cpid || !ctid) {
        this.log.error('[rakuma.login] STEP1 TOKEN_MISSING cpid/ctid is empty')
        return null
      }
      // STEP1で付与されたCookieを抽出
      let step1CookieHeader = ''
      try {
        const setCookies = response && response.headers && (response.headers['set-cookie'] || response.headers['Set-Cookie'])
        if (Array.isArray(setCookies) && setCookies.length > 0) {
          step1CookieHeader = setCookies.map(c => c.split(';')[0]).join('; ')
        } else if (typeof setCookies === 'string') {
          // 1本にまとまってくる場合
          step1CookieHeader = setCookies.split(',').map(c => c.split(';')[0]).join('; ')
        }
        if (step1CookieHeader) {
          this.log.request('[rakuma.login] STEP1 COOKIE captured=' + step1CookieHeader)
        } else {
          this.log.request('[rakuma.login] STEP1 COOKIE none')
        }
      } catch (e) {
        this.log.error('[rakuma.login] STEP1 COOKIE parse error ' + (e?.message || e))
      }
      // 余分な空白を削除
      email = email.replace('　', '')
      email = email.replace(' ', '')
      // パラメータ設定
      let formData = {
        contact_info_required: 'false',
        service_id: 'i103',
        scope: 'memberinfo_read_name,memberinfo_read_mail,idinfo_read_openid,memberinfo_read_address,memberinfo_read_telephone,memberinfo_read_basic',
        redirect_uri: 'https://api.fril.jp/api/v4/auth/rakuten/callback?registration_token=' + registrationToken,
        client_id: 'fril_api',
        rae_service_id: '',
        u: email,
        p: password,
        cres: '',
        cpid: cpid,
        cid: '',
        ctid: ctid,
        pp_version: '20170213',
        submit: 'login'
      }
      url = 'https://grp03.id.rakuten.co.jp/rms/nid/logini'
      
      response = null
      try {
        this.log.request('[rakuma.login] STEP2 POST credentials url=' + url + ' email=' + email)
        // フォームは application/x-www-form-urlencoded で送る
        const urlEncoded = new URLSearchParams()
        Object.keys(formData).forEach(k => {
          if (formData[k] !== undefined && formData[k] !== null) {
            urlEncoded.append(k, String(formData[k]))
          }
        })
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, urlEncoded.toString(), {
            'user-agent': consts.rakuma_user_agent,
            'x-fril-version': consts.rakuma_version,
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'referer': 'https://api.fril.jp/api/v4/auth/rakuten/login',
            'origin': 'https://grp03.id.rakuten.co.jp',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'accept-language': 'ja,en-US;q=0.9,en;q=0.8',
            ...(step1CookieHeader ? { 'cookie': step1CookieHeader } : {})
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
            this.log.request('[rakuma.login] STEP2 OK status=' + status + ' html.length=' + (html ? String(html.length) : '0'))
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            // 失敗時でも本文とヘッダを出力して原因特定
            const bodyPreview = typeof response.data === 'string' ? response.data.slice(0, 500) : JSON.stringify(response.data || {})
            this.log.error('[rakuma.login] STEP2 NG status=' + status)
            this.log.error('[rakuma.login] STEP2 BODY ' + bodyPreview)
            this.log.error('[rakuma.login] STEP2 HEADERS ' + JSON.stringify(response.headers || {}))
            return null
          }
        } else {
          const err = new Error('electronAPI not available')
          this.log.error('[rakuma.login] STEP2 NG ' + err.message)
          throw err
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        this.log.error('[rakuma.login] STEP2 EXCEPTION ' + (err?.stack || err))
        return null
      }
      this.log.html('login02',html)
      if (!html) {
        this.log.error('[rakuma.login] STEP2 EMPTY_HTML')
        return null
      }
      this.log.error('[rakuma.login] STEP2 HTML html=' + html)
      // 必要な要素を取得
      const authenticityToken = this.getAuthenticityToken(html)
      if (!authenticityToken) {
        this.log.error('[rakuma.login] STEP2 AUTH_TOKEN_MISSING')
        return null
      }
      const message = this.getMessage(html)
      this.log.request('[rakuma.login] STEP2 AUTH_TOKEN_OK message=' + (message || ''))
      // 返却
      if (authenticityToken) {
        // 情報を保存
        var now = new Date()
        let accountData = {
          'email': email,
          'password': password,
          'authenticityToken': authenticityToken,
          'message': message,
          'created_at': now.toFormat('YYYY-MM-DD HH24:MI:SS')
        }
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
      this.log.error('[rakuma.login] UNCAUGHT ' + (error?.stack || error))
    }
  }
  // 認証コード
  async verifyCode (account, code, callback) {
    var url = ''
    try {
      // パラメータ設定
      let formData = {
        authenticity_token: account.authenticityToken,
        auth_code: code
      }
      url = 'https://api.fril.jp/auth/otp'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData, {
            'user-agent': consts.rakuma_user_agent,
            'x-fril-version': consts.rakuma_version
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      this.log.html('verifyCode',html)
      // token取得
      var authToken = this.getAuthenticationToken(html)
      if (authToken) {
        // 情報を保存
        account.token = authToken
        // 値を返却
        if (callback) {
          callback(account)
        } else {
          return account
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
  // プロフィール取得
  async getProfile (accountData, callback) {
    var url = ''
    try {
      // オプション設定
      url = 'https://api.fril.jp/api/v2/users?auth_token=' + accountData.token
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      this.log.html('getProfile',html)
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      // jsonの定義確認
      if (json.user) {
        accountData.userId = json.user.id
        accountData.name = json.user.screen_name
        accountData.thumbnail = json.user.profile_img_url
        if (accountData.thumbnail === null) {
          accountData.thumbnail = 'http://www.rakurakufurima.com/img/noimage.png'
        }
      } else {
        return null
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
      for (var t=1; t<=10; t++){
        if (item['image'+t] && !fs.existsSync(util.getImgPath(item['image'+t]))) {
          this.log.error('画像'+ t +'が存在しません。:' + exhibitionData.item_id)
          return null
        }
      }
      // SMSチェック
      url = 'https://api.fril.jp/api/v4/sms_verification/status?auth_token=' + account.token
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      // 出品パラメータ作成
      var formData = {}
      formData.item_id = '0'
      formData.auth_token = account.token
      formData.title = item.name
      formData.detail = item.desc
      formData.status = item.rakumaCondition
      formData.sell_price = item.price
      formData.delivery_date = item.rakuma_shipping_durations
      formData.delivery_area = item.rakuma_shipping_from_areas
      formData.request_required = item.rakuma_request_required
      formData.carriage = item.rakuma_shipping_payers
      formData.delivery_method = item.rakuma_shipping_methods
      const ids = item.rakumaCategoryId.split('>')
      formData.category = ids[ids.length-1]
      formData.p_category = ids[ids.length-2]

      if (item.rakumaSize) {
        var sizeAll = JSON.parse(sessionStorage.getItem('sizeRakuma'))
        const size = sizeAll.find(size => size.id === item.rakumaSize)
        if(size){
          formData.size = size.id
          formData.size_name = size.name
        }else{
          formData.size = 19999
          formData.size_name = 'なし'
        }
      } else {
        formData.size = 19999
        formData.size_name = 'なし'
      }
      if (item.rakumaBrand) {
        formData.brand = item.rakumaBrand
      }
      url = 'https://api.fril.jp/api/items/request'
      
      response = null
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData, {
            'user-agent': consts.rakuma_user_agent,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      let json = JSON.parse(html)
      if (!json.item_result) {
        this.log.error('出品できませんでした。item_id:' + item._id + ' item_name:' + item.name)
        return null
      }
      // 商品IDを取得
      let exhibitionItemId = json.item_id
      // 画像リスト
      var imageList = []
      for(var s=1; s<=10; s++){
        if (item['image'+s]) {
          imageList.push(item['image'+s])
        }
      }
      // 画像分繰り返し
      for (var i = 0; i < imageList.length; i++) {
        // formData
        let path = await image.compositeForExcel(imageList[i])
        
        // 画像データをBase64エンコード
        const imageBuffer = fs.readFileSync(path)
        const base64Image = imageBuffer.toString('base64')
        
        const multipartData = {
          auth_token: account.token,
          current_num: i + 1,
          item_id: exhibitionItemId,
          total_num: imageList.length,
          image: {
            filename: 'image.jpg',
            contentType: 'image/jpeg',
            data: base64Image
          }
        }
        
        response = null
        try {
          // Electron環境ではIPC経由でHTTPリクエストを送信
          if (window.electronAPI && window.electronAPI.httpPostMultipart) {
            response = await window.electronAPI.httpPostMultipart('https://api.fril.jp/api/items/request_img', multipartData, {
              'user-agent': consts.rakuma_user_agent
            })
            if (response.success) {
              // 成功時はレスポンスデータを整形
              status = response.status.toString()
              html = response.data
            } else {
              // 失敗時はログを記録してnullを返す
              status = response.status.toString()
              this.log.request('access info:url->' + url + ' status->' + status)
              return null
            }
          } else {
            throw new Error('electronAPI not available')
          }
          // 成功時のログを記録
          this.log.request('access info:url->' + url + ' status->' + status)
        } catch (err) {
          // エラー時のステータスコードを取得してログに記録
          status = err.response?.status || err.code || '500'
          this.log.request('access info:url->' + url + ' status->' + status)
          return null
        }
        json = JSON.parse(html)
      }
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
  // 出品(Gold)
  async exhibitionGold (exhibitionData, callback) {
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
      for(var w=1; w<=10; w++){
        if (item['image'+w] && !fs.existsSync(util.getImgPath(item['image'+w]))) {
          this.log.error('画像'+w+'が存在しません。:' + exhibitionData.item_id)
          return null
        }
      }
      // 出品パラメータ作成
      var formData = {}
      formData.item_id = '0'
      formData.auth_token = account.token
      formData.title = item.name
      formData.detail = item.desc
      formData.status = item.condition
      formData.sell_price = item.price
      formData.delivery_date = item.shipping_durations
      formData.delivery_area = item.shipping_from_areas
      formData.request_required = item.request_required
      formData.carriage = item.shipping_payers
      formData.delivery_method = item.shipping_methods
      if (item.category3) {
        formData.category = item.category3
        formData.p_category = item.category2
      } else {
        formData.category = item.category2
        formData.p_category = item.category1
      }
      if (item.size) {
        var sizeAll = JSON.parse(sessionStorage.getItem('sizeRakuma'))
        const size = sizeAll.find(size => size.id === item.size)
        formData.size = size.id
        formData.size_name = size.name
      } else {
        formData.size = 19999
        formData.size_name = 'なし'
      }
      if (item.brand) {
        formData.brand = item.brand
      }
      // 追加パラメータ
      const computer = os.hostname()
      const version = consts.os + consts.version
      var constDB = util.getDatastore('const.db')
      var rakufuri_token = await constDB.findOne({name: consts.const_assistant_token})
      formData.computer = computer
      formData.version = version
      formData.rakufuri_token = rakufuri_token.value
      // 画像リスト
      var imageList = []
      for(var p=1; p<=10; p++){
        if (item['image'+p]) {
          imageList.push(item['image'+p])
        }
      }
      // パラメータ設定
      var num = Math.floor(Math.random () * 1000) + 1
      url = 'https://asia-northeast1-rakufuri-function.cloudfunctions.net/rakuma-exhibition-' + num
      // url = 'http://localhost:8080/'
      
      // 画像データをBase64エンコードしてmultipartデータを作成
      var multipartData = {}
      // テキストデータをコピー
      for (let key in formData) {
        multipartData[key] = formData[key]
      }
      // 画像データ
      for (var i = 0; i < imageList.length; i++) {
        let imgPath = await image.compositeForExcel(imageList[i])
        const filename = 'image_' + i + '_' + path.basename(imageList[i])
        const imageBuffer = fs.readFileSync(imgPath)
        const base64Image = imageBuffer.toString('base64')
        multipartData[filename] = {
          filename: filename,
          contentType: 'image/jpeg',
          data: base64Image
        }
      }
      
      response = null
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPostMultipart) {
          response = await window.electronAPI.httpPostMultipart(url, multipartData, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      var json = JSON.parse(html)
      const exhibitionItemId = json.exhibitionItemId
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
  // CPIDを取得
  getCpid (html) {
    var sidx = 0
    var eidx = 0
    sidx = html.indexOf('name="cpid"', sidx) + 'name="cpid"'.length
    sidx = html.indexOf('value="', sidx) + 'value="'.length
    eidx = html.indexOf('"', sidx)
    var cpid = html.substring(sidx, eidx)
    return cpid
  }
  // CTIDを取得
  getCtid (html) {
    var sidx = 0
    var eidx = 0
    sidx = html.indexOf('name="ctid"', sidx) + 'name="ctid"'.length
    sidx = html.indexOf('value="', sidx) + 'value="'.length
    eidx = html.indexOf('"', sidx)
    var ctid = html.substring(sidx, eidx)
    return ctid
  }
  // messageを取得
  getMessage (html) {
    var sidx = 0
    var eidx = 0
    sidx = html.indexOf('<div class="title-header">', sidx) + '<div class="title-header">'.length
    sidx = html.indexOf('<p>', sidx) + '<p>'.length
    eidx = html.indexOf('</p>', sidx)
    var message = html.substring(sidx, eidx)
    message = message.replace(/\s+/g, '')
    message = message.replace('\n', '')
    return message
  }
  // AuthenticityTokenを取得
  getAuthenticityToken (html) {
    var sidx = 0
    var eidx = 0
    if (html.indexOf('name="authenticity_token"', sidx) < 0) {
      return null
    }
    sidx = html.indexOf('name="authenticity_token"', sidx) + 'name="authenticity_token"'.length
    sidx = html.indexOf('value="', sidx) + 'value="'.length
    eidx = html.indexOf('"', sidx)
    const authenticityToken = html.substring(sidx, eidx)
    return authenticityToken
  }
  // AuthenticationTokenを取得
  getAuthenticationToken (html) {
    var sidx = 0
    var eidx = 0
    sidx = html.indexOf('id="authentication_token"', sidx) + 'id="authentication_token"'.length
    sidx = html.indexOf('>', sidx) + '>'.length
    eidx = html.indexOf('<', sidx)
    const authenticationToken = html.substring(sidx, eidx)
    return authenticationToken
  }
  // ランダム文字列生成
  randomString (count) {
    const S = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    // Web Crypto APIを使用してランダムなバイト配列を生成
    const array = new Uint8Array(count)
    crypto.getRandomValues(array)
    var randomString = Array.from(array).map((n) => S[n % S.length]).join('')
    return randomString
  }
  // boundary作成
  createBoundary () {
    var multipartChars = '-_1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var length = 30 + Math.floor(Math.random() * 10)
    var boundary = ''
    for (var i = 0; i < length; i++) {
      boundary += multipartChars.charAt(Math.floor(Math.random() * multipartChars.length))
    }
    return boundary
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
      // オプション設定
      url = 'https://api.fril.jp/api/v3/items/sell?auth_token=' + account.token + '&status=selling'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      if (!json.result) {
        return null
      }
      var jsonItems = json.items
      var onSaleList = []
      for (var i = 0; i < jsonItems.length; i++) {
        // 0,1以外は不要
        if (jsonItems[i].t_status !== 0 && jsonItems[i].t_status !== 1) {
          continue
        }
        // サイト
        jsonItems[i].site = 'r'
        jsonItems[i].site_name = 'ラクマ'
        // アカウントIDを付与
        jsonItems[i].account_id = account._id
        // 購入申請を取得
        if (jsonItems[i].t_status === 1) {
          jsonItems[i].request = 'あり'
        } else {
          jsonItems[i].request = '-'
        }
        // 日付を変更
        var exhibitionDt = new Date(jsonItems[i].created_at)
        jsonItems[i].created_at = exhibitionDt.toFormat('YYYY-MM-DD HH24:MI:SS')
        onSaleList.push(jsonItems[i])
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
      url = 'https://api.fril.jp/api/v3/items/show?auth_token=' + account.token + '&item_id=' + itemId
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      if (!json.result) {
        return null
      }
      // いいね！チェック
      var likeCount = json.item.likes_count
      // いいねがあったら取り消さない
      if (cancelLikeFlg !== 'true' && likeCount !== 0) {
        return false
      }
      // コメントチェック
      var commentCount = json.item.comments_count
      // コメントがあったら取り消さない
      if (cancelCommentFlg !== 'true' && commentCount !== 0) {
        return false
      }
      // 購入申請チェック
      var tStatus = json.item.info.t_status
      // 購入申請があったら取り消さない
      if (tStatus === '1') {
        return false
      }
      return true
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
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
      // パラメータ設定
      let formData = {
        auth_token: account.token,
        item_id: itemId
      }
      url = 'https://api.fril.jp/api/items/delete'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData, {
            'user-agent': consts.rakuma_user_agent,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      let json = JSON.parse(html)
      if (!json.result) {
        return null
      }
      if (json.result !== true) {
        return null
      }
      if (callback) {
        callback(json.result)
      } else {
        return true
      }
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
      // 商品情報取得 //
      // オプション設定
      url = 'https://api.fril.jp/api/v3/items/show?auth_token=' + account.token + '&item_id=' + itemId
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      if (!json.result) {
        return null
      }

      // 商品情報変更 //
      // パラメータ設定
      var price = json.item.info.s_price + changePrice
      var requestRequired = '0'
      if (json.item.info.request_required === 'True') {
        requestRequired = '1'
      }
      let formData = {
        auth_token: account.token,
        carriage: json.item.info.carriage,
        category: json.item.info.category_id,
        delivery_area: json.item.info.d_area,
        delivery_date: json.item.info.d_date,
        delivery_method: json.item.info.d_method,
        detail: json.item.info.detail,
        item_id: json.item.info.item_id,
        p_category: json.item.info.category_p_id,
        request_required: requestRequired,
        sell_price: price,
        size: json.item.info.size_id,
        size_name: json.item.info.size_name,
        status: json.item.info.status,
        title: json.item.info.item_name
      }
      url = 'https://api.fril.jp/api/items/request'
      
      response = null
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData, {
            'user-agent': consts.rakuma_user_agent,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      json = JSON.parse(html)
      if (!json.result) {
        return null
      }
      if (json.result !== true) {
        return null
      }
      if (callback) {
        callback(json.result)
      } else {
        return true
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // コメント取得
  async getComments (accountId, itemId, callback) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // コメント取得 //
      url = 'https://api.fril.jp/api/v3/comments?auth_token=' + account.token + '&item_id=' + itemId
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      if (!json.result) {
        return null
      }
      var jsonComments = json.comments
      var commentList = []
      for (var i = 0; i < jsonComments.length; i++) {
        var comment = {}
        comment.id = jsonComments[i].id
        comment.user_id = jsonComments[i].user_id
        comment.user_name = jsonComments[i].screen_name
        comment.message = jsonComments[i].comment
        var createDt = new Date(jsonComments[i].created_at)
        comment.created_at = createDt.toFormat('YYYY-MM-DD HH24:MI:SS')
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
  // コメント送信
  async addComment (accountId, itemId, comment, callback) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // パラメータ設定
      let formData = {
        auth_token: account.token,
        item_id: itemId,
        comment: comment
      }
      url = 'https://api.fril.jp/api/v3/comments'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData, {
            'user-agent': consts.rakuma_user_agent,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      let json = JSON.parse(html)
      if (!json.result) {
        return null
      }
      if (json.result !== true) {
        return null
      }
      if (callback) {
        callback(json.result)
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
      url = 'https://api.fril.jp/api/v3/items/sell?auth_token=' + account.token + '&status=trading'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      let json = JSON.parse(html)
      if (!json.result) {
        return null
      }
      var jsonItems = json.items
      var tradingList = []
      for (var i = 0; i < jsonItems.length; i++) {
        var item = {}
        item.site = 'r'
        item.site_name = 'ラクマ'
        item.id = jsonItems[i].item_id
        item.account_id = account._id
        item.screen_name = account.name
        item.item_id = jsonItems[i].item_id
        item.item_name = jsonItems[i].item_name
        item.price = jsonItems[i].price + '円'
        item.img_url = jsonItems[i].img_url
        item.status = jsonItems[i].t_status
        // ステータス変換
        switch (item.status) {
          case 2:
            item.status = '入金待ち'
            break
          case 3:
            item.status = '発送待ち'
            break
          case 4:
            item.status = '受取評価待ち'
            break
          case 5:
            item.status = '出品者の評価待ち'
            break
        }
        tradingList.push(item)
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
  // メッセージを取得
  async getMessages (accountId, itemId, callback) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // 取引メッセージ取得 //
      url = 'https://web.fril.jp/transaction?item_id=' + itemId + '&auth_token=' + account.token
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      // htmlからメッセージを取得
      var messageList = this.getMessagesFromHtml(html)
      if (callback) {
        callback(messageList)
      } else {
        return messageList
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // メッセージをHTMLから取得
  getMessagesFromHtml (html) {
    // メッセージリスト
    var messageList = []
    var sidx = 0
    var eidx = 0
    sidx = html.indexOf('>取引メッセージ<', sidx) + '> 取引メッセージ <'.length
    eidx = html.indexOf('<form', sidx)
    var messages = html.substring(sidx, eidx)
    // 初期化
    sidx = 0
    eidx = 0
    // メッセージだけ抜き出し
    var rowList = []
    while (messages.indexOf('<div class="row comment-row', sidx) >= 0) {
      sidx = messages.indexOf('<div class="row comment-row', sidx) + '<div class="row comment-row'.length
      eidx = messages.indexOf('<div class="row comment-row', sidx)
      if (eidx >= 0) {
        rowList.push(messages.substring(sidx, eidx))
      } else {
        eidx = messages.indexOf('<div class="row">', sidx)
        rowList.push(messages.substring(sidx, eidx))
      }
      if(eidx<0){
        break
      }
      sidx = eidx
    }
    // メッセージごとに処理
    for (var i = 0; i < rowList.length; i++) {
      var row = rowList[i]
      var message = {}
      if (row.indexOf('<div class="col s2">') < row.indexOf('<div class="col s10">')) {
        message.user_name = '出品者'
      } else {
        message.user_name = '購入者'
      }
      sidx = 0
      eidx = 0
      sidx = row.indexOf(' <p class="small-text">', sidx) + ' <p class="small-text">'.length
      eidx = row.indexOf('</p>', sidx)
      var messageTxt = row.substring(sidx, eidx)
      messageTxt = messageTxt.replace('\n', '')
      message.message = messageTxt.replace('<br />', '\n')
      sidx = 0
      eidx = 0
      sidx = row.indexOf('<p class="small-text right-align">', sidx) + '<p class="small-text right-align">'.length
      eidx = row.indexOf('</p>', sidx)
      var time = row.substring(sidx, eidx)
      message.datetime = time
      // メッセージ追加
      messageList.push(message)
    }
    return messageList
  }
  // 取引メッセージの送信
  async sendTradingMessage (accountId, itemId, message) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // 取引メッセージ用のパラメータを取得
      url = 'https://web.fril.jp/transaction?item_id=' + itemId + '&auth_token=' + account.token
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      // パラメータ取得
      var formData = this.getTradingMessageParamFromHtml(html)
      // token取得
      var authToken = this.getTradingMessageAuthTokenFromHtml(html)
      // OPTIONS送信
      url = 'https://api.fril.jp/api/order/comment/add'
      
      response = null
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpOptions) {
          response = await window.electronAPI.httpOptions(url, {
            'user-agent': consts.rakuma_user_agent,
            'origin': 'https://web.fril.jp',
            'access-control-request-headers': 'authorization',
            'access-control-request-method': 'post'
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      // 取引メッセージ送信 //
      url = 'https://api.fril.jp/api/order/comment/add'
      // パラメータ追加
      formData['comment'] = message
      
      response = null
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData, {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'user-agent': consts.rakuma_user_agent,
            'authorization': authToken
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      return true
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // HTMLから必要なパラメータを取得
  getTradingMessageParamFromHtml (html) {
    var params = {}
    // index
    var sidx = 0
    var eidx = 0
    sidx = html.indexOf('<form id="comment-form"', sidx)
    eidx = html.indexOf('</form>', sidx)
    var formTag = html.substring(sidx, eidx)
    sidx = 0
    eidx = 0
    while (formTag.indexOf('<input ', sidx) >= 0) {
      sidx = formTag.indexOf('<input ', sidx)
      eidx = formTag.indexOf('/>', sidx) + '/>'.length
      var hiddenTag = formTag.substring(sidx, eidx)
      sidx = eidx
      // データ取得
      var hsidx = 0
      var heidx = 0
      hsidx = hiddenTag.indexOf('name="') + 'name="'.length
      heidx = hiddenTag.indexOf('"', hsidx)
      var name = hiddenTag.substring(hsidx, heidx)
      hsidx = 0
      heidx = 0
      hsidx = hiddenTag.indexOf('value="') + 'value="'.length
      heidx = hiddenTag.indexOf('"', hsidx)
      var value = hiddenTag.substring(hsidx, heidx)
      // 追加
      params[name] = value
    }
    return params
  }
  // AuthTokenを取得
  getTradingMessageAuthTokenFromHtml (html) {
    var sidx = 0
    var eidx = 0
    sidx = html.indexOf('<span id="auth-token"', sidx)
    eidx = html.indexOf('>', sidx)
    var spanTag = html.substring(sidx, eidx)
    sidx = 0
    eidx = 0
    sidx = spanTag.indexOf('data-token="', sidx) + 'data-token="'.length
    eidx = spanTag.indexOf('"', sidx)
    var authToken = spanTag.substring(sidx, eidx)
    return authToken
  }
  // 取引中のアイテム情報を取得
  async getAddress (itemId, accountId) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // 住所を取得
      url = 'https://web.fril.jp/transaction?item_id=' + itemId + '&auth_token=' + account.token
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      // 住所を取得
      var address = this.getAddressFromHtml(html)
      return address
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // HTMLから住所を取得
  getAddressFromHtml (html) {
    var address = {}
    var sidx = 0
    var eidx = 0
    sidx = html.indexOf('<p class="caption-text">配送先住所</p>', sidx)
    sidx = html.indexOf('<p>', sidx) + '<p>'.length
    eidx = html.indexOf('<br />', sidx)
    address.zip = html.substring(sidx, eidx)
    address.zip = address.zip.replace(/\s+/g, '')
    address.zip = address.zip.replace('\n', '')
    sidx = eidx
    sidx = html.indexOf('<br />', sidx) + '<br />'.length
    eidx = html.indexOf('<br />', sidx)
    address.address1 = html.substring(sidx, eidx)
    address.address1 = address.address1.replace(/\s+/g, '')
    address.address1 = address.address1.replace('\n', '')
    sidx = eidx
    sidx = html.indexOf('<br />', sidx) + '<br />'.length
    eidx = html.indexOf('</p>', sidx)
    address.name = html.substring(sidx, eidx)
    address.name = address.name.replace(/\s+/g, '')
    address.name = address.name.replace('\n', '')
    return address
  }
  // 発送通知
  async shipped (itemId, accountId) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // 発送通知用のパラメータを取得
      url = 'https://web.fril.jp/transaction?item_id=' + itemId + '&auth_token=' + account.token
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      var formData = this.getShipmentParamFromHTML(html)
      // 発送通知 //
      url = 'https://web.fril.jp/v2/order/shipping'
      // パラメータ追加
      formData['tracking_number'] = ''
      
      response = null
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData, {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'referer': 'https://web.fril.jp/v2/sale/shipping/item?item_id=' + itemId,
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      if (html.indexOf('受取確認待ち') >= 0) {
        return true
      }
      return false
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // HTMLからhiddenパラメータを取得
  getShipmentParamFromHTML (html) {
    var params = {}
    var sidx = 0
    var eidx = 0
    sidx = html.indexOf('<form id="ship-form"', sidx)
    eidx = html.indexOf('</form>', sidx)
    var formTag = html.substring(sidx, eidx)
    sidx = 0
    eidx = 0
    while (formTag.indexOf('<input type="hidden"', sidx) >= 0) {
      sidx = formTag.indexOf('<input type="hidden"', sidx)
      eidx = formTag.indexOf('/>', sidx) + '/>'.length
      var hiddenTag = formTag.substring(sidx, eidx)
      sidx = eidx
      var hsidx = 0
      var heidx = 0
      hsidx = hiddenTag.indexOf('name="') + 'name="'.length
      heidx = hiddenTag.indexOf('"', hsidx)
      let name = hiddenTag.substring(hsidx, heidx)
      hsidx = 0
      heidx = 0
      hsidx = hiddenTag.indexOf('value="') + 'value="'.length
      heidx = hiddenTag.indexOf('"', hsidx)
      let value = hiddenTag.substring(hsidx, heidx)
      params[name] = value
    }
    sidx = 0
    eidx = 0
    while (formTag.indexOf('<option ', sidx) >= 0) {
      sidx = formTag.indexOf('<option ', sidx)
      eidx = formTag.indexOf('</option>', sidx) + '</option>'.length
      var optionTag = formTag.substring(sidx, eidx)
      if (optionTag.indexOf('selected="selected"') >= 0) {
        var osidx = 0
        var oeidx = 0
        osidx = optionTag.indexOf('value="') + 'value="'.length
        oeidx = optionTag.indexOf('"', osidx)
        let value = optionTag.substring(osidx, oeidx)
        // 追加
        params['item%5Bdelivery_method%5D'] = value
        break
      }
      sidx = eidx
    }
    sidx = 0
    eidx = 0
    sidx = formTag.indexOf('<input name="utf8"', sidx)
    eidx = formTag.indexOf('/>', sidx) + '/>'.length
    var utf8Tag = formTag.substring(sidx, eidx)
    sidx = eidx
    sidx = 0
    eidx = 0
    sidx = utf8Tag.indexOf('value="') + 'value="'.length
    eidx = utf8Tag.indexOf('"', sidx)
    var utf8Value = utf8Tag.substring(sidx, eidx)
    params['utf8'] = utf8Value
    return params
  }
  // 評価の送信
  async sendEvaluation (itemId, accountId, review, comment) {
    var url = ''
    try {
      // アカウントを取得
      var account = await util.getAccount(accountId)
      if (!account) {
        return null
      }
      // 評価用のパラメータを取得
      url = 'https://web.fril.jp/transaction?item_id=' + itemId + '&auth_token=' + account.token
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url, {
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      var formData = this.getEvaluationTokenFromHtml(html)
      // 評価 //
      url = 'https://web.fril.jp/v2/order/review'
      // パラメータ追加
      formData['review'] = review
      formData['comment'] = comment
      
      response = null
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData, {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'referer': 'https://web.fril.jp/v2/sale/shipping/item?item_id=' + itemId,
            'user-agent': consts.rakuma_user_agent
          })
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            html = response.data
          } else {
            // 失敗時はログを記録してnullを返す
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          throw new Error('electronAPI not available')
        }
        // 成功時のログを記録
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        // エラー時のステータスコードを取得してログに記録
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      if (!html) {
        return null
      }
      if (html.indexOf('取引が完了しました') >= 0) {
        return true
      }
      return false
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // 評価用のHTMLからhiddenパラメータを取得
  getEvaluationTokenFromHtml (html) {
    var params = {}
    var sidx = 0
    var eidx = 0
    sidx = html.indexOf('<form id="review-form"', sidx)
    eidx = html.indexOf('</form>', sidx)
    var formTag = html.substring(sidx, eidx)
    sidx = 0
    eidx = 0
    while (formTag.indexOf('<input type="hidden"', sidx) >= 0) {
      sidx = formTag.indexOf('<input type="hidden"', sidx)
      eidx = formTag.indexOf('/>', sidx) + '/>'.length
      var hiddenTag = formTag.substring(sidx, eidx)
      sidx = eidx
      var hsidx = 0
      var heidx = 0
      hsidx = hiddenTag.indexOf('name="') + 'name="'.length
      heidx = hiddenTag.indexOf('"', hsidx)
      var name = hiddenTag.substring(hsidx, heidx)
      hsidx = 0
      heidx = 0
      hsidx = hiddenTag.indexOf('value="') + 'value="'.length
      heidx = hiddenTag.indexOf('"', hsidx)
      var value = hiddenTag.substring(hsidx, heidx)
      params[name] = value
    }
    sidx = 0
    eidx = 0
    sidx = formTag.indexOf('<input name="utf8"', sidx)
    eidx = formTag.indexOf('/>', sidx) + '/>'.length
    var utf8Tag = formTag.substring(sidx, eidx)
    sidx = eidx
    sidx = 0
    eidx = 0
    sidx = utf8Tag.indexOf('value="') + 'value="'.length
    eidx = utf8Tag.indexOf('"', sidx)
    var utf8Value = utf8Tag.substring(sidx, eidx)
    // 追加
    params['utf8'] = utf8Value
    return params
  }
}
