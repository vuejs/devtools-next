<script setup lang="ts">
import ChildStateViewer from './ChildStateViewer.vue'
import ToggleExpanded from '~/components/basic/ToggleExpanded.vue'
import { useToggleExpanded } from '~/composables/toggle-expanded'
import { createStateEditorContext } from '~/composables/state-editor'

const props = defineProps<{
  data: Record<string, any>
}>()

const { expanded, toggleExpanded } = useToggleExpanded()

toggleExpanded('0')
createStateEditorContext({
  nodeId: 'props.nodeId!',
  inspectorId: 'props.inspectorId!',
  disableEdit: false,
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
        <span op70>
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
