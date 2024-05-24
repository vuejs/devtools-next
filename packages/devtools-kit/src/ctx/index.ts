import { target } from '@vue/devtools-shared'
import { HookKeys, Hookable } from 'hookable'
import type { DevToolsContextHooks } from './hook'
import { createDevToolsCtxHooks } from './hook'

export * from './app'

export interface DevtoolsContext {
  hooks: Hookable<DevToolsContextHooks, HookKeys<DevToolsContextHooks>>
}

target.__VUE_DEVTOOLS_KIT_CONTEXT__ ??= {
  hooks: createDevToolsCtxHooks(),
}

export const devtoolsContext = target.__VUE_DEVTOOLS_KIT_CONTEXT__ as DevtoolsContext
