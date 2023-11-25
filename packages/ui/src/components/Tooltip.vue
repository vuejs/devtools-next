<script setup lang="ts">
import { Tooltip } from 'floating-vue'
import type { FloatingVueCommonProps } from '../types'

defineProps<FloatingVueCommonProps>()
</script>

<template>
  <Tooltip
    :disabled="disabled"
    :placement="placement"
    v-bind="$attrs"
  >
    <slot />
    <template #popper>
      <slot name="popper" />
    </template>
  </Tooltip>
</template>
