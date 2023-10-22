<script setup lang="ts">
const props = withDefaults(defineProps<{
  data: {
    name: string
    id: string
    tags: {
      label: string
      textColor: number
      backgroundColor: number
      tooltip: string
    }[]
    children?: {
      name: string
      id: string
      tags: {
        label: string
        textColor: number
        backgroundColor: number
        tooltip: string
      }[]
    }[]
  }
  depth?: number
}>(), {
  depth: 0,
})

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()
const { isExpanded, toggleCollapse } = useCollapse('component-tree', props.data.id)
const { isSelected, toggleSelected } = useSelect('component-tree', props.data.id, (id) => {
  emit('select', id)
})
</script>

<template>
  <div
    class="selectable-item group"
    :style="{ paddingLeft: `${depth * 15 + 4}px` }"
    :class="{ active: isSelected }"
    @click.stop="toggleSelected(data.id)"
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
    <ComponentTreeNode v-for="(item, index) in data.children" :key="index" :data="item" :depth="depth + 1" @select="(id) => emit('select', id)" />
  </template>
</template>
