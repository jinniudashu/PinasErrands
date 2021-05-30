<template>
  <div class="mt-3 text-sm text-gray-800 flex items-center">
    <label class="text-sm font-semibold" for="Attachment"
      >Attachment (Optional)</label
    >
  </div>

  <div
    class="mt-2 h-16 bg-gray-100 rounded-lg flex flex-row items-center space-x-1 border-2 border-gray-300 border-dashed "
  >
    <label for="Attachment">
      <div class="px-2 rounded-md cursor-pointer border-r-2">
        <svg-icon :name="'uploadpicture'" />
      </div>
    </label>
    <div
      v-if="picturesCounter === 0"
      class="pl-3 text-sm text-gray-500 leading-normal"
    >
      <p v-if="userMode === 'customerInput'">
        For protect your privacy, the attachment will
        <span class="font-semibold">be deleted</span> after the order completed.
      </p>
      <p v-if="userMode === 'riderInput'">
        Receipts up to three
      </p>
    </div>
    <input
      type="file"
      id="Attachment"
      accept="image/*"
      class="sr-only"
      @change="uploadImg"
    />

    <div v-for="(image, index) in attachment" :key="image">
      <div class="container relative">
        <router-link :to="{ path: '/viewimage', query: { url: image } }">
          <img class="w-16 h-16 p-2" :src="image" alt="" />
        </router-link>
        <div class="absolute top-2 left-2 w-5" @click="delImg(image, index)">
          <svg-icon :name="'delimage'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { uploadImage, deleteImage } from '@/modules/utils/handleStorage'

export default {
  props: { attachment: Array, userMode: String },
  emits: ['uploadImg', 'delImg'],
  setup(props, context) {
    const picturesCounter = computed(() => props.attachment?.length || 0)

    const uploadImg = async (e) => {
      // 最多上传三张图片
      if (picturesCounter.value < 3) {
        if (e.target.files[0]) {
          let url = await uploadImage(e.target.files[0], 'attachments')
          if (url) {
            context.emit('uploadImg', url)
          } else {
            alert('Upload failed, please try again.')
          }
        }
      } else {
        console.log('props.attachment?.length', props.attachment?.length)
        alert('Upload up to three.')
      }
    }

    const delImg = async (img, index) => {
      let del = await deleteImage(img)
      if (del) {
        context.emit('delImg', index)
      } else {
        alert('Delete failed, please try again.')
      }
    }

    return {
      uploadImg,
      delImg,
      picturesCounter,
    }
  },
}
</script>

<style></style>
