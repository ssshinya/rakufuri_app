<template>
  <div class="contents">
    <Header :activeIdx="5"></Header>
    <el-container>
    <SideMenu :activeIdx="2"></SideMenu>
      <el-main>
        <div class="account">
          <div class="table-container">
            <el-table
              :data='accountData'
              highlight-current-row
              @current-change="handleCurrentChange"
              class="modern-table"
              empty-text="アカウントが登録されていません">
              <el-table-column label='画像' width="120" class-name="image-column">
                <template slot-scope="scope">
                  <div class="image-wrapper">
                    <img :src="scope.row.thumbnail || '/src/assets/icon.png'" class="account-image" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop='name' label='名前' width="200" class-name="name-column">
                <template slot-scope="scope">
                  <div class="name-cell">
                    <span class="name-text">{{ scope.row.name || '未設定' }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop='site' label='サイト' class-name="site-column">
                <template slot-scope="scope">
                  <el-tag :type="getSiteTagType(scope.row.site)" class="site-tag">
                    {{ scope.row.site }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop='email' label='ID' class-name="email-column">
                <template slot-scope="scope">
                  <div class="email-cell">
                    <span class="email-text">{{ scope.row.email || '未設定' }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <div class="action-buttons">
            <el-button type="primary" @click="showEntryAccount()" class="action-btn">
              <i class="el-icon-plus"></i>
              追加
            </el-button>
            <el-button type="warning" @click="modifyAccount()" class="action-btn">
              <i class="el-icon-edit"></i>
              修正
            </el-button>
            <el-button type="danger" @click="deleteAccount()" class="action-btn">
              <i class="el-icon-delete"></i>
              削除
            </el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
  </template>
  
  <script>
    import Header from '@/components/Header.vue'
    import SideMenu from '@/components/side_menu/Setting.vue'
    import consts from '../mixins/consts'
    import util from '../mixins/utilty'
    import { SQLiteWrapper } from '../mixins/sqliteWrapper'
    export default {
      components: {Header, SideMenu},
      mixins: [ consts ],
      props: {
        activeIdx: Number
      },
      data () {
        return {
          activeIndex: String(this.activeIdx),
          accountData: [],
          accountDB: null,
          exhibitionDB: null,
          currentRow: null,
          name: [],
          accountId: []
        }
      },
      mounted () {
        this.activeIndex = String(this.activeIdx)
      },
      created () {
        this.accountDB = new SQLiteWrapper('account')
        this.exhibitionDB = new SQLiteWrapper('exhibition')
        this.init()
      },
      methods: {
        async init () {
          // 表示データ取得
          var result = await this.accountDB.find({})
          // 作成日時でソート（降順）
          result.sort((a, b) => {
            const dateA = new Date(a.created_at || 0)
            const dateB = new Date(b.created_at || 0)
            return dateB - dateA
          })
          this.accountData = result
          for (let i = 0 ; i < this.accountData.length ; i++) {
            if (!this.accountData[i].site) {
              this.accountData[i].site = 'ラクマ'
            } else if (this.accountData[i].site==='r') {
              this.accountData[i].site = 'ラクマ'
            } else if (this.accountData[i].site==='p') {
              this.accountData[i].site = 'PayPay'
            }
          }
        },
        // テーブルレコード選択
        handleCurrentChange (val) {
          this.currentRow = val
        },
        // サイトタグのタイプを取得
        getSiteTagType(site) {
          if (site === 'ラクマ') {
            return 'success'
          } else if (site === 'PayPay') {
            return 'warning'
          }
          return 'info'
        },
        // アカウント登録を表示
        showEntryAccount () {
          this.$router.push('/entryAccount')
        },
        // アカウントを修正
        modifyAccount () {
          // 選択されていない
          if (this.currentRow === null) {
            util.showErrorBox('アカウントが選択されていません')
          // 選択済
          } else {
            this.$router.push({ path: '/entryAccount', query: { id: this.currentRow._id } })
          }
        },
        // アカウントを削除
        async deleteAccount () {
          // 選択されていない
          if (this.currentRow === null) {
            util.showErrorBox('アカウントが選択されていません')
          // 選択済
          } else {
            // 削除
            var account_query = {_id: this.currentRow._id}
            await this.accountDB.remove(account_query)
            var exhibition_query = {account_id: this.currentRow._id}
            await this.exhibitionDB.remove(exhibition_query)
            util.showInfoBox('削除しました。')
            // 再表示
            this.init()
          }
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

  .account {
    padding: 0;
    background: #f8fafc;
    min-height: calc(100vh - 60px);
  }

  .table-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin: 20px;
    padding: 20px;
    border: 1px solid #e2e8f0;
  }

  .modern-table {
    width: 100%;
    border-collapse: collapse;
  }

  .modern-table .el-table__header {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  }

  .modern-table .el-table__header th {
    background: transparent !important;
    color: #1e293b;
    font-weight: 600;
    font-size: 14px;
    padding: 24px 20px;
    border-bottom: 2px solid #e2e8f0 !important;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .modern-table .el-table__body tr {
    transition: all 0.3s ease;
    border-bottom: 1px solid #f1f5f9 !important;
  }

  .modern-table .el-table__body tr:hover {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .modern-table .el-table__body td {
    padding: 24px 20px;
    vertical-align: middle;
    border-bottom: 1px solid #f1f5f9 !important;
  }

  .image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80px;
  }

  .account-image {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
  }

  .account-image:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  .name-cell {
    display: flex;
    align-items: center;
  }

  .name-text {
    font-weight: 600;
    color: #1e293b;
    font-size: 16px;
  }

  .site-tag {
    border-radius: 20px;
    padding: 6px 16px;
    font-weight: 600;
    font-size: 12px;
    border: none;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .email-cell {
    display: flex;
    align-items: center;
  }

  .email-text {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding: 20px 0;
    margin: 20px;
  }

  .action-btn {
    border-radius: 12px;
    font-weight: 600;
    padding: 12px 24px;
    font-size: 14px;
    transition: all 0.3s ease;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
  }

  .action-btn i {
    font-size: 16px;
  }

  .action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  .action-btn.el-button--primary {
    background: linear-gradient(135deg, #3498db, #2ecc71);
    color: white;
    margin-top: 0 !important;
  }

  .action-btn.el-button--warning {
    background: linear-gradient(135deg, #f39c12, #e67e22);
    color: white;
  }

  .action-btn.el-button--danger {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
  }

  /* レスポンシブデザイン */
  @media (max-width: 768px) {
    .account {
      padding: 10px;
    }
    
    .action-buttons {
      flex-direction: column;
      padding: 20px;
    }
    
    .action-btn {
      width: 100%;
      justify-content: center;
    }
    
    .modern-table .el-table__header th,
    .modern-table .el-table__body td {
      padding: 12px 8px;
      font-size: 12px;
    }
    
    .account-image {
      width: 40px;
      height: 40px;
    }
  }

  /* 空の状態のスタイル */
  .modern-table .el-table__empty-block {
    padding: 60px 20px;
    color: #64748b;
    font-size: 16px;
    font-weight: 500;
  }

  /* 選択された行のスタイル */
  .modern-table .el-table__body tr.current-row {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0) !important;
    border-left: 4px solid #64748b;
  }

  .modern-table .el-table__body tr.current-row td {
    border-bottom-color: #e2e8f0 !important;
  }

  /* Element UIのデフォルトスタイルを上書き */
  .modern-table.el-table {
    border: none !important;
    border-radius: 16px;
    overflow: hidden;
  }

  .modern-table.el-table::before {
    display: none !important;
  }

  .modern-table.el-table .el-table__inner-wrapper::before {
    display: none !important;
  }

  .modern-table.el-table td,
  .modern-table.el-table th {
    border-bottom: 1px solid #f1f5f9 !important;
  }

  .modern-table.el-table th {
    border-bottom: 2px solid #e2e8f0 !important;
  }

  /* セルの境界線を調整 */
  .modern-table .el-table__body tr td:first-child {
    border-left: none !important;
  }

  .modern-table .el-table__body tr td:last-child {
    border-right: none !important;
  }

  /* ヘッダーの境界線を調整 */
  .modern-table .el-table__header tr th:first-child {
    border-left: none !important;
  }

  .modern-table .el-table__header tr th:last-child {
    border-right: none !important;
  }
  </style>
  