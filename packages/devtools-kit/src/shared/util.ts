import { formatInspectorStateValue, getInspectorStateValueType, getRawValue } from '../core/component/state/format'
import { stringifyReplacer } from '../core/component/state/replacer'
import { reviver } from '../core/component/state/reviver'
import { parseCircularAutoChunks, stringifyCircularAutoChunks } from './transfer'

export function stringify<T extends object = Record<string, unknown>>(data: T) {
  return stringifyCircularAutoChunks(data as Record<string, unknown>, stringifyReplacer)
}

export function parse(data: string, revive = false) {
  if (!data)
    return {}

  return revive
    ? parseCircularAutoChunks(data, reviver)
    : parseCircularAutoChunks(data)
}

export {
  formatInspectorStateValue,
  getInspectorStateValueType,
  getRawValue,
}
