<template>
  <el-dialog
    :model-value="show"
    :title="title"
    width="30%"
    @close="handleClose">
    <span>{{ message }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">キャンセル</el-button>
        <el-button type="primary" @click="handleConfirm">確認</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  dialogId: string
  message: string
  callback: () => void
}

const props = defineProps<Props>()

const show = ref(false)
const title = ref('確認')

const handleClose = () => {
  show.value = false
}

const handleCancel = () => {
  show.value = false
}

const handleConfirm = () => {
  props.callback()
  show.value = false
}

// 外部から表示を制御するためのメソッド
const open = () => {
  show.value = true
}

// 外部からアクセス可能にする
defineExpose({
  open
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
