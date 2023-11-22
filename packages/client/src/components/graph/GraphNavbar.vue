<script setup lang="ts">
import { VueCheckbox } from '@vue-devtools-next/ui'

const settings = graphSettings

// ['key', 'label']
const selectableItems = [
  ['node_modules'],
  ['virtual', 'virtual module'],
  ['lib', 'lib module'],
] as const
</script>

<template>
  <div navbar-base px4 flex="~ items-center gap-4">
    <div v-for="item in selectableItems" :key="item[0]" flex="~ gap-2 items-center">
      <VueCheckbox v-model="settings[item[0]]" />
      <span :class="{ 'text-gray-200': !settings[item[0]] }">Show {{ item[1] ?? item[0] }}</span>
    </div>
  </div>
</template>
