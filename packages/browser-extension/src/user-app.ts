import { target } from '@vue/devtools-shared'

window.addEventListener('message', handshake)

function handshake(e: MessageEvent) {
  if (e.data.source === '__VUE_DEVTOOLS_PROXY__' && e.data.payload.event === 'init') {
    window.removeEventListener('message', handshake)

    const listeners: ((event: unknown) => void)[] = []
  }
}

window.addEventListener('message', toggleOverlay)

function toggleOverlay(e) {
  const data = e.data
  const payload = data.payload
  if (data.source === '__VUE_DEVTOOLS_OVERLAY__' && payload.event === 'toggle-view-mode') {
    // @TODO: refactor
    target?.__VUE_DEVTOOLS_TOGGLE_OVERLAY__?.(payload.data === 'overlay')
  }
}
