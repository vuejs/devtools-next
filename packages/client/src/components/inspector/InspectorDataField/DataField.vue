<script setup lang="ts">
import type { InspectorState } from '@vue-devtools-next/schema'

const props = defineProps<{
  data: InspectorState
  hovering: boolean
}>()
</script>

<template>
  <span class="">
    <Actions v-bind="props" />
  </span>
</template>
