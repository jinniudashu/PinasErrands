<template>
  <div
    :class="
      alignCenter == true ? 'flex flex-col justify-center items-center' : ''
    "
  >
    <slot></slot>
    <div class="flex flex-row justify-start space-x-1">
      <div v-for="n in totalReviews" :key="n" @click="onClickStar(n)">
        <div :class="n - 1 < review ? 'text-yellow-400' : 'text-gray-300'">
          <svg-icon :name="'star'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, watchEffect } from 'vue'
export default {
  props: {
    initReview: Number,
    alignCenter: Boolean,
  },
  emit: ['reviewed'],
  setup(props, context) {
    const state = reactive({
      totalReviews: 5,
      review: props.initReview ? parseInt(props.initReview) : 0,
    })

    watchEffect(() => {
      state.review = parseInt(props.initReview)
    })

    const onClickStar = (n) => {
      if (props.initReview === undefined) {
        state.review = n
        context.emit('reviewed', n)
      }
    }

    return { ...toRefs(state), onClickStar }
  },
}
</script>

<style></style>
