import { useDevToolsState } from '@vue-devtools-next/core'

const fns: (() => void)[] = []

export function onDevToolsClientConnected(fn: () => void) {
  fns.push(fn)

  tryOnScopeDispose(() => {
    fns.splice(fns.indexOf(fn), 1)
  })

  const { connected } = useDevToolsState()

  if (connected.value) {
    fns.forEach(fn => fn())
    return
  }

  watchOnce(connected, (v) => {
    v && fns.forEach(fn => fn())
  })

  return () => {
    fns.splice(fns.indexOf(fn), 1)
  }
}

export function refreshCurrentPageData() {
  fns.forEach(fn => fn())
}
