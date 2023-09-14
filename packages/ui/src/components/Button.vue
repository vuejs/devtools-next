<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  type?: ButtonType
}>(), {
  type: 'default',
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

export type ButtonType = 'default' | 'primary' | 'accent' | 'danger' | 'warning' | 'info' | 'success'

const attrs = useAttrs()

const component = computed(() => {
  if (attrs.to)
    return 'router-link'
  else if (attrs.href)
    return 'a'
  return 'button'
})

const ghost = computed(() => false)

function handleClick(e: MouseEvent) {
  if (ghost.value) {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    return
  }
  console.log('click', component)
  emit('click', e)
}

const styles = {
  default: 'bg-primary-100 text-black hover:bg-primary-100-lighten active:bg-primary-100-darken',
  primary: 'bg-primary-500 text-white hover:bg-primary-500-lighten active:bg-primary-500-darken',
  accent: 'bg-accent-500 text-white dark:bg-accent-300 hover:bg-accent-500-lighten active:bg-accent-500-darken',
  danger: 'bg-danger-500 text-white hover:bg-danger-500-lighten active:bg-danger-500-darken',
  warning: 'bg-warning-500 text-white hover:bg-warning-500-lighten active:bg-warning-500-darken',
  info: 'bg-info-500 text-white hover:bg-info-500-lighten active:bg-info-500-darken',
  success: 'bg-primary-500 text-white hover:bg-primary-500-lighten active:bg-primary-500-darken',
} satisfies Record<ButtonType, string>
</script>

<template>
  <component
    :is="component" v-bind="$attrs"
    role="button" :aria-disabled="ghost"
    class="base select-none inline-flex vertical-mid no-underline text-14px h32px fcc border-none
       cursor-pointer base-br py-0 px-14px focus:text-gray-800" :class="[
      styles[props.type],
    ]"
    @click.capture="handleClick"
  >
    <slot />
  </component>
</template>
