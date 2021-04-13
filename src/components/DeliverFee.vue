<template>
  <div
    v-if="!detail"
    class="flex flex-row justify-start items-center space-x-2 bg-gray-50 py-3 pl-2 rounded-xl shadow-lg"
  >
    <p class="text-xl font-semibold text-gray-800">DELIVER FEE: P</p>
    <p class="text-xl text-gray-800">{{ totalAmount }}</p>
  </div>
  <div v-if="detail" class=" bg-gray-50 py-3 pl-2 rounded-xl shadow-lg">
    <div class="flex flex-row justify-start items-center space-x-1">
      <p class="text-lg font-semibold text-gray-800">
        DELIVERY FEE: P
      </p>
      <p class="text-lg text-gray-800">
        {{ totalAmount }}
      </p>
    </div>
    <div class="flex flex-row justify-start items-center space-x-1">
      <p class="text-lg font-semibold text-gray-800">
        ERRAND COST: P
      </p>
      <p class="text-lg text-gray-800">
        {{ errandCost }}
      </p>
    </div>
    <div class="flex flex-row justify-start items-center space-x-1">
      <p class="text-lg font-semibold text-gray-800">
        TOTAL: P
      </p>
      <p class="text-lg text-gray-800">
        {{ parseInt(totalAmount) + parseInt(errandCost) }}
      </p>
    </div>
  </div>
</template>

<script>
import { computed, reactive, toRefs, watchEffect } from 'vue'
import { useStore } from 'vuex'

export default {
  props: { detail: Boolean },
  name: 'DeliverFee',
  setup() {
    const store = useStore()
    const state = reactive({
      totalAmount: 0,
      details: [],
      errandCost: 0,
    })
    const order = computed(() => store.state.orders.currentOrder)
    const bills = computed(() => order.value?.bills)

    watchEffect(() => {
      let totalAmount = bills.value?.totalAmount
      if (totalAmount) {
        state.totalAmount = bills.value.totalAmount
        state.details = bills.value.details
        state.errandCost = order.value.productPrice
      }
    })
    return { ...toRefs(state) }
  },
}
</script>

<style></style>
