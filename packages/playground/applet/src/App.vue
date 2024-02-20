<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Pinia } from '@vue/devtools-applet'

useColorMode()
</script>

<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <div h-150 w-200 border="1 green solid">
      <Pinia />
    </div>
  </div>
</template>
