import { createMachine, assign } from 'xstate'
import router from '@/router'

const loginWithPhoneNumber = (phoneNumber) => {
  console.log('loginWithPhoneNumber:', phoneNumber)
  return new Promise((resolve) => {
    setTimeout(() => resolve('success'), 1000)
  })
}

const checkVerifyCode = (code) => {
  console.log('checkVerifyCode:', code)
  return new Promise((resolve) => {
    setTimeout(() => resolve('user'), 1000)
  })
}

const userCheckIn = (uid) => {
  console.log('checkVerifyCode:', uid)
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => resolve('Rider'), 1000)
    } catch (err) {
      console.error(err)
      reject('error')
    }
  })
}

export const loginMachine = createMachine(
  {
    id: 'login',
    initial: 'idle',
    context: {
      phoneNumber: undefined,
      verifyCode: undefined,
      error: undefined,
    },
    states: {
      // 初始等待
      idle: {
        entry: [
          'routeToLogin',
          'setFocusPhoneNumber',
          'enableSubmitPhoneNumber',
        ],
        on: {
          SUBMIT_PHONENUMBER: 'submitingPhoneNumber',
        },
      },
      // 提交电话号码
      submitingPhoneNumber: {
        invoke: {
          id: 'loginWithPhoneNumber',
          src: () => loginWithPhoneNumber(),
          onDone: {
            target: 'waitingVerifyCode',
          },
          onError: {
            target: 'errorHint',
            actions: ['showErrorHint'],
          },
        },
      },
      // 等待输入验证码
      waitingVerifyCode: {
        entry: ['setFocusVerifyCode', 'startTimer', 'disableSubmitPhoneNumber'],
        on: {
          SUBMIT_VERIFYCODE: 'submitingVerifyCode',
          TIMER_OUT: {
            target: 'idle',
            actions: ['clearTimer'],
          },
        },
      },
      // 提交验证码
      submitingVerifyCode: {
        invoke: {
          id: 'checkVerifyCode',
          src: () => checkVerifyCode(),
          onDone: {
            target: 'checkingIn',
          },
          onError: {
            target: 'errorHint',
            actions: ['showErrorHint'],
          },
        },
      },
      // 检查身份
      checkingIn: {
        invoke: {
          id: 'userCheckIn',
          src: () => userCheckIn(),
          onDone: {
            actions: [assign({ role: (ctx, event) => event.data })],
          },
          onError: {
            entry: ['showErrorHint'],
            target: 'errorHint',
          },
        },
      },
      // 出错提示
      errorHint: {
        entry: ['showErrorHint'],
        after: {
          1000: 'idle',
        },
      },
    },
  },
  {
    actions: {
      routeToLogin: () => router.replace('/login'),
      setFocusPhoneNumber: () => {
        console.log('1.setFocusPhoneNumber')
      },
      setFocusVerifyCode: () => {
        console.log('2.setFocusVerifyCode')
      },
      startTimer: () => {
        console.log('3.startTimer')
      },
      disableSubmitPhoneNumber: () => {
        console.log('4.disableSubmitPhoneNumber')
      },
      clearTimer: () => {
        console.log('5.clearTimer')
      },
      enableSubmitPhoneNumber: () => {
        console.log('6.enableSubmitPhoneNumber')
      },
      showErrorHint: () => {
        console.log('7.showErrorHint')
      },
    },
  },
)
