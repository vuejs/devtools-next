import SuperJSON from 'superjson'

import { MergeableChannelOptions } from '../../types'
import { getWSServerContext } from './context'

export function createWSServerChannel(): MergeableChannelOptions {
  const ws = getWSServerContext()
  return {
    post: data => ws.send(SuperJSON.stringify(data)),
    on: handler => ws.on('message', (data) => {
      handler(SuperJSON.parse(data.toString()))
    }),
  }
}
