<script setup lang="ts">
import { VueButton, VueDropdown, VueDropdownButton, VueIcon } from '@vue-devtools-next/ui'
import type { InspectorState, InspectorStateEditorPayload } from 'vue-devtools-kit'
import type { ButtonProps } from '@vue-devtools-next/ui/dist/types/src/components/Button'
import { useDevToolsBridgeRpc } from '@vue-devtools-next/core'
import type { EditorAddNewPropType, EditorInputValidType } from '../../../composables/inspector'

const props = withDefaults(defineProps<{
  data: InspectorState
  hovering: boolean
  depth: number
  showAddIfNeeded?: boolean
}>(), {
  showAddIfNeeded: true,
})

defineEmits<{
  'enableEditInput': [type: EditorInputValidType]
  'addNewProp': [type: EditorAddNewPropType]
}>()

const bridgeRpc = useDevToolsBridgeRpc()

const state = useStateEditorContext()

const { copy, isSupported } = useClipboard()

const popupVisible = ref(false)

const dataType = computed(() => {
  return typeof props.data.value
})

const iconButtonProps = {
  flat: true,
  size: 'mini',
} satisfies ButtonProps

const buttonClass = computed(() => ({
  'opacity-0': !props.hovering,
}))

function quickEdit(v: unknown, remove: boolean = false) {
  bridgeRpc.editInspectorState({
    path: props.data.key.split('.'),
    inspectorId: state.value.inspectorId,
    type: props.data.stateType!,
    nodeId: state.value.nodeId,
    state: {
      newKey: null!,
      value: v,
      type: dataType.value,
      remove,
    },
  } satisfies InspectorStateEditorPayload)
}
</script>

<template>
  <div class="inline pl5px">
    <!-- only editable will show operate actions -->
    <template v-if="data.editable">
      <!-- input edit, number/string/object -->
      <template v-if="dataType === 'string' || dataType === 'number' || dataType === 'object'">
        <VueButton v-bind="iconButtonProps" :class="buttonClass" @click.stop="$emit('enableEditInput', dataType)">
          <template #icon>
            <VueIcon icon="i-material-symbols-edit-rounded" />
          </template>
        </VueButton>
        <VueButton
          v-if="dataType === 'object' && showAddIfNeeded" v-bind="iconButtonProps" :class="buttonClass" @click.stop="
            $emit('addNewProp', Array.isArray(data.value) ? 'array' : 'object')"
        >
          <template #icon>
            <VueIcon icon="i-material-symbols-add-circle-rounded" />
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
    <!-- delete prop, only appear if depth > 0 -->
    <VueButton v-if="depth > 0" v-bind="iconButtonProps" :class="buttonClass" @click="quickEdit(data.value, true)">
      <template #icon>
        <VueIcon icon="i-material-symbols-delete-rounded" />
      </template>
    </VueButton>
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
          @click="copy(dataType === 'object' ? JSON.stringify(data.value) : data.value.toString())"
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
