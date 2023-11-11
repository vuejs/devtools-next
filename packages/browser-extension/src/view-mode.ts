window.addEventListener('message', onMessage)

function onMessage(e) {
  const payload = e.data.payload
  if (e.data.source === '__VUE_DEVTOOLS_PROXY__' && payload.event === 'toggle-view-mode') {
    // window.removeEventListener('message', onMessage)
    window.postMessage({
      event: 'toggle-view-mode',
      data: payload.data,
    }, '*')
  }
}
