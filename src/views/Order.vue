<template>
  <div class="bg-gray-100 min-h-screen">
    <navigation-bar />
    <div class="px-4 mt-10">
      <order-items :items="order.items" />
      <!-- Add Errand -->
      <div
        class="flex flex-col justify-start space-y-3 my-8 "
        @click="editItem(-1)"
      >
        <p class="text-xs text-gray-600">
          Want anything done somewhere else?
        </p>
        <div
          class="flex flex-row justify-center items-center space-x-2 py-2 text-lg font-semibold bg-yellow-100 rounded-xl shadow-lg w-auto pl-2"
        >
          <svg-icon :name="'circleplus'" />
          <p>ADD ERRAND REQUEST</p>
        </div>
      </div>
      <!-- Delivery Fee -->
      <deliver-fee :detail="false" />
      <!-- Confirm Button -->
      <button
        class="flex justify-center object-center rounded-lg shadow-lg text-base font-semibold px-2 py-2 mt-10 w-full"
        :class="
          isVerified
            ? 'bg-yellow-400 text-gray-700'
            : 'bg-yellow-200 text-gray-400'
        "
        :disabled="!isVerified"
        @click="submitOrder"
      >
        CONFIRM REQUEST
      </button>
    </div>
  </div>
</template>

<script>
import { reactive, watchEffect, toRefs, computed } from 'vue'
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
  setup() {
    const store = useStore()
    const router = useRouter()
    const item = {
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
    }
    const state = reactive({
      order: {
        items: [item, item],
        bills: {
          totalAmount: 0,
          totalDistance: 0,
          details: [],
        },
      },
    })

    // 订单项目非空校验
    var isVerified = computed(
      () =>
        state.order.items[0].location.address &&
        state.order.items[state.order.items.length - 1].location.address,
    )

    watchEffect(async () => {
      // 构造订单信息
      if (state.order) {
        state.order.items = store.state.orders.currentOrder.items
        // 账单信息
        state.order.bills = await store.getters['orders/summaryBills']
        store.commit('orders/setCurrentOrderBills', state.order.bills)
      }
    })

    function editItem(index) {
      store.commit('orders/setCurrentItem', item)
      router.push({
        path: '/itemedit',
        query: {
          id: index,
        },
      })
    }

    // 提交订单
    const submitOrder = async () => {
      await createNewOrder(store.state.orders.currentOrder)
      router.go(-1)
    }

    return { ...toRefs(state), submitOrder, editItem, isVerified }
  },
}
</script>
