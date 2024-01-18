<script setup lang="ts">
import { ref } from 'vue'

const arr = ref(Array.from({ length: 10000 }).fill(0).map((_, i) => i))
const object = ref(Object.fromEntries(arr.value.map(i => [i, i])))
const map = ref(new Map(arr.value.map(i => [i, i])))
const set = ref(new Set(arr.value))
</script>

<template>
  <h1>Large Data Test</h1>
  <div>
    <p>Array Length: {{ arr.length }}</p>
    <p>Object Length: {{ Object.keys(object).length }}</p>
    <p>Map Size: {{ map.size }}</p>
    <p>Set Size: {{ set.size }}</p>
  </div>
</template>
