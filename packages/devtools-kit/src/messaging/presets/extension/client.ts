import { SuperJSON } from 'superjson'
import { MergeableChannelOptions } from '../../types'
import { getExtensionClientContext } from './context'

export function createExtensionClientChannel(): MergeableChannelOptions {
  const port = getExtensionClientContext()
  return {
    post: (data) => {
      port?.postMessage(SuperJSON.stringify(data))
    },
    on: (handler) => {
      const listener = (data) => {
        handler(SuperJSON.parse(data))
      }
      port?.onMessage.addListener(listener!)
    },
  }
}
