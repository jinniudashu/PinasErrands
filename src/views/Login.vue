<template>
  <div class="bg-yellow-200 p-2 h-full">
    <div class="max-w-sm mx-auto h-screen">
      <div class="pl-6">
        <img
          class="w-40 mt-16"
          alt="Pinas Errunds"
          src="../assets/pinaserrunds.png"
        />
      </div>
      <div class="mt-16 pl-8 text-2xl font-semibold">
        Welcome!
      </div>
      <!-- 手机号登录 -->
      <!-- 输入手机号码 -->
      <div v-if="verifyProcess == 'waitPhoneNumber'">
        <div class="mt-2 pl-8 text-sm">
          Enter your mobile number to continue
        </div>
        <div class="">
          <div class="mt-10 ml-16 flex">
            <button class="py-2 px-1 bg-gray-100 w-20 rounded-lg shadow-lg">
              <div class="flex items-center">
                <img
                  class="ml-1 h-4 w-6"
                  alt="Google Logo"
                  src="../assets/philippines-flag-icon-64.png"
                />
                <div class="ml-2 text-gray-400">
                  +63
                </div>
              </div>
            </button>
            <input
              type="tel"
              id="phoneNumber"
              size="10"
              minlength="10"
              maxlength="10"
              placeholder="9*********"
              v-model="phonenumber"
              class="block bg-gray-100 w-40 ml-1 p-2 border rounded-lg border-gray-500 shadow-lg "
            />
          </div>
          <button
            @click="submitPhoneNumberAuth"
            id="sign-in-button"
            class=" mt-8 ml-16 w-60 p-2 bg-yellow-500 text-white text-center rounded shadow-lg hover:bg-yellow-400"
          >
            Sign in
          </button>
          <div>
            <input
              type="checkbox"
              v-model="rememberMe"
              id="checkbox"
              class="mt-5 ml-16 mr-1 text-sm text-gray-500"
            />
            <label for="checkbox">Remember me</label>
          </div>
        </div>
      </div>
      <!-- 输入手机校验码 -->
      <div v-if="verifyProcess == 'waitCode'">
        <div v-if="isMatch" class="mt-2 pl-8 text-sm">
          Please enter the verification code
        </div>
        <div v-if="!isMatch" class="mt-2 pl-8 text-sm text-red-500">
          Doesn't match, please try again
        </div>

        <div class="mt-10 flex justify-center">
          <div v-for="i in [0, 1, 2, 3, 4, 5]" :key="i">
            <input
              type="tel"
              v-model="codes[i]"
              class="block bg-gray-100 w-10 ml-1 p-2 border rounded-lg border-gray-500 shadow-lg focus: border-yellow-400"
              @keyup="getCode(i)"
              :ref="input[i]"
            />
          </div>
        </div>
        <!-- <button
          @click="submitPhoneNumberAuthCode"
          id="confirm-code"
          class="mt-8 py-2 bg-yellow-500 text-white text-center w-full rounded shadow-lg hover:bg-yellow-400"
        >
          Submit
        </button> -->
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '@/firebase'
export default {
  name: 'login',
  data() {
    return {
      loginInfo: {
        email: '',
        password: '',
      },
      phonenumber: '',
      codes: [],
      code: '',
      verifyProcess: 'waitPhoneNumber',
      rememberMe: true,
      input: ['0', '1', '2', '3', '4', '5'],
      isMatch: 'true',
    }
  },

  computed: {
    telnumber: function() {
      return '+63' + this.phonenumber
    },
  },

  mounted() {
    // Create a Recaptcha verifier instance globally
    // Calls submitPhoneNumberAuth() when the captcha is verified
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
        callback: () => this.submitPhoneNumberAuth(),
      },
    )
  },

  methods: {
    getCode(i) {
      this.code = this.codes.join('')
      console.log(this.code, this.codes.length)
      if (this.codes.length < 6) {
        this.$nextTick(() => {
          this.$refs[i + 1].focus()
        })
      } else {
        this.submitPhoneNumberAuthCode()
      }
    },

    // This function runs when the 'sign-in-button' is clicked
    // Takes the value from the 'phoneNumber' input and sends SMS to that phone number
    async submitPhoneNumberAuth() {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          var phoneNumber = this.telnumber
          var appVerifier = window.recaptchaVerifier
          firebase
            .auth()
            .signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
              window.confirmationResult = confirmationResult
              this.verifyProcess = 'waitCode'
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch((error) => {
          console.log(error.message)
        })
    },

    // Takes the value from the 'code' input and submits the code to verify the phone number
    // Return a user object if the authentication was successful, and auth is complete
    submitPhoneNumberAuthCode() {
      var code = this.code
      window.confirmationResult
        .confirm(code)
        .then((result) => {
          this.$store.commit('user/setUser', result.user)
          console.log('OK, logined!')
        })
        .catch((error) => {
          this.isMatch = false
          console.log(error)
          this.code = ''
          this.codes.splice(0, this.codes.length)
          this.$nextTick(() => {
            this.$refs[0].focus()
          })
        })
    },

    watch: {
      // 如果 verifyProcess 发生改变，重置输入焦点
      verifyProcess: function() {
        this.$nextTick(() => {
          this.$refs[0].focus()
        })
      },
    },
  },
}
</script>
