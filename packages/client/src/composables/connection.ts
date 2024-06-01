import { rpc } from '@vue/devtools-core'

export function heartbeat() {
  const timer = setTimeout(() => {
    heartbeat()
  }, 2000)

  rpc.value.heartbeat().then(() => {
    clearTimeout(timer)
    setTimeout(() => {
      heartbeat()
    }, 2000)
  })
}
