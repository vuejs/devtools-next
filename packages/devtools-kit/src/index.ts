import { devtoolsContext, devtoolsState, hook, initDevTools, onDevToolsConnected } from './core/general'

// Maybe it's an enum, so we can't just use export type * from '...'
export * from './core/component/types'

export const devtools = {
  state: devtoolsState,
  context: devtoolsContext,
  init: initDevTools,
  hook,
}

export {
  onDevToolsConnected,
}
