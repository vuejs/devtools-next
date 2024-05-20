import SuperJSON from 'superjson'
import { MergeableChannelOptions } from '../../types'

const BROADCAST_CHANNEL_NAME = '__devtools-kit:boardcast-channel__'

export function createBroadcastChannel(): MergeableChannelOptions {
  const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME)

  return {
    post: (data) => {
      channel.postMessage(SuperJSON.stringify(data))
    },
    on: (handler) => {
      channel.onmessage = (event) => {
        handler(SuperJSON.parse(event.data))
      }
    },
  }
}
