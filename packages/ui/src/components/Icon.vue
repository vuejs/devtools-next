<script setup lang="ts">
defineProps<{
  icon?: string
  inline?: boolean
}>()
</script>

<template>
  <component :is="inline ? 'span' : 'div'" class="$ui-base" :class="icon" />
</template>
