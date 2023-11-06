<script setup lang="ts">
import { VueButton, VueDropdown, VueDropdownButton, VueIcon } from '@vue-devtools-next/ui'
import type { InspectorState, InspectorStateEditorPayload } from 'vue-devtools-kit'
import type { ButtonProps } from '@vue-devtools-next/ui/dist/types/src/components/Button'
import { useDevToolsBridgeRpc } from '@vue-devtools-next/core'

const props = defineProps<{
  data: InspectorState
  hovering: boolean
}>()

defineEmits<{
  'enableEditInput': [type: 'number' | 'string']
}>()

const bridgeRpc = useDevToolsBridgeRpc()

const state = useStateEditorContext()

const { copy, isSupported } = useClipboard()

const popupVisible = ref(false)

const dataType = computed(() => {
  const v = props.data.value
  return typeof v
})

const iconButtonProps = {
  flat: true,
  size: 'mini',
} satisfies ButtonProps

const buttonClass = computed(() => ({
  'opacity-0': !props.hovering,
}))

function quickEdit(v: unknown) {
  bridgeRpc.editInspectorState({
    path: props.data.key,
    inspectorId: state.value.inspectorId,
    type: props.data.stateType!,
    nodeId: state.value.nodeId,
    state: {
      newKey: null!,
      value: v,
    },
  } satisfies InspectorStateEditorPayload)
}
</script>

<template>
  <div class="inline pl5px">
    <!-- only editable will show operate actions -->
    <template v-if="data.editable">
      <!-- input edit, number/string -->
      <template v-if="dataType === 'string' || dataType === 'number'">
        <VueButton v-bind="iconButtonProps" :class="buttonClass" @click="$emit('enableEditInput', dataType)">
          <template #icon>
            <VueIcon icon="i-material-symbols-edit-rounded" />
          </template>
        </VueButton>
      </template>
      <!-- checkbox, button value only -->
      <VueButton
        v-if="dataType === 'boolean'" v-bind="iconButtonProps" :class="buttonClass"
        @click="quickEdit(!data.value)"
      >
        <template #icon>
          <VueIcon :icon="data.value ? 'i-material-symbols-check-box-sharp' : 'i-material-symbols-check-box-outline-blank-sharp'" />
        </template>
      </VueButton>
      <!-- increment/decrement button, numeric value only -->
      <template v-else-if="dataType === 'number'">
        <VueButton v-bind="iconButtonProps" :class="buttonClass" @click="quickEdit((data.value as number) + 1)">
          <template #icon>
            <VueIcon icon="i-carbon-add" />
          </template>
        </VueButton>
        <VueButton v-bind="iconButtonProps" :class="buttonClass" @click="quickEdit((data.value as number) - 1)">
          <template #icon>
            <VueIcon icon="i-carbon-subtract" />
          </template>
        </VueButton>
      </template>
    </template>
    <!-- Copy key/value -->
    <VueDropdown
      :class="{
        'opacity-0': !hovering && !popupVisible,
      }"
      :button-props="{
        flat: true,
        size: 'mini',
      }"
      :disabled="!isSupported"
      @update:visible="v => popupVisible = v"
    >
      <div class="py5px w160px">
        <VueDropdownButton
          @click="() => {
            copy(data.value.toString())
          }"
        >
          <template #icon>
            <VueIcon icon="i-material-symbols-copy-all-rounded" class="mt4px" />
            Copy Value
          </template>
        </VueDropdownButton>
        <VueDropdownButton
          @click="() => {
            copy(data.key)
          }"
        >
          <template #icon>
            <VueIcon icon="i-material-symbols-copy-all-rounded" class="mt4px" />
            Copy Path
          </template>
        </VueDropdownButton>
      </div>
      <template #button-icon>
        <VueIcon icon="i-material-symbols:more-vert" />
      </template>
    </VueDropdown>
  </div>
</template>
