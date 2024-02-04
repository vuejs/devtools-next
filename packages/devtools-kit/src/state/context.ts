import { target as global } from '@vue/devtools-shared'
import type { DevToolsContext } from '../types'
import { ROUTER_KEY } from './router'

const CONTEXT_KEY = '__VUE_DEVTOOLS_CONTEXT__'

function initContextFactory() {
  return {
    appRecord: null,
    api: null,
    inspector: [],
    timelineLayer: [],
    routerInfo: {},
    router: null,
    activeInspectorTreeId: '',
    componentPluginHookBuffer: [],
  } as unknown as DevToolsContext
}

global[CONTEXT_KEY] ??= initContextFactory()

export function resetDevToolsContext() {
  global[CONTEXT_KEY] = initContextFactory()
}

export const devtoolsContext = new Proxy(global[CONTEXT_KEY], {
  get(target, property) {
    if (property === 'router')
      return global[ROUTER_KEY]

    else if (property === 'clear')
      return resetDevToolsContext

    return global[CONTEXT_KEY][property]
  },
  set(target, property, value) {
    global[CONTEXT_KEY][property] = value
    return true
  },
})
