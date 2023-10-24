<script setup lang="ts">
const isSelected = ref(false)
</script>

<template>
  <ul>
    <li
      class="flex items-center px-2 py-2 dark:border-bluegray-800 text-gray-200 border-b cursor-pointer"
      :class="{
        'hover:bg-blue-100 dark:hover:bg-blue-900 text-bluegray-800 dark:text-bluegray-200': !isSelected,
        'bg-primary-500 text-white': isSelected,
      }"
    >
      <span class="flex-1 font-mono truncate space-x-1">
        <span
          class="font-medium"
          :class="{
            'text-purple-600 dark:text-purple-400': !isSelected,
          }"
        >
          <span>increase</span>
        </span>
        <span class="op-75">
          start
        </span>
      </span>
      <span class="flex-none text-xs font-mono op-50">
        18:00
      </span>
    </li>
  </ul>
</template>
