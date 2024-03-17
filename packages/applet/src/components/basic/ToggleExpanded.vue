<script setup lang="ts">
defineProps<{
  value: boolean
}>()
</script>

<template>
  <i
    class="i-radix-icons:triangle-right flex-none text-4 op-50 transition-base"
    :class="{
      'transform rotate-90': value,
    }"
  />
</template>
