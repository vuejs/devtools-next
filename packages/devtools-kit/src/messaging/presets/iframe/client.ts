import { MergeableChannelOptions } from '../../types'

export function createIframeClientChannel(): Promise<MergeableChannelOptions> {
  return new Promise((resolve) => {
    window.addEventListener('message', (event) => {
      if (event.data === 'port' && event.ports.length > 0) {
        const port = event.ports[0]
        resolve({
          post: (data) => {
            port.postMessage(data)
          },
          on: (handler) => {
            port.onmessage = (event) => {
              handler(event.data)
            }
          },
        })
      }
    })
    window.parent.postMessage('devtools-kit:iframe-channel:init', '*')
  })
}
