import type { Router } from 'vue-router'
import type { AppRecord } from '@vue-devtools-next/schema'

export function normalizeRouterInfo(appRecord: AppRecord) {
  const router = appRecord.app?.config.globalProperties.$router as Router
  const currentRoute = router?.currentRoute.value
  const getRoutes = () => {
    const routesMap = new Map()
    return (router?.getRoutes() || []).filter(i => !routesMap.has(i.path) && routesMap.set(i.path, 1))
  }
  const routes = getRoutes()
  // console.log('currentRoute', currentRoute)
  // console.log('routes', routes)
}
