<script setup lang="ts">
import { computed } from 'vue'
import { icIcons } from '../constants/ic-icons'

const props = defineProps<{
  name: string
  size?: number
  color?: string
  class?: string
}>()
const IconPath = computed(() => icIcons[props.name] ?? '')
const styles = computed(() => ({
  ...(props.size && {
    width: `${props.size}px`,
    height: `${props.size}px`,
  }),
  ...(props.color && {
    color: props.color,
  }),
}))
</script>

<template>
  <div>
    <svg class="custom-svg h-1em w-1em" :class="props.class" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :style="styles" v-html="IconPath" />
  </div>
</template>
