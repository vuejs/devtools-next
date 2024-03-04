<script setup lang="ts">
import type { InspectorCustomState, InspectorState } from '@vue/devtools-kit'
import { formatInspectorStateValue, getInspectorStateValueType, getRaw } from '@vue/devtools-kit'
import { computed, ref } from 'vue'
import { isArray, isObject, sortByKey } from '@vue/devtools-shared'
import ChildStateViewer from './ChildStateViewer.vue'
import ToggleExpanded from '~/components/basic/ToggleExpanded.vue'
import { useToggleExpanded } from '~/composables/toggle-expanded'

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
    return `${(props.data.value as InspectorCustomState)._custom?.type}-custom-state`
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
    const result = `<span class="${type.value}-state-type">${displayedValue.value}</span>`

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
</script>

<template>
  <div>
    <div
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
    </div>
    <ChildStateViewer v-if="hasChildren && expanded.includes(`${depth}-${index}`)" :data="normalizedDisplayedChildren" :depth="depth" :index="index" />
  </div>
</template>

<style lang="scss" scoped>
// function
:deep(.function-custom-state) {
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
