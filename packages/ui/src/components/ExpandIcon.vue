<script setup lang="ts">
defineProps<{
  value: boolean
}>()
</script>

<template>
  <VDIcon
    class="material-symbols:arrow-right" text-5 op-50 n-transition
    :class="{
      'transform rotate-90': value,
    }"
  />
</template>
