<script setup lang="ts">
import { ref } from 'vue'
import { showVueNotification } from '../src/composables/notification'

const type = ref<'success' | 'info' | 'warning' | 'error'>('info')
const placement = ref<'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'>('bottom-right')

function show() {
  showVueNotification({
    message: 'hello world',
    type: type.value,
    placement: placement.value,
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

      <HstSelect
        v-model="placement"
        title="Placement"
        :options="{
          'top-left': 'Top Left',
          'top-center': 'Top Center',
          'top-right': 'Top Right',
          'bottom-left': 'Bottom Left',
          'bottom-center': 'Bottom Center',
          'bottom-right': 'Bottom Right',
        }"
      />
    </template>
    <!-- <Notification /> -->
  </Story>
</template>
