<script setup lang="ts">
import { VueButton } from '../src'
import VueTooltip from '../src/components/Tooltip.vue'
</script>

<template>
  <Story>
    <div class="flex">
      <VueTooltip>
        <VueButton>Hover me</VueButton>
        <template #popper>
          <div class="p-4">
            Tooltip content
          </div>
        </template>
      </VueTooltip>
    </div>
  </Story>
</template>
