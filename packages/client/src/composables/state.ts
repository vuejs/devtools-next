import type { RemovableRef } from '@vueuse/core'
import type { GraphSettings } from './graph'
import type { TabSettings } from './state-tab'

export const devtoolsClientState: RemovableRef<{
  isFirstVisit: boolean
  route: string
  graphSettings: GraphSettings
  tabSettings: TabSettings
}> = useLocalStorage('__VUE_DEVTOOLS_CLIENT_STATE__', {
  isFirstVisit: true,
  route: '/',
  graphSettings: {
    node_modules: false,
    virtual: false,
    lib: false,
  },
  tabSettings: {
    hiddenTabCategories: [],
    hiddenTabs: [],
    pinnedTabs: [],
  },
}, { mergeDefaults: true })
