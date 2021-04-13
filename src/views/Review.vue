<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="mx-6 pt-8">
      <div class="flex flex-col items-center justify-center">
        <img
          class="h-24 w-24 rounded-full shadow-md"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
        <div class="mt-2">
          <review-star :alignCenter="true" @reviewed="(n) => (rider = n)">
            <p class="text-lg font-semibold text-center">
              Tell Us How Was Your Ride?
            </p>
          </review-star>
        </div>
      </div>
      <div class="text-xl mt-6">
        <div class="mt-2">
          <review-star @reviewed="(n) => (punctuality = n)">
            Punctuality
          </review-star>
        </div>
        <div class="mt-2">
          <review-star @reviewed="(n) => (friendly = n)">
            Friendly
          </review-star>
        </div>
        <div class="mt-2">
          <review-star @reviewed="(n) => (communication = n)">
            Communication
          </review-star>
        </div>
        <div class="mt-2">
          <review-star @reviewed="(n) => (secure = n)">
            Was Your Delivery Secure?
          </review-star>
        </div>
      </div>
      <div class="mt-4">
        <label for="comment">
          Comment:
        </label>
        <textarea
          name="comment"
          id="comment"
          v-model="comment"
          cols="30"
          rows="4"
          class="w-full rounded-md shadow-md mt-1 p-2"
        ></textarea>
      </div>

      <div
        class="flex justify-center bg-yellow-400 text-gray-700 object-center rounded-lg shadow-lg text-base font-semibold px-2 py-2 mt-8 w-full"
        @click="onClickSubmit"
      >
        Submit
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ReviewStar from '../components/ReviewStar.vue'
import { reviewOrder } from '@/modules/utils/handleData'

export default {
  components: { ReviewStar },
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      rider: 0,
      punctuality: 0,
      friendly: 0,
      communication: 0,
      secure: 0,
      comment: null,
    })
    const order = computed(() => store.state.orders.currentOrder)

    // 提交评价
    const onClickSubmit = async () => {
      order.value.review = state
      store.commit('orders/setCurrentOrder', order.value)
      console.log('Submit:', order.value)
      await reviewOrder(order.value.id)
      router.replace('/customerhome')
    }

    return { ...toRefs(state), onClickSubmit }
  },
}
</script>

<style></style>
