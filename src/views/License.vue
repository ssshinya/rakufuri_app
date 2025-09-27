<template>
<div class="contents">
  <Header :activeIdx="5"></Header>
  <el-container>
  <SideMenu :activeIdx="1"></SideMenu>
  <el-main>
    <!-- ライセンス認証 -->
    <div class="license">
      <div :class="license_done"><el-tag type="success">ライセンス認証済み</el-tag></div>
      <div :class="license_none"><el-tag type="warning">ライセンス未認証</el-tag></div>
      <el-form ref="licenseForm" :rules="licenseRules" :model="licenseForm" label-width="120px">
        <el-form-item label="メールアドレス" prop="email">
          <el-input v-model="licenseForm.email"></el-input>
        </el-form-item>
        <el-form-item label="パスワード" prop="password">
          <el-input v-model="licenseForm.password" type="password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitLicense()">認証</el-button>
      </el-form>
    </div>
    <!-- アカウント -->
    <div style="display:none;">
      アカウント
    </div>
  </el-main>
  </el-container>
</div>
</template>

<script>
  import Header from '@/components/Header.vue'
  import SideMenu from '@/components/side_menu/Setting.vue'
  import { AssistantApi } from '../mixins/assistantApi'
  import consts from '../mixins/consts'
  import util from '../mixins/utilty'
  import 'date-utils'

  export default {
    components: {Header, SideMenu},
    mixins: [ consts ],
    created () {
      this.constDB = util.getDatastore('const.db')
      this.checkToken()
    },
    data () {
      return {
        constDB: null,
        license_done: 'status hidden',
        license_none: 'status',
        // ライセンスForm
        licenseForm: {
          email: '',
          password: ''
        },
        // ライセンスRules
        licenseRules: {
          email: [
            { required: true, message: 'メールアドレスを入力してください', trigger: 'change' }
          ],
          password: [
            { required: true, message: 'パスワードを入力してください', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      // Tokenを持っているかチェックします。
      async checkToken () {
        var result = await this.constDB.findOne({name: consts.const_assistant_token})
        if (result) {
          this.license_done = 'status'
          this.license_none = 'status hidden'
        } else {
          this.license_done = 'status hidden'
          this.license_none = 'status'
        }
      },
      // ライセンスsubmit
      submitLicense () {
        // バリデーション
        this.$refs['licenseForm'].validate((valid) => {
          if (valid) {
            var assistantApi = new AssistantApi()
            // ライセンス認証
            assistantApi.getToken(this.$refs['licenseForm'].model['email'], this.$refs['licenseForm'].model['password'], this.doneGetToken)
          } else {
            util.showErrorBox('入力内容に不備があります')
            return false
          }
        })
      },
      // Token取得後
      async doneGetToken (json) {
        // token取得
        if (json.result === consts.api_token_ok) {
          // 認証OK、最終チェック日を入れる
          // ライセンスキーを設定
          var lisence = await this.constDB.findOne({name: consts.const_lisence_key})
          var now = new Date()
          if (lisence) {
            await this.constDB.update({_id: lisence._id}, {$set: {value: now.toFormat('YYYY-MM-DD HH24:MI:SS')}})
          } else {
            await this.constDB.insert({name: consts.const_lisence_key, value: now.toFormat('YYYY-MM-DD HH24:MI:SS')})
          }
          // ラクフリTokenを設定
          var token = await this.constDB.findOne({name: consts.const_assistant_token})
          if (token) {
            await this.constDB.update({_id: token._id}, {$set: {value: json.token}})
          } else {
            await this.constDB.insert({name: consts.const_assistant_token, value: json.token})
          }
          // ライセンス認証（Deluxeを確認）
          var lflg = await util.checkLicense()
          if (!lflg) {
            var t = await this.constDB.findOne({name: consts.const_assistant_token})
            await this.constDB.remove({_id: t._id})
            this.hiddenLicense()
            return
          }
          this.doneLicense()
        } else if (json.result === consts.api_token_ng) {
          util.showErrorBox('利用できません')
        } else if (json.result === consts.api_token_non_user) {
          util.showErrorBox('メールアドレスかパスワードが間違っています')
        } else if (json.result === consts.api_token_duplication) {
          util.showErrorBox('他のパソコンでの利用を検知しました')
        } else {
          util.showErrorBox('利用できません')
        }
      },
      doneLicense () {
        util.showInfoBox('認証しました')
        this.license_done = 'status'
        this.license_none = 'status hidden'
      },
      hiddenLicense () {
        this.license_done = 'status hidden'
        this.license_none = 'status'
      }
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.contents {
  background: #f8fafc !important;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.license {
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.license .status {
  margin: 0 0 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.license .status.hidden {
  display: none;
}

.el-container {
  background: #f8fafc !important;
}

.el-main {
  background: transparent !important;
  padding: 0;
}

.el-form {
  background: white;
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.el-form-item {
  background: white;
  margin-bottom: 24px;
  text-align: left;
}

.el-form-item__label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

/* 必須項目のアスタリスクとラベルの間の隙間を削除 */
.el-form-item.is-required .el-form-item__label::before {
  margin-right: 0;
}

.el-input__wrapper {
  border-radius: 8px;
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
  box-shadow: none;
  background-color: #fff;
}

.el-input__wrapper:hover {
  border-color: #3498db;
}

.el-input__wrapper.is-focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.el-input__inner {
  border: none;
  transition: all 0.3s ease;
  font-size: 14px;
  padding: 12px 16px;
  background: transparent;
}

.el-input__inner:focus {
  border: none;
  box-shadow: none;
}

.el-button {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 12px 32px;
  font-size: 16px;
}

.el-button--primary {
  background: linear-gradient(135deg, #3498db, #2ecc71);
  border: none;
  color: white;
  margin-top: 10px;
}

.el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.3);
}

.el-tag {
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: 600;
  font-size: 14px;
  border: none;
}

.el-tag--success {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.el-tag--warning {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .license {
    margin: 10px;
    padding: 20px;
  }
  
  .el-form {
    padding: 20px;
  }
  
  .el-button--primary {
    width: 100%;
  }
}
</style>