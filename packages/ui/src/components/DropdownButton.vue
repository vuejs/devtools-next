<script setup lang="ts">
import { VClosePopper as vClosePopper } from 'floating-vue'
import type { ComputedGetter } from 'vue'
import { inject } from 'vue'
import type { ButtonProps } from './Button.vue'
import VueButton from './Button.vue'

const props = withDefaults(defineProps<ButtonProps & {
  keepOpen?: boolean
}>(), {
  keepOpen: false,
})

const disabled = inject<ComputedGetter<boolean> | undefined>('$ui-dropdown-disabled', undefined)
</script>

<template>
  <VueButton
    v-close-popper
    v-bind="{
      ...props,
      round: false,
    }"
    :disabled="disabled"
    class="transition-colors button w-full"
  >
    <slot />
  </VueButton>
</template>

<style scoped lang="scss">
.button {
  justify-content: flex-start;
}
.button:not(:hover):not(:focus):not(:active) {
  background: transparent !important;
}
</style>
