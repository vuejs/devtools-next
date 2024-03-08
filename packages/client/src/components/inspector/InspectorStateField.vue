<script setup lang="ts">
import type { InspectorCustomState, InspectorState, InspectorStateEditorPayload } from '@vue/devtools-kit'
import { isArray, isObject, sortByKey } from '@vue/devtools-shared'
import { formatInspectorStateValue, getInspectorStateValueType, getRaw, toEdit, toSubmit } from '@vue/devtools-kit'
import { defineDevToolsAction } from '@vue/devtools-core'
import { VueButton, VueIcon, VTooltip as vTooltip } from '@vue/devtools-ui'
import Actions from './InspectorDataField/Actions.vue'
import type { EditorAddNewPropType } from '~/composables/inspector'

const props = withDefaults(defineProps<{
  data: InspectorState
  depth?: number
  no: number
  rootId: string
}>(), {
  depth: 0,
})

const STATE_FIELDS_LIMIT_SIZE = 30

const state = useStateEditorContext()
const value = computed(() => formatInspectorStateValue(props.data.value))
const type = computed(() => getInspectorStateValueType(props.data.value))
const stateFormatClass = computed(() => {
  if (type.value === 'custom')
    return `state-format-${(props.data.value as InspectorCustomState)._custom?.type}`

  else
    return ``
})

const { isExpanded, toggleCollapse } = useCollapse('inspector-state', `${props.rootId}-${props.no}-${props.depth}-${props.data.key}`)

const normalizedValue = computed(() => {
  const stateTypeName = (props.data as InspectorCustomState)._custom?.stateTypeName || props.data?.stateTypeName
  if (stateTypeName === 'Reactive') {
    return stateTypeName
  }
  // @ts-expect-error @TODO: type
  else if (props.data.value?.fields?.abstract) {
    return ''
  }
  else {
    const result = `<span class="state-value-${type.value}">${value.value}</span>`
    if (stateTypeName)
      return `${result} <span class="text-gray-500">(${stateTypeName})</span>`

    return result
  }
})

const raw = computed(() => getRaw(props.data.value))

const limit = ref(STATE_FIELDS_LIMIT_SIZE)

const normalizedChildField = computed<
  Record<string, InspectorState>
>(() => {
  const { value, inherit, customType } = raw.value
  // The member in native set can only be added or removed.
  // It cannot be modified.
  const isUneditableType = customType === 'set'
  let displayedValue: any[]
  if (isArray(value)) {
    const sliced = value.slice(0, limit.value)
    return sliced.map((item, i) => ({
      key: `${props.data.key}.${i}`,
      value: item,
      ...inherit,
      editable: props.data.editable && !isUneditableType,
      creating: false,
    }))
  }
  else if (isObject(value)) {
    displayedValue = Object.keys(value).slice(0, limit.value).map(key => ({
      key: `${props.data.key}.${key}`,
      value: value[key],
      ...inherit,
      editable: props.data.editable && !isUneditableType,
      creating: false,
    }))
    if (type.value !== 'custom')
      displayedValue = sortByKey(displayedValue)
  }
  else {
    displayedValue = []
  }

  return displayedValue === props.data.value ? {} : displayedValue
})

const fieldsCount = computed(() => {
  const { value } = raw.value
  if (isArray(value))
    return value.length
  else if (isObject(value))
    return Object.keys(value).length
  else
    return 0
})

const normalizedDisplayedKey = computed(() => {
  const key = props.data.key
  const lastDotIndex = key.lastIndexOf('.')
  if (lastDotIndex === -1)
    return key
  return key.slice(lastDotIndex + 1)
})

// ---------------------------- edit ----------------------------
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
  if (!isExpanded.value)
    toggleCollapse()
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

const hasChildren = computed(() => {
  return Object.keys(normalizedChildField.value).length > 0
  // Regard empty object has children When drafting a new property.
    || draftingNewProp.value.enable
})

const containerRef = ref<HTMLDivElement>()
const { isHovering } = useHover(() => containerRef.value)
</script>

<template>
  <div ref="containerRef" class="pl-6" :style="{ paddingLeft: `${depth * 15 + 4}px` }">
    <template v-if="!hasChildren">
      <div>
        <span overflow-hidden text-ellipsis whitespace-nowrap state-key>{{ normalizedDisplayedKey }}</span>
        <span mx-1>:</span>
        <EditInput v-if="editing" v-model="editingText" :custom-type="raw.customType" @cancel="toggleEditing" @submit="submit" />
        <template v-else>
          <span :class="stateFormatClass">
            <span v-html="normalizedValue" />
          </span>
          <Actions
            :hovering="isHovering" :disable-edit="state.disableEdit"
            :data="data" :depth="depth" @enable-edit-input="toggleEditing"
            @add-new-prop="addNewProp"
          />
        </template>
      </div>
    </template>
    <template v-else>
      <div cursor-pointer>
        <div relative flex items-center @click="toggleCollapse">
          <ExpandIcon :value="isExpanded" absolute left--6 group-hover:text-white />
          <span overflow-hidden text-ellipsis whitespace-nowrap state-key>{{ normalizedDisplayedKey }}</span>
          <span mx-1>:</span>
          <EditInput v-if="editing" v-model="editingText" :custom-type="raw.customType" @cancel="toggleEditing" @submit="submit" />
          <template v-else>
            <span :class="stateFormatClass">
              <span v-html="normalizedValue" />
            </span>
            <Actions
              :show-add-if-needed="!draftingNewProp.enable"
              :hovering="isHovering" :data="data" :disable-edit="state.disableEdit"
              :depth="depth" @enable-edit-input="toggleEditing" @add-new-prop="addNewProp"
            />
          </template>
        </div>
        <div v-if="isExpanded">
          <InspectorStateField
            v-for="(field, index) in normalizedChildField" :key="index" :data="field" :depth="depth + 1" :no="no" :root-id="rootId"
          />
          <VueButton v-if="fieldsCount > limit" v-tooltip="'Show more'" flat size="mini" class="ml-4" @click="limit += STATE_FIELDS_LIMIT_SIZE">
            <template #icon>
              <VueIcon icon="i-material-symbols-more-horiz" />
            </template>
          </VueButton>
          <div v-if="draftingNewProp.enable" :style="{ paddingLeft: `${(depth + 1) * 15 + 4}px` }">
            <span overflow-hidden text-ellipsis whitespace-nowrap state-key>
              <EditInput v-model="draftingNewProp.key" :show-actions="false" />
            </span>
            <span mx-1>:</span>
            <EditInput v-model="draftingNewProp.value" :auto-focus="false" @cancel="resetDrafting" @submit="submitDrafting" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
// function
:deep(.state-format-function) {
  --at-apply: font-italic;
  & > span {
    --at-apply: 'text-#0033cc dark:text-#997fff';
    font-family: Menlo, monospace;
  }
}

// component-definition
:deep(.state-format-component-definition) {
  --at-apply: text-primary-500;
  & > span {
    --at-apply: 'text-#aaa';
  }
}

// component
:deep(.state-format-component) {
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
