<script setup lang="ts">
import type { InspectorState } from '@vue/devtools-kit'
import StateFieldViewer from './StateFieldViewer.vue'

withDefaults(defineProps<{
  data: InspectorState[]
  depth: number
  index: string
}>(), {
  depth: 0,
})
</script>

<template>
  <div>
    <div
      v-for="(item, i) in data"
      :key="i"
    >
      <StateFieldViewer :data="item" :depth="depth + 1" :index="`${index}-${i}`" />
    </div>
  </div>
</template>
