import type { DevToolsContext } from './src/types/context'
import type { DevtoolsHook } from './src/types/hook'
import type { AppRecord, DevToolsState } from './src/types/vue'

/* eslint-disable vars-on-top, no-var */
declare global {
  var __VUE_DEVTOOLS_GLOBAL_HOOK__: DevtoolsHook
  var __VUE_DEVTOOLS_CLIENT_URL__: string

  // FIXME: the type should be BridgeInstanceType
  var __VUE_DEVTOOLS_BRIDGE__: any
  var __VUE_DEVTOOLS_OVERLAY_BRIDGE__: any
  var __VUE_DEVTOOLS_PANEL_BRIDGE__: any

  var __VUE_DEVTOOLS_CLIENT_CONNECTED__: boolean
  // app record info
  var __VUE_DEVTOOLS_APP_RECORDS__: AppRecord[]
  var __VUE_DEVTOOLS_ACTIVE_APP_RECORD__: AppRecord
  var __VUE_DEVTOOLS_APP_RECROD_INFO__: {
    id: number
    appIds: Set<string>
  }
  // devtools global state
  var __VUE_DEVTOOLS_GLOBAL_STATE__: DevToolsState
  // devtools context
  var __VUE_DEVTOOLS_CONTEXT__: DevToolsContext
  // router
  var __VUE_DEVTOOLS_ROUTER__: unknown
  // toggle overlay
  var __VUE_DEVTOOLS_TOGGLE_OVERLAY__: (visible: boolean) => void
  // is vite plugin detected
  var __VUE_DEVTOOLS_VITE_PLUGIN_DETECTED__: boolean
  // is browser extension detected
  var __VUE_DEVTOOLS_BROWSER_EXTENSION_DETECTED__: boolean
  // vite client url
  var __VUE_DEVTOOLS_VITE_PLUGIN_CLIENT_URL__: string
  // remote devtools option
  var __VUE_DEVTOOLS_HOST__: string
  var __VUE_DEVTOOLS_PORT__: number
}

export { }
