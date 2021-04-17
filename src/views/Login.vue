<template>
  <toast v-if="showToast">
    {{ errMessage }}
  </toast>
  <div class="bg-yellow-200 min-h-screen pt-6">
    <div class="mx-6">
      <img
        class="w-40"
        alt="Pinas Errunds"
        src="../assets/pinaserrunds-deploy.png"
      />
      <div class="mt-16 mx-8 text-2xl font-semibold">
        Welcome!
      </div>
      <div class="mt-2 mx-8 text-sm">
        Enter your mobile number to continue
      </div>
      <div class="flex justify-center">
        <div class="w-60 flex flex-col justify-center">
          <!-- 输入手机号码 -->
          <div class="mt-8 flex">
            <div
              class="py-1 px-1 bg-gray-100 w-20 rounded-lg shadow-lg flex items-center"
            >
              <img
                class="ml-1 h-4 w-6"
                alt="Google Logo"
                src="../assets/philippines-flag-icon-64.png"
              />
              <div class="ml-2 text-gray-400">
                +63
              </div>
            </div>
            <input
              type="tel"
              id="phoneNumber"
              size="10"
              minlength="10"
              maxlength="10"
              placeholder="9*********"
              v-model="phoneNumber"
              ref="inputPhoneNumber"
              class="block text-gray-700 bg-gray-100 w-40 ml-1 p-2 rounded-lg shadow-lg border border-gray-500 focus: border-yellow-400 outline-none"
            />
          </div>
          <!-- 输入手机校验码 -->
          <div
            class="mt-4 px-2 w-full flex justify-between items-center bg-gray-100 rounded-lg shadow-lg border border-gray-500 focus: border-yellow-400"
          >
            <input
              type="tel"
              v-model="verifyCode"
              minlength="6"
              maxlength="6"
              placeholder="Verify code"
              ref="inputVerifyCode"
              class="w-28 p-2 text-gray-700 bg-gray-100 border focus: border-none outline-none"
            />
            <div class="flex mr-2 ">
              <button
                v-if="timer === 0 || timer === 60"
                @click="submitPhoneNumberAuth"
                class="text-blue-400 focus: outline-none"
              >
                Get code
              </button>
              <div v-else class="text-gray-400">{{ timer }}s</div>
            </div>
          </div>
          <!-- 提交按钮 -->
          <button
            @click="submitPhoneNumberAuthCode"
            id="sign-in-button"
            class=" mt-4 w-full p-2 bg-yellow-500 text-white font-semibold text-center rounded shadow-lg hover:bg-yellow-400"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '@/firebase'
import { computed, onMounted, onUnmounted, reactive, toRefs, ref } from 'vue'
import Toast from '../components/Toast.vue'

export default {
  name: 'login',
  components: { Toast },
  setup() {
    var handleTimer
    const state = reactive({
      phoneNumber: '',
      verifyCode: '',
      timer: 60,
      errMessage: 'This is error message',
    })
    const userPhoneNumber = computed(() => '+63' + state.phoneNumber)
    const inputPhoneNumber = ref(null)
    const inputVerifyCode = ref(null)
    const showToast = ref(false)

    onMounted(() => {
      inputPhoneNumber.value.focus()
      // Create a Recaptcha verifier instance globally
      // Calls submitPhoneNumberAuth() when the captcha is verified
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        'sign-in-button',
        {
          size: 'invisible',
          callback: () => submitPhoneNumberAuth(),
        },
      )
    })

    onUnmounted(() => {
      if (handleTimer) {
        clearInterval(handleTimer)
      }
    })

    const submitPhoneNumberAuth = () => {
      // This function runs when the 'sign-in-button' is clicked
      // Takes the value from the 'phoneNumber' input and sends SMS to that phone number
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase
            .auth()
            .signInWithPhoneNumber(
              userPhoneNumber.value,
              window.recaptchaVerifier,
            )
            .then((confirmationResult) => {
              window.confirmationResult = confirmationResult
              inputVerifyCode.value.focus()
              console.log('confirmationResult', confirmationResult)
              if (!handleTimer)
                handleTimer = setInterval(() => {
                  state.timer = state.timer - 1
                  if (state.timer === 0) {
                    clearInterval(handleTimer)
                    handleTimer = null
                    state.timer = 60
                  }
                }, 1000)
            })
            .catch((error) => {
              console.log('无效号码', error)
              // 弹出警告：无效号码
              triggerToast('Invalid phone number')
            })
        })
        .catch((error) => {
          console.log(error.message)
        })
    }

    // Takes the value from the 'code' input and submits the code to verify the phone number
    // Return a user object if the authentication was successful, and auth is complete
    const submitPhoneNumberAuthCode = () => {
      window.confirmationResult
        .confirm(state.verifyCode)
        .then((result) => {
          console.log('OK, logined!', result.user)
        })
        .catch((error) => {
          console.log(error)
          triggerToast('Invalid verify code')
        })
    }

    const triggerToast = (errMessage) => {
      state.errMessage = errMessage
      showToast.value = true
      setTimeout(() => (showToast.value = false), 2000)
    }

    return {
      ...toRefs(state),
      submitPhoneNumberAuth,
      submitPhoneNumberAuthCode,
      inputPhoneNumber,
      inputVerifyCode,
      showToast,
    }
  },
}
</script>
