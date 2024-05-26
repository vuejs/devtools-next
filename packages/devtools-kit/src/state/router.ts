import { target as global } from '@vue/devtools-shared'

export const ROUTER_KEY = '__VUE_DEVTOOLS_ROUTER__'
export const ROUTER_INFO_KEY = '__VUE_DEVTOOLS_ROUTER_INFO__'

global[ROUTER_INFO_KEY] ??= {
  currentRoute: null,
  routes: [],
}

global[ROUTER_KEY] ??= null

export const devtoolsRouterInfo: any = new Proxy(global[ROUTER_INFO_KEY], {
  get(target, property) {
    return global[ROUTER_INFO_KEY][property]
  },
})
