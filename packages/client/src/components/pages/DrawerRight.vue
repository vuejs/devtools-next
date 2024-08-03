<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  autoClose?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const el = ref<HTMLElement>()

onClickOutside(el, () => {
  if (props.modelValue && props.autoClose)
    emit('close')
}, {
  ignore: ['a', 'button', 'summary', '[role="dialog"]'],
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <Transition
    enter-active-class="duration-200 ease-in"
    enter-from-class="transform translate-x-1/1"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-out"
    leave-from-class="opacity-100"
    leave-to-class="transform translate-x-1/1"
  >
    <div
      v-if="modelValue"
      ref="el"
      border="l base"
      flex="~ col gap-1"
      absolute bottom-0 right-0 top-0 z-20 of-auto text-sm glass-effect
      v-bind="$attrs"
    >
      <button
        absolute right-3 top-4 z-20 text-xl op40 hover="op100 text-primary-400"
        @click="emit('close')"
      >
        <div i-carbon-close />
      </button>
      <div relative h-full w-full of-auto>
        <slot />
      </div>
    </div>
  </Transition>
</template>
