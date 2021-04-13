import { createMachine, assign } from 'xstate'
import { customerMachine } from './customerMachine'
import { riderMachine } from './riderMachine'
import { loginMachine } from './loginMachine'
import { getUserRoleById } from './utils/handleData'
import { auth } from '../firebase'
import store from '../store'

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
        src: () => {
          return async (callback) => {
            // Initialize：用户登录状态监听、路由守卫，返回当前用户身份
            let user = await initApp()
            if (user) {
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

// initApp：设置用户登录状态监听，置入全局store.user
const initApp = async () => {
  var user = null
  await auth.onAuthStateChanged(async () => {
    user = auth.currentUser
    if (user) {
      // 如果用户是骑手，为user增加骑手信息
      let rider = await getUserRoleById(user.uid)
      if (rider) {
        user.role = 'rider'
        user.rider = rider
      } else {
        user.role = 'customer'
      }
      store.commit('user/setUser', user)
    }
  })
  console.log('initApp:', user)
  return user
}
