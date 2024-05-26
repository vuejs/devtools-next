import { target } from '@vue/devtools-shared'
import { HookKeys, Hookable } from 'hookable'
import type { DevToolsContextHooks, DevToolsMessagingHooks } from './hook'
import { createDevToolsCtxHooks } from './hook'
import { devtoolsState } from './state'
import type { DevToolsState } from './state'
import { activeAppRecord, devtoolsAppRecords } from './app'
import type { DevToolsAppRecords } from './app'
import type { DevToolsApiType } from './api'
import { createDevToolsApi } from './api'

export * from './app'
export * from './plugin'
export * from './api'
export * from './hook'
export { devtoolsState, updateDevToolsState } from './state'

export interface DevtoolsContext {
  hooks: Hookable<DevToolsContextHooks & DevToolsMessagingHooks, HookKeys<DevToolsContextHooks & DevToolsMessagingHooks>>
  state: DevToolsState & {
    activeAppRecordId: string
    activeAppRecord: DevToolsAppRecords
    appRecords: DevToolsAppRecords[]
  }
  api: DevToolsApiType
}

const hooks = createDevToolsCtxHooks()

target.__VUE_DEVTOOLS_KIT_CONTEXT__ ??= {
  hooks,
  get state() {
    return {
      ...devtoolsState,
      activeAppRecordId: activeAppRecord.id,
      activeAppRecord: activeAppRecord.value,
      appRecords: devtoolsAppRecords.value,
    }
  },
  api: createDevToolsApi(hooks),
}

export const devtoolsContext = target.__VUE_DEVTOOLS_KIT_CONTEXT__ as DevtoolsContext
