<script setup lang="ts">
import { reactive } from 'vue'
import { logEvent } from 'histoire/client'
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
    <Variant title="Normal Button">
      <Button :type="state.type" @click="logEvent('click event', $event)">
        Button
      </Button>
    </Variant>
    <Variant title="A Button">
      <Button href="https://vuejs.org" :type="state.type">
        A Button
      </Button>
    </Variant>
    <Variant title="RouterLink Button">
      <Button to="router-path" :type="state.type">
        RouterLink Button
      </Button>
    </Variant>
    <Variant title="Round Button">
      <Button round :type="state.type">
        Round Button
      </Button>
    </Variant>
    <Variant title="Loading Button">
      <Button loading :type="state.type">
        Loading Button
      </Button>
    </Variant>
    <Variant title="With Icon">
      <Button :type="state.type">
        <template #icon>
          <div class="i-carbon-moon" />
        </template>
        Icon Button
      </Button>
    </Variant>
  </Story>
</template>

<docs lang="md">
### Button Note

`loading` and `icon` slot are mutually exclusive, only render one of them at a time.
</docs>
