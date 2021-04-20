<template>
  <div class="bg-gray-100 min-h-screen">
    <navigation-bar>
      Your Profile
    </navigation-bar>
    <div
      class="flex flex-row justify-between items-start bg-yellow-200 h-48 w-full pt-5 px-4"
    ></div>
    <!-- Avatar -->
    <div class="flex flex-col items-center justify-center -mt-12">
      <avatar
        class="w-24 h-24 rounded-full"
        :default-src="avatar"
        mode="edit"
        @input="editAvatar"
      />
    </div>
    <div class="mx-6">
      <!-- Name -->
      <div class="flex flex-row justify-start items-center space-x-2 mt-4 p-2">
        <label for="inputName" class=" text-gray-700 text-sm">
          Name:
        </label>
        <input
          id="inputName"
          type="text"
          v-model="name"
          ref="inputName"
          class="background-gray-100 rounded-lg shadow-md px-2 py-1 w-full border-gray-300 border-2 focus:outline-none"
          @click="onInputNameClicked"
        />
      </div>
      <!-- Phone Number -->
      <div class="flex flex-row justify-start items-center space-x-2 p-2">
        <label class=" text-gray-700 text-sm ">
          Phone Number:
        </label>
        <div
          class="background-gray-100 rounded-lg shadow-md px-2 py-1 w-full border-gray-300 border-2 focus:outline-none"
        >
          {{ phoneNumber }}
        </div>
      </div>
    </div>
    <!-- Button -->
    <div class="flex justify-center">
      <button
        class=" bg-yellow-400 text-gray-700 object-center rounded-lg shadow-lg text-base font-semibold px-2 py-2 mt-10 mx-6 w-full"
        @click="submitProfile"
      >
        SUBMIT
      </button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Avatar from '../components/Avatar.vue'
import { updateUserProfile } from '@/modules/utils/handleAuth'

export default {
  components: { Avatar },
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      name: store.state.user.user.displayName,
      phoneNumber: store.state.user.user.phoneNumber,
      avatar: store.state.user.user.photoURL,
    })
    const inputName = ref(null)

    const onInputNameClicked = () => {
      inputName.value.focus()
      inputName.value.select()
    }

    const editAvatar = (url) => {
      state.avatar = url
      console.log('editAvatar:', url)
    }

    const submitProfile = async () => {
      let upd = await updateUserProfile({
        displayName: state.name,
        photoURL: state.avatar,
      })
      if (upd) router.replace('/riderhome')
      else {
        alert('Upload failed, please try again.')
      }
    }

    return {
      ...toRefs(state),
      editAvatar,
      submitProfile,
      inputName,
      onInputNameClicked,
    }
  },
}
</script>
