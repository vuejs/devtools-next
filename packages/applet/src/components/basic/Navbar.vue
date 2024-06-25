<script setup lang="ts">
import { useVirtualRoute, useVirtualRouter } from '~/composables/virtual-router'

const { routes, currentRoute } = useVirtualRoute()
const router = useVirtualRouter()
</script>

<template>
  <ul class="flex gap3">
    <li
      v-for="(item, index) in routes"
      :key="index"
      class="h-10 flex cursor-pointer items-center justify-center border-b-[2px] border-solid text-size-sm leading-none hover:op100"
      :class="currentRoute.path === item.path ? 'op-100 font-medium text-primary-400 border-primary-400' : 'border-transparent op-70'"
      @click="router.push(item.path)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>
