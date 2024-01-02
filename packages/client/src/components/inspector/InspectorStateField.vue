<script setup lang="ts">
import type { InspectorCustomState, InspectorState, InspectorStateEditorPayload } from '@vue/devtools-kit'
import { sortByKey } from '@vue/devtools-shared'
import { formatInspectorStateValue, getInspectorStateValueType } from '@vue/devtools-kit'
import { useDevToolsBridgeRpc } from '@vue/devtools-core'
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

const state = useStateEditorContext()
const bridgeRpc = useDevToolsBridgeRpc()
const value = formatInspectorStateValue(props.data.value)
const type = getInspectorStateValueType(props.data.value)
const stateFormatClass = computed(() => {
  if (type === 'custom')
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
    const result = `<span class="state-value-${type}">${value}</span>`
    if (stateTypeName)
      return `${result} <span class="text-gray-500">(${stateTypeName})</span>`

    return result
  }
})

const rawValue = computed(() => {
  let value = props.data.value
  const isCustom = type === 'custom'
  let inherit = {}
  if (isCustom) {
    const data = props.data.value as InspectorCustomState
    inherit = data._custom?.fields || {}
    value = data._custom?.value as string
  }
  // @ts-expect-error @TODO: type
  if (value && value._isArray)
    // @ts-expect-error @TODO: type
    value = value.items

  return { value, inherit }
})

const normalizedChildField = computed(() => {
  let { value, inherit } = rawValue.value
  if (Array.isArray(value)) {
    // @TODO: show more
    const sliced = value.slice(0, 20)
    return sliced.map((item, i) => ({
      key: `${props.data.key}.${i}`,
      value: item,
      ...inherit,
      editable: props.data.editable,
      creating: false,
    }))
  }
  else if (typeof value === 'object') {
    value = Object.keys(value).map(key => ({
      key: `${props.data.key}.${key}`,
      value: value[key],
      ...inherit,
      editable: props.data.editable,
      creating: false,
    }))
    if (type !== 'custom')
      value = sortByKey(value)
  }
  else {
    value = []
  }

  return value === props.data.value ? {} : value
})

const normalizedDisplayedKey = computed(() => {
  const key = props.data.key
  const lastDotIndex = key.lastIndexOf('.')
  if (lastDotIndex === -1)
    return key
  return key.slice(lastDotIndex + 1)
})

const hasChildren = computed(() => {
  return Object.keys(normalizedChildField.value).length > 0
})

// ---------------------------- edit ----------------------------
const { editingType, editing, editingText, toggleEditing, nodeId } = useStateEditor()

watch(() => editing.value, (v) => {
  if (v) {
    const value = props.data.value
    if (typeof value === 'object') {
      editingText.value = JSON.stringify(value)
      return
    }
    editingText.value = value.toString()
  }
  else {
    editingText.value = ''
  }
})

function submit(dataType: string) {
  const data = props.data
  bridgeRpc.editInspectorState({
    path: data.key.split('.'),
    inspectorId: state.value.inspectorId,
    type: data.stateType!,
    nodeId,
    state: {
      newKey: null!,
      type: dataType,
      value: editingText.value,
    },
  } satisfies InspectorStateEditorPayload)
  toggleEditing()
}

// ------ add new prop ------
const { addNewProp: addNewPropApi, draftingNewProp, resetDrafting } = useStateEditorDrafting()

function addNewProp(type: EditorAddNewPropType) {
  if (!isExpanded.value)
    toggleCollapse()
  addNewPropApi(type, props.data.value)
}

function submitDrafting() {
  const data = props.data
  const path = data.key.split('.')
  path.push(draftingNewProp.value.key)
  bridgeRpc.editInspectorState({
    path,
    inspectorId: state.value.inspectorId,
    type: data.stateType!,
    nodeId,
    state: {
      newKey: draftingNewProp.value.key,
      type: typeof draftingNewProp.value.value,
      value: draftingNewProp.value.value,
    },
  } satisfies InspectorStateEditorPayload)
  resetDrafting()
}

const containerRef = ref()
const { isHovering } = useHover(containerRef)
</script>

<template>
  <div ref="containerRef" class="pl-6" :style="{ paddingLeft: `${depth * 15 + 4}px` }">
    <template v-if="!hasChildren">
      <div>
        <span overflow-hidden text-ellipsis whitespace-nowrap state-key>{{ normalizedDisplayedKey }}</span>
        <span mx-1>:</span>
        <EditInput v-if="editing" v-model="editingText" :type="editingType" @cancel="toggleEditing" @submit="submit" />
        <template v-else>
          <span :class="stateFormatClass">
            <span v-html="normalizedValue" />
          </span>
          <Actions
            :hovering="isHovering" :disable-edit="state.disableEdit"
            :data="data" :depth="depth" @enable-edit-input="toggleEditing"
          />
        </template>
      </div>
    </template>
    <template v-else>
      <div cursor-pointer>
        <div relative flex items-center @click="toggleCollapse">
          <ExpandIcon :value="isExpanded" absolute left--6 group-hover:text-white />
          <span overflow-hidden text-ellipsis whitespace-nowrap state-key>{{ data.key }}</span>
          <span mx-1>:</span>
          <EditInput v-if="editing" v-model="editingText" :type="editingType" @cancel="toggleEditing" @submit="submit" />
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
          <div v-if="draftingNewProp.enable" :style="{ paddingLeft: `${(depth + 1) * 15 + 4}px` }">
            <span overflow-hidden text-ellipsis whitespace-nowrap state-key>
              <EditInput v-model="draftingNewProp.key" type="string" :show-actions="false" />
            </span>
            <span mx-1>:</span>
            <EditInput v-model="draftingNewProp.value" type="string" :auto-focus="false" @cancel="resetDrafting" @submit="submitDrafting" />
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
