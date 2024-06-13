import { SuperJSON } from 'superjson'
import { MergeableChannelOptions } from '../../types'
import { __DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__, getElectronServerContext } from './context'

export function createElectronServerChannel(): MergeableChannelOptions {
  const socket = getElectronServerContext()
  return {
    post: (data) => {
      socket.emit(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.SERVER_TO_PROXY, SuperJSON.stringify(data))
    },
    on: (handler) => {
      socket.on(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.PROXY_TO_SERVER, (data) => {
        handler(SuperJSON.parse(data))
      })
    },
  }
}
