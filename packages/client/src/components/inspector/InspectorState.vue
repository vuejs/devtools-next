<script setup lang="ts">
import type { InspectorState } from '@vue/devtools-kit'

const props = withDefaults(defineProps<{
  data: InspectorState[]
  name: string
  id: string
  // mutate related, nodeId and inspectorId are required if disableMutate is false(by default)
  nodeId: string
  inspectorId: string
  disableEdit?: boolean
}>(), {
  disableEdit: false,
})

const { isExpanded, toggleCollapse } = useCollapse('inspector-state', props.id)
// expand the root node by default
!isExpanded.value && toggleCollapse()

createStateEditorContext({
  nodeId: props.nodeId!,
  inspectorId: props.inspectorId!,
  disableEdit: props.disableEdit,
})
</script>

<template>
  <div class="group w-full px-0 selectable-item" @click="toggleCollapse">
    <ExpandIcon :value="isExpanded" group-hover:text-white />
    <span text-primary-400 group-hover:text-white class="text-[#486887] dark:(text-[#7595b5])">
      {{ name }}
    </span>
  </div>
  <InspectorStateType v-if="isExpanded" :data="data" :root-id="id" />
</template>
