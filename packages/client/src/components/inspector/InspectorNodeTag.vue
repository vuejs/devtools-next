<script setup lang="ts">
import type { InspectorNodeTag } from 'vue-devtools-kit'

defineProps<{
  tag: InspectorNodeTag
}>()
</script>

<template>
  <span
    v-tooltip="{
      content: tag.tooltip,
      html: true,
    }"
    :style="{
      color: `#${tag.textColor.toString(16).padStart(6, '0')}`,
      backgroundColor: `#${tag.backgroundColor.toString(16).padStart(6, '0')}`,
    }"
    class="text-[0.75rem] px-1 rounded-sm ml-2 leading-snug"
  >
    {{ tag.label }}
  </span>
</template>
