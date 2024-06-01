import { computed } from 'vue'
import { tryOnScopeDispose, watchOnce } from '@vueuse/core'
import { useDevToolsState } from './devtools-state'

const fns: (() => void)[] = []

export function onDevToolsConnected(fn: () => void) {
  const { connected, clientConnected } = useDevToolsState()

  fns.push(fn)

  tryOnScopeDispose(() => {
    fns.splice(fns.indexOf(fn), 1)
  })

  const devtoolsReady = computed(() => clientConnected.value && connected.value)

  if (devtoolsReady.value) {
    fn()
  }
  else {
    watchOnce(devtoolsReady, (v) => {
      if (v)
        fn()
    })
  }

  return () => {
    fns.splice(fns.indexOf(fn), 1)
  }
}

export function refreshCurrentPageData() {
  fns.forEach(fn => fn())
}
