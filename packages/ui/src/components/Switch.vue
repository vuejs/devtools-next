<script setup lang="ts">
import { useToggle, useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const value = useVModel(props, 'modelValue', emit)
const toggleValue = useToggle(value)
</script>

<template>
  <div
    :class="[
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    ]"
    class="vertical-mid select-none text-14px $ui-base cursor-pointer $ui-if-sc gap5px" role="checkbox" @click="!disabled && toggleValue()"
  >
    <slot />
    <div
      :class="{
        selected: value,
      }"
      class="$ui-base w32px h16px rounded-8px transition-colors
            relative bg-primary-100 dark:bg-gray-700 group
            [&.selected]:bg-primary-500!
      "
    >
      <div
        class="w16px h16px rounded-full transition-transform
              group-[&.selected]:transform-translate-x-16px
             bg-primary-800 dark:bg-white
        "
        :class="[
          { 'group-hover:opacity-75 group-active:scale-85': !disabled },
          { 'opacity-65': disabled },
        ]"
      />
    </div>
  </div>
</template>
