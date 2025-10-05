<template>
  <div class="contents">
    <Header :activeIdx="5"></Header>
    <el-container>
    <SideMenu :activeIdx="2"></SideMenu>
    <el-main>
      <div class="entryAccount" id="entryAccount" >
        <el-form ref="addAccountForm" :rules="addAccountRules" :model="addAccountForm" label-width="120px">
          <el-form-item label="サイト" prop="site" class="site">
            <el-radio-group v-model="addAccountForm.site" @change='changeSite'>
              <el-radio label="0">ラクマ</el-radio>
              <el-radio label="1">Yahoo!フリマ</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="ID" prop="email">
            <el-input v-model="addAccountForm.email"></el-input>
          </el-form-item>
          <el-form-item id="password" label="パスワード" prop="password" v-show="showPassword">
            <el-input v-model="addAccountForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item class="center-button">
          <el-button type="primary" @click="submitAddAccount()">認証</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="verifyCode" id="verifyCode">
        <el-form ref="verifyCodeForm" :rules="verifyCodeRules" :model="verifyCodeForm" label-width="120px">
          <el-form-item label="認証コード" prop="code">
            <el-input v-model="verifyCodeForm.code"></el-input>
          </el-form-item>
          <el-form-item class="center-button">
            <el-button type="primary" @click="submitVerifyCode()">認証</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="pw" id="pw">
        <el-form ref="verifyPwForm" :rules="verifyPwRules" :model="verifyPwForm" label-width="120px">
          <el-form-item label="パスワード" prop="pw">
            <el-input v-model="verifyPwForm.pw"></el-input>
          </el-form-item>
          <el-form-item class="center-button">
            <el-button type="primary" @click="submitVerifyPw()">認証</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="postData" id="postData" >
        <el-form ref="postDataForm" :rules="postDataRules" :model="postDataForm" label-width="120px">
          <p style="padding:10px;text-align:center;">追加情報を入力してください</p>
          <el-form-item label="種類" prop="kind" class="kind">
            <el-radio-group v-model="postDataForm.kind">
              <p><el-radio label="0">メールアドレス</el-radio></p>
              <p><el-radio label="1">郵便番号（ハイフンなし）</el-radio></p>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="内容" prop="data">
            <el-input v-model="postDataForm.data"></el-input>
          </el-form-item>
          <el-form-item class="center-button">
          <el-button type="primary" @click="submitPostData()">入力する</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
    </el-container>
  </div>
  </template>
  
  <script>
    import Header from '@/components/Header.vue'
    import SideMenu from '@/components/side_menu/Setting.vue'
    import { RakumaApi } from '../mixins/rakumaApi.js'
    import { PaypayApi } from '../mixins/paypayApi.js'
    import consts from '../mixins/consts.js'
    import { Log } from '../mixins/log.js'
    import util from '../mixins/utilty.js'
    import 'date-utils'
  
    export default {
      components: {Header, SideMenu},
      mixins: [ consts ],
      data () {
        return {
          accountData: null,
          accountDB: null,
          modifyFlg: false,
          modifyAccount: null,
          rakumaApi: null,
          paypayApi: null,
          showPassword: true,
          // アカウントForm
          addAccountForm: {
            site: '',
            email: '',
            password: ''
          },
          // アカウントRules
          addAccountRules: {
            site: [
              { required: true, message: 'サイトを選択してください', trigger: 'change' }
            ],
            email: [
              { required: true, message: 'IDを入力してください', trigger: 'change' }
            ],
            password: [
              { required: true, message: 'パスワードを入力してください', trigger: 'change' }
            ]
          },
          // 認証コードForm
          verifyCodeForm: {
            code: ''
          },
          // 認証コードRules
          verifyCodeRules: {
            code: [
              { required: true, message: '認証コードを入力してください', trigger: 'change' }
            ]
          },
          // パスワードForm
          verifyPwForm: {
            pw: ''
          },
          // パスワードRules
          verifyPwRules: {
            pw: [
              { required: true, message: 'パスワードを入力してください', trigger: 'change' }
            ]
          },
          // 追加情報Form
          postDataForm: {
            kind: '',
            data: ''
          },
          // 追加情報Rules
          postDataRules: {
            kind: [
              { required: true, message: '項目を選択してください', trigger: 'change' }
            ],
            data: [
              { required: true, message: 'データを入力してください', trigger: 'change' }
            ]
          },
        }
      },
      created () {
        this.accountDB = util.getDatastore('account.db')
        this.rakumaApi = new RakumaApi()
        this.paypayApi = new PaypayApi()
      },
      mounted () {
        this.init()
      },
      methods: {
        async init () {
          // 初期表示
          util.noneDom('verifyCode')
          util.noneDom('pw')
          util.noneDom('postData')
          util.showDom('entryAccount')
          if (this.$route.query.id) {
            // 修正
            this.modifyFlg = true
            const query = {_id: this.$route.query.id}
            var result = await this.accountDB.findOne(query)
            this.modifyAccount = result
            // データを入れる
            this.addAccountForm.email = this.modifyAccount.email
            const site = this.modifyAccount.site
            if (!site) {
              this.addAccountForm.site = '0'
            } else if(site=='r') {
              this.addAccountForm.site = '0'
            } else if(site=='p') {
              this.addAccountForm.site = '1'
            }
            this.changeSite()
          } else {
            // 登録
            this.modifyFlg = false
          }
        },
        // サイト変更
        async changeSite () {
          try {
            // サイト取得
            var site = this.addAccountForm.site
            // サイト判定
            if (site === '0'){
              let result = await util.checkSiteLicense(this, 'r')
              if (!result) {
                util.showErrorBox('ラクマのアカウントは追加できません')
                this.addAccountForm.site = ''
                return
              }
              // ラクマ
              this.showPassword = true
              // パスワードルールを復元
              this.addAccountRules.password = [
                { required: true, message: 'パスワードを入力してください', trigger: 'change' }
              ]
            } else {
              // paypay
              let result = await util.checkSiteLicense(this, 'p')
              if (!result) {
                util.showErrorBox('PayPayのアカウントは追加できません')
                this.addAccountForm.site = ''
                return
              }
              this.showPassword = false
              delete this.addAccountRules.password
            }
          } catch (error) {
            console.error('changeSite error:', error)
            var log = new Log()
            log.error(error)
            util.showSystemErrorBox()
          }
        },
        // submit
        async submitAddAccount () {
          // バリデーション
          this.$refs['addAccountForm'].validate(async (valid) => {
            if (valid) {
              try {
                // ライセンスチェック
                var lflg = await util.checkLicense()
                if (!lflg) {
                  return
                }
                // ローディング
                util.showDom('loading')
                // サイト取得
                var site = this.addAccountForm.site
                // サイト判定
                if (site === '0'){
                  // ラクマ
                  // アカウント認証
                  this.accountData = await this.rakumaApi.login(this.addAccountForm.email, this.addAccountForm.password)
                  // ログイン結果取得
                  if (this.accountData) {
                    util.showInfoBox(this.accountData.message)
                    // 表示変更
                    util.noneDom('entryAccount')
                    util.showDom('verifyCode')
                  } else {
                    util.showErrorBox('認証できませんでした')
                  }
                } else if (site === '1') {
                  // paypay
                  // アカウント認証
                  this.accountData = await this.paypayApi.login(this.addAccountForm.email, this.addAccountForm.password)
                  // ログイン結果取得
                  if (this.accountData) {
                    // パスワード認証
                    if (this.accountData.pwFlg===true){
                      // 表示変更
                      util.noneDom('entryAccount')
                      util.showDom('pw')
                      this.verifyPwForm.pw = ''
                    // 認証コード時
                    } else {
                      // ページ全体のテキストから該当文が含まれているかを確認
                      const targetText = 'に届いた確認コードを入力してください。';
                      const textExists = await this.accountData.page.evaluate((text) => {
                        return document.body.innerText.includes(text)
                      }, targetText)
                      if (textExists) {
                        // 確認コード認証（SMS or メール）
                        util.showInfoBox('確認コードを送信しました')
                        // 表示変更
                        util.noneDom('entryAccount')
                        util.showDom('verifyCode')
                        this.verifyCodeForm.code = ''
                      } else {
                        util.showErrorBox('認証できませんでした')
                      }
                    }
                  } else {
                    util.showErrorBox('認証できませんでした')
                  }
                }
                // ローディング
                util.noneDom('loading')
              } catch (error) {
                // ローディング
                util.noneDom('loading')
                var log = new Log()
                log.error(error)
                util.showSystemErrorBox()
              }
            } else {
              util.showErrorBox('入力内容に不備があります')
              return false
            }
          })
        },
        // パスワードsubmit
        async submitVerifyPw () {
          // バリデーション
          this.$refs['verifyPwForm'].validate(async (valid) => {
            if (valid) {
              try {
                // ローディング
                util.showDom('loading')
                // paypay
                // アカウント認証
                await this.paypayApi.verifyCode(this.accountData, this.verifyPwForm.pw, async (accountData) => {
                  if (accountData) {
                    this.accountData = accountData
                    // 重複チェック
                    var doc = await this.accountDB.findOne({ userId: this.accountData.userId })
                    if (doc) {
                      await this.accountDB.update({_id: doc._id}, {$set: this.accountData})
                    } else {
                      await this.accountDB.insert(this.accountData)
                    }
                    util.showInfoBox('認証しました')
                    this.$router.push('/account')
                  } else {
                    util.showErrorBox('認証できませんでした')
                    // 表示変更
                    util.showDom('entryAccount')
                    util.noneDom('verifyCode')
                    util.noneDom('pw')
                    util.noneDom('postData')
                  }
                })
                // ローディング
                util.noneDom('loading')
              } catch (error) {
                // ローディング
                util.noneDom('loading')
                var log = new Log()
                log.error(error)
                util.showSystemErrorBox()
              }
            } else {
              util.showErrorBox('入力内容に不備があります')
              return false
            }
          })
        },
        // 認証コードsubmit
        async submitVerifyCode () {
          // バリデーション
          this.$refs['verifyCodeForm'].validate(async (valid) => {
            if (valid) {
              try {
                // ローディング
                util.showDom('loading')
                // サイト取得
                var site = this.addAccountForm.site
                // サイト判定
                if (site === '0'){
                  // ラクマ
                  // アカウント認証
                  var result = await this.rakumaApi.verifyCode(this.accountData, this.verifyCodeForm.code)
                  // ログイン結果取得
                  if (result) {
                    // アカウント認証OK
                    var profile = await this.rakumaApi.getProfile(result)
                    // プロフィール取得結果
                    if (profile) {
                      // 認証OK
                      this.accountData = profile
                      this.accountData.site = 'r'
                      // 不要な要素を削除
                      delete this.accountData.authenticityToken
                      delete this.accountData.message
                      delete this.accountData.otpRequestId
                      delete this.accountData.jar
                      // 重複チェック
                      var doc = await this.accountDB.findOne({ userId: this.accountData.userId })
                      if (doc) {
                        await this.accountDB.update({_id: doc._id}, {$set: this.accountData})
                      } else {
                        await this.accountDB.insert(this.accountData)
                      }
                      util.showInfoBox('認証しました')
                      this.$router.push('/account')
                    } else {
                      util.showErrorBox('認証できませんでした')
                    }
                  } else {
                    util.showErrorBox('認証できませんでした')
                  }
                } else if (site === '1') {
                  // paypay
                  // アカウント認証
                  await this.paypayApi.verifyCode(this.accountData, this.verifyCodeForm.code, async (accountData) => {
                    var log = new Log()
                    log.error("accountData:"+accountData)
                    if (accountData) {
                      // 追加情報が必要かどうか確認
                      if(accountData.userId==null){
                        // 表示変更
                        util.noneDom('entryAccount')
                        util.noneDom('verifyCode')
                        util.noneDom('pw')
                        util.showDom('postData')
                      }else{
                        // 追加情報必要なし
                        log.error("accountData.userId:"+accountData.userId)
                        this.accountData = accountData
                        // 重複チェック
                        var doc = await this.accountDB.findOne({ userId: this.accountData.userId })
                        if (doc) {
                          await this.accountDB.update({_id: doc._id}, {$set: this.accountData})
                        } else {
                          await this.accountDB.insert(this.accountData)
                        }
                        util.showInfoBox('認証しました')
                        this.$router.push('/account')
                      }
                    } else {
                      util.showErrorBox('認証できませんでした')
                      // 表示変更
                      util.showDom('entryAccount')
                      util.noneDom('verifyCode')
                      util.noneDom('pw')
                      util.noneDom('postData')
                    }
                  })
                }
                // ローディング
                util.noneDom('loading')
              } catch (error) {
                // ローディング
                util.noneDom('loading')
                var log = new Log()
                log.error(error)
                util.showSystemErrorBox()
              }
            } else {
              util.showErrorBox('入力内容に不備があります')
              return false
            }
          })
        },
        // 追加情報submit
        async submitPostData () {
          // バリデーション
          this.$refs['postDataForm'].validate(async (valid) => {
            if (valid) {
              try {
                // ローディング
                util.showDom('loading')
                // 種類を取得
                var kind = this.postDataForm.kind
                var data = this.postDataForm.data
                // アカウント認証
                this.accountData["postFlg"] = true
                this.accountData["kind"] = kind
                await this.paypayApi.postDataConfirm(this.accountData, kind, data, async (accountData) => {
                  var log = new Log()
                  log.error("postData:accountData:"+accountData)
                  if (accountData) {
                    this.accountData = accountData
                    // 重複チェック
                    var doc = await this.accountDB.findOne({ userId: this.accountData.userId })
                    if (doc) {
                      await this.accountDB.update({_id: doc._id}, {$set: this.accountData})
                    } else {
                      await this.accountDB.insert(this.accountData)
                    }
                    util.showInfoBox('認証しました')
                    this.$router.push('/account')
                  } else {
                    util.showErrorBox('認証できませんでした')
                    // 表示変更
                    util.showDom('entryAccount')
                    util.noneDom('verifyCode')
                    util.noneDom('pw')
                    util.noneDom('postData')
                  }
                })
                // ローディング
                util.noneDom('loading')
              } catch (error) {
                // ローディング
                util.noneDom('loading')
                var log = new Log()
                log.error(error)
                util.showSystemErrorBox()
              }
            } else {
              util.showErrorBox('入力内容に不備があります')
              return false
            }
          })
        }
      }
    }
  </script>
  <style>
  .entryAccount{
    padding: 20px 30px 0 30px;
    width:100%;
  }
  .entryAccount .site .el-radio{
    margin-right: 20px;
  }
  .verifyCode{
    padding: 20px 30px 0 30px;
    text-align: center;
    width:100%;
  }
  .pw{
    padding: 20px 30px 0 30px;
    text-align: center;
    width:100%;
  }
  .kind p{
   padding: 15px 0 0 0;
  }
  .center-button {
    text-align: center;
  }
  .center-button .el-form-item__content {
    margin-left: 0 !important;
    justify-content: center;
    display: flex;
  }
  </style>
  