import { target } from '@vue/devtools-shared'
import { HookKeys, Hookable } from 'hookable'
import type { DevToolsContextHooks } from './hook'
import { createDevToolsCtxHooks } from './hook'
import { devtoolsState } from './state'
import type { DevToolsState } from './state'
import { devtoolsInspector } from './inspector'
import { activeAppRecord, devtoolsAppRecords } from './app'
import type { DevToolsAppRecords } from './app'

export * from './app'
export * from './plugin'
export * from './state'

export interface DevtoolsContext {
  hooks: Hookable<DevToolsContextHooks, HookKeys<DevToolsContextHooks>>
  state: DevToolsState & {
    activeAppRecordId: string
    activeAppRecord: DevToolsAppRecords
    appRecords: DevToolsAppRecords[]
  }
}

target.__VUE_DEVTOOLS_KIT_CONTEXT__ ??= {
  hooks: createDevToolsCtxHooks(),
  get state() {
    return {
      ...devtoolsState,
      activeAppRecordId: activeAppRecord.id,
      activeAppRecord: activeAppRecord.value,
      appRecords: devtoolsAppRecords.value,
    }
  },
}

export const devtoolsContext = target.__VUE_DEVTOOLS_KIT_CONTEXT__ as DevtoolsContext
