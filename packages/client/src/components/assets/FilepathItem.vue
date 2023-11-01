<script setup lang="ts">
const props = defineProps<{
  filepath: string
  lineBreak?: boolean
  subpath?: boolean
}>()

const parsed = computed(() => ({ path: props.filepath }),
)
</script>

<template>
  <button
    font-mono hover:underline
    :class="lineBreak ? '' : 'ws-nowrap of-hidden truncate'"
    :title="filepath"
  >
    {{ parsed.path }}
  </button>
</template>
