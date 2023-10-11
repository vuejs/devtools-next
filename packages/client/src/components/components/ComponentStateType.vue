<script setup lang="ts">
import type { ComponentState } from '@vue-devtools-next/schema'

withDefaults(defineProps<{
  data: ComponentState[]
  depth?: number
}>(), {
  depth: 0,
})

const stateExpandedMap = ref<Record<string, boolean>>({})

const isExpanded = (id: string) => stateExpandedMap.value[id]

function toggleExpanded(id: string) {
  stateExpandedMap.value[id] = !stateExpandedMap.value[id]
}
</script>

<template>
  <div
    v-for="(item, index) in data"
    :key="index" class="flex items-center font-data-field"
    :style="{ paddingLeft: `${depth * 15 + 4}px` }"
  >
    <template v-if="item.children">
      <div cursor-pointer>
        <div flex items-center @click="toggleExpanded(`${item.key}-${index}`)">
          <ExpandIcon :value="isExpanded(`${item.key}-${index}`)" group-hover:text-white />
          <span state-key>{{ item.key }}</span>
          <span mx-1>:</span>
          <span class="state-value">{{ item.value }}</span>
        </div>
        <div v-if="isExpanded(`${item.key}-${index}`)">
          <ComponentStateType :data="item.children" :depth="depth + 1" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="pl-6">
        <span state-key>{{ item.key }}</span>
        <span mx-1>:</span>
        <span :class="`state-value-${item.type}`">{{ item.value }}</span>
      </div>
    </template>
  </div>
</template>
