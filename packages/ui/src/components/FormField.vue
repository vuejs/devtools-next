<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { computed, ref } from 'vue'
import VueInput from './Input.vue'
import VueIcon from './Icon.vue'

const props = withDefaults(defineProps<{
  modelValue: string
  status?: 'normal' | 'danger' | 'success' | 'warning'
  showMessage?: boolean
  message?: string
  placeholder?: string
}>(), {
  message: '',
  showMessage: true,
  status: 'normal',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const value = useVModel(props, 'modelValue', emit)

const focused = ref(false)

const shouldRenderMessage = computed(() => props.message && props.message.length && props.showMessage)

const statusMapping = {
  normal: 'color-gray-600 dark:color-gray-400',
  warning: 'color-warning-500 dark:color-warning-200',
  danger: 'color-danger-500 dark:color-danger-200',
  success: 'color-primary-700 dark:color-primary-500',
}

const iconMapping = {
  warning: 'i-bx:bxs-error',
  danger: 'i-ic-round-error',
  success: 'i-ep:success-filled',
}
</script>

<template>
  <div :class="{ status, focused }" class="container">
    <VueInput v-model="value" v-model:focused="focused" :placeholder="placeholder" @update-focused="f => focused = f" />
    <div
      class="message" :class="[
        shouldRenderMessage ? 'opacity-100' : 'opacity-0!',
        statusMapping[status],
      ]"
    >
      <VueIcon v-if="status !== 'normal'" inline :icon="iconMapping[status]" />
      {{ shouldRenderMessage ? message : '' }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  @apply $ui-base;
  .message {
    @apply $ui-base text-14px transition-opacity mt2;
  }
  &:not(.focused) {
    .message {
      @apply opacity-65;
    }
  }
}
</style>
