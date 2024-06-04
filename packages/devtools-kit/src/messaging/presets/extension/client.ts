import { SuperJSON } from 'superjson'
import { MergeableChannelOptions } from '../../types'
import { setExtensionClientContext } from './context'

export function createExtensionClientChannel(): MergeableChannelOptions {
  // const port = getExtensionClientContext()

  let disconnected = false
  let port: chrome.runtime.Port = null!
  let reconnectTimer: NodeJS.Timeout | null = null
  let onMessageHandler: (data: any) => void = null!

  function connect() {
    try {
      clearTimeout(reconnectTimer!)
      port = chrome.runtime.connect({
        name: `${chrome.devtools.inspectedWindow.tabId}`,
      })

      setExtensionClientContext(port)
      disconnected = false
      port?.onMessage.addListener(onMessageHandler!)

      port.onDisconnect.addListener(() => {
        disconnected = true
        port?.onMessage.removeListener(onMessageHandler!)
        reconnectTimer = setTimeout(connect, 1000)
      })
    }
    catch (e) {
      disconnected = true
    }
  }

  connect()

  return {
    post: (data) => {
      if (disconnected) {
        return
      }
      port?.postMessage(SuperJSON.stringify(data))
    },
    on: (handler) => {
      onMessageHandler = (data) => {
        if (disconnected) {
          return
        }
        handler(SuperJSON.parse(data))
      }
      port?.onMessage.addListener(onMessageHandler!)
    },
  }
}
