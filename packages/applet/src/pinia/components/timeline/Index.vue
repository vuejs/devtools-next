<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { defineDevToolsAction, defineDevToolsListener } from '@vue/devtools-core'

import type { InspectorState, TimelineEvent } from '@vue/devtools-kit'
import { computed, ref } from 'vue'
import EventList from './EventList.vue'
import EventInfo from './EventInfo.vue'

const getTimelineLayer = defineDevToolsAction('devtools:get-timeline-layer', (devtools) => {
  return devtools.context.timelineLayer
})

const onAddTimelineEvent = defineDevToolsListener<TimelineEvent>((devtools, callback) => {
  devtools.api.on.addTimelineEvent((payload) => {
    callback(payload)
  })
})

const LAYER_ID = 'pinia:mutations'
const eventList = ref<TimelineEvent['event'][]>([])
const selectedEventIndex = ref(1)
const selectedEventInfo = computed(() => eventList.value[selectedEventIndex.value] ?? null)
const normalizedEventInfo = computed(() => {
  const info: InspectorState[] = []
  for (const key in selectedEventInfo.value.data) {
    info.push({
      key,
      type: key,
      editable: false,
      value: selectedEventInfo.value.data[key]!,
    })
  }
  return info
})

// @TODO: call this after connected
// getTimelineLayer().then((data) => {
//   const layer = data.find(item => item.id === LAYER_ID)
//   console.log('x', layer)
// })

// @TODO: call this after connected and destroy after unmounted
onAddTimelineEvent((payload) => {
  if (!payload)
    return

  const { layerId, event } = payload
  if (layerId !== LAYER_ID)
    return

  eventList.value.push(event)
})
</script>

<template>
  <div class="h-full">
    <template v-if="eventList.length">
      <Splitpanes class="h-full">
        <Pane border="r base" size="40" h-full>
          <div h-full select-none overflow-scroll class="no-scrollbar">
            <EventList v-model="selectedEventIndex" :data="eventList" />
          </div>
        </Pane>
        <Pane size="60">
          <div h-full select-none overflow-scroll class="no-scrollbar">
            <EventInfo :data="selectedEventInfo" />
          </div>
        </Pane>
      </Splitpanes>
    </template>
    <div v-else class="h-full flex flex-col items-center justify-center op50">
      <i class="i-lets-icons:blank-light" />
      <span>
        No events
      </span>
    </div>
  </div>
</template>
