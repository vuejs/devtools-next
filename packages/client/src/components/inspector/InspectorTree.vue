<script setup lang="ts">
import type { InspectorNodeTag } from '@vue/devtools-kit'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

defineProps<{
  modelValue: string
  data: {
    label: string
    id: string
    tags?: InspectorNodeTag[]
  }[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function select(id: string) {
  emit('update:modelValue', id)
}
</script>

<template>
  <RecycleScroller
    v-slot="{ item }"
    :items="data"
    :min-item-size="32"
    key-field="id"
    page-mode
  >
    <div class="selectable-item" :class="{ active: modelValue === item.id }" @click="select(item.id)">
      <span class="selectable-item-label">
        {{ item.label }}
      </span>
      <InspectorNodeTag v-for="(childItem, index) in item.tags" :key="index" :tag="childItem" />
    </div>
  </RecycleScroller>
</template>
