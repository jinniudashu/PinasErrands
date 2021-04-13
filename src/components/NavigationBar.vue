<template>
  <div class="bg-white h-10 px-3 flex justify-center items-center shadow-lg">
    <div
      class="absolute left-4 top-2.5 w-6 h-6 bg-gray-800 text-gray-100 rounded-md"
      @click="goBack"
    >
      <svg-icon :name="'goback'" />
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter()

    function goBack() {
      router.go(-1)
    }

    return { goBack }
  },
}
</script>
