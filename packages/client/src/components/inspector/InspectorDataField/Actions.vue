<script setup lang="ts">
import { toRaw } from 'vue'
import { VueButton, VueDropdown, VueDropdownButton, VueIcon, VTooltip as vTooltip } from '@vue/devtools-ui'
import { getRaw } from '@vue/devtools-kit'
import type { InspectorState, InspectorStateEditorPayload } from '@vue/devtools-kit'
import type { ButtonProps } from '@vue/devtools-ui/dist/types/src/components/Button'
import { editInspectorState } from '@vue/devtools-core'
import type { EditorAddNewPropType, EditorInputValidType } from '../../../composables/inspector'

const props = withDefaults(defineProps<{
  data: InspectorState
  hovering: boolean
  depth: number
  showAddIfNeeded?: boolean
  disableEdit?: boolean
}>(), {
  showAddIfNeeded: true,
})

defineEmits<{
  enableEditInput: [type: EditorInputValidType]
  addNewProp: [type: EditorAddNewPropType]
}>()

const state = useStateEditorContext()

const { copy, isSupported } = useClipboard()

const popupVisible = ref(false)

const raw = computed(() => getRaw(props.data.value))
const rawValue = computed(() => raw.value.value)
const customType = computed(() => raw.value.customType)
const dataType = computed(() => rawValue.value === null ? 'null' : typeof rawValue.value)

const iconButtonProps = {
  flat: true,
  size: 'mini',
} satisfies ButtonProps

const buttonClass = computed(() => ({
  'opacity-0': !props.hovering,
}))

function quickEdit(v: unknown, remove: boolean = false) {
  editInspectorState({
    path: props.data.key.split('.'),
    inspectorId: state.value.inspectorId,
    type: props.data.stateType!,
    nodeId: state.value.nodeId,
    state: {
      newKey: null!,
      value: toRaw(v),
      type: dataType.value,
      remove,
    },
  } satisfies InspectorStateEditorPayload)
}

function quickEditNum(v: number | string, offset: 1 | -1) {
  const target = typeof v === 'number'
    ? v + offset
    : BigInt(v) + BigInt(offset)
  quickEdit(target)
}
</script>

<template>
  <div class="inline pl5px">
    <!-- only editable will show operate actions -->
    <template v-if="!props.disableEdit && data.editable">
      <!-- input edit, number/string/object -->
      <template v-if="dataType === 'string' || dataType === 'number' || dataType === 'object' || dataType === 'null'">
        <VueButton
          v-tooltip="{
            content: 'Edit value',
          }" v-bind="iconButtonProps" :class="buttonClass" @click.stop="$emit('enableEditInput', dataType)"
        >
          <template #icon>
            <VueIcon icon="i-material-symbols-edit-rounded" />
          </template>
        </VueButton>
        <VueButton
          v-if="dataType === 'object' && showAddIfNeeded"
          v-tooltip="{
            content: 'Add new value',
          }" v-bind="iconButtonProps" :class="buttonClass" @click.stop="
            $emit('addNewProp', Array.isArray(rawValue) ? 'array' : 'object')"
        >
          <template #icon>
            <VueIcon icon="i-material-symbols-add-circle-rounded" />
          </template>
        </VueButton>
      </template>
      <!-- checkbox, button value only -->
      <VueButton
        v-if="dataType === 'boolean'" v-bind="iconButtonProps" :class="buttonClass"
        @click="quickEdit(!rawValue)"
      >
        <template #icon>
          <VueIcon :icon="rawValue ? 'i-material-symbols-check-box-sharp' : 'i-material-symbols-check-box-outline-blank-sharp'" />
        </template>
      </VueButton>
      <!-- increment/decrement button, numeric/bigint -->
      <template v-else-if="dataType === 'number' || customType === 'bigint'">
        <VueButton v-bind="iconButtonProps" :class="buttonClass" @click.stop="quickEditNum(rawValue as number | string, 1)">
          <template #icon>
            <VueIcon icon="i-carbon-add" />
          </template>
        </VueButton>
        <VueButton v-bind="iconButtonProps" :class="buttonClass" @click.stop="quickEditNum(rawValue as number | string, -1)">
          <template #icon>
            <VueIcon icon="i-carbon-subtract" />
          </template>
        </VueButton>
      </template>
    </template>
    <!-- delete prop, only appear if depth > 0 -->
    <VueButton v-if="!props.disableEdit && depth > 0" v-bind="iconButtonProps" :class="buttonClass" @click.stop="quickEdit(rawValue, true)">
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
      <template #popper>
        <div class="w160px py5px">
          <VueDropdownButton
            @click="copy(typeof rawValue === 'object' ? JSON.stringify(rawValue) : rawValue.toString())"
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
      </template>
      <template #button-icon>
        <VueIcon icon="i-material-symbols:more-vert" />
      </template>
    </VueDropdown>
  </div>
</template>
