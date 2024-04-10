<script setup lang="ts">
import type { ComponentTreeNode } from '@vue/devtools-kit'
import ToggleExpanded from '~/components/basic/ToggleExpanded.vue'
import ComponentTreeViewer from '~/components/tree/TreeViewer.vue'
import { useToggleExpanded } from '~/composables/toggle-expanded'
import { useSelect } from '~/composables/select'

withDefaults(defineProps<{
  data: ComponentTreeNode[]
  depth: number
  i: number
}>(), {
  depth: 0,
  i: 0,
})
const { expanded, toggleExpanded } = useToggleExpanded()
const { selected, select } = useSelect()
</script>

<template>
  <div
    v-for="(item, index) in data"
    :key="index"
  >
    <div
      class="group flex cursor-pointer items-center rounded-1 hover:(bg-primary-300 dark:bg-gray-600)"
      :style=" { paddingLeft: `${15 * depth + 4}px` }"
      :class="{ 'bg-primary-600! active': selected === `${depth}-${i}-${index}` }"
      @click="select(`${depth}-${i}-${index}`)"
    >
      <ToggleExpanded
        v-if="item?.children?.length"
        :value="expanded.includes(`${depth}-${i}-${index}`)"
        class="[.active_&]:op20 group-hover:op20"
        @click.stop="toggleExpanded(`${depth}-${i}-${index}`)"
      />
      <!-- placeholder -->
      <span v-else pl5 />
      <span font-state-field text-4>
        <span class="text-gray-400 dark:text-gray-600 group-hover:(text-white op50) [.active_&]:(op50 text-white!)">&lt;</span>
        <span group-hover:text-white class="[.active_&]:(text-white)">{{ item.name }}</span>
        <span class="text-gray-400 dark:text-gray-600 group-hover:(text-white op50) [.active_&]:(op50 text-white!)">&gt;</span>
      </span>
    </div>
    <div
      v-if="item?.children?.length && expanded.includes(`${depth}-${i}-${index}`)"
    >
      <ComponentTreeViewer :data="item?.children" :depth="depth + 1" :i="index" />
    </div>
  </div>
</template>
