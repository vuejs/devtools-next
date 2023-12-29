import { useDevToolsState } from '@vue/devtools-core'

const fns: (() => void)[] = []

export function onDevToolsClientConnected(fn: () => void) {
  fns.push(fn)

  tryOnScopeDispose(() => {
    fns.splice(fns.indexOf(fn), 1)
  })

  const { connected, clientConnected } = useDevToolsState()
  const devtoolsReady = computed(() => clientConnected.value && connected.value)

  if (devtoolsReady.value) {
    fns.forEach(fn => fn())
    return
  }

  watchOnce(devtoolsReady, (v) => {
    if (v)
      fns.forEach(fn => fn())
  })

  return () => {
    fns.splice(fns.indexOf(fn), 1)
  }
}

export function refreshCurrentPageData() {
  fns.forEach(fn => fn())
}
