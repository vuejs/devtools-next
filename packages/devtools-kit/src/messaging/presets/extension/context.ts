import { target } from '@vue/devtools-shared'

interface EventEmitter {
  onMessage: {
    addListener: (listener: (name: string, ...args: any[]) => void) => void
  }
  postMessage: (name: string, ...args: any[]) => void
}
interface ExtensionClientContext extends EventEmitter {}
interface ExtensionProxyContext extends EventEmitter {}
interface ExtensionServerContext extends EventEmitter {}

export const __EXTENSION_CLIENT_CONTEXT__ = 'electron:client-context'
export const __EXTENSION_RPOXY_CONTEXT__ = 'electron:proxy-context'
export const __EXTENSION_SERVER_CONTEXT__ = 'electron:server-context'

export const __DEVTOOLS_KIT_EXTENSION_MESSAGING_EVENT_KEY__ = {
  // client
  CLIENT_TO_PROXY: 'client->proxy', // on: proxy->client
  // proxy
  PROXY_TO_CLIENT: 'proxy->client', // on: server->proxy
  PROXY_TO_SERVER: 'proxy->server', // on: client->proxy
  // server
  SERVER_TO_PROXY: 'server->proxy', // on: proxy->server
}

// client context
export function getExtensionClientContext(): ExtensionClientContext {
  return target[__EXTENSION_CLIENT_CONTEXT__]
}

export function setExtensionClientContext(context: ExtensionClientContext) {
  target[__EXTENSION_CLIENT_CONTEXT__] = context
}

// proxy context
export function getExtensionProxyContext(): ExtensionProxyContext {
  return target[__EXTENSION_RPOXY_CONTEXT__]
}

export function setExtensionProxyContext(context: ExtensionProxyContext) {
  target[__EXTENSION_RPOXY_CONTEXT__] = context
}

// server context
export function getExtensionServerContext(): ExtensionServerContext {
  return target[__EXTENSION_SERVER_CONTEXT__]
}

export function setExtensionServerContext(context: ExtensionServerContext) {
  target[__EXTENSION_SERVER_CONTEXT__] = context
}
