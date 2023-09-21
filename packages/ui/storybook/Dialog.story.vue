<script setup lang="ts">
import { ref } from 'vue'
import Dialog from '../src/components/Dialog.vue'

const modalShow = ref(false)
</script>

<template>
  <Story>
    <HstButton @click="modalShow = true">
      Show Dialog
    </HstButton>
    <Dialog v-model="modalShow">
      <div class="w-100px h-100px bg-red" />
    </Dialog>
  </Story>
</template>
