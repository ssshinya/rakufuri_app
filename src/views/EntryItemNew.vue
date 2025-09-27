<template>
  <div class="contents">
    <Header :activeIdx="1" :showFilter="0"></Header>
    <el-container>
      <SideMenu :activeIdx="1"
        @entryItem="entryItem"
        @deleteItem="deleteItem"
        @modifyItem="modifyItem"
        @entryExhibition="entryExhibition"></SideMenu>
      <el-main class="main-content">
        <div class="page-header">
          <h1 class="page-title">商品登録</h1>
          <p class="page-description">新しい商品を登録します</p>
        </div>

        <div class="form-container">
          <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="140px" class="modern-form">
            
            <!-- 商品画像セクション -->
            <div class="form-section">
              <h3 class="section-title">商品画像</h3>
              <div class="image-upload-area">
                <div class="image-grid">
                  <div 
                    v-for="(image, index) in imageSlots" 
                    :key="index"
                    class="image-slot"
                    @click="selectImage(index + 1)"
                  >
                    <img 
                      :src="image.src" 
                      :alt="`商品画像${index + 1}`"
                      class="image-preview"
                    />
                    <div v-if="image.hasImage" class="image-close" @click.stop="removeImage(index + 1)">
                      <el-icon><Close /></el-icon>
                    </div>
                    <div v-else class="image-placeholder">
                      <el-icon><Plus /></el-icon>
                      <span>画像を追加</span>
                    </div>
                  </div>
                </div>
                <p class="image-hint">最大10枚まで登録可能です</p>
              </div>
            </div>

            <!-- 基本情報セクション -->
            <div class="form-section">
              <h3 class="section-title">基本情報</h3>
              
              <el-form-item label="商品名" prop="name" class="form-item">
                <el-input 
                  v-model="ruleForm.name" 
                  placeholder="商品名を入力してください"
                  maxlength="40" 
                  show-word-limit
                  class="form-input"
                />
              </el-form-item>

              <el-form-item label="商品説明" prop="desc" class="form-item">
                <el-input 
                  type="textarea" 
                  v-model="ruleForm.desc" 
                  placeholder="商品の詳細説明を入力してください"
                  maxlength="950" 
                  show-word-limit
                  :rows="4"
                  class="form-textarea"
                />
              </el-form-item>
            </div>

            <!-- カテゴリーセクション -->
            <div class="form-section">
              <h3 class="section-title">カテゴリー</h3>
              
              <div class="category-row">
                <el-form-item label="ラクマ" prop="rakumaCategory" class="category-item">
                  <el-input 
                    v-model="ruleForm.rakumaCategory" 
                    placeholder="カテゴリーを選択してください"
                    readonly
                    class="category-input"
                  />
                  <el-button @click="selectRakumaCategory" type="primary" class="select-btn">
                    選択
                  </el-button>
                </el-form-item>

                <el-form-item label="PayPay" prop="paypayCategory" class="category-item">
                  <el-input 
                    v-model="ruleForm.paypayCategory" 
                    placeholder="カテゴリーを選択してください"
                    readonly
                    class="category-input"
                  />
                  <el-button @click="selectPaypayCategory" type="primary" class="select-btn">
                    選択
                  </el-button>
                </el-form-item>
              </div>
            </div>

            <!-- 商品詳細セクション -->
            <div class="form-section">
              <h3 class="section-title">商品詳細</h3>
              
              <div class="detail-row">
                <el-form-item label="サイズ" prop="size" class="detail-item">
                  <el-select v-model="ruleForm.rakumaSize" placeholder="ラクマ" class="form-select">
                    <el-option
                      v-for="size in rakumaSizes"
                      :key="size.id"
                      :label="size.name"
                      :value="size.id"
                    />
                  </el-select>
                  <el-select v-model="ruleForm.paypaySize" placeholder="PayPay" class="form-select">
                    <el-option
                      v-for="size in paypaySizes"
                      :key="size.id"
                      :label="size.name"
                      :value="size.id"
                    />
                  </el-select>
                </el-form-item>
              </div>

              <div class="detail-row">
                <el-form-item label="ブランド" prop="brand" class="detail-item">
                  <el-input 
                    v-model="ruleForm.rakumaBrand" 
                    placeholder="ラクマブランド"
                    readonly
                    class="brand-input"
                  />
                  <el-button @click="selectRakumaBrand" type="primary" class="select-btn">
                    選択
                  </el-button>
                  <el-input 
                    v-model="ruleForm.paypayBrand" 
                    placeholder="PayPayブランド"
                    readonly
                    class="brand-input"
                  />
                  <el-button @click="selectPaypayBrand" type="primary" class="select-btn">
                    選択
                  </el-button>
                </el-form-item>
              </div>

              <div class="detail-row">
                <el-form-item label="商品の状態" prop="condition" class="detail-item">
                  <el-select v-model="ruleForm.rakumaCondition" placeholder="ラクマ" class="form-select">
                    <el-option
                      v-for="condition in rakumaConditions"
                      :key="condition.id"
                      :label="condition.name"
                      :value="condition.id"
                    />
                  </el-select>
                  <el-select v-model="ruleForm.paypayCondition" placeholder="PayPay" class="form-select">
                    <el-option
                      v-for="condition in paypayConditions"
                      :key="condition.id"
                      :label="condition.name"
                      :value="condition.id"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>

            <!-- 配送情報セクション -->
            <div class="form-section">
              <h3 class="section-title">配送情報</h3>
              
              <el-form-item label="配送料の負担" prop="rakuma_shipping_payers" class="form-item">
                <el-select v-model="ruleForm.rakuma_shipping_payers" placeholder="選択してください" class="form-select">
                  <el-option
                    v-for="payer in shippingPayers"
                    :key="payer.id"
                    :label="payer.name"
                    :value="payer.id"
                  />
                </el-select>
              </el-form-item>

              <div class="shipping-row">
                <el-form-item label="配送の方法" prop="shipping_methods" class="shipping-item">
                  <el-select v-model="ruleForm.rakuma_shipping_methods" placeholder="ラクマ" class="form-select">
                    <el-option
                      v-for="method in rakumaShippingMethods"
                      :key="method.id"
                      :label="method.name"
                      :value="method.id"
                    />
                  </el-select>
                  <el-select v-model="ruleForm.paypay_shipping_methods" placeholder="PayPay" class="form-select">
                    <el-option
                      v-for="method in paypayShippingMethods"
                      :key="method.id"
                      :label="method.name"
                      :value="method.id"
                    />
                  </el-select>
                </el-form-item>
              </div>

              <div class="shipping-row">
                <el-form-item label="配送までの日数" prop="rakuma_shipping_durations" class="shipping-item">
                  <el-select v-model="ruleForm.rakuma_shipping_durations" placeholder="選択してください" class="form-select">
                    <el-option
                      v-for="duration in shippingDurations"
                      :key="duration.id"
                      :label="duration.name"
                      :value="duration.id"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="配送元の地域" prop="rakuma_shipping_from_areas" class="shipping-item">
                  <el-select v-model="ruleForm.rakuma_shipping_from_areas" placeholder="選択してください" class="form-select">
                    <el-option
                      v-for="pref in prefectures"
                      :key="pref.id"
                      :label="pref.name"
                      :value="pref.id"
                    />
                  </el-select>
                </el-form-item>
              </div>

              <el-form-item label="購入申請" prop="rakuma_request_required" class="form-item">
                <el-radio-group v-model="ruleForm.rakuma_request_required">
                  <el-radio label="1">あり</el-radio>
                  <el-radio label="0">なし</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>

            <!-- 価格セクション -->
            <div class="form-section">
              <h3 class="section-title">価格</h3>
              
              <el-form-item label="商品金額" prop="price" class="form-item">
                <el-input 
                  v-model.number="ruleForm.price" 
                  placeholder="価格を入力してください"
                  class="price-input"
                />
                <span class="price-unit">円</span>
              </el-form-item>
            </div>

            <!-- ボタンセクション -->
            <div class="form-actions">
              <el-button type="primary" @click="submitForm" size="large" class="submit-btn">
                登録
              </el-button>
              <el-button @click="resetForm" size="large" class="reset-btn">
                クリア
              </el-button>
              <el-button @click="goBack" size="large" class="back-btn">
                戻る
              </el-button>
            </div>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Close, Plus } from '@element-plus/icons-vue'
import Header from '@/components/Header.vue'
import SideMenu from '@/components/side_menu/Item.vue'

const router = useRouter()

// フォームデータ
const ruleForm = reactive({
  name: '',
  desc: '',
  rakumaCategory: '',
  paypayCategory: '',
  rakumaSize: '',
  paypaySize: '',
  rakumaBrand: '',
  paypayBrand: '',
  rakumaCondition: '',
  paypayCondition: '',
  rakuma_shipping_payers: '',
  rakuma_shipping_methods: '',
  paypay_shipping_methods: '',
  rakuma_shipping_durations: '',
  rakuma_shipping_from_areas: '',
  rakuma_request_required: '0',
  price: ''
})

// 画像スロット
const imageSlots = ref(Array(10).fill(null).map(() => ({
  src: '/src/assets/picture.jpg',
  hasImage: false
})))

// マスターデータ（サンプル）
const rakumaSizes = ref([
  { id: '1', name: 'XS' },
  { id: '2', name: 'S' },
  { id: '3', name: 'M' },
  { id: '4', name: 'L' },
  { id: '5', name: 'XL' }
])

const paypaySizes = ref([
  { id: '1', name: 'XS' },
  { id: '2', name: 'S' },
  { id: '3', name: 'M' },
  { id: '4', name: 'L' },
  { id: '5', name: 'XL' }
])

const rakumaConditions = ref([
  { id: '1', name: '新品' },
  { id: '2', name: '未使用に近い' },
  { id: '3', name: '目立った傷や汚れなし' },
  { id: '4', name: 'やや傷や汚れあり' },
  { id: '5', name: '傷や汚れあり' }
])

const paypayConditions = ref([
  { id: '1', name: '新品' },
  { id: '2', name: '未使用に近い' },
  { id: '3', name: '目立った傷や汚れなし' },
  { id: '4', name: 'やや傷や汚れあり' },
  { id: '5', name: '傷や汚れあり' }
])

const shippingPayers = ref([
  { id: '1', name: '送料込み' },
  { id: '2', name: '購入者負担' }
])

const rakumaShippingMethods = ref([
  { id: '1', name: '宅急便' },
  { id: '2', name: '郵便' },
  { id: '3', name: 'その他' }
])

const paypayShippingMethods = ref([
  { id: '1', name: '宅急便' },
  { id: '2', name: '郵便' },
  { id: '3', name: 'その他' }
])

const shippingDurations = ref([
  { id: '1', name: '1-2日' },
  { id: '2', name: '2-3日' },
  { id: '3', name: '4-7日' }
])

const prefectures = ref([
  { id: '1', name: '北海道' },
  { id: '2', name: '青森県' },
  { id: '3', name: '岩手県' },
  { id: '13', name: '東京都' },
  { id: '27', name: '大阪府' },
  { id: '47', name: '沖縄県' }
])

// バリデーションルール
const rules = {
  name: [
    { required: true, message: '商品名を入力してください', trigger: 'blur' },
    { min: 1, max: 40, message: '商品名は40文字以内で入力してください', trigger: 'blur' }
  ],
  desc: [
    { required: true, message: '商品説明を入力してください', trigger: 'blur' },
    { min: 1, max: 950, message: '商品説明は950文字以内で入力してください', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '商品金額を入力してください', trigger: 'blur' },
    { type: 'number', message: '数字を入力してください', trigger: 'blur' },
    { validator: (rule: any, value: any, callback: any) => {
      if (value < 300 || value > 2000000) {
        callback(new Error('300～2,000,000の間で入力してください'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ]
}

// メソッド
const entryItem = () => {
  router.push('/entryItem')
}

const deleteItem = () => {
  router.push('/')
}

const modifyItem = () => {
  router.push('/')
}

const entryExhibition = () => {
  router.push('/entryExhibition')
}

const selectImage = (index: number) => {
  console.log(`画像${index}を選択`)
  // 実際の実装ではファイル選択ダイアログを開く
  ElMessage.info(`画像${index}の選択機能は開発中です`)
}

const removeImage = (index: number) => {
  imageSlots.value[index - 1] = {
    src: '/src/assets/picture.jpg',
    hasImage: false
  }
}

const selectRakumaCategory = () => {
  ElMessage.info('ラクマカテゴリー選択機能は開発中です')
}

const selectPaypayCategory = () => {
  ElMessage.info('PayPayカテゴリー選択機能は開発中です')
}

const selectRakumaBrand = () => {
  ElMessage.info('ラクマブランド選択機能は開発中です')
}

const selectPaypayBrand = () => {
  ElMessage.info('PayPayブランド選択機能は開発中です')
}

const submitForm = () => {
  ElMessage.success('商品登録機能は開発中です')
}

const resetForm = () => {
  Object.keys(ruleForm).forEach(key => {
    ruleForm[key] = key === 'rakuma_request_required' ? '0' : ''
  })
  imageSlots.value = Array(10).fill(null).map(() => ({
    src: '/src/assets/picture.jpg',
    hasImage: false
  }))
  ElMessage.success('フォームをリセットしました')
}

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  console.log('EntryItemNew page loaded')
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.contents {
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

.main-content {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  overflow-y: auto;
}

.page-header {
  background: white;
  padding: 30px 40px;
  border-bottom: 1px solid #e0e6ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-family: 'Inter', sans-serif;
}

.page-description {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.form-container {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.modern-form {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #f0f2f5;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 24px 0;
  font-family: 'Inter', sans-serif;
  position: relative;
  padding-left: 16px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  border-radius: 2px;
}

.image-upload-area {
  margin-bottom: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.image-slot {
  position: relative;
  width: 100px;
  height: 100px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f9fafb;
}

.image-slot:hover {
  border-color: #3498db;
  background: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.image-close {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.image-close:hover {
  background: #c0392b;
  transform: scale(1.1);
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 12px;
  text-align: center;
}

.image-placeholder .el-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.image-hint {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  text-align: center;
}

.form-item {
  margin-bottom: 24px;
}

.form-input, .form-textarea {
  width: 100%;
}

.form-textarea {
  resize: vertical;
}

.category-row, .detail-row, .shipping-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 20px;
}

.category-item, .detail-item, .shipping-item {
  margin-bottom: 0;
}

.category-input, .brand-input {
  width: 100%;
  margin-right: 12px;
}

.form-select {
  width: 100%;
  margin-right: 12px;
}

.select-btn {
  min-width: 80px;
  height: 40px;
}

.price-input {
  width: 200px;
  margin-right: 8px;
}

.price-unit {
  font-size: 16px;
  color: #374151;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #f0f2f5;
}

.submit-btn {
  background: linear-gradient(135deg, #3498db, #2ecc71);
  border: none;
  color: white;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.3);
}

.reset-btn, .back-btn {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #495057;
  font-weight: 500;
  padding: 12px 32px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.reset-btn:hover, .back-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .form-container {
    padding: 20px;
  }
  
  .modern-form {
    padding: 20px;
  }
  
  .category-row, .detail-row, .shipping-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .image-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .form-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .submit-btn, .reset-btn, .back-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
