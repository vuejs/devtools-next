import { MergeableChannelOptions } from '../../types'
import { getExtensionClientContext } from './context'

export function createExtensionClientChannel(): MergeableChannelOptions {
  const port = getExtensionClientContext()
  return {
    post: (data) => {
      port?.postMessage(data)
    },
    on: (handler) => {
      const listener = (data) => {
        handler(data)
      }
      port?.onMessage.addListener(listener!)
    },
  }
}
