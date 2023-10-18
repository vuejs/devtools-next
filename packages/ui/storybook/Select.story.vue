<script setup lang="ts">
import { ref } from 'vue'
import Select from '../src/components/Select.vue'

const options = [
  {
    label: 'Option 1',
    value: 'option1',
  },
  {
    label: 'Option 2',
    value: 'option2',
  },
  {
    label: 'option 3',
    value: 'option3',
  },
  {
    label: 'option 4',
    value: 'option4',
  },
]

const current = ref(options[0].value)
const disabled = ref(false)
</script>

<template>
  <Story>
    <template #controls>
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>
    <Variant title="select">
      <Select v-model="current" :options="options" :disabled="disabled" />
      Value: {{ current }}
    </Variant>
    <Variant title="custom placeholder">
      <Select v-model="current" :options="options" placeholder="Select a option to apply" :disabled="disabled" />
    </Variant>
    <Variant title="auto-close set false">
      <Select v-model="current" :options="options" :auto-close="false" :disabled="disabled" />
    </Variant>
  </Story>
</template>
