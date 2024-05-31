import SuperJSON from 'superjson'
import { MergeableChannelOptions } from '../../types'
import { __DEVTOOLS_KIT_VITE_MESSAGING_EVENT_KEY, getViteClientContext } from './context'

export function createViteClientChannel(): MergeableChannelOptions {
  const client = getViteClientContext()
  return {
    post: (data) => {
      client?.send(__DEVTOOLS_KIT_VITE_MESSAGING_EVENT_KEY, SuperJSON.stringify(data))
    },
    on: (handler) => {
      client?.on(__DEVTOOLS_KIT_VITE_MESSAGING_EVENT_KEY, (event) => {
        handler(SuperJSON.parse(event))
      })
    },
  }
}
