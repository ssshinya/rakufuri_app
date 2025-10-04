import consts from './consts'
import { Log } from './log'

/**
 * コンピューター名を取得する関数
 * Electron環境ではOSのホスト名を取得し、取得できない場合は'unknown'を返す
 * @returns {Promise<string>} コンピューター名
 */
async function getComputerName() {
  try {
    // Electron環境ではpreloadスクリプト経由で取得
    if (window.electronAPI && window.electronAPI.getComputerName) {
      return await window.electronAPI.getComputerName()
    }
    throw new Error('electronAPI not available')
  } catch (e) {
    console.warn('Failed to get computer name:', e)
    return 'unknown'
  }
}

/**
 * アシスタントAPIクラス
 * サーバーとの通信を管理し、認証、ライセンスチェック、バージョンチェック、体験版チェックを行う
 */
export class AssistantApi {
  /**
   * コンストラクタ
   * ログインスタンスを初期化
   */
  constructor () {
    this.log = new Log()
  }
  /**
   * 認証トークンを取得する
   * メールアドレスとパスワードを使用してサーバーから認証トークンを取得
   * @param {string} email - ユーザーのメールアドレス
   * @param {string} password - ユーザーのパスワード
   * @param {function} callback - コールバック関数（オプション）
   * @returns {Promise<Object|null>} 認証トークン情報またはnull
   */
  async getToken (email, password, callback) {
    var url = ''
    try {
      // コンピューター名を取得
      let computer = await getComputerName()
      // メールアドレスから余分な空白を削除
      email = email.replace('　', '')
      email = email.replace(' ', '')
      // サーバー送信用のパラメータを設定
      let formData = {
        email: email,
        password: password,
        computer: computer,
        version: consts.os + consts.version
      }
      // APIエンドポイントURLを設定
      url = consts.assistant_host + '/api/token'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData)
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            response = { data: response.data }
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
      
      // レスポンスデータの存在チェック
      if (!response || !response.data) {
        return null
      }
      
      // 返却されたデータからJSONを取得
      let json = response.data
      if (callback) {
        // コールバック関数が指定されている場合は実行
        callback(json)
      } else {
        // コールバック関数がない場合は直接返す
        return json
      }
    } catch (error) {
      // 予期しないエラーをログに記録
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  /**
   * ライセンス情報をチェックする
   * 認証トークンを使用してサーバーからライセンス情報を取得
   * @param {string} token - 認証トークン
   * @param {function} callback - コールバック関数（オプション）
   * @returns {Promise<Object|null>} ライセンス情報またはnull
   */
  async checkLicense (token, callback) {
    var url = ''
    try {
      // コンピューター名を取得
      let computer = await getComputerName()
      // サーバー送信用のパラメータを設定
      let formData = {
        token: token,
        computer: computer,
        version: consts.os + consts.version
      }
      // APIエンドポイントURLを設定
      url = consts.assistant_host + '/api/license'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData)
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            response = { data: response.data }
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
      
      // レスポンスデータの存在チェック
      if (!response || !response.data) {
        return null
      }
      
      // 返却されたデータからJSONを取得
      let json = response.data
      if (callback) {
        // コールバック関数が指定されている場合は実行
        callback(json)
      } else {
        // コールバック関数がない場合は直接返す
        return json
      }
    } catch (error) {
      // 予期しないエラーをログに記録
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  /**
   * アプリケーションのバージョンをチェックする
   * サーバーから最新バージョン情報を取得し、現在のバージョンと比較
   * @param {function} callback - コールバック関数（オプション）
   * @returns {Promise<boolean|null>} アップデートが必要な場合はtrue、不要な場合はfalse、エラー時はnull
   */
  async checkVersion (callback) {
    var url = ''
    try {
      // バージョン情報取得用のURLを設定
      url = consts.assistant_host + '/version_dx.html'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url)
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            response = { data: response.data }
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
      
      // サーバーから取得したバージョン情報
      let nowVer = response?.data || ''
      var result = false
      // 現在のバージョンとサーバーのバージョンを比較
      if (parseFloat(nowVer) > parseFloat(consts.version)) {
        result = true
      }
      if (callback) {
        // コールバック関数が指定されている場合は実行
        callback(result)
      } else {
        // コールバック関数がない場合は直接返す
        return result
      }
    } catch (error) {
      // 予期しないエラーをログに記録
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  /**
   * 体験版の使用回数をチェックする
   * 認証トークンと使用回数を使用してサーバーから体験版情報を取得・更新
   * @param {string} token - 認証トークン
   * @param {number} count - 使用回数
   * @param {boolean} updateFlg - 使用回数を更新するかどうか
   * @param {function} callback - コールバック関数（オプション）
   * @returns {Promise<Object|null>} 体験版情報またはnull
   */
  async checkTrialCount (token, count, updateFlg, callback) {
    var url = ''
    try {
      // 更新フラグを文字列に変換
      var update = '0'
      if (updateFlg === true) {
        update = '1'
      }
      // サーバー送信用のパラメータを設定
      let formData = {
        token: token,
        update_flg: update,
        count: count
      }
      // APIエンドポイントURLを設定
      url = consts.assistant_host + '/api/trial'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData)
          if (response.success) {
            // 成功時はレスポンスデータを整形
            status = response.status.toString()
            response = { data: response.data }
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
      
      // レスポンスデータの存在チェック
      if (!response || !response.data) {
        return null
      }
      
      // 返却されたデータからJSONを取得
      let json = response.data
      if (callback) {
        // コールバック関数が指定されている場合は実行
        callback(json)
      } else {
        // コールバック関数がない場合は直接返す
        return json
      }
    } catch (error) {
      // 予期しないエラーをログに記録
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
}
