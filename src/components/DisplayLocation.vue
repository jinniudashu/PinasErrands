<template>
  <div
    class="flex flex-row justify-between items-center space-x-1 bg-gray-800 text-gray-100 rounded-lg shadow-md mt-6 px-2 py-1 w-auto"
  >
    <svg-icon :name="'pin'" />
    <div class="flex flex-col items-start px-2">
      <p class="text-sm font-semibold">Input Location</p>
      <p class="text-xs">
        {{ location.address }}
      </p>
    </div>
    <svg-icon :name="'goto'" />
  </div>
</template>

<script>
import { reactive, toRefs, watchEffect } from 'vue'
export default {
  name: 'InputLocation',
  props: {
    item: Object,
  },
  setup(props) {
    const state = reactive({
      location: {
        address: '',
        lat: null,
        lng: null,
      },
    })

    watchEffect(() => {
      if (props.item) state.location = props.item
    })

    return { ...toRefs(state) }
  },
}
</script>
