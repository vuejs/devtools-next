<script setup lang="ts">
import { ref } from 'vue'

const booleanValue = ref(true)
const numericValue = ref(0)
</script>

<template>
  <div>
    <h3>Edit State</h3>
    <ul>
      <li>boolean value: {{ booleanValue }}</li>
      <li>numeric value: {{ numericValue }}</li>
    </ul>
  </div>
</template>
