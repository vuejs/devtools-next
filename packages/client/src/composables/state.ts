import type { RemovableRef } from '@vueuse/core'
import type { GraphSettings } from './graph'
import type { TabSettings } from './state-tab'

interface DevtoolsClientState {
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
}

function clientStateFactory(): DevtoolsClientState {
  return {
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
  }
}

export const devtoolsClientState: RemovableRef<DevtoolsClientState> = useLocalStorage(
  '__VUE_DEVTOOLS_CLIENT_STATE__',
  clientStateFactory(),
  { mergeDefaults: true },
)

export function resetDevtoolsClientState() {
  devtoolsClientState.value = clientStateFactory()
}

// #region split screen related
const windowSize = useWindowSize()

export const splitScreenAvailable = computed(() => windowSize.width.value > 1080)

watch(() => devtoolsClientState.value.splitScreen.enabled, (enabled, o) => {
  if (o && !enabled) {
    // reset size
    devtoolsClientState.value.splitScreen.size = [50, 50]
  }
})
// #endregion
