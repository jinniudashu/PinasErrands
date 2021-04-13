<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="flex flex-col justify-center bg-yellow-200 h-auto w-full p-4">
      <!-- Menu -->
      <menu-button />

      <div class="mx-6 mt-2">
        <rider-order-list-item :order="order" />
        <div class="mt-3">
          <deliver-fee :detail="false" />
        </div>
        <button
          class="bg-gray-800 text-gray-100 object-center rounded-lg shadow-lg text-base font-semibold mt-4 px-2 py-2 w-full"
          @click="onClickOnTheWay"
        >
          ON THE WAY
        </button>
      </div>
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
import RiderOrderListItem from '../components/RiderOrderListItem'
import DeliverFee from '../components/DeliverFee'
import ViewLocation from '../components/ViewLocation.vue'
import MenuButton from '../components/MenuButton'

export default {
  components: { RiderOrderListItem, DeliverFee, ViewLocation, MenuButton },
  setup() {
    const store = useStore()
    const router = useRouter()
    const order = computed(() => store.state.orders.currentOrder)
    const targets = computed(() =>
      store.state.orders.currentOrder?.items.map((item) => {
        let lat = item.location.lat
        let lng = item.location.lng
        let address = item.location.address
        return { address, lat, lng }
      }),
    )
    console.log('on the way currentOrder:', order.value)
    function onClickOnTheWay() {
      router.push('/riderconfirmprice')
    }

    return { onClickOnTheWay, order, targets }
  },
}
</script>

<style></style>
