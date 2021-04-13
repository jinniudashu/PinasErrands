export default {
  namespaced: true,
  state: {
    riderLocation: null,
  },
  getters: {},
  mutations: {
    setRiderLocation(state, payload) {
      state.riderLocation = payload
    },
  },
  actions: {},
}
