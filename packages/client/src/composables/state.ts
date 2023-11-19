import type { RemovableRef } from '@vueuse/core'

export function useDevToolsClientState(): RemovableRef<{
  isFirstVisit: boolean
  route: string
}> {
  const state = useLocalStorage('__VUE_DEVTOOLS_CLIENT_STATE__', {
    isFirstVisit: true,
    route: '/',
  })

  return state
}
