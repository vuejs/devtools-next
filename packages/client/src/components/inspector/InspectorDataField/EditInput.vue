<script setup lang="ts">
import { VueButton, VueIcon, VueInput, VTooltip as vTooltip } from '@vue-devtools-next/ui'

const props = withDefaults(defineProps<{
  modelValue: string
  type: string // typeof value
  showActions?: boolean
  autoFocus?: boolean
}>(), {
  showActions: true,
  autoFocus: true,
})

const emit = defineEmits<{
  'cancel': []
  'submit': [dataType: string]
  'update:modelValue': [value: string]
}>()

// TODO: keyboard shortcut, esc to cancel, enter to submit
//       and show tooltip on button when hovering

const { escape, enter } = useMagicKeys()

watchEffect(() => {
  if (escape.value)
    emit('cancel')
  else if (enter.value)
    emit('submit', props.type)
})

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
    <VueInput v-model="value" :variant="isWarning ? 'warning' : 'normal'" class="w120px h25px px4px" :auto-focus="autoFocus" @click.stop />
    <template v-if="showActions">
      <template v-if="!isWarning">
        <VueButton
          v-tooltip="{
            content: 'Esc to cancel',
          }" size="mini" flat class="p2px!" @click.stop="$emit('cancel')"
        >
          <template #icon>
            <VueIcon icon="i-material-symbols-cancel" />
          </template>
        </VueButton>
        <VueButton
          v-tooltip="{
            content: 'Enter to submit change',
          }" size="mini" flat class="p2px!" @click.stop="$emit('submit', type)"
        >
          <template #icon>
            <VueIcon icon="i-material-symbols-save" />
          </template>
        </VueButton>
      </template>
      <VueIcon v-else icon="i-material-symbols-warning" class="color-warning-500 dark:color-warning-300" />
    </template>
  </span>
</template>
