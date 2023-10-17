<script setup lang="ts">
import { ref } from 'vue'
import Confirm from '../src/components/Confirm.vue'

const modalShow = ref(false)

const asyncClose = ref(false)

const loading = ref(false)

function confirm() {
  if (asyncClose.value) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      modalShow.value = false
    }, 3000)
  }
}
</script>

<template>
  <Story>
    <template #controls>
      <HstCheckbox v-model="asyncClose" title="Async Close" />
    </template>
    <HstButton @click="modalShow = true">
      Show Confirm
    </HstButton>
    <Confirm
      v-model="modalShow" :auto-close="!asyncClose" :loading="loading" content="Are you sure?" @confirm="confirm"
    />
  </Story>
</template>
