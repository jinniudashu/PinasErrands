export default {
  namespaced: true,
  state: {
    user: null,
    userLocation: null,
  },
  getters: {},
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setUserLocation(state, payload) {
      state.userLocation = payload
    },
  },
  actions: {
    setUser(context, payload) {
      context.commit('setUser', payload)
    },
  },
}
