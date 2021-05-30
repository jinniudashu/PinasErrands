import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Login from '../views/Login.vue'
import CustomerHome from '../views/CustomerHome.vue'
import RiderHome from '../views/RiderHome.vue'

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
    component: () =>
      import(/* webpackChunkName: "customer" */ '../views/Review.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/order/:id',
    name: 'Order',
    component: () =>
      import(/* webpackChunkName: "customer" */ '../views/Order.vue'),
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/itemedit',
    name: 'ItemEdit',
    component: () =>
      import(/* webpackChunkName: "customer" */ '../views/ItemEdit.vue'),
    // props: true,
    meta: {
      requiresAuth: true,
      keepAlive: false,
    },
  },
  {
    path: '/viewimage',
    name: 'ViewImage',
    component: () =>
      import(/* webpackChunkName: "customer" */ '../views/ViewImage.vue'),
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/orderstatus/:id',
    name: 'OrderStatus',
    component: () =>
      import(/* webpackChunkName: "customer" */ '../views/OrderStatus.vue'),
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/maplocation',
    name: 'MapLocation',
    component: () =>
      import(/* webpackChunkName: "customer" */ '../views/MapLocation.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/riderlocation',
    name: 'RiderLocation',
    component: () =>
      import(/* webpackChunkName: "customer" */ '../views/RiderLocation.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () =>
      import(/* webpackChunkName: "customer" */ '../views/Profile.vue'),
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
    component: () =>
      import(/* webpackChunkName: "rider" */ '../views/RiderOrderList.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/riderorderdetails',
    name: 'riderOrderDetails',
    component: () =>
      import(/* webpackChunkName: "rider" */ '../views/RiderOrderDetails.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/riderontheway',
    name: 'riderOnTheWay',
    component: () =>
      import(/* webpackChunkName: "rider" */ '../views/RiderOnTheWay.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/riderconfirmprice',
    name: 'riderConfirmPrice',
    component: () =>
      import(/* webpackChunkName: "rider" */ '../views/RiderConfirmPrice.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/riderordercomplete',
    name: 'riderOrderComplete',
    component: () =>
      import(/* webpackChunkName: "rider" */ '../views/RiderOrderComplete.vue'),
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
  // 判断登录状态再route
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const currentUser = store.state.user.user
  if (requiresAuth && !currentUser) next('/login')
  else next()
})

export default router
