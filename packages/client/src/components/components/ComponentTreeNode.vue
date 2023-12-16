<script setup lang="ts">
import type { ComponentTreeNode } from '@vue-devtools-next/kit'

const props = withDefaults(defineProps<{
  data: ComponentTreeNode
  depth?: number
  linkedList?: string[]
}>(), {
  depth: 0,
  linkedList: () => [],
})

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'mouseenter', id: string, visible: boolean): void
  (e: 'mouseleave', id: string, visible: boolean): void
}>()

const { isExpanded, toggleCollapse } = useCollapse('component-tree', props.data.id, [...props.linkedList!, props.data.id])
const { isSelected, toggleSelected } = useSelectWithContext('component-tree', props.data.id, (id) => {
  emit('select', id)
})
</script>

<template>
  <div
    class="group selectable-item"
    :style="{ paddingLeft: `${depth * 15 + 4}px` }"
    :class="{ active: isSelected }"
    @click.stop="toggleSelected(data.id)"
    @mouseenter="emit('mouseenter', data.id, true)"
    @mouseleave="emit('mouseleave', data.id, false)"
  >
    <!-- expand-icon -->
    <ExpandIcon v-if="data.children?.length" :value="isExpanded" group-hover:text-white class="[.active_&]:text-white" @click.prevent.stop="toggleCollapse" />
    <i v-else inline-block h-6 w-6 />
    <!-- component name -->
    <span text-primary-400 group-hover:text-white class="[.active_&]:text-white">
      {{ data.name }}
    </span>
    <InspectorNodeTag v-for="(item, index) in data.tags" :key="index" :tag="item" />
  </div>
  <template v-if="data.children?.length && isExpanded">
    <ComponentTreeNode v-for="item in data.children" :key="item.id" :data="item" :depth="depth + 1" :linked-list="[...linkedList, data.id]" @select="(id) => emit('select', id)" @mouseenter="(id) => emit('mouseenter', id, true)" @mouseleave="(id) => emit('mouseleave', id, false)" />
  </template>
</template>
