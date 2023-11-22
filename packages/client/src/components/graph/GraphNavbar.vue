<script setup lang="ts">
import { VueCheckbox } from '@vue-devtools-next/ui'

const settings = graphSettings
</script>

<template>
  <div navbar-base px4 flex="~ items-center">
    <div flex="~ gap-2 items-center">
      <VueCheckbox v-model="settings.node_modules" />
      <span :class="{ 'text-gray-200': !settings.node_modules }">Show node_modules</span>
    </div>
  </div>
</template>
