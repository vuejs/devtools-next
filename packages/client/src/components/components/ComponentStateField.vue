<script setup lang="ts">
import type { ComponentState } from '@vue-devtools-next/schema'
import { formattedValue, valueType } from 'vue-devtools-kit'
import { sortByKey } from '@vue-devtools-next/shared'

const props = withDefaults(defineProps<{
  data: ComponentState
  depth?: number
  no: number
}>(), {
  depth: 0,
})

const value = formattedValue(props.data.value)
const type = valueType(props.data.value)

const stateExpandedMap = ref<Record<string, boolean>>({})

const isExpanded = (id: string) => stateExpandedMap.value[id]

function toggleExpanded(id: string) {
  stateExpandedMap.value[id] = !stateExpandedMap.value[id]
}

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
    // @TOOD: += stateTypeName
    // if (stateTypeName)
    //   return stateTypeName

    return value
  }
})

const rawValue = computed(() => {
  let value = props.data.value
  const isCustom = type === 'custom'
  let inherit = {}
  if (isCustom) {
  // @ts-expect-error @TODO: type
    inherit = props.data?._custom.fields || {}
    // @ts-expect-error @TODO: type
    value = props.data?._custom.value
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
        <span state-key>{{ data.key }}</span>
        <span mx-1>:</span>
        <span :class="[type && `state-value-${type}`]">
          {{ normalizedValue }}
        </span>
      </div>
    </template>
    <template v-else>
      <div cursor-pointer>
        <div flex items-center relative @click="toggleExpanded(`${data.key}-${no}`)">
          <ExpandIcon :value="isExpanded(`${data.key}-${no}`)" group-hover:text-white absolute left--6 />
          <span state-key>{{ data.key }}</span>
          <span mx-1>:</span>
          <span :class="[type && `state-value-${type}`]">
            {{ normalizedValue }}
          </span>
        </div>
        <div v-if="isExpanded(`${data.key}-${no}`)">
          <ComponentStateField v-for="(field, index) in normalizedChildField" :key="index" :data="field" :depth="depth + 1" :no="no" />
        </div>
      </div>
    </template>
  </div>
</template>
