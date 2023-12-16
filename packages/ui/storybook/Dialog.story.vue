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
        <div class="h-40px w-100px bg-red" />
      </Dialog>
    </Variant>
    <Variant title="inline">
      <div class="h300px w-full container">
        <HstButton @click="modalShowInline = true">
          Show Dialog
        </HstButton>
        <Dialog v-model="modalShowInline" mount-to=".container">
          <div class="h-40px w-100px bg-red" />
        </Dialog>
      </div>
    </Variant>
  </Story>
</template>
