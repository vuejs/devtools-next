import { MergeableChannelOptions } from '../../types'
import { __DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__, getElectronProxyContext } from './context'

export function createElectronProxyChannel(): MergeableChannelOptions {
  const socket = getElectronProxyContext()
  return {
    post: (data) => {
    },
    on: (handler) => {
      socket.on(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.SERVER_TO_PROXY, (data) => {
        // @ts-expect-error skip type check
        socket.broadcast.emit(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.PROXY_TO_CLIENT, data)
      })

      socket.on(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.CLIENT_TO_PROXY, (data) => {
        // @ts-expect-error skip type check
        socket.broadcast.emit(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.PROXY_TO_SERVER, data)
      })
    },
  }
}
