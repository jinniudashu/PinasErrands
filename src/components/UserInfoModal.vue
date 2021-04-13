<template>
  <div>
    <section
      class="z-20 h-screen w-screen bg-gray-500 fixed top-0 opacity-50"
      @click="$emit('close-edit')"
    ></section>
    <div class="absolute inset-0">
      <div class="flex h-full">
        <div class="z-30 m-auto bg-gray-50 p-2 rounded shadow w-10/12 md:w-1/3">
          <div class="p-2 border">
            <form class="p-2 my-2" @submit.prevent="onSubmit">
              <div class="my-4">
                <label>Please enter your name</label>
                <input
                  ref="nameRef"
                  v-model="displayName"
                  class="rounded shadow p-2 w-full mt-5"
                  placeholder="Enter your name"
                />
              </div>
              <div class="my-4">
                <button
                  type="submit"
                  class="w-full rounded shadow-md bg-yellow-400 text-white p-2"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { updateUserProfile } from '@/utils/handleAuth.js'

export default {
  props: {},
  emits: ['close-edit'],
  setup(_, { emit }) {
    const displayName = ref('')
    const nameRef = ref(null)

    const onSubmit = async () => {
      await updateUserProfile(displayName.value)
      emit('close-edit')
    }

    onMounted(() => {
      nameRef.value.focus()
    })

    return {
      nameRef,
      displayName,
      onSubmit,
    }
  },
}
</script>
