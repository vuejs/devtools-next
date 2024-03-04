import { formatInspectorStateValue, getInspectorStateValueType, getRaw } from '@vue/devtools-kit'
import type { InspectorCustomState } from '@vue/devtools-kit'
import { isArray, isObject } from '@vue/devtools-shared'

interface NormalizedStateItem {
  key: string
  editable: boolean
}

function normalizeStateValue(state: InspectorCustomState & { stateTypeName?: string }) {
  const values: {
    value: string
    extraValue: string
  } = {
    value: '',
    extraValue: null!,
  }
  const stateTypeName = state._custom?.stateTypeName || state?.stateTypeName
  if (stateTypeName === 'Reactive') {
    values.value = stateTypeName
  }
  // @ts-expect-error @TODO: type
  else if (props.data.value?.fields?.abstract) {
    values.value = ''
  }
  else {
    values.value = formatInspectorStateValue(state)
    if (stateTypeName)
      values.extraValue = stateTypeName
  }
  return values
}

function normalizeStateChildren(item: InspectorCustomState) {
  const result: NormalizedStateItem[] = []
  // @TODO: limit
  const raw = getRaw(item)
  const { value } = raw
  // @TODO: use shared isArray instead
  if (isArray(value)) {
    console.log('x', value)
  }

  else if (isObject(value)) {
    // @TODO
    result.push(...normalizeState(value))
    console.log('x--', value, result)
  }

  return result
}

function normalizeStateItem(state: InspectorCustomState) {
  const basicType = getInspectorStateValueType(state)
  const customType = basicType === 'custom' ? state._custom?.type : ''
  const values = normalizeStateValue(state)
  const children = normalizeStateChildren(state)
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

export function normalizeState(state: Record<string, InspectorCustomState> | object) {
  const result: NormalizedStateItem[] = []
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
