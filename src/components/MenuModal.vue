<template>
  <div v-if="show" @click="$emit('close')">
    <section
      class="z-20 h-screen w-screen bg-gray-500 fixed top-0 opacity-50"
    ></section>
    <div class="absolute inset-0">
      <div class=" flex h-full">
        <div class="z-30 bg-yellow-200 w-3/4 p-4 ">
          <!-- <div class="cursor-pointer mt-1 right-10">
            <svg-icon :name="'menu'" />
          </div> -->

          <div
            class="mt-10 border-gray-300 border-b-2 p-1 text-sm cursor-pointer"
            @click="onClickLogout"
          >
            Logout
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '@/modules/utils/handleAuth.js'

export default {
  props: { show: Boolean },
  emits: ['close'],
  setup() {
    const router = useRouter()
    const onClickLogout = () => {
      logout()
      router.replace('/login')
    }

    return { onClickLogout }
  },
}
</script>
