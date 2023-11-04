<script setup lang="ts">
// eslint-disable-next-line ts/consistent-type-imports
import type { InspectorNodeTag } from 'vue-devtools-kit'

const props = defineProps<{
  modelValue: string
  data: {
    label: string
    id: string
    tags?: InspectorNodeTag[]
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function select() {
  emit('update:modelValue', props.data.id)
}
</script>

<template>
  <div class="selectable-item" :class="{ active: modelValue === data.id }" @click="select">
    <span>
      {{ data.label }}
    </span>
    <InspectorNodeTag v-for="(item, index) in data.tags" :key="index" :tag="item" />
  </div>
</template>
