<script setup lang="ts">
import { reactive } from 'vue'
import type { ButtonType } from '../src/components/Button.vue'
import Button from '../src/components/Button.vue'

const state = reactive<{
  type: ButtonType
}>({
  type: 'default',
})
</script>

<template>
  <Story>
    <Variant title="Normal Button">
      <Button :type="state.type">
        Button
      </Button>
      <template #controls>
        <HstSelect
          v-model="state.type"
          title="Type"
          :options="{
            default: 'Default',
            primary: 'Primary',
            accent: 'Accent',
            danger: 'Danger',
            warning: 'Warning',
            info: 'Info',
            success: 'Success',
          }"
        />
      </template>
    </Variant>
    <Variant title="A Button">
      <Button href="https://google.com">
        A Button
      </Button>
    </Variant>
    <Variant title="RouterLink Button">
      <Button to="router-path">
        A Button
      </Button>
    </Variant>
  </Story>
</template>
