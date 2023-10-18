<script setup lang="ts">
import { ref } from 'vue'
import FormField from '../src/components/FormField.vue'

const value = ref('')
const showMessage = ref(true)
</script>

<template>
  <Story>
    <template #controls>
      <HstCheckbox v-model="showMessage" title="ShowMessage" />
    </template>
    <Variant title="normal">
      <FormField
        v-model="value" placeholder="Input" :show-message="showMessage"
        message="Username should have at least 30 words words words words."
      />
    </Variant>
    <Variant title="warning">
      <FormField
        v-model="value" status="warning" placeholder="Input" :show-message="showMessage"
        message="Username should have at least 30 words words words words."
      />
    </Variant>
    <Variant title="danger">
      <FormField
        v-model="value" status="danger" placeholder="Input" :show-message="showMessage"
        message="Username should have at least 30 words words words words."
      />
    </Variant>
    <Variant title="success">
      <FormField
        v-model="value" status="success" placeholder="Input" :show-message="showMessage"
        message="Username should have at least 30 words words words words."
      />
    </Variant>
  </Story>
</template>
