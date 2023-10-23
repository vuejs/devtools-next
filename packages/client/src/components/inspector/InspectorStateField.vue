<script setup lang="ts">
import type { InspectorCustomState, InspectorState } from 'vue-devtools-kit'
import { sortByKey } from '@vue-devtools-next/shared'
import { formatInspectorStateValue, getInspectorStateValueType } from 'vue-devtools-kit/shared'

const props = withDefaults(defineProps<{
  data: InspectorState
  depth?: number
  no: number
}>(), {
  depth: 0,
})

const value = formatInspectorStateValue(props.data.value)
const type = getInspectorStateValueType(props.data.value)
const stateFormatClass = computed(() => {
  if (type === 'custom')
    return `state-format-${(props.data.value as InspectorCustomState)._custom?.type}`

  else
    return ``
})

const { isExpanded, toggleCollapse } = useCollapse('inspector-state', `${props.no}-${props.depth}-${props.data.key}`)

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
    const silced = value.slice(0, 20)
    return silced.map((item, i) => ({
      key: i,
      value: item,
      ...inherit,
    }))
  }
  else if (typeof value === 'object') {
    value = Object.keys(value).map(key => ({
      key,
      value: value[key],
      ...inherit,
    }))
    if (type !== 'custom')
      value = sortByKey(value)
  }
  else {
    value = []
  }

  return value === props.data.value ? {} : value
})

const hasChildren = computed(() => {
  return Object.keys(normalizedChildField.value).length > 0
})
</script>

<template>
  <div class="pl-6" :style="{ paddingLeft: `${depth * 15 + 4}px` }">
    <template v-if="!hasChildren">
      <div>
        <span state-key whitespace-nowrap overflow-hidden text-ellipsis>{{ data.key }}</span>
        <span mx-1>:</span>
        <span :class="stateFormatClass">
          <span v-html="normalizedValue" />
        </span>
      </div>
    </template>
    <template v-else>
      <div cursor-pointer>
        <div flex items-center relative @click="toggleCollapse">
          <ExpandIcon :value="isExpanded" group-hover:text-white absolute left--6 />
          <span state-key whitespace-nowrap overflow-hidden text-ellipsis>{{ data.key }}</span>
          <span mx-1>:</span>
          <span :class="stateFormatClass">
            <span v-html="normalizedValue" />
          </span>
        </div>
        <div v-if="isExpanded">
          <InspectorStateField v-for="(field, index) in normalizedChildField" :key="index" :data="field" :depth="depth + 1" :no="no" />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
// function
:deep(.state-format-function) {
  --at-apply: "font-italic";
  & > span {
    --at-apply: "text-#0033cc dark:text-#997fff";
    font-family: Menlo, monospace;
  }
}

// component-definition
:deep(.state-format-component-definition) {
  --at-apply: text-primary-500;
  & > span {
    --at-apply: "text-#aaa";
  }
}

// component
:deep(.state-format-component) {
  --at-apply: text-primary-500;
  &::before {
    content: "<";
  }
   &::after {
    content: ">";
  }
  &::before, &::after {
    --at-apply: "text-#aaa";
  }
}
</style>
