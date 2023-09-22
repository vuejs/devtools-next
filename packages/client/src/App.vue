<script setup lang="ts">
import { useDevToolsContext } from '@vue-devtools-next/app-core'

useDark()
const { connected } = useDevToolsContext()
</script>

<template>
  <main class="$ui-bg-base fixed inset-0 h-screen w-screen">
    <AppConnecting v-if="!connected" />
    <div v-else>
      Hello DevTools
    </div>
  </main>
</template>
