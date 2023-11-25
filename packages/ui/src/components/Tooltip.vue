<script setup lang="ts">
import type { Placement } from 'floating-vue'
import { Tooltip } from 'floating-vue'

defineProps<{
  placement?: Placement
  disabled?: boolean
}>()
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
