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

  let connected = false
  let channel = new MessageChannel()
  let onMessageHandler: (data: any) => void

  function reconnect() {
    channel.port1.close()
    channel.port2.close()
    channel = new MessageChannel()
    channel.port1.onmessage = onMessageHandler
  }

  window.addEventListener('message', (event) => {
    if (event.data === __DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY) {
      if (connected) {
        reconnect()
      }
      // @ts-expect-error type check
      event.source?.postMessage('port', '*', [channel.port2])
      connected = true
    }
  })

  return {
    post: (data) => {
      channel.port1.postMessage(SuperJSON.stringify(data))
    },
    on: (hanlder) => {
      onMessageHandler = (event) => {
        hanlder(SuperJSON.parse(event.data))
      }
      channel.port1.onmessage = onMessageHandler
    },
  }
}
