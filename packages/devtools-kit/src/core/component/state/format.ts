import { INFINITY, NAN, NEGATIVE_INFINITY, UNDEFINED, rawTypeRE, specialTypeRE } from './constants'
import { isPlainObject } from './is'
import { escape, internalStateTokenToString } from './util'

export function getInspectorStateValueType(value, raw = true) {
  const type = typeof value
  if (value == null || value === UNDEFINED) {
    return 'null'
  }
  else if (
    type === 'boolean'
      || type === 'number'
      || value === INFINITY
      || value === NEGATIVE_INFINITY
      || value === NAN
  ) {
    return 'literal'
  }
  else if (value?._custom) {
    if ((raw || value._custom.display != null || value._custom.displayText != null))
      return 'custom'

    else
      return getInspectorStateValueType(value._custom.value)
  }
  else if (typeof value === 'string') {
    const typeMatch = specialTypeRE.exec(value)
    if (typeMatch) {
      const [, type] = typeMatch
      return `native ${type}`
    }
    else {
      return 'string'
    }
  }
  else if (Array.isArray(value) || (value?._isArray)) {
    return 'array'
  }
  else if (isPlainObject(value)) {
    return 'plain-object'
  }
  else {
    return 'unknown'
  }
}

export function formatInspectorStateValue(value, quotes = false) {
  let result
  const type = getInspectorStateValueType(value, false)
  if (type !== 'custom' && value?._custom)
    value = value._custom.value

  // eslint-disable-next-line no-cond-assign
  if ((result = internalStateTokenToString(value))) {
    return result
  }
  else if (type === 'custom') {
    return value._custom.displayText ?? value._custom.display
  }
  else if (type === 'array') {
    return `Array[${value.length}]`
  }
  else if (type === 'plain-object') {
    return `Object${Object.keys(value).length ? '' : ' (empty)'}`
  }
  else if (type?.includes('native')) {
    return escape(specialTypeRE.exec(value as string)?.[2] as string)
  }
  else if (typeof value === 'string') {
    const typeMatch = value.match(rawTypeRE)
    if (typeMatch)
      value = escape(typeMatch[1])

    else if (quotes)
      value = `<span>"</span>${escape(value)}<span>"</span>`

    else
      value = escape(value)

    value = value.replace(/ /g, '&nbsp;')
      .replace(/\n/g, '<span>\\n</span>')
  }
  return value
}
