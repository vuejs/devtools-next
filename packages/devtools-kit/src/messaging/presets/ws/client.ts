import SuperJSON from 'superjson'
import { MergeableChannelOptions } from '../../types'
import { getWSClientContext } from './context'

export function createWSClientChannel(): MergeableChannelOptions {
  const ws = getWSClientContext()
  return {
    post: (data) => {
      data = SuperJSON.stringify(data)
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data)
      }
      else {
        const handle = () => {
          ws.send(data)
          ws.removeEventListener('open', handle)
        }
        ws.addEventListener('open', handle)
      }
    },
    on: handler => ws.addEventListener('message', (event) => {
      handler(SuperJSON.parse(event.data))
    }),
  }
}
