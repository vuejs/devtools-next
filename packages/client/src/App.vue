<script setup lang="ts">
import { useDevToolsState } from '@vue-devtools-next/core'

// @TODO: fix browser extension cross-origin localStorage issue
useColorMode()
const router = useRouter()
const { connected } = useDevToolsState()

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
    <div v-else class="h-full of-auto">
      <RouterView />
    </div>
  </main>
</template>
