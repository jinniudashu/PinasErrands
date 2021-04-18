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

export default {
  props: {
    defaultSrc: String,
    mode: String,
  },

  data() {
    return {
      src: this.defaultSrc,
      newAvatar: false,
    }
  },

  methods: {
    browse() {
      this.$refs.file.click()
    },
    async remove() {
      let del = await deleteImage(this.src)
      if (del) {
        this.newAvatar = false
        this.src = this.defaultSrc
        let upd = await updateUserProfile({ photo_url: this.defaultSrc })
        if (upd) {
          this.$emit('input', null)
          console.log('del ok, us default', this.defaultSrc)
        }
      } else {
        alert('Delete failed, please try again.')
      }
    },
    async change(e) {
      if (e.target.files[0]) {
        let url = await uploadImage(e.target.files[0], 'avatars')
        this.newAvatar = true
        if (url) {
          this.src = url
          let upd = await updateUserProfile({ photoURL: url })
          if (upd) {
            this.$emit('input', url)
            console.log('Avata.changed:', url)
          }
        } else {
          alert('Upload failed, please try again.')
        }
      }
    },
  },
}
</script>
