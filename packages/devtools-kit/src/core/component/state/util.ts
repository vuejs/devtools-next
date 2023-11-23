import { ESC, INFINITY, NAN, NEGATIVE_INFINITY, UNDEFINED, fnTypeRE } from './constants'
import { isComputed, isPlainObject, isPrimitive, isReactive, isReadOnly, isRef } from './is'

export function internalStateTokenToString(value: unknown) {
  if (value === null)
    return 'null'

  else if (value === UNDEFINED)
    return 'undefined'

  else if (value === NAN)
    return 'NaN'

  else if (value === INFINITY)
    return 'Infinity'

  else if (value === NEGATIVE_INFINITY)
    return '-Infinity'

  return false
}

/**
 * Convert prop type constructor to string.
 */
export function getPropType(type: Array<string | null | Function | number> | string | null | Function | number) {
  if (Array.isArray(type))
    return type.map(t => getPropType(t)).join(' or ')

  if (type == null)
    return 'null'

  const match = type.toString().match(fnTypeRE)
  return typeof type === 'function'
    ? (match && match[1]) || 'any'
    : 'any'
}

/**
 * Sanitize data to be posted to the other side.
 * Since the message posted is sent with structured clone,
 * we need to filter out any types that might cause an error.
 */
export function sanitize(data: unknown) {
  if (
    !isPrimitive(data)
    && !Array.isArray(data)
    && !isPlainObject(data)
  ) {
    // handle types that will probably cause issues in
    // the structured clone
    return Object.prototype.toString.call(data)
  }
  else {
    return data
  }
}

export function getSetupStateType(raw) {
  return {
    ref: isRef(raw),
    computed: isComputed(raw),
    reactive: isReactive(raw),
    readonly: isReadOnly(raw),
  }
}

export function toRaw(value) {
  if (value?.__v_raw)
    return value.__v_raw

  return value
}

export function escape(s: string) {
  return s.replace(/[<>"&]/g, (s: string) => {
    return ESC[s] || s
  })
}
