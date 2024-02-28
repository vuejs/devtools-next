import { DevToolsType, parse } from '@vue/devtools-kit'
import { nanoid } from 'nanoid'
import { BRIDGE_DEVTOOLS_ACTION_KEY, BRIDGE_DEVTOOLS_LISTENER_KEY, getBridgeInstance } from './shared'

export function defineDevToolsAction<T>(name: string, action: (devtools: DevToolsType, ...args: any[]) => T | Promise<T>) {
  return async (...args: any[]) => {
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
        args,
      })
    })
  }
}

export function defineDevToolsListener<T>(fn: (devtools: DevToolsType, callback: Function) => void, options: { parser?: 'json' | 'devtools' } = {}) {
  return (listener: (payload: T) => void) => {
    const {
      parser = 'devtools',
    } = options
    const parserFn = parser === 'devtools' ? parse : JSON.parse
    const bridge = getBridgeInstance()
    const uniqueEventKey = nanoid()

    const off = bridge.on(uniqueEventKey, (e) => {
      listener(parserFn(e))
    })

    bridge.emit(BRIDGE_DEVTOOLS_LISTENER_KEY, {
      key: uniqueEventKey,
      action: `${fn}`,
      parser,
    })

    return off
  }
}

export function defineViteRPCClientAction() {
  return {}
}

export function defineViteRPCServerAction() {}

export function defineViteRPCClientListener() {}
