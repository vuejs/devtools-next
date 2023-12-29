import type { RouteLocationNormalizedLoaded, RouteRecordNormalized, Router } from 'vue-router'
import type { AppRecord } from '@vue/devtools-schema'
import { deepClone, target as global } from '@vue/devtools-shared'
import { debounce } from 'perfect-debounce'
import { DevToolsEvents, apiHooks } from '../../api'
import { hook } from '../general/hook'

const RouterInfoKey = '__VUE_DEVTOOLS_ROUTER_INFO__'
export const RouterKey = '__VUE_DEVTOOLS_ROUTER__'

export type { Router } from 'vue-router'
export interface RouterInfo {
  currentRoute: RouteLocationNormalizedLoaded | null
  routes: RouteRecordNormalized[]
  router: Router | null
}

global[RouterInfoKey] ??= {
  currentRoute: null,
  routes: [],
  router: null,
} as RouterInfo

global[RouterKey] ??= null as unknown as Router

export const devtoolsRouterInfo: RouterInfo = new Proxy(global[RouterInfoKey], {
  get(target, property) {
    return global[RouterInfoKey][property]
  },
})

export function normalizeRouterInfo(appRecord: AppRecord) {
  const getRoutes = (router?: Router) => {
    const routesMap = new Map()
    return (router?.getRoutes() || []).filter(i => !routesMap.has(i.path) && routesMap.set(i.path, 1))
  }
  function init() {
    const router = appRecord.app?.config.globalProperties.$router as Router | undefined
    const currentRoute = router?.currentRoute.value
    const routes = getRoutes(router).map((item) => {
      const { path, name, children } = item
      return {
        path,
        name,
        children,
      }
    })
    const c = console.warn
    console.warn = () => {}
    global[RouterInfoKey] = {
      currentRoute: currentRoute ? deepClone(currentRoute) : {},
      routes: deepClone(routes),
    }
    global[RouterKey] = router
    console.warn = c
  }

  init()

  // @TODO: use another way to watch router
  hook.on.componentUpdated(debounce(() => {
    init()
    apiHooks.callHook(DevToolsEvents.ROUTER_INFO_UPDATED, global[RouterInfoKey])
  }, 200))
}

export function getRouterDevToolsId(id: string) {
  return id.replace(/\D/g, '') || '0'
}
