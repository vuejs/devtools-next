// @TODO: schema package for global types (based on untyped) ?

import { DevtoolsHook } from './vue'
import type { Bridge } from '@vue-devtools-next/app-core'

declare global {
  var __VUE_DEVTOOLS_GLOBAL_HOOK__: DevtoolsHook
  var __VUE_DEVTOOLS_CLIENT_URL__: string
  var __VUE_DEVTOOLS_BRIDGE__: InstanceType<typeof Bridge>
  var __VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER__: [string, Record<string, unknown>][]
  var __VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER_COLLECT_EVENT__: Array<() => void>
  var __VUE_DEVTOOLS_STOP_COLLECT_HOOK_BUFFER__: () => void
}

export { }
