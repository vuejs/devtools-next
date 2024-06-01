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

  const buffer: Array<(data: any, ...extras: any[]) => void> = []
  let port: MessagePort = null!

  window.addEventListener('message', (event) => {
    if (event.data === 'port' && event.ports.length > 0) {
      port = event.ports[0]

      if (buffer.length) {
        buffer.forEach((handler) => {
          port.onmessage = (event) => {
            handler(SuperJSON.parse(event.data))
          }
        })
        buffer.length = 0
      }
    }
  })
  window.parent.postMessage(__DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY, '*')

  return {
    post: (data) => {
      if (port) {
        port.postMessage(SuperJSON.stringify(data))
      }
      else {
        function handler() {
          if (port) {
            port.postMessage(SuperJSON.stringify(data))
            window.removeEventListener('message', handler)
          }
        }
        window.addEventListener('message', handler)
      }
    },
    on: (handler) => {
      if (!port) {
        buffer.push(handler)
      }
      else {
        port.onmessage = (event) => {
          handler(SuperJSON.parse(event.data))
        }
      }
    },
  }
}
