<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="flex flex-row justify-end mr-4 mt-2 z-10">
      <menu-button />
    </div>
    <div class="-mt-8">
      <banner />
    </div>
    <div class="flex flex-row justify-between items-center px-6 mt-1">
      <img
        class=" cursor-pointer"
        @click="newErrend"
        src="@/assets/errand.svg"
        alt="Errand"
      />
      <!-- <svg-icon :name="'errand'" /> -->
      <img class=" cursor-pointer" src="@/assets/market.svg" alt="Market" />
      <!-- <svg-icon :name="'market'" /> -->
      <img class=" cursor-pointer" src="@/assets/food.svg" alt="Food" />
      <!-- <svg-icon :name="'food'" /> -->
    </div>
    <div class="mt-3">
      <order-list :orders="orders" />
    </div>
  </div>
</template>

<script>
import { ref, watchEffect, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import Banner from '../components/Banner.vue'
import OrderList from '@/components/OrderList.vue'
import MenuButton from '../components/MenuButton.vue'

export default {
  name: 'Home',
  components: {
    OrderList,
    Banner,
    MenuButton,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const orders = ref([])

    watchEffect(() => (orders.value = store.state.orders.orders))

    onMounted(() => {
      let currentOrder = {
        items: [
          {
            location: {
              address: '',
              lat: 0,
              lng: 0,
            },
            contactName: '',
            contactPhone: '',
            request: '',
            attachment: [],
            sideTrips: [],
            schedule: {
              isScheduled: false,
              time: null,
            },
          },
          {
            location: {
              address: '',
              lat: 0,
              lng: 0,
            },
            contactName: '',
            contactPhone: '',
            request: '',
            attachment: [],
            sideTrips: [],
            schedule: {
              isScheduled: false,
              time: null,
            },
          },
        ],
        bills: {
          totalAmount: 0,
          totalDistance: 0,
          details: [],
        },
      }
      store.commit('orders/setCurrentOrder', currentOrder)
    })

    function newErrend() {
      router.push('/order/new')
    }

    return { newErrend, orders }
  },
}
</script>
