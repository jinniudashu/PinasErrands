<template>
  <div class="bg-gray-100 min-h-screen">
    <navigation-bar />
    <div class="mt-6 mx-6">
      <div class="bg-gray-50 mt-3 p-2 w-full rounded-xl shadow-lg text-sm">
        <div v-for="(item, index) in order?.items" :key="index">
          <div class="my-3">
            <p class="font-semibold">Contact Name: {{ item.contactName }}</p>
            <p class="mt-1">Contact Number: {{ item.contactPhone }}</p>
            <p class="mt-1">
              {{ index === order?.items.length - 1 ? 'Delivery:' : 'Pick Up:' }}
              <span>
                {{ item.location.address }}
              </span>
            </p>
            <p class="mt-1">
              {{
                index === order?.items.length - 1
                  ? 'Landmark:'
                  : 'Errand Request: '
              }}<span>{{ item.request }}</span>
            </p>
            <div v-if="item.attachment.length > 0" class="mt-1">
              <p>
                Attachment:
              </p>
              <div v-for="image in item.attachment" :key="image">
                <div class="container relative">
                  <img class="w-full h-auto p-2" :src="image" alt="" />
                </div>
              </div>
            </div>
            <hr />
            <hr />
          </div>
        </div>
      </div>
      <button
        class="bg-gray-800 text-gray-100 object-center rounded-lg shadow-lg text-base font-semibold mt-4 px-2 py-2 w-full"
        @click="onClickAccept"
      >
        ACCEPT
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { riderGetOrder } from '@/modules/utils/handleData'
export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const order = computed(() => store.state.orders.currentOrder)

    async function onClickAccept() {
      console.log('currentOrder', order.value)
      // Take the order
      let getOrder = await riderGetOrder(order.value.id, order.value.notifyId)
      if (getOrder) {
        router.push('/riderontheway')
      } else {
        // Notify 'Sorry, this order has been assigned! Please wait another notification'
        router.replace('/riderhome')
      }
    }
    return { order, onClickAccept }
  },
}
</script>

<style></style>
