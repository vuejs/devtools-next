<script setup lang="ts">
const props = defineProps<{
  data: {
    label: string
    id: string
    tags: {
      label: string
      textColor: number
      backgroundColor: number
      tooltip: string
    }[]
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
    <span
      v-for="(tag, index) of data.tags"
      :key="index"
      v-tooltip="{
        content: tag.tooltip,
        html: true,
      }"
      :style="{
        color: `#${tag.textColor.toString(16).padStart(6, '0')}`,
        backgroundColor: `#${tag.backgroundColor.toString(16).padStart(6, '0')}`,
      }"
      class="text-[0.75rem] px-1 rounded-sm ml-2 leading-snug"
    >
      {{ tag.label }}
    </span>
  </div>
</template>
