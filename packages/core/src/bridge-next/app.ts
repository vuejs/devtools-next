import { devtools } from '@vue/devtools-kit'
import { BridgeInstanceType } from '../bridge/core'
import { BRIDGE_DEVTOOLS_ACTION_KEY, BRIDGE_DEVTOOLS_LISTENER_KEY } from './shared'

export function initAppBridge(bridge: BridgeInstanceType) {
  bridge.on(BRIDGE_DEVTOOLS_ACTION_KEY, async (payload) => {
  // eslint-disable-next-line no-new-func
    const action = new Function('devtools', `return (${payload.action})(devtools)`)
    const result = await action(devtools)
    bridge.emit(payload.key, result)
  })

  bridge.on(BRIDGE_DEVTOOLS_LISTENER_KEY, async (payload) => {
  // eslint-disable-next-line no-new-func
    const action = new Function(`return ${payload.action}`)
    const callback = action()
    callback(devtools, (res: unknown) => {
      bridge.emit(payload.key, res)
    })
  })
}
