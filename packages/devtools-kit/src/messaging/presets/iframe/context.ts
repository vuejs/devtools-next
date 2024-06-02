import { target } from '@vue/devtools-shared'

export const __DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY = '__devtools-kit-iframe-messaging-event-key__'

export const __IFRAME_SERVER_CONTEXT__ = 'iframe:server-context'
export function getIframeServerContext(): HTMLIFrameElement {
  return target[__IFRAME_SERVER_CONTEXT__]
}

export function setIframeServerContext(context: HTMLIFrameElement) {
  target[__IFRAME_SERVER_CONTEXT__] = context
}
