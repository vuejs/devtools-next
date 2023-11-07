<script setup lang="ts">
import { reactive, ref } from 'vue'

const booleanValue = ref(true)
const numericValue = ref(0)

const reactiveValue = reactive({
  a: 1,
})

const stringValue = ref('abc')
</script>

<template>
  <div>
    <h3>Edit State</h3>
    <ul>
      <li>boolean value: {{ booleanValue }}</li>
      <li>numeric value: {{ numericValue }}</li>
      <li>reactive value: {{ JSON.stringify(reactiveValue) }}</li>
      <li>string value: {{ stringValue }}</li>
    </ul>
  </div>
</template>
