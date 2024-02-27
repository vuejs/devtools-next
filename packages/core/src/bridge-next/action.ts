import { DevToolsType } from '@vue/devtools-kit'
import { nanoid } from 'nanoid'
import { BRIDGE_DEVTOOLS_ACTION_KEY, BRIDGE_DEVTOOLS_LISTENER_KEY, getBridgeInstance } from './shared'

export function defineDevToolsAction<T>(name: string, action: (devtools: DevToolsType) => T) {
  return async () => {
    const bridge = getBridgeInstance()
    const uniqueEventKey = nanoid()

    return await new Promise<T>((resolve) => {
      bridge.once(uniqueEventKey, (e: T) => {
        resolve(e)
      })

      bridge.emit(BRIDGE_DEVTOOLS_ACTION_KEY, {
        name,
        key: uniqueEventKey,
        action: `${action}`,
      })
    })
  }
}

export function defineDevToolsListener<T>(fn: (devtools: DevToolsType, callback: Function) => void) {
  return (listener: (payload: T) => void) => {
    const bridge = getBridgeInstance()
    const uniqueEventKey = nanoid()

    const off = bridge.on(uniqueEventKey, (e) => {
      listener(e)
    })

    bridge.emit(BRIDGE_DEVTOOLS_LISTENER_KEY, {
      key: uniqueEventKey,
      action: `${fn}`,
    })

    return off
  }
}
