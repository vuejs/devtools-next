import { devtoolsContext as _devtoolsContext, initDevTools as _initDevTools, setupDevToolsPlugin } from '../src2/index'
import { toggleComponentInspectorEnabled } from '../src2/core/component-inspector'
import { addCustomCommand, addCustomTab, removeCustomCommand } from '../src2/ctx'
import { toggleHighPerfMode } from '../src2/core/high-perf-mode'
import { setOpenInEditorBaseUrl } from '../src2/core/open-in-editor'
import { onDevToolsClientConnected } from '../src2/core'
import { hook } from './hook'
import { devtoolsContext, devtoolsState } from './state'
// import { setupDevToolsPlugin } from './api'

export * from '../src2/index'
export type * from '../src2/types'
export type * from '../src2/core/open-in-editor'
export type * from '../src2/core/component-highlighter'
export type * from '../src2/core/component-inspector'
export type * from '../src2/core/component/types'

export type DevToolsType = any

export { parse, stringify } from '../src2/shared'
export { formatInspectorStateValue, getInspectorStateValueType, getRaw, toEdit, toSubmit } from '../src2/core/component/state/format'
export { UNDEFINED, INFINITY, NAN, NEGATIVE_INFINITY } from '../src2/core/component/state/constants'
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
  addCustomTab,
  addCustomCommand,
  removeCustomCommand,
  setupDevToolsPlugin,
  toggleComponentInspectorEnabled,
  toggleHighPerfMode,
  setOpenInEditorBaseUrl,
}
