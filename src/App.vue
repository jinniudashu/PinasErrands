<template>
  <router-view />
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'
import {
  getUserRoleById,
  initRiderStatus,
  initMyOrders,
  getOrderById,
} from '@/modules/utils/handleData'

import { Loader } from '@googlemaps/js-api-loader'

const loader = new Loader({
  // apiKey: process.env.VUE_APP_GOOGLEAPIKEY,
  apiKey: 'AIzaSyDX6fmLJL3ZHIC-doOOD4VaLaWyJ61h7fM',
  libraries: ['places'],
  language: 'en',
  version: 'beta',
})

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    var handleInitRiderStatus, handleInitMyOrders

    onMounted(() => {
      // 调入@googlemaps/js-api-loader
      loader.load()

      // 判断是否支持地理位置
      // 初始化用户身份，用户状态，路由到相关页面
      auth.onAuthStateChanged(async (user) => {
        store.commit('user/setUser', user)
        console.log('app:', user)
        let route = ''
        if (user) {
          // 如果用户是骑手，为user增加骑手信息
          let rider = await getUserRoleById(user.uid)
          if (rider) {
            // 初始化骑手状态监听器
            handleInitRiderStatus = initRiderStatus(user.uid)
            // 如果订单在执行中，初始化订单监听器
            if (rider.status === 'busy') {
              // 获取rider当前执行的订单
              let order = await getOrderById(rider.currentOrderId)
              store.commit('orders/setCurrentOrder', order)
              console.log('currentOrder:', store.state.orders.currentOrder)
              switch (order.status) {
                case 'assigned':
                  route = '/riderontheway'
                  break
                case 'confirmed':
                  route = '/riderordercomplete'
                  break
              }
            } else {
              route = '/riderhome'
            }
          } else {
            // 初始化用户订单集侦听器
            handleInitMyOrders = initMyOrders(user.uid)
            user.role = 'customer'
            route = '/customerhome'
          }
          router.replace(route)
        } else {
          if (handleInitRiderStatus) {
            handleInitRiderStatus()
          }
          if (handleInitMyOrders) {
            handleInitMyOrders()
          }
          router.replace('/login')
        }
      })
    })

    // onUnMounted
    onUnmounted(() => {
      if (handleInitRiderStatus) {
        handleInitRiderStatus()
      }
      if (handleInitMyOrders) {
        handleInitMyOrders()
      }
    })
  },
}
</script>
