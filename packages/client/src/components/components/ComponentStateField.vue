<script setup lang="ts">
import type { ComponentState } from '@vue-devtools-next/schema'
import { sortByKey } from '@vue-devtools-next/shared'
import { componentStateValueType, formatComponentStateValue } from 'vue-devtools-kit/shared'

const props = withDefaults(defineProps<{
  data: ComponentState
  depth?: number
  no: number
}>(), {
  depth: 0,
})

const value = formatComponentStateValue(props.data.value)
const type = componentStateValueType(props.data.value)
const stateFormatClass = computed(() => {
  if (type === 'custom') {
    // @ts-expect-error @TODO: type
    return `state-format-${props.data.value?._custom?.type}`
  }
  else {
    return ``
  }
})

const { isExpanded, toggleCollapse } = useCollapse('component-state', `${props.no}-${props.depth}-${props.data.key}`)

const normalizedValue = computed(() => {
  // @ts-expect-error @TODO: type
  const stateTypeName = props.data?._custom?.stateTypeName || props.data?.stateTypeName
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
    // @ts-expect-error @TODO: type
    inherit = props.data?.value?._custom?.fields || {}
    // @ts-expect-error @TODO: type
    value = props.data?.value?._custom.value
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
          <ComponentStateField v-for="(field, index) in normalizedChildField" :key="index" :data="field" :depth="depth + 1" :no="no" />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
// @TODO: other custom type
:deep(.state-format-function) {
  --at-apply: "font-italic";
  & > span {
    --at-apply: "text-#0033cc dark:text-#997fff";
    font-family: Menlo, monospace;
  }
}

:deep(.state-format-component-definition) {
  --at-apply: text-primary-500;
  & > span {
    --at-apply: "text-#aaa";
  }
}
</style>
