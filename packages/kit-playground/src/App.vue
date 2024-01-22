<script setup lang="ts">
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <div>
    Hello World {{ count }}
    <button @click="count++">
      Add
    </button>
  </div>
</template>
