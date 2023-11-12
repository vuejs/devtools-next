<script setup lang="ts">
import type { Ref } from 'vue'
import { useDevToolsState } from '@vue-devtools-next/core'
import { isInChromePanel } from '@vue-devtools-next/shared'

// @TODO: fix browser extension cross-origin localStorage issue
useColorMode()
const router = useRouter()
const { connected } = useDevToolsState()

const viewMode = inject<Ref<'overlay' | 'panel'>>('viewMode', ref('overlay'))
const viewModeSwitchVisible = computed(() => viewMode.value === 'overlay' && isInChromePanel)
const { toggle } = useToggleViewMode()
watch(connected, (v) => {
  if (v)
    router.replace('/components')
}, {
  immediate: true,
})
</script>

<template>
  <main class="$ui-bg-base fixed inset-0 h-screen w-screen">
    <AppConnecting v-if="!connected" />
    <ViewModeSwitch v-else-if="viewModeSwitchVisible" />
    <div v-else class="h-full of-auto">
      <RouterView />
    </div>
  </main>
</template>
