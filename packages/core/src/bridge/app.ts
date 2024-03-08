import { devtools, stringify } from '@vue/devtools-kit'
import { initDevToolsAEvent } from '../bridge-events'
import { BridgeInstanceType } from './core'
import { BRIDGE_DEVTOOLS_ACTION_KEY, BRIDGE_DEVTOOLS_LISTENER_KEY, devtoolsActionEvents, devtoolsListenerEvents, setBridgeTarget } from './shared'

export function setupAppBridge(bridge: BridgeInstanceType) {
  setBridgeTarget('app')

  initDevToolsAEvent()

  bridge.on(BRIDGE_DEVTOOLS_ACTION_KEY, async (payload) => {
    const action = devtoolsActionEvents.get(payload.name)!
    if (action) {
      const result = await action(devtools, ...payload.args)
      bridge.emit(payload.key, result)
    }
  })

  bridge.on(BRIDGE_DEVTOOLS_LISTENER_KEY, async (payload) => {
    const listener = devtoolsListenerEvents.get(payload.name)!

    if (listener) {
      listener(devtools, (res: any) => {
        const stringifyFn = payload.parser === 'devtools' ? stringify : JSON.stringify
        bridge.emit(payload.key, stringifyFn(res))
      })
    }
  })
}
