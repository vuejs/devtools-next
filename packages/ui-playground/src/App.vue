<script setup lang="ts">
import { VueButton, VueDarkToggle } from '@vue-devtools-next/ui'
import { useDark } from '@vueuse/core'

const dark = useDark()
</script>

<template>
  {{ dark }}
  <VueDarkToggle>
    <template #default="{ isDark, toggle }">
      <VueButton @click="toggle">
        {{ isDark }}
      </VueButton>
    </template>
  </VueDarkToggle>
</template>
