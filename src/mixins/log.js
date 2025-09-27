// import { remote } from 'electron'
// var fs = require('fs')
// require('date-utils')

export class Log {
  constructor () {
    // フォルダチェック
    // if (!fs.existsSync(remote.app.getPath('userData') + '/log')) {
    //   fs.mkdirSync(remote.app.getPath('userData') + '/log')
    // }
    console.log('Log constructor called')
  }
  // リクエストログを出力
  request (message) {
    // var now = new Date()
    // fs.appendFileSync(remote.app.getPath('userData') + '/log/' + 'request.log', now.toFormat('YYYY-MM-DD HH24:MI:SS') + ':' + message + '\n')
    console.log('Request Log:', message)
  }
  // エラーログを出力
  error (message) {
    // var now = new Date()
    // fs.appendFileSync(remote.app.getPath('userData') + '/log/' + 'error.log', now.toFormat('YYYY-MM-DD HH24:MI:SS') + ':' + message + '\n')
    console.error('Error Log:', message)
  }
  // エクセルログを出力
  excel (message) {
    // fs.appendFileSync(remote.app.getPath('userData') + '/log/' + 'excel.log', message + '\n')
    console.log('Excel Log:', message)
  }
  // HTMLログを出力
  html (name, contents) {
    // var now = new Date()
    // if(!contents){
    //   contents = ''
    // }
    // fs.appendFileSync(remote.app.getPath('userData') + '/log/' + now.toFormat('YYYYMMDDHH24MISS') + '_' + name + '.html',  contents + '\n')
    console.log('HTML Log:', name, contents)
  }
  // ログのパスを取得
  getPath () {
    // return remote.app.getPath('userData') + '/log/'
    console.log('Log path requested')
    return '/tmp/log/'
  }
  // ログを削除
  clearLog () {
    // if (fs.existsSync(remote.app.getPath('userData') + '/log')) {
    //   var files = fs.readdirSync(remote.app.getPath('userData') + '/log')
    //   for (let file in files) {
    //     fs.unlinkSync(remote.app.getPath('userData') + '/log/' + files[file])
    //   }
    // }
    console.log('Clear log called')
  }
  // エクセルログを削除
  rmExcel () {
    // if (fs.existsSync(remote.app.getPath('userData') + '/log/' + 'excel.log')) {
    //   fs.unlinkSync(remote.app.getPath('userData') + '/log/' + 'excel.log')
    // }
    console.log('Remove excel log called')
  }
}
