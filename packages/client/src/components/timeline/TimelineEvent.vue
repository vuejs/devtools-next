<script setup lang="ts">
import type { TimelineEvent } from 'vue-devtools-kit'
import { RecycleScroller } from 'vue-virtual-scroller'
import { formatTime } from '~/utils'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

defineProps<{
  modelValue: string
  data: TimelineEvent['event'][]
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
function select(id: string) {
  emit('update:modelValue', id)
}
</script>

<template>
  <RecycleScroller
    v-slot="{ item }"
    :items="data"
    :min-item-size="42"
    key-field="id"
    page-mode
  >
    <li
      class="flex cursor-pointer items-center border-b px-2 py-2 text-gray-200 dark:border-bluegray-800"
      :class="{
        'hover:bg-blue-100 dark:hover:bg-blue-900 text-bluegray-800 dark:text-bluegray-200': !(modelValue === item.id),
        'bg-primary-500 text-white': modelValue === item.id,
      }"
      @click="select(item.id)"
    >
      <span class="flex-1 truncate font-mono space-x-1">
        <span
          class="font-medium"
          :class="{
            'text-purple-600 dark:text-purple-400': !(modelValue === item.id),
          }"
        >
          <span>{{ item.title || 'Event' }}</span>
        </span>
        <span v-if="item.subtitle" class="op-75" v-html="item.subtitle" />
      </span>
      <span v-if="item.time" class="flex-none text-xs font-mono op-50">
        {{ formatTime(item.time) }}
      </span>
    </li>
  </RecycleScroller>
</template>
