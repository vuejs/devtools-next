<script setup lang="ts">
// eslint-disable-next-line ts/consistent-type-imports
import type { InspectorNodeTag } from 'vue-devtools-kit'

const props = defineProps<{
  data: {
    label: string
    id: string
    tags: InspectorNodeTag[]
  }
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()
const { isSelected, toggleSelected } = useSelect('inspector-tree', props.data.id, (id) => {
  emit('select', id)
})
</script>

<template>
  <div class="selectable-item" :class="{ active: isSelected }" @click="toggleSelected(data.id)">
    <span>
      {{ data.label }}
    </span>
    <InspectorNodeTag v-for="(item, index) in data.tags" :key="index" :tag="item" />
  </div>
</template>
