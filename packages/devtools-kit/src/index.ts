import { devtoolsContext as _devtoolsContext, initDevTools as _initDevTools, setupDevToolsPlugin } from '../src2/index'
import { onDevToolsClientConnected, onDevToolsConnected } from './core'
import { hook } from './hook'
import { devtoolsContext, devtoolsState, setDevToolsEnv } from './state'
// import { setupDevToolsPlugin } from './api'
import { addCustomTab } from './core/custom-tab'
import { addCustomCommand, removeCustomCommand } from './core/custom-command'
import { toggleComponentInspectorEnabled } from './core/component-inspector'
import { toggleHighPerfMode } from './core/high-perf-mode'
import { setOpenInEditorBaseUrl } from './core/open-in-editor'

export * from '../src2/index'
export type * from '../src2/types'
export type * from './core/custom-tab'
export type * from './core/custom-command'
export type * from './core/open-in-editor'
export type * from './core/component-highlighter'
export type * from './core/component-inspector'

export type DevToolsType = any

export { parse, stringify } from './shared'
export { formatInspectorStateValue, getInspectorStateValueType, getRaw, toEdit, toSubmit } from './core/component/state/format'
export { UNDEFINED, INFINITY, NAN, NEGATIVE_INFINITY } from './core/component/state/constants'
export { isPlainObject } from './core/component/state/is'

export const devtools = {
  state: devtoolsState as any,
  context: devtoolsContext as any,
  hook: hook as any,
  init: () => {
    // initDevTools()
    _initDevTools()
  },
  get ctx() {
    return _devtoolsContext
  },
  get api() {
    return devtoolsContext.api as any
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
