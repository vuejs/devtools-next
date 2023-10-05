import { target } from '@vue-devtools-next/shared'

export interface DevToolsContext {
  connected: boolean
  activeAppVueVersion: string
  componentCount: number
}

export function createDevToolsContext(): DevToolsContext {
  return {
    connected: false,
    activeAppVueVersion: '',
    componentCount: 0,
  }
}

export function updateDevToolsContext(params: Partial<DevToolsContext>) {
  target.__VUE_DEVTOOLS_CTX__ = {
    ...target.__VUE_DEVTOOLS_CTX__,
    ...params,
  }
  // Object.assign(target.__VUE_DEVTOOLS_CTX__, params)
}
