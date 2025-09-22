<template>
  <div class="contents">
    <Header :activeIdx="4" :showFilter="0"></Header>
    <el-container>
      <el-main>
        <h2>住所</h2>
        <p>住所機能は開発中です。</p>
        <el-button @click="goBack">戻る</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.contents {
  height: 100%;
}
</style>

