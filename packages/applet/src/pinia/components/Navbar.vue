<script setup lang="ts">
import { useVirtualRoute, useVirtualRouter } from '~/composables/virtual-router'

const { routes } = useVirtualRoute()
const router = useVirtualRouter()
</script>

<template>
  <ul class="flex gap3">
    <li
      v-for="(item, index) in routes"
      :key="index"
      cursor-pointer op70 hover:op100
      @click="router.push(item.path)"
    >
      <i :class="item.icon" />
    </li>
  </ul>
</template>
