<script setup lang="ts">
import type { InspectorCustomState, InspectorState, InspectorStateEditorPayload } from '@vue/devtools-kit'
import { formatInspectorStateValue, getInspectorStateValueType, getRaw, toEdit, toSubmit } from '@vue/devtools-kit'
import { computed, ref, watch } from 'vue'
import { defineDevToolsAction } from '@vue/devtools-core'
import { isArray, isObject, sortByKey } from '@vue/devtools-shared'
import ChildStateViewer from './ChildStateViewer.vue'
import StateFieldEditor from './StateFieldEditor.vue'
import ToggleExpanded from '~/components/basic/ToggleExpanded.vue'
import { useToggleExpanded } from '~/composables/toggle-expanded'
import { useStateEditor, useStateEditorContext, useStateEditorDrafting } from '~/composables/state-editor'
import type { EditorAddNewPropType } from '~/composables/state-editor'
import { useHover } from '~/composables/hover'

const props = defineProps<{
  data: InspectorState
  depth: number
  index: string
}>()

const STATE_FIELDS_LIMIT_SIZE = 30
const limit = ref(STATE_FIELDS_LIMIT_SIZE)
// display value
const displayedValue = computed(() => formatInspectorStateValue(props.data.value))
const type = computed(() => getInspectorStateValueType(props.data.value))
const raw = computed(() => getRaw(props.data.value))
const { expanded, toggleExpanded } = useToggleExpanded()

// custom state format class
const stateFormatClass = computed(() => {
  if (type.value === 'custom')
    return `${(props.data.value as InspectorCustomState)._custom?.type ?? 'string'}-custom-state`
  else
    return ``
})

// normalized display key
const normalizedDisplayedKey = computed(() => {
  const key = props.data.key
  const lastDotIndex = key.lastIndexOf('.')
  if (lastDotIndex === -1)
    return key
  return key.slice(lastDotIndex + 1)
})

// normalized display value
const normalizedDisplayedValue = computed(() => {
  const directlyDisplayedValueMap = ['Reactive']
  const extraDisplayedValue = (props.data as InspectorCustomState)._custom?.stateTypeName || props.data?.stateTypeName
  if (directlyDisplayedValueMap.includes(extraDisplayedValue!)) {
    return extraDisplayedValue
  }

  else if ((props.data.value as InspectorCustomState['_custom'])?.fields?.abstract) {
    return ''
  }

  else {
    const _value = type.value === 'custom' && !(props.data.value as InspectorCustomState)._custom?.type ? `"${displayedValue.value}"` : displayedValue.value
    const result = `<span class="${type.value}-state-type">${_value}</span>`

    if (extraDisplayedValue)
      return `${result} <span class="text-gray-500">(${extraDisplayedValue})</span>`

    return result
  }
})

// normalized display children
const normalizedDisplayedChildren = computed(() => {
  const { value, inherit } = raw.value
  let displayedChildren: unknown[] = []
  if (isArray(value)) {
    const sliced = value.slice(0, limit.value)
    return sliced.map((item, i) => ({
      key: `${props.data.key}.${i}`,
      value: item,
      ...inherit,
      editable: props.data.editable,
      creating: false,
    })) as unknown as InspectorState[]
  }
  else if (isObject(value)) {
    displayedChildren = Object.keys(value).slice(0, limit.value).map(key => ({
      key: `${props.data.key}.${key}`,
      value: value[key],
      ...inherit,
      editable: props.data.editable,
      creating: false,
    }))
    if (type.value !== 'custom')
      displayedChildren = sortByKey(displayedChildren)
  }

  return (displayedChildren === props.data.value ? [] : displayedChildren) as InspectorState[]
})

// has children
const hasChildren = computed(() => {
  return normalizedDisplayedChildren.value.length > 0
})

// #region editor
const containerRef = ref<HTMLDivElement>()
const state = useStateEditorContext()
const { isHovering } = useHover(() => containerRef.value)

const { editingType, editing, editingText, toggleEditing, nodeId } = useStateEditor()

watch(() => editing.value, (v) => {
  if (v) {
    const { value } = raw.value
    editingText.value = toEdit(value, raw.value.customType)
  }
  else {
    editingText.value = ''
  }
})

const editInspectorState = defineDevToolsAction('devtools:edit-inspector-state', (devtools, payload: InspectorStateEditorPayload) => {
  devtools.api.editInspectorState(payload)
})

function submit() {
  const data = props.data
  editInspectorState({
    path: data.key.split('.'),
    inspectorId: state.value.inspectorId,
    type: data.stateType!,
    nodeId,
    state: {
      newKey: null!,
      type: editingType.value,
      value: toSubmit(editingText.value, raw.value.customType),
    },
  } satisfies InspectorStateEditorPayload)
  toggleEditing()
}

// ------ add new prop ------
const { addNewProp: addNewPropApi, draftingNewProp, resetDrafting } = useStateEditorDrafting()

function addNewProp(type: EditorAddNewPropType) {
  if (!expanded.value)
    // toggleExpanded()
    addNewPropApi(type, raw.value.value)
}

function submitDrafting() {
  const data = props.data
  const path = data.key.split('.')
  path.push(draftingNewProp.value.key)
  editInspectorState({
    path,
    inspectorId: state.value.inspectorId,
    type: data.stateType!,
    nodeId,
    state: {
      newKey: draftingNewProp.value.key,
      type: typeof toSubmit(draftingNewProp.value.value),
      value: toSubmit(draftingNewProp.value.value),
    },
  } satisfies InspectorStateEditorPayload)
  resetDrafting()
}

// #endregion
</script>

<template>
  <div>
    <div
      ref="containerRef"
      class="font-state-field flex items-center"
      :class="[hasChildren && 'cursor-pointer hover:(bg-active)']"
      :style="{ paddingLeft: `${depth * 15 + 4}px` }"
      @click="toggleExpanded(`${depth}-${index}`)"
    >
      <ToggleExpanded
        v-if="hasChildren"
        :value="expanded.includes(`${depth}-${index}`)"
      />
      <!-- placeholder -->
      <span v-else pl5 />
      <span op70>
        {{ normalizedDisplayedKey }}
      </span>
      <span mx1>:</span>
      <span :class="stateFormatClass">
        <span v-html="normalizedDisplayedValue" />
      </span>
      <StateFieldEditor
        :hovering="isHovering" :disable-edit="state.disableEdit"
        :data="data" :depth="depth" @enable-edit-input="toggleEditing"
        @add-new-prop="addNewProp"
      />
    </div>
    <ChildStateViewer v-if="hasChildren && expanded.includes(`${depth}-${index}`)" :data="normalizedDisplayedChildren" :depth="depth" :index="index" />
  </div>
</template>

<style lang="scss" scoped>
// string
:deep(.string-custom-state) {
  --at-apply: string-state-type;
}

// function
:deep(.function-custom-state) {
  --at-apply: font-italic;
  & > span {
    --at-apply: 'text-#0033cc dark:text-#997fff';
    font-family: Menlo, monospace;
  }
}

// component-definition
:deep(.component-definition-custom-state) {
  --at-apply: text-primary-500;
  & > span {
    --at-apply: 'text-#aaa';
  }
}

// component
:deep(.component-custom-state) {
  --at-apply: text-primary-500;
  &::before {
    content: '<';
  }
  &::after {
    content: '>';
  }
  &::before,
  &::after {
    --at-apply: 'text-#aaa';
  }
}
</style>
