<script setup lang="ts">
defineProps<{
  icon?: string
}>()
</script>

<template>
  <div class="$ui-base" :class="icon" />
</template>
