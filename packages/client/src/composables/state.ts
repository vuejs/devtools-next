import type { RemovableRef } from '@vueuse/core'
import type { GraphSettings } from './graph'
import type { TabSettings } from './state-tab'

export const devtoolsClientState: RemovableRef<{
  isFirstVisit: boolean
  route: string
  graphSettings: GraphSettings
  tabSettings: TabSettings
  expandSidebar: boolean
  splitScreen: {
    enabled: boolean
    view: string
    size: [number, number]
  }
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
  splitScreen: {
    enabled: false,
    view: 'overview',
    size: [50, 50],
  },
  expandSidebar: false,
}, { mergeDefaults: true })

export function clearDevtoolsClientState() {
  devtoolsClientState.value = undefined
}

const windowSize = useWindowSize()

export const splitScreenAvailable = computed(() => windowSize.width.value > 1080)
