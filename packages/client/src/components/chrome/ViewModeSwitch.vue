<script setup lang="ts">
import { VueButton } from '@vue-devtools-next/ui'

useColorMode()

const { toggle } = useToggleViewMode()
</script>

<template>
  <div class="$ui-bg-base fixed inset-0 h-screen w-screen flex flex-col justify-center items-center">
    <DevToolsLogo h-18 />
    <p class="text-sm p3 font-bold">
      DevTools is currently injected into user application in <em class="text-primary-600">Overlay</em> view mode.
    </p>
    <p>
      <VueButton @click.stop="toggle('panel')">
        Switch to Panel Mode
      </VueButton>
    </p>
  </div>
</template>
