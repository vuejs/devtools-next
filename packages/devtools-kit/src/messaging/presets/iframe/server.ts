import SuperJSON from 'superjson'

import { isBrowser } from '@vue/devtools-shared'
import { MergeableChannelOptions } from '../../types'
import { __DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY } from './context'

export function createIframeServerChannel(): MergeableChannelOptions {
  if (!isBrowser) {
    return {
      post: (data) => {},
      on: (handler) => {},
    }
  }
  const channel = new MessageChannel()

  window.addEventListener('message', (event) => {
    if (event.data === __DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY)
      // @ts-expect-error type check
      event.source?.postMessage('port', '*', [channel.port2])
  })

  return {
    post: (data) => {
      channel.port1.postMessage(SuperJSON.stringify(data))
    },
    on: (hanlder) => {
      channel.port1.onmessage = (event) => {
        hanlder(SuperJSON.parse(event.data))
      }
    },
  }
}
