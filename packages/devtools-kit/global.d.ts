import type { DevToolsContext, DevToolsEnv, DevToolsHook, DevToolsState, Router, RouterInfo } from './src/types'

/* eslint-disable vars-on-top, no-var */
declare global {
  var __VUE_DEVTOOLS_GLOBAL_HOOK__: DevToolsHook
  var __VUE_DEVTOOLS_GLOBAL_STATE__: DevToolsState
  var __VUE_DEVTOOLS_CONTEXT__: DevToolsContext
  var __VUE_DEVTOOLS_APP_RECROD_INFO__: {
    id: number
    appIds: Set<string>
  }
  var __VUE_DEVTOOLS_ROUTER__: Router | null
  var __VUE_DEVTOOLS_ROUTER_INFO__: RouterInfo
  var __VUE_DEVTOOLS_ENV__: DevToolsEnv
  var __VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__: boolean
  var __VUE_DEVTOOLS_VITE_PLUGIN_DETECTED__: boolean
  var __VUE_DEVTOOLS_VITE_PLUGIN_CLIENT_URL__: string
  var __VUE_DEVTOOLS_BROWSER_EXTENSION_DETECTED__: boolean
}

export { }
