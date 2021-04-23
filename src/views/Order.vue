<template>
  <div class="bg-gray-100 min-h-screen">
    <navigation-bar />
    <div class="px-4 mt-10">
      <order-items :items="order.items" />
      <!-- Add Errand -->
      <router-link :to="'/itemedit/-1'">
        <div class="flex flex-row justify-start items-center space-x-3 my-8 ">
          <div
            class="flex flex-row justify-start items-center space-x-2 py-2 text-lg font-semibold bg-yellow-100 rounded-xl shadow-lg w-52 pl-2"
          >
            <svg-icon :name="'circleplus'" />
            <p>Errand Item</p>
          </div>
          <p class="text-xs text-gray-600">
            Want anything done somewhere else?
          </p>
        </div>
      </router-link>
      <!-- Delivery Fee -->
      <deliver-fee :detail="false" />
      <!-- Confirm Button -->
      <button
        class="flex justify-center bg-yellow-400 text-gray-700 object-center rounded-lg shadow-lg text-base font-semibold px-2 py-2 mt-10 w-full"
        @click="submitOrder"
      >
        CONFIRM REQUEST
      </button>
    </div>
  </div>
</template>

<script>
import { reactive, watchEffect, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import DeliverFee from '../components/DeliverFee.vue'
import { createNewOrder } from '@/modules/utils/handleData'
import OrderItems from '../components/OrderItems.vue'

export default {
  name: 'Order',
  components: {
    DeliverFee,
    OrderItems,
  },
  props: {
    id: String,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      order: {
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
      },
    })

    watchEffect(async () => {
      // 构造订单信息
      if (state.order) {
        state.order.items = store.state.orders.currentOrder.items
        // 账单信息
        state.order.bills = await store.getters['orders/summaryBills']
        store.commit('orders/setCurrentOrderBills', state.order.bills)
      }
    })

    // 提交订单
    const submitOrder = async () => {
      await createNewOrder(store.state.orders.currentOrder)
      router.go(-1)
    }

    return { ...toRefs(state), submitOrder }
  },
}
</script>
