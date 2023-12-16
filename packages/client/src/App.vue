<script setup lang="ts">
import type { Ref } from 'vue'
import { useDevToolsBridge, useDevToolsState } from '@vue-devtools-next/core'
import { isInChromePanel } from '@vue-devtools-next/shared'
import { Pane, Splitpanes } from 'splitpanes'

// @TODO: fix browser extension cross-origin localStorage issue
useColorMode()
const router = useRouter()
const route = useRoute()
const { connected } = useDevToolsState()
const clientState = devtoolsClientState

const viewMode = inject<Ref<'overlay' | 'panel'>>('viewMode', ref('overlay'))
const viewModeSwitchVisible = computed(() => viewMode.value === 'overlay' && isInChromePanel)
const { toggle } = useToggleViewMode()
const bridge = useDevToolsBridge()

const isUtilityView = computed(() => route.path.startsWith('/__') || route.path === '/')
const sidebarExpanded = computed(() => clientState.value.expandSidebar)

watchEffect(() => {
  const scale = devtoolsClientState.value.scale
  document.body.style.fontSize = `${scale * 15}px`
})

watch(connected, (v) => {
  if (v) {
    router.replace(clientState.value.isFirstVisit ? '/' : clientState.value.route)
    router.afterEach(() => {
      const path = route.path
      if (path.includes('__'))
        return
      clientState.value.route = path
    })
  }
}, {
  immediate: true,
})

useEventListener('keydown', (e) => {
  if (e.code === 'KeyD' && e.altKey && e.shiftKey)
    bridge.value.emit('toggle-panel')
})

watchEffect(() => {
  bridge.value.emit('update-client-state', {
    minimizePanelInteractive: devtoolsClientState.value.minimizePanelInteractive,
    closeOnOutsideClick: devtoolsClientState.value.interactionCloseOnOutsideClick,
    showFloatingPanel: devtoolsClientState.value.showPanel,
  })
})

const splitScreenEnabled = computed(() => clientState.value.splitScreen.enabled)
const isSplitScreenAvailable = splitScreenAvailable
const splitScreenSize = computed({
  get: () => clientState.value.splitScreen.size,
  set: v => clientState.value.splitScreen.size = v,
})
</script>

<template>
  <main class="fixed inset-0 h-screen w-screen $ui-bg-base">
    <AppConnecting v-if="!connected" />
    <ViewModeSwitch v-else-if="viewModeSwitchVisible" />
    <div
      v-else
      class="h-full of-auto"
      :class="isUtilityView ? 'flex' : sidebarExpanded ? 'grid grid-cols-[250px_1fr]' : 'grid grid-cols-[50px_1fr]'"
      h-full h-screen of-hidden font-sans bg-base
    >
      <SideNav v-if="!isUtilityView" of-x-hidden of-y-auto />
      <Splitpanes
        h-full of-hidden
        @resize="splitScreenSize = $event.map((v) => v.size)"
      >
        <Pane h-full class="of-auto!" min-size="10" :size="splitScreenSize[0]">
          <RouterView />
        </Pane>
        <Pane v-if="!isUtilityView && splitScreenEnabled && isSplitScreenAvailable" relative h-full class="of-auto!" :size="splitScreenSize[1]">
          <SplitScreen />
        </Pane>
      </Splitpanes>
    </div>
  </main>
</template>
