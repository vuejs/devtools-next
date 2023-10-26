<script setup lang="ts">
import type { TimelineEvent } from 'vue-devtools-kit'
import { formatTime } from '~/utils'

const props = defineProps<{
  modelValue: string
  data: TimelineEvent['event']
  id: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const isSelected = computed(() => props.modelValue === props.id)
function select() {
  emit('update:modelValue', props.id)
}
</script>

<template>
  <ul>
    <li
      class="flex items-center px-2 py-2 dark:border-bluegray-800 text-gray-200 border-b cursor-pointer"
      :class="{
        'hover:bg-blue-100 dark:hover:bg-blue-900 text-bluegray-800 dark:text-bluegray-200': !isSelected,
        'bg-primary-500 text-white': isSelected,
      }"
      @click="select"
    >
      <span class="flex-1 font-mono truncate space-x-1">
        <span
          class="font-medium"
          :class="{
            'text-purple-600 dark:text-purple-400': !isSelected,
          }"
        >
          <span>{{ data.title || 'Event' }}</span>
        </span>
        <span v-if="data.subtitle" class="op-75" v-html="data.subtitle" />
      </span>
      <span v-if="data.time" class="flex-none text-xs font-mono op-50">
        {{ formatTime(data.time / 1000) }}
      </span>
    </li>
  </ul>
</template>
