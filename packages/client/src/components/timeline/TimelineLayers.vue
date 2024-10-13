<script setup lang="ts">
import { rpc, useDevToolsState } from '@vue/devtools-core'
import { useDevToolsColorMode, vTooltip, VueIcIcon } from '@vue/devtools-ui'
import { defineModel } from 'vue'

defineProps<{ data: {
  id: string
  label: string
}[] }>()

const emit = defineEmits(['select', 'clear'])
const devtoolsState = useDevToolsState()
const recordingState = computed(() => devtoolsState.timelineLayersState.value.recordingState)
const timelineLayersState = computed(() => devtoolsState.timelineLayersState.value)
const recordingTooltip = computed(() => recordingState.value ? 'Stop recording' : 'Start recording')
const { colorMode } = useDevToolsColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const selected = defineModel()
function select(id: string) {
  selected.value = id
  emit('select', id)
}

function getTimelineLayerEnabled(id: string) {
  return {
    'mouse': timelineLayersState.value.mouseEventEnabled,
    'keyboard': timelineLayersState.value.keyboardEventEnabled,
    'component-event': timelineLayersState.value.componentEventEnabled,
    'performance': timelineLayersState.value.performanceEventEnabled,
  }[id]
}

function toggleRecordingState() {
  rpc.value.updateTimelineLayersState({
    recordingState: !recordingState.value,
  })
}

function toggleTimelineLayerEnabled(id: string) {
  const normalizedId = {
    'mouse': 'mouseEventEnabled',
    'keyboard': 'keyboardEventEnabled',
    'component-event': 'componentEventEnabled',
    'performance': 'performanceEventEnabled',
  }[id]
  rpc.value.updateTimelineLayersState({
    [normalizedId]: !getTimelineLayerEnabled(id),
  })
}
</script>

<template>
  <div h-full flex flex-col p2>
    <div class="mb-1 flex justify-end pb-1" border="b dashed base">
      <div class="flex items-center gap-2 px-1">
        <div v-tooltip.bottom-end="{ content: recordingTooltip }" class="flex items-center gap1" @click="toggleRecordingState">
          <span v-if="recordingState" class="recording recording-btn bg-[#ef4444]" />
          <span v-else class="recording-btn bg-black op70 dark:(bg-white) hover:op100" />
        </div>
        <div v-tooltip.bottom-end="{ content: 'Clear all timelines' }" class="flex items-center gap1" @click="emit('clear')">
          <VueIcIcon name="baseline-delete" cursor-pointer text-xl op70 hover:op100 />
        </div>
      </div>
    </div>
    <ul class="p2">
      <li
        v-for="item in data" :key="item.id"
        class="group relative selectable-item"
        :class="{ active: item.id === selected }"
        @click="select(item.id)"
      >
        {{ item.label }}
        <span class="absolute right-2 rounded-1 bg-primary-500 px1 text-3 text-white op0 [.active_&]:(bg-primary-400 dark:bg-gray-600) group-hover:op80 hover:op100!" @click.stop="toggleTimelineLayerEnabled(item.id)">
          {{ getTimelineLayerEnabled(item.id) ? 'Disabled' : 'Enabled' }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}
.recording-btn {
  --at-apply: w-3.5 h-3.5 inline-flex cursor-pointer rounded-50%;
}
.recording {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  transition-duration: 1s;
  box-shadow: #ef4444 0 0 8px;
}
</style>
