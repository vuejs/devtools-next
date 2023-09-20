import { Bridge } from '../../app-core/src/bridge'
import { prepareInjection } from '../../app-core/src/injection'
import { initDevTools } from '../client/devtools-panel'

initDevTools({
  connect(cb) {
    injectScript(chrome.runtime.getURL('dist/user-app.js'), () => {
      let port: chrome.runtime.Port

      // connect to background to setup proxy
      function connect() {
        // @TODO: add retry logic
        port = chrome.runtime.connect({
          name: `${chrome.devtools.inspectedWindow.tabId}`,
        })
        port.onDisconnect.addListener(() => {
          console.log('port.onDisconnect')
        })
      }
      connect()

      const bridge = new Bridge({
        tracker(fn) {
          port.onMessage.addListener((e) => {
            fn(e)
          })
        },
        trigger(data) {
          port.postMessage(data)
        },
      })

      prepareInjection(bridge)

      cb(bridge)
    })
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
