<template>
  <p>{{ errundRequest }}</p>
  <p>{{ attachment }}</p>
</template>
<script>
import { reactive, toRefs, watchEffect } from 'vue'
export default {
  props: {
    item: Object,
  },
  setup(props) {
    const state = reactive({
      errundRequest: '',
      attachment: [],
    })
    watchEffect(() => {
      if (props.item) {
        state.errundRequest = props.item.request
        state.attachment = props.item.attachment
      }
    })

    return { ...toRefs(state) }
  },
}
</script>

<style></style>
