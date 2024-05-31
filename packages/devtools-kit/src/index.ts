import { initDevTools, onDevToolsClientConnected } from './core'
import { toggleComponentInspectorEnabled } from './core/component-inspector'
import { setupDevToolsPlugin } from './core/plugin'
import { addCustomCommand, addCustomTab, devtoolsContext, removeCustomCommand } from './ctx'
import { toggleHighPerfMode } from './core/high-perf-mode'
import { setOpenInEditorBaseUrl } from './core/open-in-editor'
import { hook } from './hook'

export * from './core'
export * from './core/plugin'
export * from './ctx'
export * from './messaging'
export type * from './types'
export type * from './core/open-in-editor'
export type * from './core/component-highlighter'
export type * from './core/component-inspector'
export type * from './core/component/types'
export { parse, stringify } from './shared'
export { formatInspectorStateValue, getInspectorStateValueType, getRaw, toEdit, toSubmit } from './core/component/state/format'
export { UNDEFINED, INFINITY, NAN, NEGATIVE_INFINITY } from './core/component/state/constants'
export { isPlainObject } from './core/component/state/is'

export const devtools = {
  hook,
  init: () => {
    initDevTools()
  },
  get ctx() {
    return devtoolsContext
  },
  get api() {
    return devtoolsContext.api
  },
}

export {
  onDevToolsClientConnected,
  addCustomTab,
  addCustomCommand,
  removeCustomCommand,
  setupDevToolsPlugin,
  toggleComponentInspectorEnabled,
  toggleHighPerfMode,
  setOpenInEditorBaseUrl,
}
