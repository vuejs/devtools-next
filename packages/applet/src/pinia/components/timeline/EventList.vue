<script setup lang="ts">
import type { TimelineEvent } from '@vue/devtools-kit'
import { computed } from 'vue'
import { formatTime } from '~/utils'

const props = defineProps<{
  data: Array<TimelineEvent['event'] & { color?: string }>
}>()

const selected = defineModel()
const colors = ['#3e5770', '#42b983', '#0098c4']

const normalizedData = computed(() => {
  let currentColorIndex = -1
  let currentGroupId = 0
  props.data.forEach((item) => {
    if (item.groupId !== currentGroupId || currentColorIndex === -1)
      currentColorIndex = (currentColorIndex + 1) % colors.length

    currentGroupId = item.groupId ?? currentGroupId

    item.color = colors[currentColorIndex]
  })
  return props.data
})
</script>

<template>
  <div class="p3">
    <ul>
      <li v-for="(item, index) in normalizedData" :key="index" class="relative mb7 h6 cursor-pointer" :style="{ color: selected === index ? item.color : '' }" @click="selected = index">
        <!-- head -->
        <span class="absolute top-1.5 inline-block h3 w3 b rounded-50%" :style="{ border: `3px solid ${item.color}` }" />
        <!-- line -->
        <span v-if="index < data.length - 1" class="absolute left-5px top-4.5 h10 w0 border-l-2" border="solid gray2" />
        <!-- content -->
        <p class="h-full flex items-center truncate pl5">
          <span absolute top-5 pr2 text-3 op40>[{{ formatTime(item.time) }}]</span>
          {{ item.title }}
          <span pl2 op30>{{ item.subtitle }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>
