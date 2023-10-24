<script setup lang="ts">
import { computed } from 'vue'
import { toHex } from '~/utils'

const props = defineProps<{
  data: {
    label: string
    id: string
    color: number
  }
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

const activeTextColor = computed(() => `#${toHex(props.data.color)}`)

const { isSelected, toggleSelected } = useSelect('timeline-layer', props.data.id, (id) => {
  emit('select', id)
})
</script>

<template>
  <div class="selectable-item" :style="isSelected ? { color: activeTextColor } : {}" @click="toggleSelected(data.id)">
    <span overflow-hidden text-ellipsis ws-nowrap>
      {{ data.label }}
    </span>
  </div>
</template>
