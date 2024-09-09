<script setup lang="ts">
import type { ComponentTreeNode, InspectorTree } from '@vue/devtools-kit'
import NodeTag from '~/components/basic/NodeTag.vue'
import ToggleExpanded from '~/components/basic/ToggleExpanded.vue'
import ComponentTreeViewer from '~/components/tree/TreeViewer.vue'

import { useSelect } from '~/composables/select'
import { useToggleExpanded } from '~/composables/toggle-expanded'

withDefaults(defineProps<{
  data: ComponentTreeNode[] | InspectorTree[]
  depth: number
  withTag: boolean
}>(), {
  depth: 0,
  withTag: false,
})
const selectedNodeId = defineModel()
const { expanded, toggleExpanded } = useToggleExpanded()
const { select: _select } = useSelect()

function normalizeLabel(item: ComponentTreeNode | InspectorTree) {
  return ('name' in item && item?.name) || ('label' in item && item.label)
}

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
      @dblclick="toggleExpanded(item.id)"
    >
      <ToggleExpanded
        v-if="item?.children?.length"
        :value="expanded.includes(item.id)"
        class="[.active_&]:op20 group-hover:op20"
        @click.stop="toggleExpanded(item.id)"
      />
      <!-- placeholder -->
      <span v-else pl5 />
      <span font-state-field text-3.5>
        <span v-if="withTag" class="text-gray-400 dark:text-gray-600 group-hover:(text-white op50) [.active_&]:(op50 text-white!)">&lt;</span>
        <span group-hover:text-white class="ws-nowrap [.active_&]:(text-white)">{{ normalizeLabel(item) }}</span>
        <span v-if="withTag" class="text-gray-400 dark:text-gray-600 group-hover:(text-white op50) [.active_&]:(op50 text-white!)">&gt;</span>
      </span>
      <NodeTag v-for="(_item, _index) in item.tags" :key="_index" :tag="_item" />
    </div>
    <div
      v-if="item?.children?.length && expanded.includes(item.id)"
    >
      <ComponentTreeViewer v-model="selectedNodeId" :data="item?.children" :depth="depth + 1" :with-tag="withTag" />
    </div>
  </div>
</template>
