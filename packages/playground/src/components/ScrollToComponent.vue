<script setup lang="ts">
import { ref } from 'vue'

const a = ref(1)
</script>

<template>
  <h1>{{ a }}</h1>
  <p class="stc">
    Scroll to Component
  </p>
  <div>Scroll</div>
</template>

<style lang="scss" scoped>
.stc {
  text-align: center;
  margin: 0 auto;
  width: 800px;
  height: 150px;
  line-height: 150px;
  margin-top: 1000px;
}
</style>
