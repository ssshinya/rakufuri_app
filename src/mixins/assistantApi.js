import consts from './consts'
import { Log } from './log'
import axios from 'axios'

// コンピューター名を取得する関数
function getComputerName() {
  // Electron環境でのみosモジュールを使用
  if (typeof window !== 'undefined' && window.require) {
    try {
      const os = window.require('os')
      return os.hostname()
    } catch (e) {
      console.warn('Failed to get hostname from os module:', e)
    }
  } else if (typeof require !== 'undefined') {
    try {
      const os = require('os')
      return os.hostname()
    } catch (e) {
      console.warn('Failed to get hostname from os module:', e)
    }
  }
  
  // フォールバック: ブラウザ環境では一意の識別子を生成
  if (typeof window !== 'undefined') {
    // ローカルストレージから既存のIDを取得、なければ新規生成
    let deviceId = localStorage.getItem('rakufuri-device-id')
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('rakufuri-device-id', deviceId)
    }
    return deviceId
  }
  
  return 'unknown-device'
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
      let computer = getComputerName()
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
        response = await axios.post(url, formData)
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        status = err.response?.status || err.code
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
      let computer = getComputerName()
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
        response = await axios.post(url, formData)
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        status = err.response?.status || err.code
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
        response = await axios.get(url)
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        status = err.response?.status || err.code
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
        response = await axios.post(url, formData)
        this.log.request('access info:url->' + url + ' status->' + status)
      } catch (err) {
        status = err.response?.status || err.code
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
