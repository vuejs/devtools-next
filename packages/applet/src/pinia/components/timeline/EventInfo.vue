<script setup lang="ts">
import type { InspectorState, TimelineEvent } from '@vue/devtools-kit'
import { computed } from 'vue'
import RootStateViewer from '~/components/state/RootStateViewer.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'

const props = defineProps<{
  data: TimelineEvent['event']
}>()

const normalizedEventInfo = computed(() => {
  const info: InspectorState[] = []
  for (const key in props.data) {
    info.push({
      key,
      type: key,
      editable: false,
      value: props.data[key],
    })
  }
  return info
})

createExpandedContext()
</script>

<template>
  <div p3>
    <RootStateViewer :data="{ state: normalizedEventInfo }" />
  </div>
</template>
