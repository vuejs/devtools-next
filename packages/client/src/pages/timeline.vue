<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

// eslint-disable-next-line ts/consistent-type-imports
import type { InspectorState, TimelineEvent } from 'vue-devtools-kit'
import { onDevToolsClientConnected, useDevToolsBridgeRpc } from '@vue-devtools-next/core'

const bridgeRpc = useDevToolsBridgeRpc()
const layers = ref<{
  color: number
  id: string
  label: string
}[]>([])
const timelineEvent = ref<Record<string, TimelineEvent['event'][]>>({})
const { selected } = createSelectContext('timeline-layer')
const { selected: selectedEvent } = createSelectContext('timeline-event')
createCollapseContext('inspector-state')
const activeTimelineEvent = computed(() => timelineEvent.value[selected.value] ?? [])
const selectedEventInfo = computed(() => activeTimelineEvent.value?.[+(selectedEvent.value ?? 0)]?.data ?? {})
const normalizedEventInfo = computed(() => {
  const info: InspectorState[] = []
  for (const key in selectedEventInfo.value) {
    info.push({
      key,
      type: key,
      editable: false,
      value: selectedEventInfo.value[key],
    })
  }
  return info
})

onDevToolsClientConnected(() => {
  bridgeRpc.getTimelineLayer().then(({ data }) => {
    layers.value = data
    layers.value.forEach((layer) => {
      timelineEvent.value[layer.id] = []
    })
    if (!selected.value)
      selected.value = data[0].id
  })
  bridgeRpc.on.addTimelineEvent((payload) => {
    if (!payload)
      return
    const { layerId, event } = payload
    timelineEvent.value[layerId].push(event)
  })
})
</script>

<template>
  <div>
    <Splitpanes>
      <Pane border="r base" size="20">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <TimelineLayer v-for="(item) in layers" :key="item.id" :data="item" />
        </div>
      </Pane>
      <Pane border="r base" size="45">
        <div h-screen select-none overflow-scroll class="no-scrollbar">
          <template v-if="activeTimelineEvent.length">
            <TimelineEvent v-for="(item, index) in activeTimelineEvent" :id="`${index}`" :key="index" :data="item" />
          </template>
          <EmptyPane v-else icon="i-ic-baseline-inbox">
            No events
          </EmptyPane>
        </div>
      </Pane>
      <Pane size="35">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <InspectorState v-for="(item, key) in { 'event info': normalizedEventInfo }" :id="`${key}`" :key="key + Date.now()" :data="item" :name="`${key}`" />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
