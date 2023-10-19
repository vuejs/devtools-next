<script setup lang="ts">
const props = defineProps<{
  data: {
    label: string
    id: string
  }
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()
const { isSelected, toggleSelected } = useSelect('pinia-store-tree', props.data.id, (id) => {
  emit('select', id)
})
</script>

<template>
  <div class="selectable-item" :class="{ active: isSelected }" @click="toggleSelected(data.id)">
    <span>
      {{ data.label }}
    </span>
  </div>
</template>
