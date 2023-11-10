<script setup lang="ts">
import { VueButton, VueIcon, VueInput } from '@vue-devtools-next/ui'

// TODO: keyboard shortcut, esc to cancel, enter to submit
//       and show tooltip on button when hovering

const props = defineProps<{
  modelValue: string
  type: string // typeof value
}>()

const emit = defineEmits<{
  'cancel': []
  'submit': [dataType: string]
  'update:modelValue': [value: string]
}>()

const value = useVModel(props, 'modelValue', emit)

function tryToParseJSONString(v: unknown) {
  try {
    JSON.parse(v as string)
    return true
  }
  catch {
    return false
  }
}

const isWarning = computed(() =>
  // warning if is empty or is NaN if is a numeric value
  // or is not a valid Object if is an object
  value.value.trim().length === 0
  || (
    props.type === 'number'
      ? Number.isNaN(Number(value.value))
      : false
  )
  // @TODO: maybe a better way to check? use JSON.parse is not a performance-friendly way
  || (
    props.type === 'object'
      ? !tryToParseJSONString(value.value)
      : false
  ),
)
</script>

<template>
  <span class="flex-inline items-center gap4px">
    <VueInput v-model="value" :variant="isWarning ? 'warning' : 'normal'" class="w120px h25px px4px" auto-focus @click.stop />
    <template v-if="!isWarning">
      <VueButton size="mini" flat class="p2px!" @click.stop="$emit('cancel')">
        <template #icon>
          <VueIcon icon="i-material-symbols-cancel" />
        </template>
      </VueButton>
      <VueButton size="mini" flat class="p2px!" @click.stop="$emit('submit', type)">
        <template #icon>
          <VueIcon icon="i-material-symbols-save" />
        </template>
      </VueButton>
    </template>
    <template v-else>
      <VueIcon icon="i-material-symbols-warning" class="color-warning-500 dark:color-warning-300" />
    </template>
  </span>
</template>
