<template>
  <div class="cursor-pointer" @click="showModal = true">
    <svg-icon :name="'menu'" />
  </div>
  <teleport to="#modal-container">
    <menu-modal :show="showModal" @close="showModal = false"></menu-modal>
  </teleport>
</template>

<script>
import { ref } from 'vue'
import MenuModal from './MenuModal.vue'
export default {
  components: {
    MenuModal,
  },
  setup() {
    const showModal = ref(false)
    return {
      showModal,
    }
  },
}
</script>

<style></style>
