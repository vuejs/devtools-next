<script setup lang="ts">
import { ref } from 'vue'
import Foo from '../components/Foo.vue'

const visible = ref(false)
</script>

<template>
  <div>
    Home
    <Foo v-if="visible" />
    <button @click="visible = !visible">
      Toggle
    </button>
  </div>
</template>
