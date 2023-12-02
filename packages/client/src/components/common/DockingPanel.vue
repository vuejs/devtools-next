<script setup lang="ts">
import { VueButton, VueDarkToggle, VueIcon } from '@vue-devtools-next/ui'

const expandSidebar = computed({
  get: () => devtoolsClientState.value.expandSidebar,
  set: v => (devtoolsClientState.value.expandSidebar = v),
})

function refreshPage() {
  location.reload()
}
</script>

<template>
  <div>
    <div px3 py2 border="b base" flex="~ gap-2">
      <VueDarkToggle>
        <template #default="{ isDark, toggle }">
          <VueButton @click="toggle">
            <div i-carbon-sun dark:i-carbon-moon translate-y--1px /> {{ isDark.value ? 'Dark' : 'Light' }}
          </VueButton>
        </template>
      </VueDarkToggle>
      <VueButton @click="expandSidebar = !expandSidebar">
        <VueIcon :icon="expandSidebar ? 'i-carbon-side-panel-close' : 'i-carbon-side-panel-open'" />
        {{ expandSidebar ? 'Minimize Sidebar' : 'Expand Sidebar' }}
      </VueButton>
      <VueButton to="/settings">
        <div i-carbon-settings-adjust /> Settings
      </VueButton>
    </div>
    <div px3 py2 flex="~ gap2">
      <VueButton @click="refreshPage">
        Refresh Page
      </VueButton>
    </div>
  </div>
</template>
