<template>
  <el-aside class="modern-sidebar">
    <nav class="sidebar-nav">
      <div class="nav-section">
        <div class="nav-section-title">設定</div>
        
        <div 
          class="nav-item" 
          @click="showSetting('1')"
          :class="{ 'active': activeIndex === '1' }"
        >
          <div class="nav-icon">🔐</div>
          <span class="nav-text">ライセンス認証</span>
          <div class="nav-arrow">→</div>
        </div>
        
        <div 
          class="nav-item" 
          @click="showSetting('2')"
          :class="{ 'active': activeIndex === '2' }"
        >
          <div class="nav-icon">👤</div>
          <span class="nav-text">アカウント</span>
          <div class="nav-arrow">→</div>
        </div>
        
        <div 
          class="nav-item" 
          @click="showSetting('3')"
          :class="{ 'active': activeIndex === '3' }"
        >
          <div class="nav-icon">⏰</div>
          <span class="nav-text">出品間隔</span>
          <div class="nav-arrow">→</div>
        </div>
        
        <div 
          class="nav-item" 
          @click="showSetting('4')"
          :class="{ 'active': activeIndex === '4' }"
        >
          <div class="nav-icon">🖼️</div>
          <span class="nav-text">画像パス確認</span>
          <div class="nav-arrow">→</div>
        </div>
        
        <div 
          class="nav-item" 
          @click="showSetting('5')"
          :class="{ 'active': activeIndex === '5' }"
        >
          <div class="nav-icon">📁</div>
          <span class="nav-text">データ入出力</span>
          <div class="nav-arrow">→</div>
        </div>
      </div>
    </nav>
    
    <div class="sidebar-footer">
      <div class="footer-info">
        <div class="info-item">
          <span class="info-label">バージョン</span>
          <span class="info-value">v{{version}}</span>
        </div>
      </div>
    </div>
  </el-aside>
</template>

<script>
  import consts from '../../mixins/consts'
  export default {
    props: {
      activeIdx: Number
    },
    data () {
      return {
        activeIndex: String(this.activeIdx),
        version: ''
      }
    },
    mounted () {
      this.activeIndex = String(this.activeIdx)
      this.version = consts.version
    },
    methods: {
      showSetting (index) {
        // 表示が違う場合
        if (index !== this.activeIndex) {
          switch (index) {
            case '1':
              this.$router.push('/license')
              break
            case '2':
              this.$router.push('/account')
              break
            case '3':
              this.$router.push('/entryInterval')
              break
            case '4':
              this.$router.push('/imagePath')
              break
            case '5':
              this.$router.push('/transferData')
              break
            default:
              break
          }
        }
      }
    }
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.modern-sidebar {
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  height: 100%;
  width: 250px !important;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.modern-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  position: relative;
  z-index: 2;
}

.nav-section {
  margin-bottom: 32px;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section-title {
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 12px 20px;
  font-family: 'Inter', sans-serif;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  margin: 0 12px 4px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.nav-item.active {
  background: linear-gradient(135deg, #3498db, #2ecc71);
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.3);
  transform: translateX(4px);
}

.nav-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.nav-text {
  color: #1e293b;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  font-family: 'Inter', sans-serif;
  text-shadow: none;
}

.nav-arrow {
  color: #64748b;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-8px);
}

.nav-item:hover .nav-arrow {
  opacity: 1;
  transform: translateX(0);
}

.nav-item.active .nav-arrow {
  opacity: 1;
  transform: translateX(0);
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;
}

.footer-info {
  text-align: center;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.info-label {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.info-value {
  color: #1e293b;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

/* スクロールバーのカスタマイズ */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .modern-sidebar {
    width: 200px !important;
  }
  
  .nav-item {
    padding: 12px 16px;
    margin: 0 8px 4px;
  }
  
  .nav-text {
    font-size: 13px;
  }
  
  .nav-icon {
    font-size: 16px;
    margin-right: 10px;
  }
}
</style>
