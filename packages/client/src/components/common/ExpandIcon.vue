<script setup lang="ts">
defineProps<{
  value: boolean
}>()
</script>

<template>
  <i
    class="i-radix-icons:triangle-right text-5 op-50 transition-base flex-none"
    :class="{
      'transform rotate-90': value,
    }"
  />
</template>
