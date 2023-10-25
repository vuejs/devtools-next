<script setup lang="ts">
import { UNDEFINED } from 'vue-devtools-kit/shared'
import { Pane, Splitpanes } from 'splitpanes'

// eslint-disable-next-line ts/consistent-type-imports
import type { InspectorState, TimelineEvent } from 'vue-devtools-kit'
import { onDevToolsClientConnected, useDevToolsBridgeRpc } from '@vue-devtools-next/core'

const bridgeRpc = useDevToolsBridgeRpc()
const layers = ref<{
  color: number
  id: string
  label: string
  groups?: Record<number | string, { events: TimelineEvent['event'][]; duration: number }>
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
const normalizedGroupInfo = computed(() => {
  const groups = layers.value.find(layer => layer.id === selected.value)?.groups
  const groupId = activeTimelineEvent.value?.[+(selectedEvent.value ?? 0)]?.groupId
  const groupInfo = groups?.[groupId]
  if (groupInfo) {
    return [{
      key: 'events',
      type: 'events',
      editable: false,
      value: groupInfo.events.length,
    }, groupInfo.duration && {
      key: 'duration',
      type: 'duration',
      editable: false,
      value: `${groupInfo.duration}ms`,
    }].filter(Boolean)
  }
  return undefined
})

const inspectorState = computed(() => {
  return { 'event info': normalizedEventInfo.value, ...(normalizedGroupInfo.value && { 'group info': normalizedGroupInfo.value }) } as unknown as Record<string, InspectorState[]>
})

function normalizeGroupInfo(layerId: string, event: TimelineEvent['event']) {
  const layer = layers.value.find(layer => layer.id === layerId)
  if (layer && (`${event.groupId}` !== UNDEFINED || event.groupId != null)) {
    layer.groups![event.groupId] ??= {
      events: [],
      duration: 0,
    }
    layer.groups![event.groupId].events.push(event)
    layer.groups![event.groupId].duration = event.time - layer.groups![event.groupId].events?.[0]?.time
  }
}

onDevToolsClientConnected(() => {
  bridgeRpc.getTimelineLayer().then(({ data }) => {
    layers.value = data
    layers.value.forEach((layer) => {
      timelineEvent.value[layer.id] = []
      layer.groups = {}
    })
    if (!selected.value)
      selected.value = data[0].id
  })
  bridgeRpc.on.addTimelineEvent((payload) => {
    if (!payload)
      return
    const { layerId, event } = payload
    timelineEvent.value[layerId].push(event)
    normalizeGroupInfo(layerId, event)
  })
})
</script>

<template>
  <div>
    <Splitpanes>
      <!-- layer -->
      <Pane border="r base" size="20">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <TimelineLayer v-for="(item) in layers" :key="item.id" :data="item" />
        </div>
      </Pane>
      <!-- event -->
      <Pane border="r base" size="45">
        <div h-screen select-none overflow-scroll class="no-scrollbar">
          <template v-if="activeTimelineEvent.length">
            <!-- @TODO: recycle scroller wrapper -->
            <TimelineEvent v-for="(item, index) in activeTimelineEvent" :id="`${index}`" :key="index" :data="item" />
          </template>
          <EmptyPane v-else icon="i-ic-baseline-inbox">
            No events
          </EmptyPane>
        </div>
      </Pane>
      <!-- event info -->
      <Pane size="35">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <template v-if="selectedEvent">
            <InspectorState v-for="(item, key) in inspectorState" :id="`${key}`" :key="key + Date.now()" :data="item" :name="`${key}`" />
          </template>
          <EmptyPane v-else icon="i-carbon:menu">
            Select an event to display details
          </EmptyPane>
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
