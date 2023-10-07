import { target as global } from '@vue-devtools-next/shared'

const StateKey = '__VUE_DEVTOOLS_GLOBAL_STATE__'
global[StateKey] ??= {
  vueAppInitialized: false,
  appRecords: [],
  activeAppRecord: null,
}

export const devtoolsGlobalState = new Proxy(global[StateKey], {
  get(target, property) {
    return global[StateKey][property]
  },
  set(target, property, value) {
    target[property] = value
    // sync to global to ensure the state is consistent
    global[StateKey][property] = value
    return true
  },
  deleteProperty(target, property) {
    delete target[property]
    return true
  },
})
