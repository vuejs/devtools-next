// import { Bridge } from '../../core/src/bridge'
// import { initDevTools } from '../client/devtools-panel'
import { VITE_PLUGIN_CLIENT_URL_STORAGE_KEY, VITE_PLUGIN_DETECTED_STORAGE_KEY } from './../../shared/src/constants'

const connectionInfo: {
  retryTimer: NodeJS.Timeout | null
  count: number
  disconnected: boolean
  port: chrome.runtime.Port
  listeners: Array<() => void>
} = {
  retryTimer: null,
  count: 0,
  disconnected: false,
  port: null!,
  listeners: [],
}

function connect() {
  try {
    clearTimeout(connectionInfo.retryTimer!)
    connectionInfo.count++
    connectionInfo.port = chrome.runtime.connect({
      name: `${chrome.devtools.inspectedWindow.tabId}`,
    })

    connectionInfo.disconnected = false
    connectionInfo.port.onDisconnect.addListener(() => {
      connectionInfo.disconnected = true
      connectionInfo.retryTimer = setTimeout(connect, 1000)
    })
    if (connectionInfo.count > 1)
      connectionInfo.listeners.forEach(fn => connectionInfo.port.onMessage.addListener(fn))
  }
  catch (e) {
    connectionInfo.disconnected = true
    connectionInfo.retryTimer = setTimeout(connect, 5000)
  }
}

chrome.storage.local.get([VITE_PLUGIN_DETECTED_STORAGE_KEY, VITE_PLUGIN_CLIENT_URL_STORAGE_KEY]).then((storage) => {
  const vitePluginDetected = storage[VITE_PLUGIN_DETECTED_STORAGE_KEY]
  const vitePluginClientUrl = storage[VITE_PLUGIN_CLIENT_URL_STORAGE_KEY]
  // for vite plugin
  if (vitePluginDetected) {
    function init(iframe: HTMLIFrameElement) {
      if (chrome.runtime?.id === undefined)
        return
      injectScript(chrome.runtime.getURL('dist/user-app.js'), () => {
        connect()

        // proxy user app messaging
        function onPortMessage(data) {
          if (connectionInfo.disconnected)
            return
          iframe?.contentWindow?.postMessage({
            source: '__VUE_DEVTOOLS_USER_APP__',
            data,
          }, '*')
        }
        connectionInfo.port!.onMessage.addListener(onPortMessage)

        // proxy devtools client messaging
        function onIframeMessage(e) {
          if (connectionInfo.disconnected)
            return
          if (e.data.source === '__VUE_DEVTOOLS_CLIENT__')
            connectionInfo.port?.postMessage(e.data.data)
        }
        window.addEventListener('message', onIframeMessage)

        iframe?.contentWindow?.postMessage('__VUE_DEVTOOLS_CREATE_CLIENT__', '*')

        function cleanup() {
          connectionInfo.port!.onMessage.removeListener(onPortMessage)
          window.removeEventListener('message', onIframeMessage)
          chrome.devtools.network.onNavigated.removeListener(cleanup)
          init(iframe)
        }
        chrome.devtools.network.onNavigated.addListener(cleanup)
      })
    }

    function createClient() {
      const iframe = document.createElement('iframe')
      iframe.src = vitePluginClientUrl
      iframe.style.border = 'none'
      iframe.style.width = '100vw'
      iframe.style.height = '100vh'
      document.getElementById('app')!.appendChild(iframe)
      iframe.onload = () => {
        init(iframe)
      }
    }

    createClient()
  }
  // for browser extension
  else {
    // initDevTools({
    //   connect(cb) {
    //     if (chrome.runtime?.id === undefined)
    //       return
    //     injectScript(chrome.runtime.getURL('dist/user-app.js'), () => {
    //       // connect to background to setup proxy
    //       connect()

    //       const bridge = new Bridge({
    //         tracker(fn: any) {
    //           connectionInfo.port.onMessage.addListener(fn)
    //           connectionInfo.listeners.push(fn)
    //         },
    //         trigger(data) {
    //           if (connectionInfo.disconnected)
    //             return

    //           connectionInfo.port?.postMessage(data)
    //         },
    //       })

    //       cb(bridge)
    //     })
    //   },
    //   reload(fn) {
    //     chrome.devtools.network.onNavigated.addListener(fn)
    //   },
    // })
  }
})

function injectScript(scriptName: string, cb: () => void) {
  const src = `
    (function() {
      var script = document.constructor.prototype.createElement.call(document, 'script');
      script.src = "${scriptName}";
      document.documentElement.appendChild(script);
      script.parentNode.removeChild(script);
    })()
  `
  chrome.devtools.inspectedWindow.eval(src, (res, err) => {
    if (err)
      console.error(err)

    cb()
  })
}
