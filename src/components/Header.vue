<template>
  <el-header class="modern-header">
    <div class="header-container">
      <div class="logo-section">
        <h1 class="app-title">ラクフリ</h1>
      </div>
      
      <div class="tabs-section">
        <div class="tab-nav">
          <div 
            v-for="(tab, index) in tabs" 
            :key="tab.id"
            :class="['tab-item', { 'active': activeIndex === String(tab.id) }]"
            @click="handleSelect(String(tab.id))"
          >
            <span class="tab-text">{{ tab.name }}</span>
            <div class="tab-indicator"></div>
          </div>
        </div>
      </div>
      
      <div class="search-section" v-if="filterFlg">
        <div class="search-container">
          <el-input 
            v-model="filter" 
            placeholder="絞り込み検索..." 
            class="search-input"
            @keyup.enter="doFilter()"
          >
            <template #suffix>
              <el-icon class="search-icon" @click="doFilter()">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

interface Props {
  activeIdx: number
  showFilter: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  doFilter: [filter: string]
}>()

const router = useRouter()
const route = useRoute()

const activeIndex = ref(String(props.activeIdx))
const filterFlg = ref(false)
const filter = ref('')

// タブデータ
const tabs = ref([
  { id: 1, name: '商品', icon: '📦' },
  { id: 2, name: '出品', icon: '➕' },
  { id: 3, name: '出品中', icon: '🛍️' },
  { id: 4, name: '取引中', icon: '🤝' },
  { id: 5, name: '設定', icon: '⚙️' }
])

onMounted(() => {
  activeIndex.value = String(props.activeIdx)
  if (props.showFilter === 1) {
    filterFlg.value = true
  }
})

watch(() => props.activeIdx, (newVal) => {
  activeIndex.value = String(newVal)
})

const handleSelect = (key: string) => {
  // タブが違う場合
  if (key !== activeIndex.value || (route.name !== 'items' && route.name !== 'exhibition' && route.name !== 'onsale' && route.name !== 'trading' && route.name !== 'license')) {
    switch (key) {
      case '1':
        router.push('items')
        break
      case '2':
        router.push('exhibition')
        break
      case '3':
        router.push('onsale')
        break
      case '4':
        router.push('trading')
        break
      case '5':
        router.push('license')
        break
      default:
        break
    }
  }
}

// 絞り込み
const doFilter = () => {
  emit('doFilter', filter.value)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.modern-header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 70px !important;
  padding: 0;
  position: relative;
  z-index: 1000;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.logo-section {
  flex-shrink: 0;
}

.app-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  font-family: 'Inter', sans-serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.tabs-section {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 40px;
}

.tab-nav {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tab-item {
  position: relative;
  padding: 12px 24px;
  margin: 0 2px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  min-width: 80px;
  text-align: center;
}

.tab-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.tab-item.active {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tab-text {
  color: white;
  font-weight: 500;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 2;
}

.tab-indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  border-radius: 2px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-item.active .tab-indicator {
  width: 80%;
}

.search-section {
  flex-shrink: 0;
}

.search-container {
  position: relative;
}

.search-input {
  width: 280px;
}

.search-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.search-input :deep(.el-input__inner) {
  color: #333;
  font-weight: 500;
  padding-left: 20px;
}

.search-icon {
  color: #3498db;
  cursor: pointer;
  transition: color 0.3s ease;
}

.search-icon:hover {
  color: #2ecc71;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .header-container {
    padding: 0 10px;
  }
  
  .app-title {
    font-size: 20px;
  }
  
  .tabs-section {
    margin: 0 20px;
  }
  
  .tab-item {
    padding: 10px 16px;
    min-width: 60px;
  }
  
  .tab-text {
    font-size: 12px;
  }
  
  .search-input {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .tabs-section {
    margin: 0 10px;
  }
  
  .tab-item {
    padding: 8px 12px;
    min-width: 50px;
  }
  
  .tab-text {
    font-size: 11px;
  }
  
  .search-input {
    width: 150px;
  }
}
</style>

