<template>
  <div class="bg-yellow-200 min-h-screen p-4">
    <!-- Menu -->
    <menu-button />

    <div class="mx-4 mt-3">
      <div>
        <div
          class="bg-gray-50 py-3 pl-2 mt-3 rounded-xl shadow-lg flex flex-row justify-start space-x-2"
        >
          <span class="font-semibold">ADDRESS:</span>
          <span class="text-sm"> {{ address }}</span>
        </div>
        <div
          class="bg-gray-50 py-3 pl-2 mt-3 rounded-xl shadow-lg flex flex-row justify-start space-x-2"
        >
          <p class="font-semibold">
            TOTAL DELIVERY FEE: P
            {{
              parseInt(order.bills.totalAmount) + parseInt(order.productPrice)
            }}
          </p>
        </div>
        <div
          class="bg-gray-50 py-3 pl-2 mt-3 rounded-xl shadow-lg flex flex-row justify-start space-x-2"
        >
          <p class="font-semibold">TIME: {{}}</p>
        </div>
      </div>
      <button
        class="bg-gray-800 text-gray-100 object-center rounded-lg shadow-lg text-base font-semibold mt-6 px-2 py-2 w-full"
        @click="onClickCompleted"
      >
        COMPLETED
      </button>
    </div>
    <div class="text-center font-semibold mt-2">
      TAKE CARE!
    </div>
  </div>
  <div class="absolute top-80 right-0 bottom-0 left-0 mt-3">
    <router-link :to="'/riderlocation'">
      <view-location :targets="targets" />
    </router-link>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { completeOrder } from '@/modules/utils/handleData'
import ViewLocation from '../components/ViewLocation.vue'
import MenuButton from '../components/MenuButton'

export default {
  components: { ViewLocation, MenuButton },
  setup() {
    const store = useStore()
    const router = useRouter()
    const order = computed(() => store.state.orders.currentOrder)
    const targets = computed(() =>
      store.state.orders.currentOrder.items.map((item) => {
        let lat = item.location.lat
        let lng = item.location.lng
        let address = item.location.address
        return { address, lat, lng }
      }),
    )
    const address = computed(
      () => order.value.items[order.value.items.length - 1].location.address,
    )
    async function onClickCompleted() {
      await completeOrder(order.value.id)
      router.push('/riderhome')
    }

    return { order, address, onClickCompleted, targets }
  },
}
</script>

<style></style>
