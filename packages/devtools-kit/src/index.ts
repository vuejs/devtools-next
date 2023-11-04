import { devtoolsContext, devtoolsState, hook, initDevTools, onDevToolsConnected } from './core/general'
import { editState } from './core/component/edit'

// Maybe it's an enum, so we can't just use export type * from '...'
export * from './core/component/types'
export type * from './core/timeline/types'
export type * from './core/router'

export const devtools = {
  state: devtoolsState,
  context: devtoolsContext,
  init: initDevTools,
  hook,
}

export {
  onDevToolsConnected,
  editState,
}
