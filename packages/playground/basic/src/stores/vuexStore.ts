import { createStore } from 'vuex'

export default createStore({
  state: {
    counter: 0,
  },
  mutations: {
    increment(state) {
      state.counter++
    },
  },
  actions: {
    doubleIncrement({ commit }) {
      commit('increment')
      commit('increment')
    },
  },
  modules: {
    namespacedModule: {
      namespaced: true,
      state: () => ({
        value: 'Hello, Vuex',
      }),
      getters: {
        exclamation(state) {
          return `${state.value}!!!!!!!`
        },
      },
      modules: {
        unnamespacedModule: {
          state: () => ({
            value: 'unnamespacedModule',
          }),
        },
      },
    },
  },
})
