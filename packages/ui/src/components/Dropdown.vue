<script setup lang="ts" generic="T">
import type { Placement } from 'floating-vue'
import { Dropdown } from 'floating-vue'
import type { ButtonType } from './Button.vue'
import VueButton from './Button.vue'

withDefaults(defineProps<{
  label: string
  autoHide?: boolean
  trigger?: 'click' | 'hover'
  buttonType?: ButtonType
  buttonClass?: ''
  distance?: number
  placement?: Placement
}>(), {
  autoHide: true,
  trigger: 'click',
  buttonClass: '',
  distance: 0,
})
</script>

<template>
  <Dropdown class="dropdown" :triggers="[trigger]" :distance="distance + 6" :placement="placement">
    <VueButton :type="buttonType" :class="buttonClass">
      {{ label }}
      <template #icon>
        <slot name="button-icon" />
      </template>
      <template #icon-right>
        <slot name="button-icon-right" />
      </template>
    </VueButton>
    <template #popper>
      <div class="popper">
        <slot>
          <div class="p2 opacity-40">
            Empty...
          </div>
        </slot>
      </div>
    </template>
  </Dropdown>
</template>

<style scoped lang="scss">
.dropdown {
  @apply inline-block w-auto;
}
.popper {
  @apply rounded-lg shadow-lg overflow-hidden;
}
</style>
