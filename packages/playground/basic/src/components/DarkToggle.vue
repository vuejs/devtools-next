<script setup lang="ts">
import { useDark } from '@vueuse/core'

const isDark = useDark()
</script>

<template>
  <button @click="isDark = !isDark">
    toggle dark mode
  </button>
  <div>isDark: {{ isDark }}</div>
</template>
