<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import Dialog from './Dialog.vue'
import Button from './Button.vue'

const props = defineProps<{
  modelValue?: boolean
  message: string
}>()
const emits = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'cancel'): void
  (event: 'confirm'): void
}>()

const value = useVModel(props, 'modelValue', emits, { passive: true })

function hide() {
  value.value = false
}
</script>

<template>
  <Dialog v-model="value">
    <div flex="~ col" min-w-100px w-25vw gap-15px p4>
      <div>{{ message }}</div>
      <div w-full flex items-center justify-end gap-10px>
        <Button border-none bg="gray-300/30" @click.prevent="$emit('cancel'); hide()">
          cancel
        </Button>
        <Button border-none bg-primary text-white hover:text-white @click.prevent="$emit('confirm'); hide()">
          confirm
        </Button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
</style>
