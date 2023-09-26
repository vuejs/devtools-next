import type { BridgeInstanceType } from '../app-core/src/bridge'
import type { DevToolsContext } from '../app-core/src/context'
import type { DevtoolsHook } from './src/types/vue'

declare global {
  var __VUE_DEVTOOLS_GLOBAL_HOOK__: DevtoolsHook
  var __VUE_DEVTOOLS_CLIENT_URL__: string
  var __VUE_DEVTOOLS_BRIDGE__: BridgeInstanceType
  var __VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER__: [string, Record<string, unknown>][]
  var __VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER_COLLECT_EVENT__: Array<() => void>
  var __VUE_DEVTOOLS_STOP_COLLECT_HOOK_BUFFER__: () => void
  var __VUE_DEVTOOLS_CTX__: DevToolsContext
}

export { }
