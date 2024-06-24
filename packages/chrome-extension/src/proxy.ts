// This is a content-script that is injected only when the devtools are
// activated. Because it is not injected using eval, it has full privilege
// to the chrome runtime API. It serves as a proxy between the injected
// user application and the Vue devtools panel.

import { createRpcProxy } from '@vue/devtools-kit'

createRpcProxy({
  preset: 'extension',
})

// const port = chrome.runtime.connect({
//   name: 'content-script',
// })

// function sendMessageToUserApp(payload) {
//   window.postMessage({
//     source: '__VUE_DEVTOOLS_PROXY__',
//     payload,
//   }, '*')
// }

// function sendMessageToDevTools(e) {
//   if (e.data && e.data.source === '__VUE_DEVTOOLS_USER_APP__')
//     port.postMessage(e.data.payload)
// }

// port.onMessage.addListener(sendMessageToUserApp)
// window.addEventListener('message', sendMessageToDevTools)
// port.onDisconnect.addListener(() => {
//   window.removeEventListener('message', sendMessageToDevTools)
//   sendMessageToUserApp({
//     event: 'shutdown',
//   })
// })

// sendMessageToUserApp({
//   event: 'init',
// })
