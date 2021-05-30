<template>
  <div class="bg-yellow-200 min-h-screen p-4">
    <!-- Menu -->
    <menu-button />

    <div class="mx-4 mt-3">
      <div>
        <div
          class="bg-gray-50 mt-3 p-2 w-full rounded-xl shadow-lg text-sm"
          @click="isActivate = !isActivate"
        >
          <div v-if="isActivate">
            <div class="flex flex-row justify-between">
              <p class="font-semibold">
                Contact Name:
                {{ order?.items[order?.items.length - 1].contactName }}
              </p>
              <div class="text-gray-400 mr-2">
                <svg-icon :name="'chevron-up'" />
              </div>
            </div>
            <p class="mt-1">
              Contact Number:
              {{ order?.items[order?.items.length - 1].contactPhone }}
            </p>
            <p class="mt-1">
              Delivery:
              <span>
                {{ order?.items[order?.items.length - 1].location.address }}
              </span>
            </p>
            <p class="mt-1">
              Landmark:
              <span>{{ order?.items[order?.items.length - 1].request }}</span>
            </p>
            <div
              v-if="order?.items[order?.items.length - 1].attachment.length > 0"
              class="mt-1"
            >
              <p>
                Attachment:
              </p>
              <div
                v-for="image in order?.items[order?.items.length - 1]
                  .attachment"
                :key="image"
              >
                <div class="container relative">
                  <img class="w-full h-auto p-2" :src="image" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="flex flex-row justify-between">
              <p class="font-semibold">
                Contact Name:
                {{ order?.items[order?.items.length - 1].contactName }}
              </p>
              <div class="text-gray-400 mr-2">
                <svg-icon :name="'chevron-down'" />
              </div>
            </div>
          </div>
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
      isActivate: false,
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
