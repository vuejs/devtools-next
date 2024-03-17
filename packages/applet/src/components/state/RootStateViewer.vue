<script setup lang="ts">
import { watchEffect } from 'vue'
import type { InspectorState } from '@vue/devtools-kit'
import ChildStateViewer from './ChildStateViewer.vue'
import ToggleExpanded from '~/components/basic/ToggleExpanded.vue'
import { useToggleExpanded } from '~/composables/toggle-expanded'
import { createStateEditorContext } from '~/composables/state-editor'

const props = withDefaults(defineProps<{
  data: Record<string, InspectorState[]>
  nodeId: string
  inspectorId: string
  disableEdit?: boolean
}>(), {
  disableEdit: false,
})

function initEditorContext() {
  return {
    nodeId: props.nodeId,
    inspectorId: props.inspectorId,
    disableEdit: props.disableEdit,
  }
}

const { context } = createStateEditorContext(initEditorContext())
watchEffect(() => {
  context.value = initEditorContext()
})

const { expanded, toggleExpanded } = useToggleExpanded()

watchEffect(() => {
  // Expand the root level by default
  Object.keys(props.data).forEach((_, index) => {
    if (!expanded.value.includes(`${index}`))
      toggleExpanded(`${index}`)
  })
})
</script>

<template>
  <div>
    <div
      v-for="(item, key, index) in data"
      :key="index"
    >
      <div
        class="flex items-center"
        :class="[item?.length && 'cursor-pointer hover:(bg-active)']"
        @click="toggleExpanded(`${index}`)"
      >
        <ToggleExpanded
          v-if="item?.length"
          :value="expanded.includes(`${index}`)"
        />
        <!-- placeholder -->
        <span v-else pl5 />
        <span font-state-field text-4>
          {{ key }}
        </span>
      </div>
      <div
        v-if="item?.length && expanded.includes(`${index}`)"
      >
        <ChildStateViewer :data="item" :index="`${index}`" />
      </div>
    </div>
  </div>
</template>
