<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div>
    Foo Component {{ msg }}
  </div>
</template>
