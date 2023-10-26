<script setup lang="ts">
import { computed } from 'vue'
import { toHex } from '~/utils'

const props = defineProps<{
  modelValue: string
  data: {
    label: string
    id: string
    color: number
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function select() {
  emit('update:modelValue', props.data.id)
}
const activeTextColor = computed(() => `#${toHex(props.data.color)}`)
</script>

<template>
  <div class="selectable-item" :style="modelValue === data.id ? { color: activeTextColor } : {}" @click="select">
    <span overflow-hidden text-ellipsis ws-nowrap>
      {{ data.label }}
    </span>
  </div>
</template>
