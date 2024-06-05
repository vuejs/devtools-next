import SuperJSON from 'superjson'
import { MergeableChannelOptions } from '../../types'
import { __DEVTOOLS_KIT_VITE_MESSAGING_EVENT_KEY, getViteServerContext } from './context'

export function createViteServerChannel(): MergeableChannelOptions {
  const viteServer = getViteServerContext()
  // `server.hot` (Vite 5.1+) > `server.ws`
  const ws = viteServer.hot ?? viteServer.ws

  return {
    post: data => ws?.send(__DEVTOOLS_KIT_VITE_MESSAGING_EVENT_KEY, SuperJSON.stringify(data)),
    on: handler => ws?.on(__DEVTOOLS_KIT_VITE_MESSAGING_EVENT_KEY, (event) => {
      handler(SuperJSON.parse(event))
    }),
  }
}
