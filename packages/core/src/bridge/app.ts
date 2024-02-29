import { devtools, stringify } from '@vue/devtools-kit'
import { BridgeInstanceType } from './core'
import { BRIDGE_DEVTOOLS_ACTION_KEY, BRIDGE_DEVTOOLS_LISTENER_KEY } from './shared'

export function initAppBridge(bridge: BridgeInstanceType) {
  bridge.on(BRIDGE_DEVTOOLS_ACTION_KEY, async (payload) => {
  // eslint-disable-next-line no-new-func
    const action = new Function('devtools', '...args', `return (${payload.action})(devtools, ...args)`)
    const result = await action(devtools, ...payload.args)
    bridge.emit(payload.key, result)
  })

  bridge.on(BRIDGE_DEVTOOLS_LISTENER_KEY, async (payload) => {
  // eslint-disable-next-line no-new-func
    const action = new Function(`return ${payload.action}`)
    const callback = action()
    callback(devtools, (res) => {
      const stringifyFn = payload.parser === 'devtools' ? stringify : JSON.stringify
      bridge.emit(payload.key, stringifyFn(res))
    })
  })
}
