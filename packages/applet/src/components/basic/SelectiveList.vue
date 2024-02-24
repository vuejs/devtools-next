<script setup lang="ts">
import { defineModel } from 'vue'

defineProps<{ data: { id: string, name: string }[] }>()

const selected = defineModel()

function select(id: string) {
  selected.value = id
}
</script>

<template>
  <ul class="p2">
    <li
      v-for="item in data" :key="item.id"
      class="selectable-item"
      :class="{ active: item.id === selected }"
      @click="select(item.id)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>
