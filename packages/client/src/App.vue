<script setup lang="ts">
import { useDevToolsContext } from '@vue-devtools-next/app-core'

useDark()
const router = useRouter()
const { connected } = useDevToolsContext()

watch(connected, (v) => {
  if (v)
    router.replace('/overview')
}, {
  immediate: true,
})
</script>

<template>
  <main class="$ui-bg-base fixed inset-0 h-screen w-screen">
    <AppConnecting v-if="!connected" />
    <div v-else>
      <RouterView />
    </div>
  </main>
</template>
