// This is a content-script that is injected only when the devtools are
// activated. Because it is not injected using eval, it has full privilege
// to the chrome runtime API. It serves as a proxy between the injected
// backend and the Vue devtools panel.

const port = chrome.runtime.connect({
  name: 'content-script',
})

function sendMessageToBackend(payload) {
  window.postMessage({
    source: '__VUE_DEVTOOLS_PROXY__',
    payload,
  }, '*')
}

function sendMessageToDevTools(e) {
  if (e.data && e.data.source === '__VUE_DEVTOOLS_BACKEND__')
    port.postMessage(e.data.payload)
}

port.onMessage.addListener(sendMessageToBackend)
window.addEventListener('message', sendMessageToDevTools)

sendMessageToBackend({
  event: 'init',
})
