<script setup lang="ts">
import { VueButton, VueIcon, VueInput } from '@vue-devtools-next/ui'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'cancel': []
  'submit': [value: string]
  'update:modelValue': [value: string]
}>()

const value = useVModel(props, 'modelValue', emit)
</script>

<template>
  <span class="flex-inline items-center gap4px">
    <VueInput v-model="value" class="w120px h25px px4px" auto-focus />
    <VueButton size="mini" flat class="p2px!" @click="$emit('cancel')">
      <template #icon>
        <VueIcon icon="i-material-symbols-cancel" />
      </template>
    </VueButton>
    <VueButton size="mini" flat class="p2px!" @click="$emit('submit', value)">
      <template #icon>
        <VueIcon icon="i-material-symbols-save" />
      </template>
    </VueButton>
  </span>
</template>
