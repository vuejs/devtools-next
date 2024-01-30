import type { DevToolsState } from './src/types'

/* eslint-disable vars-on-top, no-var */
declare global {
  var __VUE_DEVTOOLS_GLOBAL_HOOK__: unknown
  var __VUE_DEVTOOLS_GLOBAL_STATE__: DevToolsState
  var __VUE_DEVTOOLS_APP_RECROD_INFO__: {
    id: number
    appIds: Set<string>
  }
}

export { }
