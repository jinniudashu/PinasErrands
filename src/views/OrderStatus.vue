<template>
  <div class="bg-gray-100 min-h-screen">
    <navigation-bar />
    <router-link to="/riderlocation">
      <div
        v-if="status === 'confirmed'"
        class="flex flex-row justify-start  ml-3 mt-3 "
      >
        <img class="w-16" src="@/assets/assigned.svg" alt="" />
        <p class="mt-2 text-sm">Rider's current location...</p>
      </div>
    </router-link>
    <div class="flex flex-col items-center mt-10  mx-4 ">
      <div
        class="container mx-auto flex justify-center items-center"
        @click="toRiderLocation"
      >
        <svg-icon :name="status" />
      </div>
      <div class="text-xl text-gray-800 font-semibold mt-4">
        {{ txt1 }}
      </div>
      <div
        v-if="!(status === 'completed')"
        class="text-xl text-gray-800 font-semibold w-66 text-center mt-1"
      >
        {{ txt2 }}
        <span v-if="status === 'confirmed'">P{{ totalPrice }}</span>
      </div>
      <div
        v-if="status === 'completed'"
        class="flex justify-center bg-yellow-400 text-gray-700 object-center rounded-lg shadow-lg text-base font-semibold px-2 py-2 mt-4 w-full"
        @click="onClickReview"
      >
        {{ txt2 }}
      </div>
    </div>
    <div v-if="status === 'confirmed'" class="mt-8 px-4">
      <deliver-fee :detail="true" />
      <div
        v-if="attachment.length > 0"
        class="mt-2 h-16 bg-gray-100 rounded-lg flex flex-row items-center space-x-3 border-2 border-gray-300 border-dashed "
      >
        <div v-for="image in attachment" :key="image">
          <router-link :to="{ path: '/viewimage', query: { url: image } }">
            <img class="w-16 h-16 p-2" :src="image" alt="" />
          </router-link>
        </div>
      </div>
    </div>

    <div class="mt-12 px-4">
      <order-items :items="items" />
    </div>
  </div>
</template>

<script>
import { computed, watchEffect, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { filterOrderByOrderId } from '@/modules/utils/handleData.js'
import { statusDisplayItems } from '@/modules/businessEntity'
import OrderItems from '../components/OrderItems.vue'
import DeliverFee from '../components/DeliverFee.vue'

export default {
  components: { OrderItems, DeliverFee },
  props: {
    id: String,
  },

  setup(props) {
    const store = useStore()
    const router = useRouter()
    const order = computed(() => filterOrderByOrderId(props.id))
    const attachment = computed(() => order.value.riderAttachments)

    const state = reactive({
      // image: '',
      txt1: '',
      txt2: '',
      status: '',
      totalPrice: 0,
      items: null,
    })

    watchEffect(() => {
      store.commit('orders/setCurrentOrder', order.value)
      let status = order.value?.status
      if (status) {
        state.status = status
        // state.image = statusDisplayItems[status].image
        state.txt1 = statusDisplayItems[status].txt1
        state.txt2 = statusDisplayItems[status].txt2
        state.totalPrice =
          parseInt(order.value.bills.totalAmount) +
          parseInt(order.value.productPrice)
        state.items = order.value.items
      }
    })

    const toRiderLocation = () => {
      if (state.status === 'assigned') {
        router.push('/riderlocation')
      }
    }

    const onClickReview = () => {
      router.push('/review')
    }

    return { ...toRefs(state), toRiderLocation, onClickReview, attachment }
  },
}
</script>
