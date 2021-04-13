import { createStore } from 'vuex'
// import createPersistedState from 'vuex-persistedstate' //保持Vuex状态的插件
import userMoudle from './user'
import ordersMoudle from './orders'
import riderMoudle from './rider'

export default createStore({
  // plugins: [createPersistedState()],
  modules: {
    user: userMoudle,
    orders: ordersMoudle,
    rider: riderMoudle,
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
