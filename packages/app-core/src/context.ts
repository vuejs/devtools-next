import { target } from '@vue-devtools-next/shared'

export interface DevToolsContext {
  connected: boolean
  componentCount: number
}

export function createDevToolsContext(): DevToolsContext {
  return {
    connected: false,
    componentCount: 0,
  }
}

export function updateDevToolsContext(params: Partial<DevToolsContext>): DevToolsContext {
  return Object.assign(target.__VUE_DEVTOOLS_CTX__, params)
}
