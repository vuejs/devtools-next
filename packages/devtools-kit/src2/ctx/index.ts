import { target } from '@vue/devtools-shared'
import { HookKeys, Hookable } from 'hookable'
import type { DevToolsContextHooks, DevToolsMessagingHooks } from './hook'
import { createDevToolsCtxHooks } from './hook'
import { activeAppRecord, devtoolsAppRecords, devtoolsState } from './state'
import type { DevToolsAppRecords, DevToolsState } from './state'
import type { DevToolsApiType } from './api'
import { createDevToolsApi } from './api'

export * from './plugin'
export * from './api'
export * from './hook'
export * from './inspector'
export * from './env'
export * from './state'

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
