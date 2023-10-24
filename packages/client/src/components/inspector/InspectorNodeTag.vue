<script setup lang="ts">
import type { InspectorNodeTag } from 'vue-devtools-kit'
import { toHex } from '~/utils'

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
      color: `#${toHex(tag.textColor)}`,
      backgroundColor: `#${toHex(tag.backgroundColor)}`,
    }"
    class="text-[0.75rem] px-1 rounded-sm ml-2 leading-snug"
  >
    {{ tag.label }}
  </span>
</template>
