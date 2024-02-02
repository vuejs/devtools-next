<script setup lang="ts">
import { ref } from 'vue'
import Name from './components/Name.vue'

const count = ref(0)
const visible = ref(true)
</script>

<template>
  <div>
    Hi {{ count }}

    <Name v-if="visible" />
  </div>
</template>
