<script setup lang="ts">
import { ref } from 'vue'
import Switch from '../src/components/Switch.vue'

const value = ref(false)
</script>

<template>
  <Story>
    <Variant title="switch">
      <Switch v-model="value" />
    </Variant>
    <Variant title="label">
      <Switch v-model="value">
        Select
      </Switch>
    </Variant>
  </Story>
</template>
