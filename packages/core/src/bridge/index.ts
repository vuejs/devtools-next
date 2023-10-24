import { Bridge } from './core'
import { BridgeRpc as DevToolsRpc, registerBridgeRpc as registerDevToolsSideBridgeRpc } from './devtools'
import { BridgeRpc as UserAppRpc, registerBridgeRpc as registerUserAppSideBridgeRpc } from './user-app'

export { BridgeEvents } from './types'
export {
  Bridge,
  DevToolsRpc,
  UserAppRpc,
}

export function registerBridgeRpc(target: 'devtools' | 'user-app') {
  if (target === 'devtools')
    registerDevToolsSideBridgeRpc()

  else
    registerUserAppSideBridgeRpc()
}
