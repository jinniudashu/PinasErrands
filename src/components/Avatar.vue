<template>
  <div class="relative inline-block overflow-hidden">
    <input
      type="file"
      accept="image/*"
      class="hidden"
      ref="file"
      @change="change"
    />
    <img :src="src" alt="Avatar" class="h-full w-full object-cover" />
    <div
      v-if="mode === 'edit'"
      class="absolute top-0 h-full w-full bg-black bg-opacity-25 flex items-center justify-center"
    >
      <button
        type="button"
        @click="browse()"
        class="rounded-full hover:bg-white hover:bg-opacity-25 p-2 focus:outline-none text-white transition duration-200"
      >
        <svg-icon name="camera" class="h-6 w-6"></svg-icon>
      </button>
      <button
        v-if="newAvatar"
        type="button"
        @click="remove()"
        class="rounded-full hover:bg-white hover:bg-opacity-25 p-2 focus:outline-none text-white transition duration-200"
      >
        <svg-icon name="x" class="h-6 w-6"></svg-icon>
      </button>
    </div>
  </div>
</template>

<script>
import { uploadImage, deleteImage } from '@/modules/utils/handleStorage'
import { updateUserProfile } from '@/modules/utils/handleAuth'
import { reactive, toRefs, ref } from 'vue'

export default {
  props: {
    defaultSrc: String,
    mode: String,
  },

  setup(props, { emit }) {
    const state = reactive({
      src: props.defaultSrc,
      newAvatar: false,
    })

    const file = ref(null)

    function browse() {
      file.value.click()
    }

    const remove = async () => {
      let del = await deleteImage(state.src)
      if (del) {
        state.newAvatar = false
        state.src = null
        let upd = await updateUserProfile({ photoURL: null })
        if (upd) {
          emit('input', null)
        }
      } else {
        alert('Delete failed, please try again.')
      }
    }

    const change = async (e) => {
      if (e.target.files[0]) {
        let url = await uploadImage(e.target.files[0], 'avatars')
        state.newAvatar = true
        if (url) {
          state.src = url
          let upd = await updateUserProfile({ photoURL: url })
          if (upd) {
            emit('input', url)
          }
        } else {
          alert('Upload failed, please try again.')
        }
      }
    }

    return { ...toRefs(state), file, browse, remove, change }
  },
}
</script>
