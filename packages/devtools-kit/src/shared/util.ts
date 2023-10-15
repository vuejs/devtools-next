import { componentStateValueType, formatComponentStateValue, replacerForInternal, reviver } from '../core/component/general/data'
import { parseCircularAutoChunks, stringifyCircularAutoChunks } from './transfer'

export function stringify<T extends object = Record<string, unknown>>(data: T) {
  return stringifyCircularAutoChunks(data as Record<string, unknown>, replacerForInternal)
}

export function parse(data: unknown[], revive = false) {
  return revive
    ? parseCircularAutoChunks(data, reviver)
    : parseCircularAutoChunks(data)
}

export {
  componentStateValueType,
  formatComponentStateValue,
}
