import { SuperJSON } from 'superjson'
import { MergeableChannelOptions } from '../../types'
import { __DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__, getElectronClientContext } from './context'

export function createElectronClientChannel(): MergeableChannelOptions {
  const socket = getElectronClientContext()
  return {
    post: (data) => {
      socket.emit(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.CLIENT_TO_PROXY, SuperJSON.stringify(data))
    },
    on: (handler) => {
      socket.on(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.PROXY_TO_CLIENT, (e) => {
        handler(SuperJSON.parse(e))
      })
    },
  }
}
