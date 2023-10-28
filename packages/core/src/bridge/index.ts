import { Bridge } from './core'
import { BridgeRpc as DevToolsRpc, registerBridgeRpc as registerDevToolsSideBridgeRpc } from './devtools'
import type { BridgeRpcOptions } from './devtools'
import { BridgeRpc as UserAppRpc, registerBridgeRpc as registerUserAppSideBridgeRpc } from './user-app'

export { BridgeEvents } from './types'
export {
  Bridge,
  DevToolsRpc,
  UserAppRpc,
}

export function registerBridgeRpc(target: 'devtools' | 'user-app', options: BridgeRpcOptions = {}) {
  if (target === 'devtools')
    registerDevToolsSideBridgeRpc(options)

  else
    registerUserAppSideBridgeRpc()
}
