import { Bridge } from '../../core/src/bridge'

window.addEventListener('message', handshake)

// @TODO: init backend

function handshake(e: MessageEvent) {
  if (e.data.source === '__VUE_DEVTOOLS_PROXY__' && e.data.payload.event === 'init') {
    const listeners: ((event: unknown) => void)[] = []
    const bridge = new Bridge({
      tracker(fn) {
        const listener = (event) => {
          if (event.data.source === '__VUE_DEVTOOLS_PROXY__' && event.data.payload)
            fn(event.data.payload)
        }
        window.addEventListener('message', listener)
        listeners.push(listener)
      },
      trigger(data) {
        window.postMessage({
          source: '__VUE_DEVTOOLS_BACKEND__',
          payload: data,
        }, '*')
      },
    })

    bridge.on('shutdown', () => {
      listeners.forEach((listener) => {
        window.removeEventListener('message', listener)
      })
      listeners.length = 0
      window.addEventListener('message', handshake)
    })

    bridge.on('client:ready', () => {
      console.log('client:ready 🎉')
    })

    bridge.emit('boom', 'hello world!')
  }
}
