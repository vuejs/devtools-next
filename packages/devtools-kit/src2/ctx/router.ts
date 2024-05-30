import { target as global } from '@vue/devtools-shared'
import { Router, RouterInfo } from '../types'

export const ROUTER_KEY = '__VUE_DEVTOOLS_ROUTER__'
export const ROUTER_INFO_KEY = '__VUE_DEVTOOLS_ROUTER_INFO__'

global[ROUTER_INFO_KEY] ??= {
  currentRoute: null,
  routes: [],
}

global[ROUTER_KEY] ??= {}

export const devtoolsRouterInfo = new Proxy<RouterInfo>(global[ROUTER_INFO_KEY], {
  get(target, property) {
    return global[ROUTER_INFO_KEY][property]
  },
})

export const devtoolsRouter = new Proxy<{ value: Router }>(global[ROUTER_KEY], {
  get(target, property) {
    if (property === 'value') {
      return global[ROUTER_KEY]
    }
  },
})
