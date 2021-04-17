<template>
  <div class="bg-gray-100 min-h-screen">
    <div
      class="flex flex-row justify-between items-start bg-yellow-200 h-48 w-full pt-5 px-4"
    >
      <!-- Menu -->
      <menu-button />

      <!-- Pinas Logo -->
      <img
        class="w-48 "
        src="@/assets/pinaserrunds-deploy.png"
        alt="Pinas Errunds"
      />
    </div>
    <!-- Avatar & Reviews & Rides -->
    <div class="flex flex-col items-center justify-center -mt-12">
      <avatar
        class="w-24 h-24 rounded-full"
        :default-src="avatar"
        :mode="'edit'"
        @input="editAvatar"
      />

      <div class="mt-1 text-gray-800 text-base font-semibold">
        {{ riderName }}
      </div>
      <div class="flex flex-row justify-center text-gray-700 mt-1">
        <review-star :initReview="reviews" />
      </div>
      <div class="mt-1">{{ rides }} RIDES</div>
    </div>
    <!-- Button -->
    <div class="flex flex-row justify-center items-center space-x-5 mt-6">
      <div
        class="flex justify-between items-center"
        @click="onToggleDuty(onDuty)"
      >
        <p class="text-gray-600 font-semibold mr-3">
          Off Duty
        </p>
        <div
          class="w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out"
          :class="{ 'bg-yellow-400': onDuty }"
        >
          <div
            class="bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out"
            :class="{ 'translate-x-6': onDuty }"
          ></div>
        </div>
        <p class="ml-3 text-gray-600 font-semibold">
          On Duty
        </p>
      </div>
    </div>

    <!-- Income & Rides & New order notify -->
    <div v-if="onDuty" class="flex flex-row justify-between mx-8 mt-16">
      <div
        class="flex flex-col justify-center items-center bg-gray-50 p-2 w-32 rounded-xl shadow-lg"
      >
        <p class="text-base font-semibold text-gray-800">
          Income
        </p>
        <p class="text-base text-gray-800 mt-1">
          P1000
        </p>
      </div>
      <div class="flex flex-row">
        <div
          class="flex flex-col justify-center items-center bg-gray-50 p-2 w-32 rounded-xl shadow-lg"
        >
          <p class="text-base font-semibold text-gray-800">
            Rides
          </p>
          <p class="text-base text-gray-800 mt-1">
            12
          </p>
        </div>
        <div v-if="notifiesCounter > 0" class="flex flex-row -ml-7 -mt-3">
          <div class="text-gray-600" @click="onClickNotifies">
            <svg-icon :name="'message'" />
          </div>
          <p
            class="bg-red-500 rounded-full w-4 h-4 text-gray-200 text-xs text-center -ml-3"
          >
            {{ notifiesCounter }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, toRefs, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ReviewStar from '../components/ReviewStar.vue'
import { updateRiderStatus } from '@/modules/utils/handleData'
import Avatar from '../components/Avatar.vue'
import MenuButton from '../components/MenuButton.vue'

export default {
  components: { ReviewStar, Avatar, MenuButton },
  setup() {
    const store = useStore()
    const router = useRouter()
    const notifiesCounter = computed(
      () => store.state.orders.orderNotifies.length,
    )
    const rider = computed(() => store.state.user.user?.rider)
    const onDuty = computed(() =>
      rider.value?.status === 'idle' ? true : false,
    )
    // const avatar = computed(() => store.state.user.user.photoURL)
    const state = reactive({
      riderName: '',
      reviews: 0,
      rides: 0,
      avatar: null,
    })

    watchEffect(() => {
      state.riderName = store.state.user.user.displayName
      state.avatar = store.state.user.user.photoURL
      state.reviews = rider.value?.reviews
      state.rides = rider.value?.rides
    })

    function onClickNotifies() {
      router.push('/riderorderlist')
    }

    const onToggleDuty = async (duty) => {
      await updateRiderStatus(rider.value?.id, !duty)
    }

    const editAvatar = (url) => {
      state.avatar = url
      console.log('editAvatar:', url)
    }

    return {
      notifiesCounter,
      ...toRefs(state),
      onClickNotifies,
      onToggleDuty,
      onDuty,
      editAvatar,
    }
  },
}
</script>
