<script setup lang="ts">
import { VueCheckbox, VueInput } from '@vue-devtools-next/ui'

// ['key', 'label']
const selectableItems = [
  ['node_modules'],
  ['virtual', 'virtual module'],
  ['lib', 'lib module'],
] as const
</script>

<template>
  <div navbar-base px4 flex="~ items-center gap-4">
    <div>
      <VueInput v-model="graphSearchText" placeholder="Search modules..." />
    </div>
    <div v-for="item in selectableItems" :key="item[0]" flex="~ gap-2 items-center">
      <VueCheckbox v-model="graphSettings[item[0]]" />
      <span :class="{ 'text-gray-200': !graphSettings[item[0]] }">Show {{ item[1] ?? item[0] }}</span>
    </div>
  </div>
</template>
