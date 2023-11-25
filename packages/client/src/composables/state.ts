import type { RemovableRef } from '@vueuse/core'
import type { GraphSettings } from './graph'
import type { TabSettings } from './state-tab'

export const devtoolsClientState: RemovableRef<{
  isFirstVisit: boolean
  route: string
  graphSettings: GraphSettings
  tabSettings: TabSettings
  expandSidebar: boolean
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
  expandSidebar: false,
}, { mergeDefaults: true })

export function clearDevtoolsClientState() {
  devtoolsClientState.value = undefined
}
