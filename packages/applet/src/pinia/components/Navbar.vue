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
      cursor-pointer hover:op100
      :style="{
        opacity: currentRoute.path === item.path ? 1 : 0.7,
      }"
      @click="router.push(item.path)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>
