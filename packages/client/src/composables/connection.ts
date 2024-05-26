import { rpc } from '@vue/devtools-core'

const connected = ref(false)

export function onDevToolsConnected(fn: () => void) {
  if (connected.value) {
    fn()
  }
  else {
    const stop = watch(connected, (value) => {
      if (value) {
        stop()
        fn()
      }
    })
  }
}

export function useConnection() {
  return { connected }
}

export function markAsConnected() {
  connected.value = true
}

export function markAsDisconnected() {
  connected.value = false
}

export function heartbeat() {
  const timer = setTimeout(() => {
    markAsDisconnected()
    heartbeat()
  }, 2000)
  rpc.value.heartbeat().then(() => {
    clearTimeout(timer)
    markAsConnected()
    setTimeout(() => {
      heartbeat()
    }, 2000)
  })
}
