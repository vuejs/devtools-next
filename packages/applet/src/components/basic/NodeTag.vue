<script setup lang="ts">
import { vTooltip } from '@vue/devtools-ui'
import type { InspectorNodeTag } from '@vue/devtools-kit'
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
    class="ml-2 rounded-sm px-1 text-[0.75rem] leading-snug"
  >
    {{ tag.label }}
  </span>
</template>
