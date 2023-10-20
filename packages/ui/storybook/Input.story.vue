<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { logEvent } from 'histoire/client'
import Input from '../src/components/Input.vue'

const value = ref('')

const disable = ref(false)
const loading = ref(false)

watchEffect(() => {
  if (value.value === 'aaa') {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      value.value = ''
    }, 1000)
  }
})
</script>

<template>
  <Story>
    <template #controls>
      <HstCheckbox v-model="disable" title="Disable" />
      <HstCheckbox v-model="loading" title="Loading" />
    </template>
    <Variant title="normal">
      <Input
        v-model="value" :loading="loading"
        :disabled="disable" placeholder="Input" @key-tab="($event) => {
          logEvent('key-tab', $event)
        }"
      />

      <div class="mt-20px">
        VModel: {{ value }}
      </div>
    </Variant>
    <Variant title="accent">
      <Input v-model="value" :loading="loading" :disabled="disable" placeholder="Accent Input" variant="accent" />
    </Variant>
    <Variant title="flat">
      <Input v-model="value" :loading="loading" :disabled="disable" placeholder="Flat Input" variant="flat" />
    </Variant>
    <Variant title="password">
      <Input v-model="value" :loading="loading" :disabled="disable" placeholder="Flat Input" password />
    </Variant>
    <Variant title="icon">
      <Input
        v-model="value" :loading="loading" :disabled="disable" placeholder="Flat Input" variant="accent"
        left-icon="i-carbon-search" right-icon="i-carbon-password"
      />
    </Variant>
  </Story>
</template>
