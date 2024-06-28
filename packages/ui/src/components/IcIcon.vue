<script setup lang="ts">
import { computed } from 'vue'
import { icIcons } from '../constants/ic-icons'

/**
 * Use font-size and color to style the icon
 */

const props = defineProps<{
  name: string
}>()

const IconPath = computed(() => icIcons[props.name] ?? '')
</script>

<template>
  <div>
    <svg
      class="custom-svg h-1em w-1em"
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      v-html="IconPath"
    />
  </div>
</template>
