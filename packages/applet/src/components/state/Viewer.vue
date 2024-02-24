<script setup lang="ts">
// eslint-disable-next-line import/no-self-import
import StateViewer from './Viewer.vue'

import ToggleExpanded from '~/components/basic/ToggleExpanded.vue'

import { useToggleExpanded } from '~/composables/toggle-expanded'

interface State {
  key: string
  editable: boolean
  type: string
  display: unknown
  children?: State[]
}

const props = withDefaults(defineProps<{
  data: State[]
  depth?: number
}>(), {
  depth: 0,
})

function normalizeDisplay(item: State) {
  if (item.type === 'string')
    return `"${item.display}"`

  else
    return item.display
}

const { expanded, toggleExpanded } = useToggleExpanded()
</script>

<template>
  <div>
    <div
      v-for="(item, index) in data"
      :key="index"
      :style="{ paddingLeft: `${depth * 15}px` }"
    >
      <div
        class="flex items-center"
        :class="[item?.children?.length && 'cursor-pointer hover:(bg-active)']"
        @click="toggleExpanded(`${depth}-${index}`)"
      >
        <ToggleExpanded
          v-if="item?.children?.length"
          :value="expanded.includes(`${depth}-${index}`)"
        />
        <!-- placeholder -->
        <span v-else pl5 />
        {{ item.key }}
        <span mx1>:</span>
        <span :class="`${item.type}-state-type`">{{ normalizeDisplay(item) }}</span>
      </div>
      <div
        v-if="item?.children?.length && expanded.includes(`${depth}-${index}`)"
      >
        <StateViewer :data="item.children" :depth="depth + 1" />
      </div>
    </div>
  </div>
</template>
