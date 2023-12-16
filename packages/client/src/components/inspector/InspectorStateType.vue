<script setup lang="ts">
import type { InspectorState } from 'vue-devtools-kit'

withDefaults(defineProps<{
  data: InspectorState[]
  depth?: number
}>(), {
  depth: 0,
})
</script>

<template>
  <div
    v-for="(item, index) in data"
    :key="index" class="flex items-center pl-8 font-data-field"
  >
    <InspectorStateField :data="item" :no="index" />
  </div>
</template>
