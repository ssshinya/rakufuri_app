<template>
  <div class="contents">
    <Header :activeIdx="1" :showFilter="1" @doFilter="doFilter"></Header>
    <el-container>
      <SideMenu :activeIdx="1"
        @entryItem="entryItem"
        @deleteItem="deleteItem"
        @modifyItem="modifyItem"
        @entryExhibition="entryExhibition"></SideMenu>
      <el-main>
        <div class="itemList">
          <el-table
            :data='itemData ? itemData.slice((currentPage-1)*pagesize,currentPage*pagesize) : itemData'
            stripe
            ref="multipleTable"
            @select="selectTabaleCheckbox"
            @selection-change="handleSelectionChange"
            @row-click="handleCurrentChange"
            @sort-change='sortChange'
            style='width: 100%; height:100%'>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label='画像' width="100" class-name="image">
              <template #default="scope">
                <div class="img">
                  <img v-if="scope.row.image1 === ''" src="/src/assets/picture.jpg" />
                  <img v-else :src="scope.row.image1" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop='name' sortable label='商品名' width="200"></el-table-column>
            <el-table-column prop='rakumaCategory' sortable label='カテゴリー(ラクマ)' width="250"></el-table-column>
            <el-table-column prop='paypayCategory' sortable label='カテゴリー(PayPay)' width="250"></el-table-column>
            <el-table-column prop='rakumaCondition' sortable label='商品の状態(ラクマ)' width="180"></el-table-column>
            <el-table-column prop='paypayCondition' sortable label='商品の状態(PayPay)' width="180"></el-table-column>
            <el-table-column prop='rakuma_shipping_payers' sortable label='配送料の負担(ラクマ)' width="180"></el-table-column>
            <el-table-column prop='rakuma_shipping_methods' sortable label='配送の方法(ラクマ)' width="180"></el-table-column>
            <el-table-column prop='paypay_shipping_methods' sortable label='配送の方法(PayPay)' width="180"></el-table-column>
            <el-table-column prop='rakuma_shipping_durations' sortable label='配送までの日数' width="150"></el-table-column>
            <el-table-column prop='rakuma_shipping_from_areas' sortable label='配送元の地域' width="130"></el-table-column>
            <el-table-column prop='rakuma_request_required' sortable label='購入申請(ラクマ)' width="160"></el-table-column>
            <el-table-column prop='price' sortable label='商品金額' width="150"></el-table-column>
          </el-table>
          <div style="text-align: center;margin-top: 20px;">
            <el-pagination
              background
              ref="pagination"
              layout="prev, pager, next"
              :total="total"
              :page-size="pagesize"
              @current-change="current_change">
            </el-pagination>
          </div>
        </div>
        <!-- 削除ダイアログ -->
        <Dialog :dialogId="'deleteDialog'" :message="'本当に削除しますか？'" :callback="doDelete"></Dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import SideMenu from '@/components/side_menu/Item.vue'
import Dialog from '@/components/Dialog.vue'

const router = useRouter()

// データ
const itemData = ref([])
const multipleSelection = ref([])
const total = ref(0)
const pagesize = ref(100)
const currentPage = ref(1)

// 初期化
onMounted(() => {
  // 基本的な初期化処理
  console.log('Index page loaded')
  console.log('itemData:', itemData.value)
  console.log('total:', total.value)
  
})

// メソッド
const doFilter = (keyword: string) => {
  console.log('Filter:', keyword)
}

const entryItem = () => {
  router.push('/entryItem')
}

const deleteItem = () => {
  console.log('Delete item')
}

const modifyItem = () => {
  console.log('Modify item')
}

const entryExhibition = () => {
  router.push('/entryExhibition')
}

const selectTabaleCheckbox = (val: any, row: any) => {
  console.log('Select checkbox:', val, row)
}

const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const handleCurrentChange = (row: any) => {
  console.log('Row click:', row)
}

const sortChange = (column: any) => {
  console.log('Sort change:', column)
}

const current_change = (currentPage: number) => {
  console.log('Page change:', currentPage)
}

const doDelete = () => {
  console.log('Delete confirmed')
}
</script>

<style>
.itemList{
}
.itemList td.image{
  padding: 12px 0 6px 0;
}
.itemList td.image .img{
  height:80px;
  width:80px;
  border-radius:4px;
  overflow:hidden;
  background:#ffffff;
  position: relative;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
}
.itemList td.image .img img{
  max-width:80px;
  max-height:80px;
}
.itemList .el-table__empty-text{
  text-align:left;
  padding-left: 10px;
  width:100%;
}

/* デバッグ用スタイル */
.itemList {
  border: 2px solid red; /* テーブルコンテナの境界を確認 */
}

.el-table {
  border: 2px solid blue; /* テーブル自体の境界を確認 */
}

.el-table th {
  background-color: #f0f0f0; /* ヘッダーの背景色を確認 */
  border: 1px solid #ccc; /* ヘッダーの境界を確認 */
}
</style>
