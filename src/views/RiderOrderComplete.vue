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
          <p class="font-semibold">TIME: {{ time }}</p>
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
import { computed, onMounted, onUnmounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { completeOrder } from '@/modules/utils/handleData'
import ViewLocation from '../components/ViewLocation.vue'
import MenuButton from '../components/MenuButton'
import { getDistance, useGeolocation } from '@/modules/utils/handleGoogleMap'

export default {
  components: { ViewLocation, MenuButton },
  setup() {
    const store = useStore()
    const router = useRouter()
    const order = computed(() => store.state.orders.currentOrder)
    const targets = computed(() =>
      order.value.items.map((item) => item.location),
    )
    const state = reactive({
      // 目的地地址
      address: targets.value[targets.value.length - 1].address,
      // 到目的地时间
      time: 'Calculating...',
    })

    const { coords } = useGeolocation()
    const currPos = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude,
    }))

    var handleTimer
    onMounted(async () => {
      // 终点位置
      let theEnd = targets.value[targets.value.length - 1]

      // 取Rider当前手机位置计算duration
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            let currPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            let { duration } = await getDistance(currPos, theEnd)
            console.log('duration:', duration)
            state.time = duration
          },
          (error) => {
            console.log('error', error)
          },
        )
      }

      // 每30秒取一次duration
      if (!handleTimer)
        handleTimer = setInterval(async () => {
          let { duration } = await getDistance(currPos.value, theEnd)
          state.time = duration
        }, 30000)
    })

    onUnmounted(() => {
      clearInterval(handleTimer)
    })

    async function onClickCompleted() {
      await completeOrder(order.value.id)
      router.push('/riderhome')
    }

    return {
      order,
      onClickCompleted,
      ...toRefs(state),
      targets,
    }
  },
}
</script>

<style></style>
