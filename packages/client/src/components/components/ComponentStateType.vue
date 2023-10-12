<script setup lang="ts">
import type { ComponentState } from '@vue-devtools-next/schema'

withDefaults(defineProps<{
  data: ComponentState[]
  depth?: number
}>(), {
  depth: 0,
})
</script>

<template>
  <div
    v-for="(item, index) in data"
    :key="index" class="flex items-center font-data-field pl-8"
  >
    <ComponentStateField :data="item" :no="index" />
  </div>
</template>
