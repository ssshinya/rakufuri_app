<template>
  <div class="contents">
    <Header :activeIdx="1"></Header>
    <el-container>
    <SideMenu :activeIdx="2"
      @entryItem="entryItem"
      @deleteItem="deleteItem"
      @modifyItem="modifyItem"
      @entryExhibition="entryExhibition"></SideMenu>
    <el-main>
      <!-- 商品登録 -->
      <div id="item_entry" class="item_entry">
        <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="140px">
          <el-form-item label="商品画像" class="images" prop="image1">
            <div id="image1_div" class="image" @click="selectImage('1')">
              <img id='image1' src="@/assets/picture.jpg">
            </div>
            <img id='close1' src="@/assets/close.png" class="close" @click="closeImage('1')">
            <div id="image2_div" class="image" @click="selectImage('2')">
              <img id="image2" src="@/assets/picture.jpg">
            </div>
            <img id='close2' src="@/assets/close.png" class="close" @click="closeImage('2')">
            <div id="image3_div" class="image" @click="selectImage('3')">
              <img id="image3" src="@/assets/picture.jpg">
            </div>
            <img id='close3' src="@/assets/close.png" class="close" @click="closeImage('3')">
            <div id="image4_div" class="image" @click="selectImage('4')">
              <img id="image4" src="@/assets/picture.jpg">
            </div>
            <img id='close4' src="@/assets/close.png" class="close" @click="closeImage('4')">
            <div id="image5_div" class="image" @click="selectImage('5')">
              <img id="image5" src="@/assets/picture.jpg">
            </div>
            <img id='close5' src="@/assets/close.png" class="close" @click="closeImage('5')">
            <div id="image6_div" class="image" @click="selectImage('6')">
              <img id='image6' src="@/assets/picture.jpg">
            </div>
            <img id='close6' src="@/assets/close.png" class="close" @click="closeImage('6')">
            <div id="image7_div" class="image" @click="selectImage('7')">
              <img id="image7" src="@/assets/picture.jpg">
            </div>
            <img id='close7' src="@/assets/close.png" class="close" @click="closeImage('7')">
            <div id="image8_div" class="image" @click="selectImage('8')">
              <img id="image8" src="@/assets/picture.jpg">
            </div>
            <img id='close8' src="@/assets/close.png" class="close" @click="closeImage('8')">
            <div id="image9_div" class="image" @click="selectImage('9')">
              <img id="image9" src="@/assets/picture.jpg">
            </div>
            <img id='close9' src="@/assets/close.png" class="close" @click="closeImage('9')">
            <div id="image10_div" class="image" @click="selectImage('10')">
              <img id="image10" src="@/assets/picture.jpg">
            </div>
            <img id='close10' src="@/assets/close.png" class="close" @click="closeImage('10')">
            <el-input v-model="ruleForm.image1" class="hidden"></el-input>
            <el-input v-model="ruleForm.image2" class="hidden"></el-input>
            <el-input v-model="ruleForm.image3" class="hidden"></el-input>
            <el-input v-model="ruleForm.image4" class="hidden"></el-input>
            <el-input v-model="ruleForm.image5" class="hidden"></el-input>
            <el-input v-model="ruleForm.image6" class="hidden"></el-input>
            <el-input v-model="ruleForm.image7" class="hidden"></el-input>
            <el-input v-model="ruleForm.image8" class="hidden"></el-input>
            <el-input v-model="ruleForm.image9" class="hidden"></el-input>
            <el-input v-model="ruleForm.image10" class="hidden"></el-input>
          </el-form-item>
          <el-form-item label="商品名" prop="name">
            <el-input v-model="ruleForm.name" maxlength="40" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="商品説明" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc" maxlength="950" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="カテゴリー" prop="category" class="category">
            <el-input id="rakuma_category_txt" placeholder="ラクマ" :readonly="true"></el-input>
            <i id='rakuma_category_clear' class="el-icon-circle-close" @click="clearRakumaCategory()"></i>
            <el-button @click="selectRakumaCategory()" type="info">選択</el-button>
            <el-input v-model="ruleForm.rakumaCategory" class="hidden"></el-input>
            <el-input v-model="ruleForm.rakumaCategoryId" class="hidden"></el-input>
            <el-input id="paypay_category_txt" placeholder="PayPay" :readonly="true"></el-input>
            <i id='paypay_category_clear' class="el-icon-circle-close" @click="clearPaypayCategory()"></i>
            <el-button @click="selectPaypayCategory()" type="info">選択</el-button>
            <el-input v-model="ruleForm.paypayCategory" class="hidden"></el-input>
            <el-input v-model="ruleForm.paypayCategoryId" class="hidden"></el-input>
          </el-form-item>
          <el-form-item label="サイズ" prop="size" class="size">
            <el-select v-model="ruleForm.rakumaSize" placeholder="ラクマ">
              <el-option
                v-for="rakumaSize in rakumaSizes"
                :key="rakumaSize.id"
                :label="rakumaSize.name"
                :value="rakumaSize.id">
              </el-option>
            </el-select>
            <el-select v-model="ruleForm.paypaySize" placeholder="PayPay">
              <el-option
                v-for="paypaySize in paypaySizes"
                :key="paypaySize.id"
                :label="paypaySize.name"
                :value="paypaySize.id">
              </el-option>
            </el-select>
            <el-input v-model="ruleForm.paypaySpecsId" class="hidden"></el-input>
            <el-input v-model="ruleForm.paypaySpecsName" class="hidden"></el-input>
          </el-form-item>
          <el-form-item label="ブランド" class="brand" prop="brand">
            <el-input id="rakuma_brand_txt" placeholder="ラクマ" :readonly="true"></el-input>
            <i id='rakuma_brand_clear' class="el-icon-circle-close" @click="clearRakumaBrand()"></i>
            <el-button @click="selectRakumaBrand()" type="info">選択</el-button>
            <el-input v-model="ruleForm.rakumaBrand" class="hidden"></el-input>
            <el-input id="paypay_brand_txt" placeholder="PayPay"  :readonly="true"></el-input>
            <i id='paypay_brand_clear' class="el-icon-circle-close" @click="clearPaypayBrand()"></i>
            <el-button @click="selectPaypayBrand()" type="info">選択</el-button>
            <el-input v-model="ruleForm.paypayBrand" class="hidden"></el-input>
          </el-form-item>
          <el-form-item label="商品の状態" prop="condition" class="condition">
            <el-select v-model="ruleForm.rakumaCondition" placeholder="ラクマ">
              <el-option
                v-for="condition in rakuma_conditions"
                :key="condition.id"
                :label="condition.name"
                :value="condition.id"></el-option>
            </el-select>
            <el-select v-model="ruleForm.paypayCondition" placeholder="PayPay">
              <el-option
                v-for="condition in paypay_conditions"
                :key="condition.id"
                :label="condition.name"
                :value="condition.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配送料の負担" prop="rakuma_shipping_payers">
            <el-select v-model="ruleForm.rakuma_shipping_payers" placeholder="ラクマ" @change="selectShipping($event)">
              <el-option
                v-for="shipping_payer in rakuma_shipping_payers"
                :key="shipping_payer.id"
                :label="shipping_payer.name"
                :value="shipping_payer.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配送の方法" prop="shipping_methods" class="shipping_methods">
            <el-select v-model="ruleForm.rakuma_shipping_methods" placeholder="ラクマ">
              <el-option
                v-for="shipping_method in rakuma_shipping_methods"
                :key="shipping_method.id"
                :label="shipping_method.name"
                :value="shipping_method.id">
              </el-option>
            </el-select>
            <el-select v-model="ruleForm.paypay_shipping_methods" placeholder="PayPay">
              <el-option
                v-for="shipping_method in paypay_shipping_methods"
                :key="shipping_method.id"
                :label="shipping_method.name"
                :value="shipping_method.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配送までの日数" prop="rakuma_shipping_durations">
            <el-select v-model="ruleForm.rakuma_shipping_durations" placeholder="選択してください">
              <el-option
                v-for="shipping_duration in rakuma_shipping_durations"
                :key="shipping_duration.id"
                :label="shipping_duration.name"
                :value="shipping_duration.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配送元の地域" prop="rakuma_shipping_from_areas">
            <el-select v-model="ruleForm.rakuma_shipping_from_areas" placeholder="選択してください">
              <el-option
                v-for="pref in rakuma_prefs"
                :key="pref.id"
                :label="pref.name"
                :value="pref.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="購入申請" prop="rakuma_request_required">
            <el-radio-group v-model="ruleForm.rakuma_request_required">
              <el-radio label="1">あり</el-radio>
              <el-radio label="0">なし</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品金額" class="price" prop="price">
            <el-input v-model.number="ruleForm.price"></el-input>円
          </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登録</el-button>
          <el-button @click="resetForm('ruleForm')">クリア</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- カテゴリー -->
      <div id="category_body" class="category_body">
        <div class="title">カテゴリーを選択</div>
        <div id='category_selection' class="category_selection"></div>
        <el-table
          ref="singleTable"
          :data="categoryList"
          highlight-current-row
          border
          @current-change="handleCategoryChange"
          :show-header="false"
          height="290"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="カテゴリー">
          </el-table-column>
        </el-table>
        <div class="btn">
          <el-button @click="cancelCategory()">戻る</el-button>
        </div>
      </div>
      <!-- ブランド -->
      <div id="brand_body" class="brand_body">
        <div class="title">ブランド選択</div>
        <div class="filter">
          <el-input placeholder="絞り込み" v-model="filter">
            <el-button slot="append" icon="el-icon-search" @click="changeFilter()"></el-button>
          </el-input>
        </div>
        <el-table
          ref="singleTable"
          :data="brandList"
          highlight-current-row
          border
          @current-change="handleCurrentChange"
          height="290"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="ブランド名">
          </el-table-column>
        </el-table>
        <div class="btn">
          <el-button @click="cancelBrand()">戻る</el-button>
          <el-button type="primary" @click="choseBrand()">選択</el-button>
        </div>
      </div>
    </el-main>
    </el-container>
  </div>
  </template>
  
  <script>
  import Header from '@/components/Header.vue'
  import SideMenu from '@/components/side_menu/Item.vue'
  import consts from '../mixins/consts'
  import util from '../mixins/utilty'
  // import { remote } from 'electron'
  import image from '../mixins/image'
  import { Log } from '../mixins/log'
  import { PaypayApi } from '../mixins/paypayApi'
  // const fs = require('fs')
  
    export default {
      components: {Header, SideMenu},
      mixins: [ consts ],
      async created () {
        // DB
        // this.itemDB = util.getDatastore('items.db')
        this.paypayApi = new PaypayApi()
        // masterデータ取得
        // this.rakumaCategory1 = JSON.parse(sessionStorage.getItem('categoryRakuma1'))
        // this.rakumaCategory2 = JSON.parse(sessionStorage.getItem('categoryRakuma2'))
        // this.rakumaCategory3 = JSON.parse(sessionStorage.getItem('categoryRakuma3'))
        // this.sizeAll = JSON.parse(sessionStorage.getItem('sizeRakuma'))
        // this.rakumaBrandAll = JSON.parse(localStorage.getItem('brandRakuma'))
        console.log('EntryItem created')
      },
      mounted () {
        this.entryItemInit()
        util.noneDom('category_body')
        util.noneDom('brand_body')
        console.log('EntryItem mounted')
      },
      data () {
        // 商品価格カスタムルール
        var checkPrice = (rule, value, callback) => {
          if (value < 300 || value > 2000000) {
            callback(new Error('300～2,000,000の間で入力してください'))
          } else {
            callback()
          }
        }
        // 商品画像カスタムルール
        var checkImage = (rule, value, callback) => {
          var image1 = this.$refs['ruleForm'].model['image1']
          var image2 = this.$refs['ruleForm'].model['image2']
          var image3 = this.$refs['ruleForm'].model['image3']
          var image4 = this.$refs['ruleForm'].model['image4']
          var image5 = this.$refs['ruleForm'].model['image5']
          var image6 = this.$refs['ruleForm'].model['image6']
          var image7 = this.$refs['ruleForm'].model['image7']
          var image8 = this.$refs['ruleForm'].model['image8']
          var image9 = this.$refs['ruleForm'].model['image9']
          var image10 = this.$refs['ruleForm'].model['image10']
          if (!image1 && !image2 && !image3 && !image4 && !image5 && !image6 && !image7 && !image8 && !image9 && !image10) {
            callback(new Error('商品画像がありません'))
          } else {
            callback()
          }
        }
        // カテゴリーカスタムルール
        var checkCategory = (rule, value, callback) => {
          if (!this.$refs['ruleForm'].model['rakumaCategory'] && !this.$refs['ruleForm'].model['paypayCategory']) {
            callback(new Error('カテゴリーが選択されていません'))
          } else {
            callback()
          }
        }
        // サイト情報チェック
        var checkSiteRequiredCategory= (rule, value, callback) => {
          if (!this.$refs['ruleForm'].model['rakumaCategory'] &&
            (this.$refs['ruleForm'].model['rakumaCondition'] || this.$refs['ruleForm'].model['rakuma_shipping_methods'] )) {
            callback(new Error('ラクマのカテゴリーが選択されていません'))
          } else if (!this.$refs['ruleForm'].model['paypayCategory'] &&
            (this.$refs['ruleForm'].model['paypayCondition'] || this.$refs['ruleForm'].model['paypay_shipping_methods'])) {
            callback(new Error('PayPayのカテゴリーが選択されていません'))
          } else {
            callback()
          }
        }
        // サイズカスタムルール
        var checkSize = (rule, value, callback) => {
          if (this.rakumaSizes && value === null && this.rakumaSizes.length > 0 && this.rakumaSizes[0].id !== ''
              && this.paypaySizes && value === null && this.paypaySizes.length > 0 && this.rakumaSizes[0].id !== '') {
            callback(new Error('サイズが選択されていません'))
          } else {
            callback()
          }
        }
        // 商品の状態カスタムルール
        var checkCondition = (rule, value, callback) => {
          if (!this.$refs['ruleForm'].model['rakumaCondition'] && !this.$refs['ruleForm'].model['paypayCondition']) {
            callback(new Error('商品の状態が選択されていません'))
          } else {
            callback()
          }
        }
        // サイト情報チェック
        var checkSiteRequiredCondition = (rule, value, callback) => {
          if (!this.$refs['ruleForm'].model['rakumaCondition'] &&
            (this.$refs['ruleForm'].model['rakumaCategory'] || this.$refs['ruleForm'].model['rakuma_shipping_methods'] )) {
            callback(new Error('ラクマの商品の状態が選択されていません'))
          } else if (!this.$refs['ruleForm'].model['paypayCondition'] &&
            (this.$refs['ruleForm'].model['paypayCategory'] || this.$refs['ruleForm'].model['paypay_shipping_methods'])) {
            callback(new Error('PayPayの商品の状態が選択されていません'))
          } else {
            callback()
          }
        }
        // 配送料の負担カスタムルール
        var checkShippingPayers = (rule, value, callback) => {
          if (this.$refs['ruleForm'].model['rakuma_shipping_methods'] && !this.$refs['ruleForm'].model['rakuma_shipping_payers']) {
            callback(new Error('配送料の負担が選択されていません'))
          }
          callback()
        }
        // 配送の方法の状態カスタムルール
        var checkShippingMethods = (rule, value, callback) => {
          if (!this.$refs['ruleForm'].model['rakuma_shipping_methods'] && !this.$refs['ruleForm'].model['paypay_shipping_methods']) {
            callback(new Error('配送の方法が選択されていません'))
          }
          callback()
        }
        // サイト情報チェック
        var checkSiteRequiredShippingMethods = (rule, value, callback) => {
          if (!this.$refs['ruleForm'].model['rakuma_shipping_methods'] &&
            (this.$refs['ruleForm'].model['rakumaCategory'] || this.$refs['ruleForm'].model['rakumaCondition'] )) {
            callback(new Error('ラクマの配送の方法が選択されていません'))
          } else if (!this.$refs['ruleForm'].model['paypay_shipping_methods'] &&
            (this.$refs['ruleForm'].model['paypayCategory'] || this.$refs['ruleForm'].model['paypayCondition'])) {
            callback(new Error('PayPayの配送の方法が選択されていません'))
          } else {
            callback()
          }
        }
        // 購入申請チェック
        var checkSiteRequiredRequest = (rule, value, callback) => {
          if (!this.$refs['ruleForm'].model['rakuma_request_required'] &&
            (this.$refs['ruleForm'].model['rakumaCategory'] || this.$refs['ruleForm'].model['rakumaCondition'] || this.$refs['ruleForm'].model['rakuma_shipping_methods'] )) {
            callback(new Error('ラクマの購入申請が選択されていません'))
          } else {
            callback()
          }
        }
        return {
          itemDB: null,
          paypayApi: null,
          // 定数を取得
          modifyFlg: false,
          modifyData: null,
          categorySite: null,
          rakumaCategory1: null,
          rakumaCategory2: null,
          rakumaCategory3: null,
          rakumaSizes: null,
          paypaySizes: null,
          sizeAll: null,
          brandSite: null,
          rakumaBrandAll: null,
          paypayBrandAll: null,
        rakuma_conditions: consts.rakuma_condition,
        paypay_conditions: consts.paypay_condition,
        rakuma_shipping_payers: consts.rakuma_shipping_payers,
        rakuma_shipping_methods: consts.shipping_methods_seller,
        shipping_methods_seller: consts.shipping_methods_seller,
        shipping_methods_buyer: consts.shipping_methods_buyer,
        paypay_shipping_methods: consts.paypay_shipping_methods,
        rakuma_shipping_durations: consts.rakuma_shipping_durations,
        paypay_shipping_durations: consts.paypay_shipping_durations,
        rakuma_prefs: consts.rakuma_prefs,
        paypay_prefs: consts.paypay_prefs,
        rakuma_request_required: consts.rakuma_request_required,
          // フォーム
          ruleForm: {
            image1: '',
            image2: '',
            image3: '',
            image4: '',
            image5: '',
            image6: '',
            image7: '',
            image8: '',
            image9: '',
            image10: '',
            name: '',
            desc: '',
            rakumaCategory: '',
            rakumaCategoryId: '',
            paypayCategory: '',
            paypayCategoryId: '',
            rakumaSize: '',
            paypaySize: '',
            paypaySpecsId: '',
            paypaySpecsName: '',
            rakumaBrand: '',
            paypayBrand: '',
            rakumaCondition: '',
            paypayCondition: '',
            rakuma_shipping_payers: '',
            rakuma_shipping_methods: '',
            paypay_shipping_methods: '',
            rakuma_shipping_durations: '',
            rakuma_shipping_from_areas: '',
            rakuma_request_required: '',
            price: ''
          },
          // フォームルール
          rules: {
            image1: [
              { required: true, validator: checkImage, trigger: 'change' }
            ],
            name: [
              { required: true, message: '商品名を入力してください', trigger: 'change' },
              { min: 0, max: 40, message: '商品名が40文字を超えています', trigger: 'change' }
            ],
            desc: [
              { required: true, message: '商品説明を入力してください', trigger: 'change' },
              { min: 0, max: 950, message: '商品説明が950文字を超えています', trigger: 'change' }
            ],
            category: [
              { required: true, validator: checkCategory, trigger: 'change' },
              { required: true, validator: checkSiteRequiredCategory, trigger: 'change' }
            ],
            size: [
              { validator: checkSize, trigger: 'change' }
            ],
            condition: [
              { required: true, validator: checkCondition, trigger: 'change' },
              { required: true, validator: checkSiteRequiredCondition, trigger: 'change' }
            ],
            rakuma_shipping_payers: [
              { required: false, validator: checkShippingPayers, trigger: 'change' }
            ],
            shipping_methods: [
              { required: true, validator: checkShippingMethods, trigger: 'change' },
              { required: true, validator: checkSiteRequiredShippingMethods, trigger: 'change' }
            ],
            rakuma_shipping_durations: [
              { required: true, message: '配送までの日数を選択してください', trigger: 'change' }
            ],
            rakuma_shipping_from_areas: [
              { required: true, message: '配送元の地域を選択してください', trigger: 'change' }
            ],
            rakuma_request_required: [
              { required: false, validator: checkSiteRequiredRequest, trigger: 'change' },
            ],
            price: [
              { required: true, message: '商品金額を入力してください', trigger: 'change' },
              {type: 'number', message: '数字を入力してください', trigger: 'change'},
              { validator: checkPrice, trigger: 'change' }
            ]
          },
          // カテゴリー
          categoryList: [],
          selectCategories: [],
          // ブランド
          allBrandList: [],
          brandList: [],
          filter: '',
          currentRow: null
        }
      },
      methods: {
        // 登録
        entryItem () {
          this.$router.push('index')
        },
        // 修正
        modifyItem () {
          this.$router.push('index')
        },
        // 削除
        deleteItem () {
          this.$router.push('index')
        },
        // 出品登録
        entryExhibition () {
          this.$router.push('index')
        },
        async entryItemInit () {
          // 初期表示
          console.log('EntryItem init')
          // if (this.$route.query.id) {
          //   // 修正
          //   this.modifyFlg = true
          //   const query = {_id: this.$route.query.id}
          //   var doc = await this.itemDB.findOne(query)
          //   await this.showItem(doc)
          // } else {
          //   // 登録
          //   this.modifyFlg = false
          // }
        },
        // 修正時、選択された商品を表示
        async showItem (doc) {
          try {
            // 変更前のデータ
            this.modifyData = doc
            // 配送方法を設定
            if (this.modifyData.rakuma_shipping_payers === '1') {
              this.rakuma_shipping_methods = this.shipping_methods_seller
            } else {
              this.rakuma_shipping_methods = this.shipping_methods_buyer
            }
            // データを入れる
            this.$refs['ruleForm'].model['image1'] = this.modifyData.image1
            this.$refs['ruleForm'].model['image2'] = this.modifyData.image2
            this.$refs['ruleForm'].model['image3'] = this.modifyData.image3
            this.$refs['ruleForm'].model['image4'] = this.modifyData.image4
            this.$refs['ruleForm'].model['image5'] = this.modifyData.image5
            this.$refs['ruleForm'].model['image6'] = this.modifyData.image6
            this.$refs['ruleForm'].model['image7'] = this.modifyData.image7
            this.$refs['ruleForm'].model['image8'] = this.modifyData.image8
            this.$refs['ruleForm'].model['image9'] = this.modifyData.image9
            this.$refs['ruleForm'].model['image10'] = this.modifyData.image10
            this.$refs['ruleForm'].model['name'] = this.modifyData.name
            this.$refs['ruleForm'].model['desc'] = this.modifyData.desc
            this.$refs['ruleForm'].model['rakumaCategory'] = this.modifyData.rakumaCategory
            this.$refs['ruleForm'].model['rakumaCategoryId'] = this.modifyData.rakumaCategoryId
            this.$refs['ruleForm'].model['paypayCategory'] = this.modifyData.paypayCategory
            this.$refs['ruleForm'].model['paypayCategoryId'] = this.modifyData.paypayCategoryId
            this.$refs['ruleForm'].model['rakumaBrand'] = this.modifyData.rakumaBrand
            this.$refs['ruleForm'].model['paypayBrand'] = this.modifyData.paypayBrand
            this.$refs['ruleForm'].model['rakumaCondition'] = this.modifyData.rakumaCondition
            this.$refs['ruleForm'].model['paypayCondition'] = this.modifyData.paypayCondition
            this.$refs['ruleForm'].model['rakuma_shipping_payers'] = this.modifyData.rakuma_shipping_payers
            this.$refs['ruleForm'].model['rakuma_shipping_methods'] = this.modifyData.rakuma_shipping_methods
            this.$refs['ruleForm'].model['paypay_shipping_methods'] = this.modifyData.paypay_shipping_methods
            this.$refs['ruleForm'].model['rakuma_shipping_durations'] = this.modifyData.rakuma_shipping_durations
            this.$refs['ruleForm'].model['rakuma_shipping_from_areas'] = this.modifyData.rakuma_shipping_from_areas
            this.$refs['ruleForm'].model['rakuma_request_required'] = this.modifyData.rakuma_request_required
            this.$refs['ruleForm'].model['price'] = this.modifyData.price
            // 画像を表示
            for(var i=1; i<=10; i++){
              if (this.modifyData['image'+i]) {
                document.getElementById('image'+i).src = 'file:' + util.getImgPath(this.modifyData['image'+i])
                document.getElementById('close'+i).style.display = 'block'
              }
            }
            // カテゴリーを表示
            if (this.modifyData.rakumaCategory) {
              document.getElementById('rakuma_category_txt').value = this.modifyData.rakumaCategory
            }
            if (this.modifyData.paypayCategory) {
              document.getElementById('paypay_category_txt').value = this.modifyData.paypayCategory
              const ids = this.modifyData.paypayCategoryId.split('>')
              this.setPaypayBrand(ids[ids.length-1])
            }
            // サイズを表示
            if (this.modifyData.rakumaSize) {
              const ids = this.modifyData.rakumaCategoryId.split('>')
              this.setRakumaSize(ids[ids.length-1])
              this.$refs['ruleForm'].model['rakumaSize'] = this.modifyData.rakumaSize
            }
            if (this.modifyData.paypaySize) {
              const ids = this.modifyData.paypayCategoryId.split('>')
              this.setPaypaySize(ids[ids.length-1])
              this.$refs['ruleForm'].model['paypaySize'] = this.modifyData.paypaySize
              this.$refs['ruleForm'].model['paypaySpecsId'] = this.modifyData.paypaySpecsId
              this.$refs['ruleForm'].model['paypaySpecsName'] = this.modifyData.paypaySpecsName
            }
            // ブランドを表示
            if (this.modifyData.rakumaBrand) {
              const data = this.rakumaBrandAll.filter((item) => { return (item.id === this.modifyData.rakumaBrand) })
              document.getElementById('rakuma_brand_txt').value = data[0].name
              document.getElementById('rakuma_brand_clear').style.display = 'block'
            }
            if (this.modifyData.paypayBrand) {
              const data = this.paypayBrandAll.filter((item) => { return (item.id === this.modifyData.paypayBrand) })
              document.getElementById('paypay_brand_txt').value = data[0].name
              document.getElementById('paypay_brand_clear').style.display = 'block'
            }
          } catch (error) {
            var log = new Log()
            log.error(error)
            util.showSystemErrorBox()
          }
        },
        // フォームサブミット
        submitForm (formName) {
          // バリデーション
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              try {
                var now = new Date()
                // 発送日数を取得
                var paypayShippingDuration = this.getPaypayId(this.$refs[formName].model['rakuma_shipping_durations'], this.rakuma_shipping_durations ,this.paypay_shipping_durations)
                // 都道府県を取得
                var paypayShippingFromArea = this.getPaypayId(this.$refs[formName].model['rakuma_shipping_from_areas'], this.rakuma_prefs ,this.paypay_prefs)
                // サイズ名を取得
                var sizeName = ''
                if (this.paypaySizes) {
                  const data = this.paypaySizes.filter((item) => { return (item.id === this.$refs[formName].model['paypaySize']) })
                  if (data && data.length > 0) {
                    sizeName = data[0].name
                  }
                }
                // 商品情報
                var item = {
                  image1: this.$refs[formName].model['image1'],
                  image2: this.$refs[formName].model['image2'],
                  image3: this.$refs[formName].model['image3'],
                  image4: this.$refs[formName].model['image4'],
                  image5: this.$refs[formName].model['image5'],
                  image6: this.$refs[formName].model['image6'],
                  image7: this.$refs[formName].model['image7'],
                  image8: this.$refs[formName].model['image8'],
                  image9: this.$refs[formName].model['image9'],
                  image10: this.$refs[formName].model['image10'],
                  name: this.$refs[formName].model['name'],
                  desc: this.$refs[formName].model['desc'],
                  rakumaCategory: this.$refs[formName].model['rakumaCategory'],
                  rakumaCategoryId: this.$refs[formName].model['rakumaCategoryId'],
                  paypayCategory: this.$refs[formName].model['paypayCategory'],
                  paypayCategoryId: this.$refs[formName].model['paypayCategoryId'],
                  rakumaSize: this.changeNull(this.$refs[formName].model['rakumaSize']),
                  paypaySize: this.changeNull(this.$refs[formName].model['paypaySize']),
                  paypaySizeName: sizeName,
                  paypaySpecsId: this.$refs['ruleForm'].model['paypaySpecsId'],
                  paypaySpecsName: this.$refs['ruleForm'].model['paypaySpecsName'],
                  rakumaBrand: this.$refs[formName].model['rakumaBrand'],
                  paypayBrand: this.$refs[formName].model['paypayBrand'],
                  rakumaCondition: this.$refs[formName].model['rakumaCondition'],
                  paypayCondition: this.$refs[formName].model['paypayCondition'],
                  rakuma_shipping_payers: this.$refs[formName].model['rakuma_shipping_payers'],
                  rakuma_shipping_methods: this.$refs[formName].model['rakuma_shipping_methods'],
                  paypay_shipping_methods: this.$refs[formName].model['paypay_shipping_methods'],
                  rakuma_shipping_durations: this.$refs[formName].model['rakuma_shipping_durations'],
                  paypay_shipping_durations: paypayShippingDuration,
                  rakuma_shipping_from_areas: this.$refs[formName].model['rakuma_shipping_from_areas'],
                  paypay_shipping_from_areas: paypayShippingFromArea,
                  rakuma_request_required: this.$refs[formName].model['rakuma_request_required'],
                  price: this.$refs[formName].model['price'],
                  created_at: now.toFormat('YYYY-MM-DD HH24:MI:SS')
                }
                // tmp内のファイルを移動
                if (!fs.existsSync(remote.app.getPath('userData') + '/img')) {
                  fs.mkdirSync(remote.app.getPath('userData') + '/img')
                }
                // ファイルを移動、削除
                for (var s=1; s<=10; s++) {
                  if ((!this.modifyFlg && item['image'+s] !== '') || (this.modifyFlg && item['image'+s] !== '' && item['image'+s] !== this.modifyData['image'+s])) {
                    fs.renameSync(remote.app.getPath('userData') + '/tmp/' + item['image'+s], remote.app.getPath('userData') + '/img/' + item['image'+s])
                  }
                }
                // tmp内のファイルを消す
                var tmpFiles = fs.readdirSync(remote.app.getPath('userData') + '/tmp')
                for (var file in tmpFiles) {
                  fs.unlinkSync(remote.app.getPath('userData') + '/tmp/' + tmpFiles[file])
                }
                // 修正で前の画像がなくなった場合
                var deleteImgs = []
                for (var t=1; t<=10; t++){
                  if (this.modifyFlg && item['image'+t] !== this.modifyData['image'+t] && this.modifyData['image'+t] !== '') {
                    deleteImgs.push(this.modifyData['image'+t])
                  }
                }
                for (let i = 0; i < deleteImgs.length; i++) {
                  if (fs.existsSync(remote.app.getPath('userData') + '/img/' + deleteImgs[i])) {
                    fs.unlinkSync(remote.app.getPath('userData') + '/img/' + deleteImgs[i])
                  }
                }
                // 画像の入れ替え
                var imgArray = []
                for (let m=1; m<=10; m++){
                  if (item['image'+m] !== '') {
                    imgArray.push(item['image'+m])
                  }
                }
                var count = 1
                for (count = 1; count <= 10;) {
                  if (imgArray[count - 1]) {
                    item['image' + count] = imgArray[count - 1]
                  } else {
                    item['image' + count] = ''
                  }
                  count++
                }
                // DBに登録・更新
                if (this.modifyFlg) {
                  // 修正
                  const query = {_id: this.modifyData._id}
                  await this.itemDB.update(query, item)
                  util.showInfoBox('商品を更新しました')
                  // 画面を戻す
                  this.$router.push('items')
                } else {
                  // 追加
                  await this.itemDB.insert(item)
                  util.showInfoBox('商品を登録しました')
                  // 画面を戻す
                  this.$router.push('items')
                }
              } catch (error) {
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
        // nullを""に変換
        changeNull (value) {
          if (value === null) {
            return ''
          }
          return value
        },
        // フォームリセット
        resetForm (formName) {
          this.$refs[formName].resetFields()
        },
        // 画像を選択
        async selectImage (num) {
          try {
            // ファイル選択
            const dialog = require('electron').remote.dialog
            var result = await dialog.showOpenDialog(null, {
              properties: ['openFile'],
              title: '画像を選択',
              defaultPath: '.',
              filters: [
                {name: 'image file', extensions: ['png', 'jpg', 'jpeg']}
              ]
            })
            // 未選択
            if (result.filePaths.length === 0) {
              return
            }
            // 画像選択
            var filename = await image.composite(result.filePaths[0])
            // image画像を設定
            var imageEle = document.getElementById('image' + num)
            var closeEle = document.getElementById('close' + num)
            imageEle.src = 'file:' + remote.app.getPath('userData') + '/tmp/' + filename
            closeEle.style.display = 'block'
            this.$refs['ruleForm'].model['image' + num] = filename
          } catch (error) {
            util.noneDom('loading')
            var log = new Log()
            log.error(error)
            util.showSystemErrorBox()
          }
        },
        // 画像を削除
        closeImage (num) {
          // closeを消す
          var close = document.getElementById('close' + num)
          close.style.display = 'none'
          // 選択画像パスを消す
          this.$refs['ruleForm'].model['image' + num] = ''
          // 画像をnoimageに
          var image = document.getElementById('image' + num)
          this['style' + num] = {height: '100px', width: '100px'}
          image.src = require('@/assets/picture.jpg')
        },
        // PaypayのIDを取得
        getPaypayId (rakumaId, rakumaArray, paypayArray) {
          const rakumaData = rakumaArray.filter((item) => { return (item.id === rakumaId) })
          const paypayData = paypayArray.filter((item) => { return (item.name === rakumaData[0].name) })
          return paypayData[0].id
        },
        // カテゴリーを選択
        selectRakumaCategory () {
          // リセット
          this.selectCategories = []
          util.innerHtmlDom('category_selection',this.printFootprints())
          // フラグを変更
          this.categorySite = 0
          // ラクマのカテゴリーを追加
          this.categoryList = this.rakumaCategory1
          util.noneDom('item_entry')
          util.showDom('category_body', 'block')
        },
        // カテゴリーを選択
        async selectPaypayCategory () {
          // リセット
          this.selectCategories = []
          util.innerHtmlDom('category_selection',this.printFootprints())
          // フラグを変更
          this.categorySite = 1
          // PayPayのカテゴリーを追加
          this.categoryList = await this.paypayApi.getCategory()
          util.noneDom('item_entry')
          util.showDom('category_body', 'block')
        },
        // カテゴリー選択キャンセル
        cancelCategory () {
          util.showDom('item_entry','block')
          util.noneDom('category_body')
        },
        // カテゴリー行を選択
        handleCategoryChange (val) {
          if (!val) { return }
          // サイトによって変更
          if (this.categorySite===0) {
            // ラクマ
            this.clickRakumaCategory(val)
          } else {
            // PayPay
            this.clickPaypayCategory(val)
          }
        },
        // ラクマカテゴリー選択
        clickRakumaCategory (val) {
          // カテゴリー保存
          this.selectCategories.push(val)
          // カテゴリー取得
          var rakumaCategory = null
          var keys = null
          switch (this.selectCategories.length) {
            case 1 :
              rakumaCategory = this.rakumaCategory2
              break
            case 2 :
              rakumaCategory = this.rakumaCategory3
              break
            default :
              // 最終選択
              var rakumaCategoryTxt = document.getElementById('rakuma_category_txt')
              rakumaCategoryTxt.value = this.printFootprints(' > ')
              this.$refs['ruleForm'].model['rakumaCategory'] = this.printFootprints(' > ')
              this.$refs['ruleForm'].model['rakumaCategoryId'] = this.printFootprintIds()
              util.showDom('item_entry','block')
              util.showDom('rakuma_category_clear','block')
              util.noneDom('category_body')
              // サイズを指定
              this.setRakumaSize(val.id)
              return
          }
          keys = Object.keys(rakumaCategory)
          var category = []
          for (var key in keys) {
            if (rakumaCategory[key].parentCategoryId === val.id) {
              category.push(rakumaCategory[key])
            }
          }
          this.categoryList = category
          // 表示変更
          util.innerHtmlDom('category_selection',this.printFootprints())
        },
        // Paypayカテゴリー選択
        async clickPaypayCategory (val) {
          // カテゴリー保存
          this.selectCategories.push(val)
          if (val.productCategory) {
            // 最終行
            var paypayCategoryTxt = document.getElementById('paypay_category_txt')
            paypayCategoryTxt.value = this.printFootprints(' > ')
            this.$refs['ruleForm'].model['paypayCategory'] = this.printFootprints(' > ')
            this.$refs['ruleForm'].model['paypayCategoryId'] = this.printFootprintIds()
            util.showDom('item_entry','block')
              util.showDom('paypay_category_clear','block')
            util.noneDom('category_body')
            // サイズを取得
            this.setPaypaySize(val.productCategory.id)
            // ブランドを取得
            this.setPaypayBrand(val.id)
            return
          }
          // カテゴリー取得
          this.categoryList = await this.paypayApi.getCategory(val.id)
          // 表示変更
          util.innerHtmlDom('category_selection',this.printFootprints())
        },
        // ラクマカテゴリーを削除
        clearRakumaCategory () {
          // ボタンとテキストを消す
          var rakumaClear = document.getElementById('rakuma_category_clear')
          var rakumaCategoryTxt = document.getElementById('rakuma_category_txt')
          rakumaClear.style.display = 'none'
          rakumaCategoryTxt.value = ''
          // 選択カテゴリーを消す
          this.$refs['ruleForm'].model['rakumaCategory'] = ''
        },
        // PayPayカテゴリーを削除
        clearPaypayCategory () {
          // ボタンとテキストを消す
          var paypayClear = document.getElementById('paypay_category_clear')
          var paypayCategoryTxt = document.getElementById('paypay_category_txt')
          paypayClear.style.display = 'none'
          paypayCategoryTxt.value = ''
          // 選択カテゴリーを消す
          this.$refs['ruleForm'].model['paypayCategory'] = ''
        },
        // 足跡を作成
        printFootprints (delimiter) {
          if (!delimiter) {
            delimiter = '&nbsp;>&nbsp;'
          }
          var footprints = ''
          for (var i=0; i<this.selectCategories.length ; i++) {
            if (i!==0) { footprints += delimiter }
            footprints += this.selectCategories[i].name
          }
          return footprints
        },
        // 足跡IDを作成
        printFootprintIds () {
          var footprints = ''
          for (var i=0; i<this.selectCategories.length ; i++) {
            if (i!==0) { footprints += '>' }
            if (this.selectCategories[i].productCategory) {
              footprints += this.selectCategories[i].productCategory.id
            } else {
              footprints += this.selectCategories[i].id
            }
          }
          return footprints
        },
        // ラクマのサイズを設定
        setRakumaSize (id) {
          // サイズを初期化
          this.$refs['ruleForm'].model['rakumaSize'] = null
          this.rakumaSizes = null
          // サイズタイプを取得
          var sizeType
          var keys = Object.keys(this.rakumaCategory3)
          for (var key in keys) {
            if (this.rakumaCategory3[key].id === id) {
              sizeType = this.rakumaCategory3[key].sizeType
              break
            }
          }
          // サイズを取得
          var size = []
          var sizeKeys = Object.keys(this.sizeAll)
          for (var sizeKey in sizeKeys) {
            if (this.sizeAll[sizeKey].type === sizeType) {
              size.push(this.sizeAll[sizeKey])
            }
          }
          this.rakumaSizes = size
        },
        // PayPayサイズを設定
        async setPaypaySize (id) {
          // サイズを初期化
          this.$refs['ruleForm'].model['paypaySize'] = null
          var json = await this.paypayApi.getSize(id)
          if (json.isBrandAvailable===true) {
            for (var i=0 ; i<json.specList.length ; i++ ) {
              if (json.specList[i].name.indexOf('サイズ') >= 0) {
                this.paypaySizes = json.specList[i].values
                this.$refs['ruleForm'].model['paypaySpecsId'] = json.specList[i].id
                this.$refs['ruleForm'].model['paypaySpecsName'] = json.specList[i].name
              }
            }
            if (this.paypaySizes) {
              for (var t=0 ; t<this.paypaySizes.length; t++) {
                this.paypaySizes[t].id = String(this.paypaySizes[t].id)
              }
            }
          } else {
            this.paypaySizes = null
          }
        },
        // PayPayブランドを設定
        async setPaypayBrand (id) {
          // ブランドを取得
          var json = await this.paypayApi.getBrand(id)
          this.paypayBrandAll = []
          if (json) {
            for (var i=0 ; i<json.brandGroups.length ; i++ ) {
              for (var s=0 ; s<json.brandGroups[i].brands.length; s++ ){
                var brand = {}
                brand['id'] = json.brandGroups[i].brands[s].id
                brand['name'] = json.brandGroups[i].brands[s].name
                brand['nameKana'] = json.brandGroups[i].brands[s].nameKana
                this.paypayBrandAll.push(brand)
              }
            }
          }
        },
        // ブランドを選択
        selectRakumaBrand () {
          this.brandSite = 0
          util.noneDom('item_entry')
          util.showDom('brand_body', 'block')
          util.showDom('loading')
          this.initRakumaBrand()
        },
        // ブランドを選択
        selectPaypayBrand () {
          this.brandSite = 1
          util.noneDom('item_entry')
          util.showDom('brand_body', 'block')
          util.showDom('loading')
          this.initPaypayBrand()
        },
        // ブランド初期化
        async initRakumaBrand () {
          var brandRakuma = JSON.parse(localStorage.getItem('brandRakuma'))
          this.allBrandList = brandRakuma
          this.brandList = brandRakuma
          util.noneDom('loading')
        },
        // ブランド初期化
        async initPaypayBrand () {
          this.allBrandList = this.paypayBrandAll
          this.brandList = this.paypayBrandAll
          util.noneDom('loading')
        },
        // ラクマブランドを削除
        clearRakumaBrand () {
          // ボタンとテキストを消す
          var rakumaClear = document.getElementById('rakuma_brand_clear')
          var rakumaBrandTxt = document.getElementById('rakuma_brand_txt')
          rakumaClear.style.display = 'none'
          rakumaBrandTxt.value = ''
          // 選択ブランドを消す
          this.$refs['ruleForm'].model['rakumaBrand'] = ''
        },
        // PayPayブランドを削除
        clearPaypayBrand () {
          // ボタンとテキストを消す
          var paypayClear = document.getElementById('paypay_brand_clear')
          var paypayBrandTxt = document.getElementById('paypay_brand_txt')
          paypayClear.style.display = 'none'
          paypayBrandTxt.value = ''
          // 選択ブランドを消す
          this.$refs['ruleForm'].model['paypayBrand'] = ''
        },
        // 配送料負担を選択
        selectShipping (event) {
          if (event === '1') {
            this.rakuma_shipping_methods = this.shipping_methods_seller
            this.$refs['ruleForm'].model['shipping_methods'] = null
          } else {
            this.rakuma_shipping_methods = this.shipping_methods_buyer
            this.$refs['ruleForm'].model['shipping_methods'] = null
          }
        },
        getRakumaCategory1Name (id) {
          const data = this.rakumaCategory1.filter((item) => { return (item.id === id) })
          return data[0].name
        },
        getRakumaCategory2Name (id) {
          const data = this.rakumaCategory2.filter((item) => { return (item.id === id) })
          return data[0].name
        },
        getRakumaCategory3Name (id) {
          if (!id) {
            return ''
          }
          const data = this.rakumaCategory3.filter((item) => { return (item.id === id) })
          return data[0].name
        },
        // ブランド行を選択
        handleCurrentChange (val) {
          this.currentRow = val
        },
        // ブランド絞り込み
        changeFilter () {
          if (this.filter !== '') {
            // 入力あり
            var filterBrandList = []
            var keys = Object.keys(this.allBrandList)
            for (var key in keys) {
              var brandName = this.allBrandList[key].name.toLowerCase()
              var brandKana = ''
              if (this.allBrandList[key].kana) {
                brandKana = this.allBrandList[key].kana.toLowerCase()
              } else {
                brandKana = this.allBrandList[key].nameKana.toLowerCase()
              }
              var filterName = this.filter.toLowerCase()
              if (brandName.indexOf(filterName) >= 0 || brandKana.indexOf(filterName) >= 0) {
                // 文字を含む場合
                filterBrandList.push(this.allBrandList[key])
              }
            }
            this.brandList = filterBrandList
          } else {
            this.brandList = this.allBrandList
          }
        },
        // ブランドを選択
        choseBrand () {
          var brandTxtId = ''
          var clearId = ''
          var brandId = ''
          // 選択サイト
          if (this.brandSite===0) {
            // ラクマ
            brandTxtId = 'rakuma_brand_txt'
            clearId = 'rakuma_brand_clear'
            brandId = 'rakumaBrand'
          } else {
            // PayPay
            brandTxtId = 'paypay_brand_txt'
            clearId = 'paypay_brand_clear'
            brandId = 'paypayBrand'
          }
          var brandTxt = document.getElementById(brandTxtId)
          var clear = document.getElementById(clearId)
          brandTxt.value = this.currentRow.name
          clear.style.display = 'block'
          this.$refs['ruleForm'].model[brandId] = this.currentRow.id
          util.showDom('item_entry','block')
          util.noneDom('brand_body')
        },
        // ブランド選択キャンセル
        cancelBrand () {
          util.showDom('item_entry','block')
          util.noneDom('brand_body')
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
    .item_entry{
      padding: 40px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      margin: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
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
    }
    .el-form-item {
      background: white;
      margin-bottom: 24px;
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
    .el-input__inner, .el-textarea__inner, .el-select .el-input__inner {
      border: none;
      transition: all 0.3s ease;
      font-size: 14px;
      padding: 12px 16px;
      background: transparent;
    }
    .el-input__inner:focus, .el-textarea__inner:focus, .el-select .el-input__inner:focus {
      border: none;
      box-shadow: none;
    }
    .el-textarea__wrapper {
      border-radius: 8px;
      border: 1px solid #e1e8ed !important;
      transition: all 0.3s ease;
      box-shadow: none;
      background-color: #fff;
    }
    .el-textarea__wrapper:hover {
      border-color: #3498db !important;
    }
    .el-textarea__wrapper.is-focus {
      border-color: #3498db !important;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1) !important;
    }
    /* テキストエリアのフォーカス状態をより確実に制御 */
    .el-textarea:focus-within .el-textarea__wrapper {
      border-color: #3498db !important;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1) !important;
    }
    .el-textarea:focus-within .el-textarea__wrapper:hover {
      border-color: #3498db !important;
    }
    /* テキストエリアの内側要素のボーダーを無効化 */
    .el-textarea__inner {
      border: none !important;
      outline: none !important;
    }
    .el-textarea__inner:focus {
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
    }
    /* Element Plusのデフォルトスタイルを強制的に上書き */
    .el-textarea.is-focus .el-textarea__wrapper {
      border-color: #3498db !important;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1) !important;
    }
    .el-textarea.is-focus .el-textarea__inner {
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
    }
    /* 文字数カウント機能付きテキストエリア用のスタイル */
    .el-input--textarea .el-textarea__wrapper {
      border: 1px solid #e1e8ed !important;
      border-radius: 8px;
      transition: all 0.3s ease;
      box-shadow: none;
      background-color: #fff;
    }
    .el-input--textarea .el-textarea__wrapper:hover {
      border-color: #3498db !important;
    }
    .el-input--textarea.is-focus .el-textarea__wrapper {
      border-color: #3498db !important;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1) !important;
    }
    .el-input--textarea:focus-within .el-textarea__wrapper {
      border-color: #3498db !important;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1) !important;
    }
    .el-input--textarea .el-textarea__inner {
      border: none !important;
      outline: none !important;
      resize: vertical;
    }
    .el-input--textarea .el-textarea__inner:focus {
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
    }
    .el-button {
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      padding: 12px 24px;
    }
    .el-button--primary {
      background: linear-gradient(135deg, #3498db, #2ecc71);
      border: none;
      color: white;
    }
    .el-button--primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(52, 152, 219, 0.3);
    }
    .el-button--default {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      color: #495057;
    }
    .el-button--default:hover {
      background: #e9ecef;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .el-radio-group {
      display: flex;
      gap: 16px;
    }
    .el-radio {
      margin-right: 0;
    }
    .el-radio__label {
      font-weight: 500;
      color: #2c3e50;
    }
    .el-radio__input.is-checked .el-radio__inner {
      background-color: #3498db;
      border-color: #3498db;
    }
    .el-select-dropdown {
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      border: 1px solid #e1e8ed;
    }
    .el-select-dropdown__item {
      padding: 12px 16px;
      font-weight: 500;
    }
    .el-select-dropdown__item:hover {
      background-color: #f8f9fa;
    }
    .el-select-dropdown__item.selected {
      background-color: #e3f2fd;
      color: #3498db;
      font-weight: 600;
    }
    .el-select .el-input__wrapper {
      border-radius: 8px;
      border: 1px solid #e1e8ed;
      transition: all 0.3s ease;
      box-shadow: none;
      background-color: #fff;
    }
    .el-select .el-input__wrapper:hover {
      border-color: #3498db;
    }
    .el-select .el-input__wrapper.is-focus {
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }
    /* 隠しフィールドのel-input__wrapperを完全に非表示 */
    .el-input.hidden .el-input__wrapper {
      display: none !important;
    }
    .el-input.hidden {
      display: none !important;
    }
    .item_entry .images .el-form-item__content{
      line-height:0;
      height:220px;
    }
    .item_entry .images .image{
      width: 100px;
      height: 100px;
      border: 2px dashed #d1d5db;
      border-radius: 12px;
      position: absolute;
      cursor: pointer;
      overflow: hidden;
      text-align: center;
      align-items: center;
      display: flex;
      justify-content: center;
      background: #f9fafb;
      transition: all 0.3s ease;
    }
    .item_entry .images .image:hover {
      border-color: #3498db;
      background: #f0f9ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
    }
    .item_entry .images .image img{
      max-width: 100px;
      max-height: 100px;
      border-radius: 8px;
      object-fit: cover;
    }
    .item_entry .images .close{
      width: 24px;
      height: 24px;
      position: absolute;
      cursor: pointer;
      background: #e74c3c;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    .item_entry .images .close:hover {
      background: #c0392b;
      transform: scale(1.1);
    }
    #image1_div {
      top: 0px;
      left: 0px;
      width:100px;
      z-index:100;
    }
    #close1 {
      top: -10px;
      left: 89px;
      display: none;
      z-index:104;
    }
    #image2_div {
      top: 0px;
      left: 115px;
      z-index:101;
    }
    #close2 {
      top: -10px;
      left: 204px;
      display: none;
      z-index:105;
    }
    #image3_div {
      top: 0px;
      left: 230px;
      z-index:102;
    }
    #close3 {
      top: -10px;
      left: 319px;
      display: none;
      z-index:106;
    }
    #image4_div {
      top: 0px;
      left: 345px;
      z-index:103;
    }
    #close4 {
      top: -10px;
      left: 434px;
      display: none;
      z-index:107;
    }
    #image5_div {
      top: 0px;
      left: 460px;
      z-index:103;
    }
    #close5 {
      top: -10px;
      left: 549px;
      display: none;
      z-index:107;
    }
    #image6_div {
      top: 120px;
      left: 0px;
      width:100px;
      z-index:100;
    }
    #close6 {
      top: 110px;
      left: 89px;
      display: none;
      z-index:104;
    }
    #image7_div {
      top: 120px;
      left: 115px;
      z-index:101;
    }
    #close7 {
      top: 110px;
      left: 204px;
      display: none;
      z-index:105;
    }
    #image8_div {
      top: 120px;
      left: 230px;
      z-index:102;
    }
    #close8 {
      top: 110px;
      left: 319px;
      display: none;
      z-index:106;
    }
    #image9_div {
      top: 120px;
      left: 345px;
      z-index:103;
    }
    #close9 {
      top: 110px;
      left: 434px;
      display: none;
      z-index:107;
    }
    #image10_div {
      top: 120px;
      left: 460px;
      z-index:103;
    }
    #close10 {
      top: 110px;
      left: 549px;
      display: none;
      z-index:107;
    }
    .item_entry .brand .el-form-item__content{
      line-height:0;
    }
    .item_entry .el-select{
      width: 220px;
      margin-right:20px;
    }
    .item_entry .category .el-input{
      width: 220px;
      margin-right:5px;
    }
    .item_entry .category #rakuma_category_txt,#paypay_category_txt{
      padding-right:25px;
    }
    .item_entry .category #rakuma_category_clear,#paypay_category_clear{
      width:12px;
      height:12px;
      opacity:0.5;
      position:absolute;
      top:14px;
      left:200px;
      display: none;
      cursor: pointer;
    }
    .item_entry .category #paypay_category_clear{
      left:490px;
    }
    .item_entry .category button{
      width: 55px;
      padding: 12px 0 !important;
      margin-top: 0px !important;
      margin-right: 30px !important;
    }
    .item_entry .size .el-select:first-child{
      margin-right:90px;
    }
    .item_entry .condition .el-select:first-child{
      margin-right:90px;
    }
    .item_entry .shipping_methods .el-select:first-child{
      margin-right:90px;
    }
    .item_entry .brand .el-input{
      width: 220px;
      margin-right:5px;
    }
    .item_entry .brand #rakuma_brand_txt,#paypay_brand_txt{
      padding-right:25px;
    }
    .item_entry .brand #rakuma_brand_clear,#paypay_brand_clear{
      width:12px;
      height:12px;
      opacity:0.5;
      position:absolute;
      top:14px;
      left:200px;
      display: none;
      cursor: pointer;
    }
    .item_entry .brand #paypay_brand_clear{
      left:490px;
    }
    .item_entry .brand button{
      width: 55px;
      padding: 12px 0 !important;
      margin-top: 0px !important;
      margin-right: 30px !important;
    }
    .item_entry .price .el-input{
      width:220px;
      margin-right:5px;
    }
    .brand_body, .category_body {
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin: 20px;
      color: #2c3e50;
    }
    .brand_body .title, .category_body .title {
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e1e8ed;
    }
    .brand_body .filter, .category_body .filter {
      margin-top: 20px;
    }
    .brand_body .el-table, .category_body .el-table {
      margin-top: 20px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .brand_body .el-table th, .category_body .el-table th {
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      color: #2c3e50;
      font-weight: 600;
      border: none;
    }
    .brand_body .el-table td, .category_body .el-table td {
      border: none;
      border-bottom: 1px solid #e1e8ed;
    }
    .brand_body .el-table tr:hover, .category_body .el-table tr:hover {
      background: #f8f9fa;
    }
    .brand_body .btn, .category_body .btn {
      margin-top: 20px;
      text-align: center;
    }
    .category_body .category_selection {
      margin: 15px 0 0 15px !important;
      font-weight: 600;
      color: #3498db;
      font-size: 16px;
    }
  </style>
  