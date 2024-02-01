import type { RouteLocationNormalizedLoaded, RouteRecordNormalized } from 'vue-router'

export type { Router } from 'vue-router'
export interface RouterInfo {
  currentRoute: RouteLocationNormalizedLoaded | null | {}
  routes: RouteRecordNormalized[]
  // router: Router | null
}
