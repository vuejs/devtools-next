<script setup lang="ts">
import { VueDrawer } from '@vue-devtools-next/ui'

const props = defineProps<{
  modelValue: boolean
  to: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const show = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <VueDrawer v-model="show" :close-outside="false" :mount-to="to" permanent>
    <div class="w-300px" />
  </VueDrawer>
</template>
