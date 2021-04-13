<template>
  <div class="bg-gray-100 min-h-screen">
    <navigation-bar />
    <div class="mt-6 mx-6">
      <div v-for="order in orders" :key="order.id" @click="onClickOrder(order)">
        <rider-order-list-item :order="order" />
      </div>
    </div>
  </div>
</template>

<script>
import { watchEffect, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import RiderOrderListItem from '../components/RiderOrderListItem'

export default {
  components: { RiderOrderListItem },
  setup() {
    const store = useStore()
    const router = useRouter()
    const orders = ref([])

    watchEffect(async () => {
      orders.value = await store.getters['orders/getNewOrders']
      console.log('orders.value', orders.value)
      console.log('user:', store.state.user.user.rider)
    })

    function onClickOrder(order) {
      store.commit('orders/setCurrentOrder', order)
      router.push('/riderOrderDetails')
    }

    return { orders, onClickOrder }
  },
}
</script>

<style></style>
