import { DevToolsType, parse } from '@vue/devtools-kit'
import { nanoid } from 'nanoid/non-secure'
import { BRIDGE_DEVTOOLS_ACTION_KEY, BRIDGE_DEVTOOLS_LISTENER_KEY, devtoolsActionEvents, devtoolsListenerEvents, getBridgeInstance, getBridgeTarget } from './shared'

export function defineDevToolsAction<T>(name: string, action: (devtools: DevToolsType, ...args: any[]) => T | Promise<T>) {
  return async (...args: any[]) => {
    const target = getBridgeTarget()
    if (target === 'devtools') {
      const bridge = getBridgeInstance()
      const uniqueEventKey = nanoid()
      return await new Promise<T>((resolve) => {
        bridge.once(uniqueEventKey, (e: T) => {
          resolve(e)
        })

        bridge.emit(BRIDGE_DEVTOOLS_ACTION_KEY, {
          name,
          key: uniqueEventKey,
          args,
        })
      })
    }
    else {
      devtoolsActionEvents.set(name, action)
    }
  }
}

export function defineDevToolsListener<T>(name: string, fn: (devtools: DevToolsType, callback: Function) => void, options: { parser?: 'json' | 'devtools' } = {}) {
  return (listener: (payload: T) => void) => {
    const target = getBridgeTarget()
    if (target === 'devtools') {
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
        name,
        parser,
      })

      return off
    }
    else {
      devtoolsListenerEvents.set(name, fn)
      return () => {}
    }
  }
}
