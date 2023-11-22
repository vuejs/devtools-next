<script setup lang="ts">
import { ref } from 'vue'
import Dialog from '../src/components/Dialog.vue'

const modalShow = ref(false)

const modalShowInline = ref(false)
</script>

<template>
  <Story>
    <Variant title="default">
      <HstButton @click="modalShow = true">
        Show Dialog
      </HstButton>
      <Dialog v-model="modalShow">
        <div class="w-100px h-40px bg-red" />
      </Dialog>
    </Variant>
    <Variant title="inline">
      <div class="container w-full h300px">
        <HstButton @click="modalShowInline = true">
          Show Dialog
        </HstButton>
        <Dialog v-model="modalShowInline" mount-to=".container">
          <div class="w-100px h-40px bg-red" />
        </Dialog>
      </div>
    </Variant>
  </Story>
</template>
