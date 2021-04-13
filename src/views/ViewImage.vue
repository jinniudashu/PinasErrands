<template>
  <navigation-bar />
  <div class="bg-black min-h-screen container mx-auto">
    <img class=" w-full object-center" :src="url" alt="" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
export default {
  setup() {
    const route = useRoute()
    const url = computed(() => route.query.url)
    return { url }
  },
}
</script>

<style></style>
