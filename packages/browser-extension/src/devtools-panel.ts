import { Bridge } from '../../app-core/src/bridge'
import { initDevTools } from '../client/devtools-panel'

const connectionInfo: {
  retryTimer: NodeJS.Timeout | null
  count: number
  disconnected: boolean
} = {
  retryTimer: null,
  count: 0,
  disconnected: false,
}

initDevTools({
  connect(cb) {
    injectScript(chrome.runtime.getURL('dist/user-app.js'), () => {
      let port: chrome.runtime.Port

      const listeners: Array<() => void> = []

      // connect to background to setup proxy
      function connect() {
        try {
          clearTimeout(connectionInfo.retryTimer!)
          connectionInfo.count++
          port = chrome.runtime.connect({
            name: `${chrome.devtools.inspectedWindow.tabId}`,
          })

          connectionInfo.disconnected = false
          port.onDisconnect.addListener(() => {
            connectionInfo.disconnected = true
            connectionInfo.retryTimer = setTimeout(connect, 1000)
          })
          if (connectionInfo.count > 1)
            listeners.forEach(fn => port.onMessage.addListener(fn))
        }
        catch (e) {
          connectionInfo.disconnected = true
          connectionInfo.retryTimer = setTimeout(connect, 5000)
        }
      }
      connect()

      const bridge = new Bridge({
        tracker(fn: any) {
          port.onMessage.addListener(fn)
          listeners.push(fn)
        },
        trigger(data) {
          if (connectionInfo.disconnected)
            return
          port?.postMessage(data)
        },
      })

      cb(bridge)
    })
  },
  reload(fn) {
    chrome.devtools.network.onNavigated.addListener(fn)
  },
})

function injectScript(scriptName: string, cb: () => void) {
  const src = `
    (function() {
      var script = document.constructor.prototype.createElement.call(document, 'script');
      script.src = "${scriptName}";
      document.documentElement.appendChild(script);
      // script.parentNode.removeChild(script);
    })()
  `
  chrome.devtools.inspectedWindow.eval(src, (res, err) => {
    if (err)
      console.error(err)

    cb()
  })
}
