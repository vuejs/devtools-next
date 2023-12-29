<script setup lang="ts">
import { VueIcon } from '@vue/devtools-ui'

const props = defineProps<{
  icon?: string
  inline?: boolean
}>()
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center p-12 text-center text-gray-400 space-y-6 dark:text-gray-600">
    <VueIcon v-bind="props" />
    <div><slot /></div>
  </div>
</template>
