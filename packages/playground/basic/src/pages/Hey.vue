<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="container">
    Hey: {{ route.params.id }}
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
