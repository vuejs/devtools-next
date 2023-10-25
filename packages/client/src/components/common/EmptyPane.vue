<script setup lang="ts">
import { VueIcon } from '@vue-devtools-next/ui'

const props = defineProps<{
  icon?: string
  inline?: boolean
}>()
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center space-y-6 p-12 text-gray-400 dark:text-gray-600 text-center">
    <VueIcon v-bind="props" />
    <div><slot /></div>
  </div>
</template>
