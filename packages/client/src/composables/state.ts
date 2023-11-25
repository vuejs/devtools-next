import type { RemovableRef } from '@vueuse/core'
import type { GraphSettings } from './graph'

export const devtoolsClientState: RemovableRef<{
  isFirstVisit: boolean
  route: string
  graphSettings: GraphSettings
}> = useLocalStorage('__VUE_DEVTOOLS_CLIENT_STATE__', {
  isFirstVisit: true,
  route: '/',
  graphSettings: {
    node_modules: false,
    virtual: false,
    lib: false,
  },
}, { mergeDefaults: true })
