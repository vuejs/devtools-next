<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { useDevToolsColorMode } from '@vue/devtools-ui'
import { parse } from '@vue/devtools-kit'
import { rpc } from '@vue/devtools-core'

import('./setup/unocss-runtime')
useDevToolsColorMode()
const router = useRouter()
const route = useRoute()
const hostEnv = useHostEnv()
const { connected: _connected, activeAppRecordId: _activeAppRecordId, appRecords: _appRecords } = useDevToolsState()
const clientState = devtoolsClientState

const { connected } = useConnection()
const devtoolsReady = computed(() => connected.value && _connected.value)
const isUtilityView = computed(() => route.path.startsWith('/__') || route.path === '/')
const sidebarExpanded = computed(() => clientState.value.expandSidebar)
const splitScreenEnabled = computed(() => clientState.value.splitScreen.enabled)
const splitScreenSize = computed({
  get: () => clientState.value.splitScreen.size,
  set: v => clientState.value.splitScreen.size = v,
})

watchEffect(() => {
  const scale = devtoolsClientState.value.scale
  document.documentElement.style.fontSize = `${scale * 15}px`
})

watch(devtoolsReady, (v) => {
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
    rpc.value.emit('toggle-panel')
})

function getInspectorState() {
  rpc.value.getInspectorState({
    inspectorId: 'components',
    nodeId: 'app-1:root',
  }).then(([res]) => {
    console.log('state', parse(res))
  })
}

watchEffect(() => {
  console.log('x', _appRecords.value)
  activeAppRecords.value = _appRecords.value
  activeAppRecordId.value = _activeAppRecordId.value
})

onDevToolsConnected(() => {
  rpc.value.initDevToolsServerListener()
  rpc.value.checkVueInspectorDetected().then(([detected]) => {
    if (detected) {
      vueInspectorDetected.value = true
      registerCommands(() =>
        [{
          id: 'action:vue-inspector',
          title: 'Inspector',
          icon: 'i-carbon-select-window',
          action: async () => {
            rpc.value.emit('toggle-panel', false)
            await rpc.value.enableVueInspector()
          },
        }],
      )
    }
  })
})

// watchEffect(() => {
//   bridge.value.emit('update-client-state', {
//     minimizePanelInteractive: devtoolsClientState.value.minimizePanelInteractive,
//     closeOnOutsideClick: devtoolsClientState.value.interactionCloseOnOutsideClick,
//     showFloatingPanel: devtoolsClientState.value.showPanel,
//   })
// })
</script>

<template>
  <main class="fixed inset-0 h-screen w-screen $ui-bg-base">
    <AppConnecting v-if="!devtoolsReady" />
    <div
      v-else
      class="h-full of-auto transition-base"
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
        <Pane v-if="!isUtilityView && splitScreenEnabled" relative h-full class="of-auto!" :size="splitScreenSize[1]">
          <SplitScreen />
        </Pane>
      </Splitpanes>
    </div>
    <CommandPalette />
  </main>
</template>
