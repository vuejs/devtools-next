<script setup lang="ts">
import { ref } from 'vue'
import { showVueNotification } from '../src'
import Notification from '../src/components/Notification.vue'

const type = ref<'success' | 'info' | 'warning' | 'error'>('info')

function show() {
  showVueNotification({
    message: 'hello world',
    type: type.value,
    duration: 10000,
  })
}
</script>

<template>
  <Story>
    <HstButton @click="show">
      Show Message
    </HstButton>
    <template #controls>
      <HstSelect
        v-model="type"
        title="Type"
        :options="{
          warning: 'Warning',
          error: 'Error',
          info: 'Info',
          success: 'Success',
        }"
      />
    </template>
    <Notification />
  </Story>
</template>
