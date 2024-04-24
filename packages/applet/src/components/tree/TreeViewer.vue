<script setup lang="ts">
import type { ComponentTreeNode } from '@vue/devtools-kit'
import ToggleExpanded from '~/components/basic/ToggleExpanded.vue'
import ComponentTreeViewer from '~/components/tree/TreeViewer.vue'
import NodeTag from '~/components/basic/NodeTag.vue'

import { useToggleExpanded } from '~/composables/toggle-expanded'
import { useSelect } from '~/composables/select'

withDefaults(defineProps<{
  data: ComponentTreeNode[]
  depth: number
}>(), {
  depth: 0,
})
const selectedNodeId = defineModel()
const { expanded, toggleExpanded } = useToggleExpanded()
const { select: _select } = useSelect()

function select(id: string) {
  selectedNodeId.value = id
}
</script>

<template>
  <div
    v-for="(item, index) in data"
    :key="index"
    :class="{
      'min-w-max': depth === 0,
    }"
  >
    <div
      class="group flex cursor-pointer items-center rounded-1 hover:(bg-primary-300 dark:bg-gray-600)"
      :style=" { paddingLeft: `${15 * depth + 4}px` }"
      :class="{ 'bg-primary-600! active': selectedNodeId === item.id }"
      @click="select(item.id)"
    >
      <ToggleExpanded
        v-if="item?.children?.length"
        :value="expanded.includes(item.id)"
        class="[.active_&]:op20 group-hover:op20"
        @click.stop="toggleExpanded(item.id)"
      />
      <!-- placeholder -->
      <span v-else pl5 />
      <span font-state-field text-4>
        <span class="text-gray-400 dark:text-gray-600 group-hover:(text-white op50) [.active_&]:(op50 text-white!)">&lt;</span>
        <span group-hover:text-white class="ws-nowrap [.active_&]:(text-white)">{{ item.name }}</span>
        <span class="text-gray-400 dark:text-gray-600 group-hover:(text-white op50) [.active_&]:(op50 text-white!)">&gt;</span>
      </span>
      <NodeTag v-for="(_item, _index) in item.tags" :key="_index" :tag="_item" />
    </div>
    <div
      v-if="item?.children?.length && expanded.includes(item.id)"
    >
      <ComponentTreeViewer v-model="selectedNodeId" :data="item?.children" :depth="depth + 1" />
    </div>
  </div>
</template>
