<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  inline?: boolean
  action?: boolean
}>(), {
  action: false,
})
</script>

<template>
  <component :is="inline ? 'span' : 'div'" class="$ui-base" :class="[icon, action ? 'cursor-pointer hover:op50' : '']" />
</template>
