<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { computed, ref } from 'vue'
import VueIcon from './Icon.vue'
import VueLoading from './LoadingIndicator.vue'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  variant?: 'normal' | 'accent' | 'flat'
  disabled?: boolean
  password?: boolean
  leftIcon?: string
  rightIcon?: string
  loading?: boolean
}>(), {
  placeholder: '',
  variant: 'normal',
  disabled: false,
  password: false,
  /**
   * loading will auto enable disabled
   */
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'keyTab': [e: KeyboardEvent]
}>()

const focused = ref(false)

const value = useVModel(props, 'modelValue', emit)

const noFocusAnimation = computed(() => props.variant === 'flat')

const disabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <div
    class="container" :class="{
      'border-none bg-transparent': variant === 'flat',
      'cursor-not-allowed opacity-50': disabled,
      'accent': variant === 'accent',
      'focused': focused,
    }"
    @click="focused = true"
  >
    <div v-if="leftIcon" class="icon">
      <VueIcon :icon="leftIcon" />
    </div>
    <input
      v-model="value"
      class="input" v-bind="$attrs" :type="props.password ? 'password' : 'text'"
      placeholder="placeholder" :disabled="disabled"
      @blur="focused = false"
    >
    <div v-if="loading" class="icon">
      <VueLoading />
    </div>
    <div v-else-if="rightIcon" class="icon">
      <VueIcon :icon="rightIcon" />
    </div>
    <!-- Focus animation -->
    <div
      v-if="!noFocusAnimation" class="animation"
    />
  </div>
</template>

<style lang="scss" scoped>
.container {
  @apply relative w-auto min-w-200px overflow-hidden b-1 border-primary-100
         flex justify-between items-center gap-2px py-5px px12px color-gray-800 dark:color-gray-100;
  .input {
    @apply $ui-base w-full outline-none rounded-sm bg-white color-inherit
        placeholder-color-gray-500 dark:placeholder-gray-300;
  }
  .icon {
    @apply transition-colors $ui-fcc color-gray-500 dark:color-gray-300;
  }
  .animation {
    @apply absolute z-9999 bottom--1px bg-primary-500
           h-3px pointer-events-none transition-all duration-240
           left-50% right-50% opacity-0;
  }
  &.accent {
    &.focused {
      .icon {
        @apply color-accent-500;
      }
    }
    .animation {
      @apply bg-accent-500;
    }
  }
  &.focused {
    .icon {
      @apply color-primary-500;
    }
    .animation {
      @apply left-0 right-0 opacity-100;
    }
  }
}
</style>
