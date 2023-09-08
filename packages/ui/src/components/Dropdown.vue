<script setup lang="ts" generic="T">
import { useVModel } from '@vueuse/core'

const props = withDefaults(defineProps<{
  show: boolean
  items: T[]
  position?: 'left' | 'right'
}>(), {
  position: 'left',
})

const emit = defineEmits<{
  'update:show': [boolean]
}>()

defineSlots<{
  item(props: { item: T }): any
}>()

const show = useVModel(props, 'show', emit, { passive: true })
</script>

<template>
  <Transition
    name="dropdown" enter-active-class="transition-all" leave-active-class="transition-all"
    enter-from-class="opacity-0 scale-95" leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="show" absolute z-100 min-w-100px rounded p-2 shadow-lg bg-base
      :class="[position === 'left' ? 'left-0' : 'right-0']"
    >
      <div v-for="item of items" :key="`${item}`">
        <slot name="item" :item="item" />
      </div>
    </div>
  </Transition>
</template>
