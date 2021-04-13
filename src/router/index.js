import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
// import { auth } from '@/firebase'

import Login from '../views/Login.vue'
import CustomerHome from '../views/CustomerHome.vue'
import Order from '../views/Order.vue'
import OrderStatus from '../views/OrderStatus.vue'
import ItemEdit from '../views/ItemEdit.vue'
import MapLocation from '../views/MapLocation.vue'
import RiderLocation from '../views/RiderLocation.vue'
import Review from '../views/Review.vue'
import ViewImage from '../views/ViewImage.vue'

import RiderHome from '../views/RiderHome.vue'
import RiderOrderList from '../views/RiderOrderList.vue'
import RiderOrderDetails from '../views/RiderOrderDetails.vue'
import RiderOnTheWay from '../views/RiderOnTheWay.vue'
import RiderConfirmPrice from '../views/RiderConfirmPrice.vue'
import RiderOrderComplete from '../views/RiderOrderComplete.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/customerhome',
    name: 'customerHome',
    component: CustomerHome,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/review',
    name: 'Review',
    component: Review,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/order/:id',
    name: 'Order',
    component: Order,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/itemedit/:id',
    name: 'ItemEdit',
    component: ItemEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/viewimage',
    name: 'ViewImage',
    component: ViewImage,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/orderstatus/:id',
    name: 'OrderStatus',
    component: OrderStatus,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/maplocation',
    name: 'MapLocation',
    component: MapLocation,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/riderlocation',
    name: 'RiderLocation',
    component: RiderLocation,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/riderhome',
    name: 'riderHome',
    component: RiderHome,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/riderorderlist',
    name: 'riderOrderList',
    component: RiderOrderList,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/riderorderdetails',
    name: 'riderOrderDetails',
    component: RiderOrderDetails,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/riderontheway',
    name: 'riderOnTheWay',
    component: RiderOnTheWay,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/riderconfirmprice',
    name: 'riderConfirmPrice',
    component: RiderConfirmPrice,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/riderordercomplete',
    name: 'riderOrderComplete',
    component: RiderOrderComplete,
    meta: {
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// 设置路由守卫
router.beforeEach((to, from, next) => {
  // 创建新订单时，先清空全局临时变量
  if (from.name === 'Order' && to.name === 'ItemEdit') {
    store.commit('orders/setTmpSubmitedLocation', null)
  }

  // 判断登录状态再route
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const currentUser = store.state.user.user
  if (requiresAuth && !currentUser) next('/login')
  else next()
})

export default router
