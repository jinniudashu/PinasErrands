<template>
  <navigation-bar />
  <div class="absolute top-11 right-0 bottom-0 left-0">
    <view-location :targets="targets" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import ViewLocation from '../components/ViewLocation.vue'
export default {
  components: { ViewLocation },
  setup() {
    const store = useStore()
    const targets = computed(() =>
      store.state.orders.currentOrder.items.map((item) => {
        let lat = item.location.lat
        let lng = item.location.lng
        let address = item.location.address
        return { address, lat, lng }
      }),
    )
    return { targets }
  },
}
</script>
