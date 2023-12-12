<script setup lang="ts" generic="K extends number | string, V">
import { computed } from 'vue'
import { VClosePopper as vClosePopper } from 'floating-vue'
import VueDropdown from './Dropdown.vue'
import VueButton from './Button.vue'
import type { ButtonProps } from './Button.vue'

const props = withDefaults(defineProps<{
  modelValue: K
  options: { label: V, value: K }[]
  placeholder?: string
  autoClose?: boolean
  disabled?: boolean
  buttonProps?: ButtonProps
}>(), {
  placeholder: 'Select...',
  autoClose: true,
  disabled: false,
  buttonClass: '',
  buttonProps: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [value: K]
}>()

const value = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})
</script>

<template>
  <VueDropdown
    :label="placeholder"
    v-bind="{
      buttonProps,
      disabled,
    }"
  >
    <template #popper>
      <div class="m1 flex flex-col min-w-140px w-auto">
        <VueButton
          v-for="item in options" :key="item.value" v-close-popper="props.autoClose" :disabled="disabled" round="normal"
          class="flex-[auto_1_1] not-action:[&:not(.active)]:bg-transparent!"
          :class="{
            active: item.value === value,
          }"
          @click="() => {
            value = item.value
          }"
        >
          {{ item.label }}
        </VueButton>
      </div>
    </template>
    <template #button-icon-right>
      <div class="i-mdi-chevron-down" />
    </template>
  </VueDropdown>
</template>
