<script setup lang="ts">
import { VueButton, VueDarkToggle, VueIcon, VueSelect } from '@vue-devtools-next/ui'
import { isInChromePanel } from '@vue-devtools-next/shared'
import { useDevToolsBridgeRpc, useDevToolsState } from '@vue-devtools-next/core'

// #region view mode
const viewMode = inject<Ref<'overlay' | 'panel'>>('viewMode', ref('overlay'))
const viewModeSwitchVisible = computed(() => viewMode.value === 'panel' && isInChromePanel)
const { toggle: toggleViewMode } = useToggleViewMode()
// #endregion

const bridgeRpc = useDevToolsBridgeRpc()
const router = useRouter()

const expandSidebar = computed({
  get: () => devtoolsClientState.value.expandSidebar,
  set: v => (devtoolsClientState.value.expandSidebar = v),
})

const splitScreenEnabled = computed({
  get: () => devtoolsClientState.value.splitScreen.enabled,
  set: v => (devtoolsClientState.value.splitScreen.enabled = v),
})
const isSplitScreenAvailable = splitScreenAvailable

function refreshPage() {
  location.reload()
}

const devtoolsState = useDevToolsState()
const appRecords = computed(() => devtoolsState.appRecords.value.map(app => ({
  label: app.name + (app.version ? ` (${app.version})` : ''),
  value: app.id,
})))

const activeAppRecords = ref(appRecords.value[0].value)

watch(activeAppRecords, (id) => {
  bridgeRpc.toggleApp(`${id}`).then(() => {
    router.push('/overview').then(() => {
      refreshCurrentPageData()
    })
  })
})
</script>

<template>
  <div>
    <div px3 py2 border="b base" flex="~ gap-2">
      <VueDarkToggle>
        <template #default="{ isDark, toggle }">
          <VueButton outlined type="primary" @click="toggle">
            <div i-carbon-sun dark:i-carbon-moon translate-y--1px /> {{ isDark.value ? 'Dark' : 'Light' }}
          </VueButton>
        </template>
      </VueDarkToggle>
      <VueButton outlined type="primary" @click="expandSidebar = !expandSidebar">
        <VueIcon :icon="expandSidebar ? 'i-carbon-side-panel-close' : 'i-carbon-side-panel-open'" />
        {{ expandSidebar ? 'Minimize Sidebar' : 'Expand Sidebar' }}
      </VueButton>
      <VueButton to="/settings" outlined type="primary">
        <div i-carbon-settings-adjust /> Settings
      </VueButton>
    </div>
    <div v-if="isSplitScreenAvailable" px3 py2 border="b base" flex="~ gap-2">
      <VueButton outlined type="primary" @click="splitScreenEnabled = !splitScreenEnabled">
        <div i-carbon-split-screen />
        {{ splitScreenEnabled ? 'Close Split Screen' : 'Split Screen' }}
      </VueButton>
    </div>
    <div px3 py2 flex="~ gap2">
      <VueSelect v-model="activeAppRecords" :options="appRecords" placeholder="Toggle App" :button-props="{ outlined: true, type: 'primary' }" />
      <VueButton outlined type="primary" @click="refreshPage">
        Refresh Page
      </VueButton>
      <VueButton v-if="viewModeSwitchVisible" outlined type="primary" @click="toggleViewMode('overlay')">
        Switch to Overlay Mode
      </VueButton>
    </div>
  </div>
</template>
