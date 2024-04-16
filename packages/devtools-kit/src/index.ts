import { initDevTools, onDevToolsClientConnected, onDevToolsConnected } from './core'
import { hook } from './hook'
import { devtoolsContext, devtoolsState, setDevToolsEnv } from './state'
import { setupDevToolsPlugin } from './api'
import { addCustomTab } from './core/custom-tab'
import { addCustomCommand, removeCustomCommand } from './core/custom-command'
import { toggleComponentInspectorEnabled } from './core/component-inspector'
import { toggleHighPerfMode } from './core/high-perf-mode'
import { setOpenInEditorBaseUrl } from './core/open-in-editor'

export type * from './core/custom-tab'
export type * from './core/custom-command'
export type * from './core/timeline'
export type * from './core/open-in-editor'
export type * from './core/component-highlighter'
export type * from './core/component/types'
export type * from './core/component-inspector'
export type * from './core/inspector'
export type * from './types'

export interface DevToolsType {
  state: typeof devtoolsState
  context: typeof devtoolsContext
  hook: typeof hook
  init: typeof initDevTools
  get api(): typeof devtoolsContext.api

}

export { parse, stringify } from './shared'
export { formatInspectorStateValue, getInspectorStateValueType, getRaw, toEdit, toSubmit } from './core/component/state/format'
export { UNDEFINED } from './core/component/state/constants'

export const devtools = {
  state: devtoolsState,
  context: devtoolsContext,
  hook,
  init: initDevTools,
  get api() {
    return devtoolsContext.api
  },
}

export {
  onDevToolsClientConnected,
  onDevToolsConnected,
  addCustomTab,
  addCustomCommand,
  removeCustomCommand,
  setupDevToolsPlugin,
  setDevToolsEnv,
  toggleComponentInspectorEnabled,
  toggleHighPerfMode,
  setOpenInEditorBaseUrl,
}
