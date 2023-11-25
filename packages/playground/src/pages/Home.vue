<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <div class="container">
    Home
    <!-- <Foo v-if="visible" />
    <button @click="visible = !visible">
      Toggle
    </button> -->
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
