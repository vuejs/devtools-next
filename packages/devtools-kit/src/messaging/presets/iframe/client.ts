import { isBrowser } from '@vue/devtools-shared'
import SuperJSON from 'superjson'
import { MergeableChannelOptions } from '../../types'
import { __DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY } from './context'

export function createIframeClientChannel(): MergeableChannelOptions {
  if (!isBrowser) {
    return {
      post: (data) => {},
      on: (handler) => {},
    }
  }

  return {
    post: data => window.parent.postMessage(SuperJSON.stringify({
      event: __DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY,
      data,
    }), '*'),
    on: handler => window.addEventListener('message', (event) => {
      try {
        const parsed = SuperJSON.parse<{ event: string, data: unknown }>(event.data)
        if (event.source === window.parent && parsed.event === __DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY) {
          handler(parsed.data)
        }
      }
      catch (e) {

      }
    }),
  }
}
