import { Bridge } from '../../app-core/src/bridge'
import { initDevTools } from '../client/devtools-panel'

const connectionInfo: {
  retryTimer: NodeJS.Timeout | null
  count: number
} = {
  retryTimer: null,
  count: 0,
}

initDevTools({
  connect(cb) {
    injectScript(chrome.runtime.getURL('dist/user-app.js'), () => {
      let port: chrome.runtime.Port

      const listeners: Function[] = []

      // connect to background to setup proxy
      function connect() {
        try {
          clearTimeout(connectionInfo.retryTimer!)

          // @TODO: add retry logic
          port = chrome.runtime.connect({
            name: `${chrome.devtools.inspectedWindow.tabId}`,
          })

          port.onDisconnect.addListener(() => {
            connectionInfo.retryTimer = setTimeout(connect, 1000)
          })
        }
        catch (e) {
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
          port.postMessage(data)
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
