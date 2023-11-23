<script setup lang="ts">
import { VueCheckbox, VueInput } from '@vue-devtools-next/ui'

const text = graphSearchText
const settings = graphSettings

// ['key', 'label']
const selectableItems = [
  ['node_modules'],
  ['virtual', 'virtual module'],
  ['lib', 'lib module'],
] as const
</script>

<template>
  <div navbar-base glass-effect px4 flex="~ items-center gap-4" absolute top-0 left-0 w-full z-10>
    <div>
      <VueInput v-model="text" placeholder="Search modules..." />
    </div>
    <div v-for="item in selectableItems" :key="item[0]" flex="~ gap-2 items-center">
      <VueCheckbox v-model="settings[item[0]]" />
      <span :class="{ 'text-gray-400 dark:text-gray-600': !settings[item[0]] }">Show {{ item[1] ?? item[0] }}</span>
    </div>
  </div>
</template>
