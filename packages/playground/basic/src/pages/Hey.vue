<script setup lang="ts">
import { useCounterStore } from '../stores'

const route = useRoute()
const counterStore = useCounterStore()
</script>

<template>
  <div class="container">
    <img src="/vite.svg" alt="Vite Logo">
    Hey: {{ route.params.id }}
    Counter: {{ counterStore.count }}
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 250px;
  height: 150px;
  background: #363636;
  border-radius: 4px;
}
</style>
