import { MergeableChannelOptions } from '../../types'

export function createIframeServerChannel(): MergeableChannelOptions {
  const channel = new MessageChannel()

  window.addEventListener('message', (event) => {
    if (event.data === 'devtools-kit:iframe-channel:init')
      // @ts-expect-error type check
      event.source?.postMessage('port', '*', [channel.port2])
  })

  return {
    post: (data) => {
      channel.port1.postMessage(data)
    },
    on: (hanlder) => {
      channel.port1.onmessage = (event) => {
        hanlder(event.data)
      }
    },
  }
}
