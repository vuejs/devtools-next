<script setup lang="ts">
import type { InspectorState } from 'vue-devtools-kit'

const props = defineProps<{
  data: InspectorState[]
  name: string
  id: string
  nodeId: string
  inspectorId: string
}>()

const { isExpanded, toggleCollapse } = useCollapse('inspector-state', props.id)
// expand the root node by default
!isExpanded.value && toggleCollapse()

createStateEditorContext({
  nodeId: props.nodeId,
  inspectorId: props.inspectorId,
})
</script>

<template>
  <div class="selectable-item group w-full px-0" @click="toggleCollapse">
    <ExpandIcon :value="isExpanded" group-hover:text-white />
    <span text-primary-400 group-hover:text-white class="text-[#486887] dark:(text-[#7595b5])">
      {{ name }}
    </span>
  </div>
  <InspectorStateType v-if="isExpanded" :data="data" />
</template>
