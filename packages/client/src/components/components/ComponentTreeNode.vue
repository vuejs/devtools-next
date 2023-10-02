<script setup lang="ts">
const props = withDefaults(defineProps<{
  data: {
    name: string
    id: string
    children?: {
      name: string
      id: string
    }[]
  }
  depth?: number
}>(), {
  depth: 0,
})

const { isExpanded, toggleExpanded } = useToggleComponentExpanded(props.data.id)
const { selectedComponent, selectComponent } = useSelectComponent()

function select() {
  selectComponent(props.data.id)
}
</script>

<template>
  <div
    class="selectable-item group"
    :style="{ paddingLeft: `${depth * 15 + 4}px` }"
    :class="{ active: selectedComponent === data.id }"
    @click="select"
  >
    <!-- expand-icon -->
    <ExpandIcon v-if="data.children" :value="isExpanded" group-hover:text-white class="[.active_&]:text-white" @click.prevent.stop="toggleExpanded" />
    <i v-else inline-block h-6 w-6 />
    <!-- component name -->
    <span text-primary-400 group-hover:text-white class="[.active_&]:text-white">
      {{ data.name }}
    </span>
  </div>
  <template v-if="data.children && isExpanded">
    <ComponentTreeNode v-for="(item, index) in data.children" :key="index" :data="item" :depth="depth + 1" />
  </template>
</template>
