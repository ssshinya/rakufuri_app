import consts from './consts'
import { Log } from './log'

// コンピューター名を取得する関数
function getComputerName() {
  try {
    // Electron環境ではpreloadスクリプト経由で取得
    if (window.electronAPI && window.electronAPI.getAppName) {
      return window.electronAPI.getAppName()
    }
    // フォールバック: ブラウザ環境ではランダムな名前を生成
    return 'browser-' + Math.random().toString(36).substr(2, 9)
  } catch (e) {
    console.warn('Failed to get computer name:', e)
    return 'unknown'
  }
}

export class AssistantApi {
  constructor () {
    this.log = new Log()
  }
  /**
   * Tokenを取得します。
   */
  async getToken (email, password, callback) {
    var url = ''
    try {
      // コンピューター名
      let computer = await getComputerName()
      // 余分な空白を削除
      email = email.replace('　', '')
      email = email.replace(' ', '')
      // パラメータ設定
      let formData = {
        email: email,
        password: password,
        computer: computer,
        version: consts.os + consts.version
      }
      url = consts.assistant_host + '/api/token'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData)
          if (response.success) {
            status = response.status.toString()
            response = { data: response.data }
          } else {
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          // ブラウザ環境では直接axiosを使用（CORSエラーの可能性あり）
          const axios = (await import('axios')).default
          response = await axios.post(url, formData)
        }
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      
      if (!response || !response.data) {
        return null
      }
      
      // 返却されたデータからjson取得
      let json = response.data
      if (callback) {
        callback(json)
      } else {
        return json
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  /**
   * ライセンスチェックを取得します。
   */
  async checkLicense (token, callback) {
    var url = ''
    try {
      // コンピューター名
      let computer = await getComputerName()
      // パラメータ設定
      let formData = {
        token: token,
        computer: computer,
        version: consts.os + consts.version
      }
      url = consts.assistant_host + '/api/license'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData)
          if (response.success) {
            status = response.status.toString()
            response = { data: response.data }
          } else {
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          // ブラウザ環境では直接axiosを使用（CORSエラーの可能性あり）
          const axios = (await import('axios')).default
          response = await axios.post(url, formData)
        }
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      
      if (!response || !response.data) {
        return null
      }
      
      // 返却されたデータからjson取得
      let json = response.data
      if (callback) {
        callback(json)
      } else {
        return json
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
  // バージョンチェック
  async checkVersion (callback) {
    var url = ''
    try {
      url = consts.assistant_host + '/version_dx.html'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpGet) {
          response = await window.electronAPI.httpGet(url)
          if (response.success) {
            status = response.status.toString()
            response = { data: response.data }
          } else {
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          // ブラウザ環境では直接axiosを使用（CORSエラーの可能性あり）
          const axios = (await import('axios')).default
          response = await axios.get(url)
        }
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      
      let nowVer = response?.data || ''
      var result = false
      if (parseFloat(nowVer) > parseFloat(consts.version)) {
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
  // 体験版のチェックを行います。
  async checkTrialCount (token, count, updateFlg, callback) {
    var url = ''
    try {
      // パラメータ設定
      var update = '0'
      if (updateFlg === true) {
        update = '1'
      }
      let formData = {
        token: token,
        update_flg: update,
        count: count
      }
      url = consts.assistant_host + '/api/trial'
      
      let response = null
      let status = '200'
      try {
        // Electron環境ではIPC経由でHTTPリクエストを送信
        if (window.electronAPI && window.electronAPI.httpPost) {
          response = await window.electronAPI.httpPost(url, formData)
          if (response.success) {
            status = response.status.toString()
            response = { data: response.data }
          } else {
            status = response.status.toString()
            this.log.request('access info:url->' + url + ' status->' + status)
            return null
          }
        } else {
          // ブラウザ環境では直接axiosを使用（CORSエラーの可能性あり）
          const axios = (await import('axios')).default
          response = await axios.post(url, formData)
        }
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        status = err.response?.status || err.code || '500'
        this.log.request('access info:url->' + url + ' status->' + status)
        return null
      }
      
      if (!response || !response.data) {
        return null
      }
      
      // 返却されたデータからjson取得
      let json = response.data
      if (callback) {
        callback(json)
      } else {
        return json
      }
    } catch (error) {
      this.log.request('access error:url->' + url + ' error->' + error.stack)
    }
  }
}
