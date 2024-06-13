import { target } from '@vue/devtools-shared'

interface EventEmitter {
  on: (name: string, handler: (data: any) => void) => void
  send: (name: string, ...args: any[]) => void
  emit: (name: string, ...args: any[]) => void
}
interface ElectronClientContext extends EventEmitter {}
interface ElectronProxyContext extends EventEmitter {}
interface ElectronServerContext extends EventEmitter {}

export const __ELECTRON_CLIENT_CONTEXT__ = 'electron:client-context'
export const __ELECTRON_RPOXY_CONTEXT__ = 'electron:proxy-context'
export const __ELECTRON_SERVER_CONTEXT__ = 'electron:server-context'

export const __DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__ = {
  // client
  CLIENT_TO_PROXY: 'client->proxy', // on: proxy->client
  // proxy
  PROXY_TO_CLIENT: 'proxy->client', // on: server->proxy
  PROXY_TO_SERVER: 'proxy->server', // on: client->proxy
  // server
  SERVER_TO_PROXY: 'server->proxy', // on: proxy->server
}

// client context
export function getElectronClientContext(): ElectronClientContext {
  return target[__ELECTRON_CLIENT_CONTEXT__]
}

export function setElectronClientContext(context: ElectronClientContext) {
  target[__ELECTRON_CLIENT_CONTEXT__] = context
}

// proxy context
export function getElectronProxyContext(): ElectronProxyContext {
  return target[__ELECTRON_RPOXY_CONTEXT__]
}

export function setElectronProxyContext(context: ElectronProxyContext) {
  target[__ELECTRON_RPOXY_CONTEXT__] = context
}

// server context
export function getElectronServerContext(): ElectronServerContext {
  return target[__ELECTRON_SERVER_CONTEXT__]
}

export function setElectronServerContext(context: ElectronServerContext) {
  target[__ELECTRON_SERVER_CONTEXT__] = context
}
