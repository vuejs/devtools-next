<script setup lang="ts">
import { computed } from 'vue'
import { formatInspectorStateValue, getInspectorStateValueType, getRaw } from '@vue/devtools-kit'
import type { InspectorCustomState, TimelineEvent } from '@vue/devtools-kit'
import StateViewer from '~/components/state/Viewer.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'

const props = defineProps<{
  data: TimelineEvent['event']
}>()

function normalizeValue(item) {
  const values = {
    value: '',
    extraValue: null,
  }
  const stateTypeName = (item as InspectorCustomState)._custom?.stateTypeName || item?.stateTypeName
  if (stateTypeName === 'Reactive') {
    values.value = stateTypeName
  }
  // @ts-expect-error @TODO: type
  else if (props.data.value?.fields?.abstract) {
    values.value = ''
  }
  else {
    values.value = formatInspectorStateValue(item)
    if (stateTypeName)
      values.extraValue = stateTypeName
  }
  return values
}

function normalizeChildren(item) {
  const result: any[] = []
  // @TODO: limit
  const raw = getRaw(item)
  const { value } = raw
  // @TODO: use shared isArray instead
  if (Array.isArray(value)) {
    console.log('x', value)
  }

  else if (typeof value === 'object') {
    // @TODO
    result.push(...normalizeState(value))
    console.log('x--', value, result)
  }

  return result
}

function normalizeStateItem(item) {
  const basicType = getInspectorStateValueType(item)
  const customType = basicType === 'custom' ? (item as InspectorCustomState)._custom?.type : ''
  const values = normalizeValue(item)
  const children = normalizeChildren(item)
  return {
    type: (basicType === 'custom' && !customType) ? 'string' : basicType,
    customType,
    children,
    values: {
      ...values,
      withStyles: !!customType,
    },
  }
}

function normalizeState(state) {
  const result: any[] = []
  for (const key in state) {
    const item = state[key]
    const normalizedItem = normalizeStateItem(item)
    result.push({
      key,
      editable: item.editable,
      ...normalizedItem,
    })
  }
  return result
}

const state: any = computed(() => normalizeState(props.data?.data))

createExpandedContext()
</script>

<template>
  <div p3>
    <StateViewer :data="state" />
  </div>
</template>
