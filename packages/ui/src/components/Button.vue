<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import LoadingIndicator from './LoadingIndicator.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  round: 'normal',
  loading: false,
  disabled: false,
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

export interface ButtonProps {
  type?: ButtonType
  round?: 'full' | 'normal' | false
  loading?: boolean
  disabled?: boolean
}

export type ButtonType = 'default' | 'primary' | 'accent' | 'danger' | 'warning' | 'info' | 'success'

const attrs = useAttrs()

const component = computed(() => {
  if (attrs.to)
    return 'router-link'
  else if (attrs.href)
    return 'a'
  return 'button'
})

const disabled = computed(() => props.loading || props.disabled)

function handleClick(e: MouseEvent) {
  if (disabled.value) {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    return
  }
  emit('click', e)
}

const styles = {
  default: `
  bg-primary-100 text-black hover:bg-primary-100-lighter active:bg-primary-100-darker
    dark:(bg-gray-800 hover:bg-gray-800-lighter active:bg-gray-800-darker text-white)
  `,
  primary: 'bg-primary-500 text-white hover:bg-primary-500-lighter active:bg-primary-500-darker',
  accent: 'bg-accent-500 text-white dark:bg-accent-300 hover:bg-accent-500-lighter active:bg-accent-500-darker',
  danger: 'bg-danger-500 text-white hover:bg-danger-500-lighter active:bg-danger-500-darker',
  warning: 'bg-warning-500 text-white hover:bg-warning-500-lighter active:bg-warning-500-darker',
  info: `
  bg-primary-100 text-info-500 hover:bg-primary-100-lighter active:bg-primary-100-darker
    dark:(bg-gray-800 hover:bg-gray-800-lighter active:bg-gray-800-darker)
  `,
  success: `
  bg-primary-100 text-primary-500 hover:bg-primary-100-lighter active:bg-primary-100-darker
    dark:(bg-gray-800 hover:bg-gray-800-lighter active:bg-gray-800-darker)
  `,
} satisfies Record<ButtonType, string>
</script>

<template>
  <component
    :is="component" v-bind="$attrs"
    role="button" :aria-disabled="disabled"
    class="$ui-base select-none inline-flex vertical-mid no-underline
       text-14px h32px $ui-inline-fcc border-none
       cursor-pointer py-0 px-14px gap5px"
    :class="[
      styles[props.type],
      {
        'rounded-full': props.round === 'full',
        '$ui-base-br': props.round === 'normal',
        'opacity-50 cursor-not-allowed': disabled,
      },
    ]"
    @click.capture="handleClick"
  >
    <LoadingIndicator v-if="loading" class="w-12px h-full mt2px" />
    <slot v-else name="icon" class="$ui-inline-fcc h-full w-12px" />
    <div>
      <slot />
    </div>
    <slot name="icon-right" />
  </component>
</template>
