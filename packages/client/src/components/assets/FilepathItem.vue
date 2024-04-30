<script setup lang="ts">
import { vTooltip } from '@vue/devtools-ui'

const props = defineProps<{
  filepath: string
  lineBreak?: boolean
  subpath?: boolean
}>()

const parsed = computed(() => ({ path: props.filepath }),
)

const { copy } = useCopy()
</script>

<template>
  <button
    v-tooltip="'Copy file path'" font-mono hover:underline
    :class="lineBreak ? '' : 'ws-nowrap of-hidden truncate'"
    :title="filepath" @click="copy(filepath)"
  >
    {{ parsed.path }}
  </button>
</template>
