<script setup lang="ts">
import { ref } from 'vue'
import Checkbox from '../src/components/Checkbox.vue'

const checked = ref(false)
</script>

<template>
  <Story>
    <Variant title="normal">
      <div>
        <span>value: {{ checked }}</span>
        <Checkbox v-model="checked" />
      </div>
    </Variant>
    <Variant title="accent">
      <div>
        value: {{ checked }} <Checkbox v-model="checked" variant="accent" />
      </div>
    </Variant>
  </Story>
</template>
