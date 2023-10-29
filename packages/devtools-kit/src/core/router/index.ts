import type { RouteLocationNormalizedLoaded, RouteRecordNormalized, Router } from 'vue-router'
import type { AppRecord } from '@vue-devtools-next/schema'
import { target as global } from '@vue-devtools-next/shared'
import { watch } from 'vue'
import { DevToolsEvents, apiHooks } from '../../api'

const RouterKey = '__VUE_DEVTOOLS_ROUTER_INFO__'

export interface RouterInfo {
  currentRoute: RouteLocationNormalizedLoaded | null
  routes: RouteRecordNormalized[]
  router: Router | null
}

global[RouterKey] ??= {
  currentRoute: null,
  routes: [],
  router: null,
} as RouterInfo

export const devtoolsRouterInfo: RouterInfo = new Proxy(global[RouterKey], {
  get(target, property) {
    return global[RouterKey][property]
  },
})

export function normalizeRouterInfo(appRecord: AppRecord) {
  const getRoutes = (router: Router) => {
    const routesMap = new Map()
    return (router?.getRoutes() || []).filter(i => !routesMap.has(i.path) && routesMap.set(i.path, 1))
  }
  function init() {
    const router = appRecord.app?.config.globalProperties.$router as Router
    const currentRoute = router?.currentRoute.value

    const routes = getRoutes(router)
    global[RouterKey] = {
      currentRoute: JSON.parse(JSON.stringify(currentRoute)),
      routes: JSON.parse(JSON.stringify(routes)),
      router: JSON.parse(JSON.stringify(router)),
    }
  }

  init()
  // @TODO: use another way to watch router (browser extension working failed)
  watch(() => appRecord.app?.config.globalProperties.$router, () => {
    init()
    apiHooks.callHook(DevToolsEvents.ROUTER_INFO_UPDATED, global[RouterKey])
  }, { deep: true })
}
