<template>
  <el-aside class="menu">
    <el-button @click="entryItem">商品登録</el-button>
    <el-button @click="modifyItem">商品修正</el-button>
    <el-button @click="deleteItem">商品削除</el-button>
    <el-button @click="entryExhibition">出品登録</el-button>
  </el-aside>
</template>

<script setup lang="ts">
interface Props {
  activeIdx: number
}

defineProps<Props>()

const emit = defineEmits<{
  entryItem: []
  modifyItem: []
  deleteItem: []
  entryExhibition: []
}>()

const entryItem = () => {
  emit('entryItem')
}

const modifyItem = () => {
  emit('modifyItem')
}

const deleteItem = () => {
  emit('deleteItem')
}

const entryExhibition = () => {
  emit('entryExhibition')
}
</script>

<style>
.menu{
  background: #fafafa;
  height:100%;
  text-align:center;
  padding-top: 20px;
  width: 190px !important;
}
.menu button{
  width:150px;
  margin: 5px 0 0 0 !important;
  padding: 12px 10px;
}
</style>

