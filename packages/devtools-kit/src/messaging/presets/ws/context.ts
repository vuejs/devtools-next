import { target } from '@vue/devtools-shared'

interface EventEmitter {
  on: (name: string, handler: (data: any) => void) => void
  send: (name: string, ...args: any[]) => void
}
type WSClientContext = WebSocket
interface WSServerContext extends EventEmitter {}

export const __DEVTOOLS_KIT_WS_MESSAGING_EVENT_KEY = '__devtools-kit-ws-messaging-event-key__'
export const __WS_CLIENT_CONTEXT__ = 'ws:client-context'
export const __WS_SERVER_CONTEXT__ = 'ws:server-context'

export function getWSClientContext(): WSClientContext {
  return target[__WS_CLIENT_CONTEXT__]
}

export function setWSClientContext(context: WSClientContext) {
  target[__WS_CLIENT_CONTEXT__] = context
}

export function getWSServerContext(): WSServerContext {
  return target[__WS_SERVER_CONTEXT__]
}

export function setWSServerContext(context: WSServerContext) {
  target[__WS_SERVER_CONTEXT__] = context
}
