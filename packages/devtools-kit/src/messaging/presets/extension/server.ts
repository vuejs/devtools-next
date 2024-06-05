import { SuperJSON } from 'superjson'
import { MergeableChannelOptions } from '../../types'
import { __DEVTOOLS_KIT_EXTENSION_MESSAGING_EVENT_KEY__ } from './context'

export function createExtensionServerChannel(): MergeableChannelOptions {
  return {
    post: (data) => {
      window.postMessage({
        source: __DEVTOOLS_KIT_EXTENSION_MESSAGING_EVENT_KEY__.SERVER_TO_PROXY,
        payload: SuperJSON.stringify(data),
      }, '*')
    },
    on: (handler) => {
      const listener = (event: MessageEvent) => {
        if (event.data.source === __DEVTOOLS_KIT_EXTENSION_MESSAGING_EVENT_KEY__.PROXY_TO_SERVER && event.data.payload) {
          handler(SuperJSON.parse(event.data.payload))
        }
      }
      window.addEventListener('message', listener)
      return () => {
        window.removeEventListener('message', listener)
      }
    },
  }
}
