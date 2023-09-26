import { target } from '@vue-devtools-next/shared'
import { BridgeEvents } from '@vue-devtools-next/schema'
import { Bridge } from './bridge'

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
  Object.assign(target.__VUE_DEVTOOLS_CTX__, params)
  Bridge.value?.emit(BridgeEvents.UPDATE_DEVTOOLS_CONTEXT, {
    keys: Object.keys(params),
    values: params,
  })
}
