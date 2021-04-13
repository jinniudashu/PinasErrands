import { createMachine, assign } from 'xstate'
// import { initApp } from './utils/handleData'
import { customerMachine } from './customerMachine'
import { riderMachine } from './riderMachine'
import { loginMachine } from './loginMachine'

const appMachine = createMachine({
  id: 'app',
  initial: 'loading',
  context: {
    user: null,
  },
  states: {
    loading: {
      invoke: {
        id: 'initLoading',
        // Initialize：用户登录状态监听、路由守卫，返回当前用户身份
        src: () => {
          return async (callback) => {
            // let user = await initApp()
            let user = null
            if (user) {
              console.log('appMachine:', user.role)
              console.log('appMachine:', user.rider)
              console.log('appMachine:', user)
              console.log('appMachine:', user.role === 'rider')
              if (user.role === 'rider') {
                callback({ type: 'RIDER_IN', user }) //用户身份为骑手，转骑手场景
              } else {
                callback({ type: 'CUSTOMER_IN', user }) //用户身份为客户，转客户场景
              }
            } else {
              callback({ type: 'NOT_LOGIN' }) //没有登录，去登录
            }
          }
        },
      },
      on: {
        NOT_LOGIN: 'login',
        CUSTOMER_IN: {
          target: 'customerService',
          actions: assign({ user: (ctx, evt) => evt.user }),
        },
        RIDER_IN: {
          target: 'riderService',
          actions: assign({ user: (ctx, evt) => evt.user }),
        },
      },
    },
    login: {
      invoke: {
        id: 'login',
        src: loginMachine,
        onDone: 'loading',
      },
    },
    customerService: {
      invoke: {
        id: 'customer',
        src: customerMachine,
        data: { user: (ctx) => ctx.user },
        onDone: 'login',
      },
    },
    riderService: {
      invoke: {
        id: 'rider',
        src: riderMachine,
        data: { user: (ctx) => ctx.user },
        onDone: 'login',
      },
    },
  },
})

export default appMachine
