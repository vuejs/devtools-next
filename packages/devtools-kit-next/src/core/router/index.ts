import type { RouteLocationNormalizedLoaded, RouteRecordRaw, Router } from 'vue-router'
import { deepClone, target as global } from '@vue/devtools-shared'
import { debounce } from 'perfect-debounce'
import { ROUTER_INFO_KEY, ROUTER_KEY } from '../../state'
import type { AppRecord } from '../../types'
import { hook } from '../../hook'
import { DevToolsEvents, apiHooks } from '../../api/hook'

function getRoutes(router?: Router) {
  const routesMap = new Map()
  return (router?.getRoutes() || []).filter(i => !routesMap.has(i.path) && routesMap.set(i.path, 1))
}

function filterRoutes(routes: RouteRecordRaw[]) {
  return routes.map((item) => {
    let { path, name, children } = item
    if (children?.length)
      children = filterRoutes(children)

    return {
      path,
      name,
      children,
    }
  })
}

function filterCurrentRoute(route: RouteLocationNormalizedLoaded & { href?: string } | undefined) {
  if (route) {
    const { fullPath, hash, href, path, name, matched, params, query } = route
    return {
      fullPath,
      hash,
      href,
      path,
      name,
      params,
      query,
      matched: filterRoutes(matched),
    }
  }
  return route
}

export function normalizeRouterInfo(appRecord: AppRecord) {
  function init() {
    const router = appRecord.app?.config.globalProperties.$router as Router | undefined
    const currentRoute = filterCurrentRoute(router?.currentRoute.value)
    const routes = filterRoutes(getRoutes(router))
    const c = console.warn
    console.warn = () => {}
    global[ROUTER_INFO_KEY] = {
      currentRoute: currentRoute ? deepClone(currentRoute) : {},
      routes: deepClone(routes),
    }
    global[ROUTER_KEY] = router!
    console.warn = c
  }

  init()

  // @TODO: use another way to watch router
  hook.on.componentUpdated(debounce(() => {
    init()
    apiHooks.callHook(DevToolsEvents.ROUTER_INFO_UPDATED, global[ROUTER_INFO_KEY])
  }, 200))
}
export function getRouterDevToolsId(id: string) {
  return id.replace(/\D/g, '') || '0'
}
