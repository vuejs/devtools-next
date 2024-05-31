import { target } from '@vue/devtools-shared'

interface EventEmitter {
  on: (name: string, handler: (data: any) => void) => void
  send: (name: string, ...args: any[]) => void
}
interface ViteClientContext extends EventEmitter {
}

interface ViteDevServer {
  hot?: EventEmitter
  ws?: EventEmitter
}

export const __DEVTOOLS_KIT_VITE_MESSAGING_EVENT_KEY = '__devtools-kit-vite-messaging-event-key__'
export const __VITE_CLIENT_CONTEXT__ = 'vite:client-context'
export const __VITE_SERVER_CONTEXT__ = 'vite:server-context'

export function getViteClientContext(): ViteClientContext {
  return target[__VITE_CLIENT_CONTEXT__]
}

export function setViteClientContext(context: ViteClientContext) {
  target[__VITE_CLIENT_CONTEXT__] = context
}

export function getViteServerContext(): ViteDevServer {
  return target[__VITE_SERVER_CONTEXT__]
}

export function setViteServerContext(context: ViteDevServer) {
  target[__VITE_SERVER_CONTEXT__] = context
}
