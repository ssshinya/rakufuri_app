import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/items',
    name: 'items',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/entryItem',
    name: 'entryItem',
    component: () => import('../views/EntryItem.vue')
  },
  {
    path: '/entryExhibition',
    name: 'entryExhibition',
    component: () => import('../views/EntryExhibition.vue')
  },
  // 出品
  {
    path: '/exhibition',
    name: 'exhibition',
    component: () => import('../views/Exhibition.vue')
  },
  // 出品中
  {
    path: '/onsale',
    name: 'onsale',
    component: () => import('../views/OnSale.vue')
  },
  // 料金変更
  {
    path: '/changePrice',
    name: 'changePrice',
    component: () => import('../views/ChangePrice.vue')
  },
  // コメント
  {
    path: '/comment',
    name: 'comment',
    component: () => import('../views/Comment.vue')
  },
  // 取引中
  {
    path: '/trading',
    name: 'trading',
    component: () => import('../views/Trading.vue')
  },
  // 取引メッセージ
  {
    path: '/message',
    name: 'message',
    component: () => import('../views/Message.vue')
  },
  // 住所
  {
    path: '/address',
    name: 'address',
    component: () => import('../views/Address.vue')
  },
  // 発送コード
  {
    path: '/sendCode',
    name: 'sendCode',
    component: () => import('../views/SendCode.vue')
  },
  {
    path: '/evaluation',
    name: 'evaluation',
    component: () => import('../views/Evaluation.vue')
  },
  // 設定
  {
    path: '/license',
    name: 'license',
    component: () => import('../views/License.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/Account.vue')
  },
  {
    path: '/entryAccount',
    name: 'entryAccount',
    component: () => import('../views/EntryAccount.vue')
  },
  {
    path: '/entryInterval',
    name: 'entryInterval',
    component: () => import('../views/EntryInterval.vue')
  },
  {
    path: '/imagePath',
    name: 'imagePath',
    component: () => import('../views/ImagePath.vue')
  },
  {
    path: '/transferData',
    name: 'transferData',
    component: () => import('../views/TransferData.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

