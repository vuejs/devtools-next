<script setup lang="ts">
import { DevToolsMessagingEvents, rpc } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import { Pane, Splitpanes } from 'splitpanes'

import { computed, onUnmounted, ref } from 'vue'
import type { CustomInspectorState, TimelineEventOptions } from '@vue/devtools-kit'
import DevToolsHeader from '~/components/basic/DevToolsHeader.vue'
import Empty from '~/components/basic/Empty.vue'
import Navbar from '~/components/basic/Navbar.vue'
import RootStateViewer from '~/components/state/RootStateViewer.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'
import EventList from './EventList.vue'

const props = defineProps<{
  layerIds: string[]
  docLink: string
  githubRepoLink?: string
}>()

const { expanded: expandedStateNodes } = createExpandedContext('timeline-state')

// event info + group info = [0, 1]
expandedStateNodes.value = ['0', '1']

const eventList = ref<TimelineEventOptions['event'][]>([])
const groupList = ref<Map<string | number | undefined, TimelineEventOptions['event'][]>>(new Map())
const selectedEventIndex = ref(0)
const selectedEventInfo = computed(() => eventList.value[selectedEventIndex.value] ?? null)
// event info
const normalizedEventInfo = computed(() => {
  const info: CustomInspectorState[] = []
  for (const key in selectedEventInfo.value?.data) {
    info.push({
      key,
      type: key,
      editable: false,
      value: selectedEventInfo.value.data[key]!,
    } as unknown as CustomInspectorState)
  }
  return info
})
// group info
const normalizedGroupInfo = computed(() => {
  const groupId = selectedEventInfo.value?.groupId
  const groupInfo = groupList.value.get(groupId)!
  if (groupInfo) {
    const duration = groupInfo[groupInfo.length - 1]?.time - (groupInfo[0]?.time ?? 0)
    return [{
      key: 'events',
      type: 'events',
      editable: false,
      value: groupInfo.length,
    }, duration && {
      key: 'duration',
      type: 'duration',
      editable: false,
      value: `${duration}ms`,
    }].filter(Boolean)
  }
  return undefined
})

// normalize display info
const displayedInfo = computed(() => {
  return { 'Event Info': normalizedEventInfo.value, ...(normalizedGroupInfo.value && { 'Group Info': normalizedGroupInfo.value }) } as unknown as Record<string, CustomInspectorState[]>
})

function normalizeGroupList(event: TimelineEventOptions['event']) {
  const groupId = event.groupId
  if (groupId !== undefined) {
    groupList.value.set(groupId, groupList.value.get(groupId) ?? [])
    groupList.value.get(groupId)?.push(event)
  }
}

function onTimelineEventUpdated(_payload) {
  const payload = parse(_payload)
  if (!payload)
    return

  const { layerId, event } = payload
  if (!props.layerIds.includes(layerId))
    return

  eventList.value.push(event)
  normalizeGroupList(event)
}

rpc.functions.on(DevToolsMessagingEvents.TIMELINE_EVENT_UPDATED, onTimelineEventUpdated)

onUnmounted(() => {
  rpc.functions.off(DevToolsMessagingEvents.TIMELINE_EVENT_UPDATED, onTimelineEventUpdated)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <DevToolsHeader :doc-link="docLink" :github-repo-link="githubRepoLink">
      <Navbar />
    </DevToolsHeader>
    <template v-if="eventList.length">
      <div class="flex-1 overflow-hidden">
        <Splitpanes class="h-full">
          <Pane border="r base" size="40" h-full>
            <div h-full select-none overflow-scroll class="no-scrollbar">
              <EventList v-model="selectedEventIndex" :data="eventList" />
            </div>
          </Pane>
          <Pane size="60">
            <div h-full select-none overflow-scroll class="no-scrollbar">
              <RootStateViewer class="p3" :data="displayedInfo" node-id="" inspector-id="" :disable-edit="true" expanded-state-id="timeline-state" />
            </div>
          </Pane>
        </Splitpanes>
      </div>
    </template>
    <Empty v-else class="flex-1">
      No events
    </Empty>
  </div>
</template>
