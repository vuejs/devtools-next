import { SuperJSON } from 'superjson'
import { MergeableChannelOptions } from '../../types'
import { __DEVTOOLS_KIT_EXTENSION_MESSAGING_EVENT_KEY__ } from './context'

// This is a content-script that is injected only when the devtools are
// activated. Because it is not injected using eval, it has full privilege
// to the chrome runtime API. It serves as a proxy between the injected
// user application and the Vue devtools panel.

export function createExtensionProxyChannel(): MergeableChannelOptions {
  const port = chrome.runtime.connect({
    name: 'content-script',
  })

  function sendMessageToUserApp(payload: any) {
    window.postMessage({
      source: __DEVTOOLS_KIT_EXTENSION_MESSAGING_EVENT_KEY__.PROXY_TO_SERVER,
      payload,
    }, '*')
  }

  function sendMessageToDevToolsClient(e: MessageEvent) {
    if (e.data && e.data.source === __DEVTOOLS_KIT_EXTENSION_MESSAGING_EVENT_KEY__.SERVER_TO_PROXY) {
      try {
        port.postMessage(e.data.payload)
      }
      catch (e) {}
    }
  }

  port.onMessage.addListener(sendMessageToUserApp)
  window.addEventListener('message', sendMessageToDevToolsClient)
  port.onDisconnect.addListener(() => {
    window.removeEventListener('message', sendMessageToDevToolsClient)
    sendMessageToUserApp(SuperJSON.stringify({
      event: 'shutdown',
    }))
  })

  sendMessageToUserApp(SuperJSON.stringify({
    event: 'init',
  }))

  return {
    post: (data) => {
    },
    on: (handler) => {

    },
  }
}
