import { INFINITY, MAX_ARRAY_SIZE, MAX_STRING_SIZE, NAN, NEGATIVE_INFINITY, UNDEFINED } from './constants'
import { getBigIntDetails, getComponentDefinitionDetails, getDateDetails, getFunctionDetails, getHTMLElementDetails, getInstanceDetails, getMapDetails, getObjectDetails, getRouterDetails, getSetDetails, getStoreDetails } from './custom'
import { isVueInstance } from './is'
import { sanitize } from './util'

const seenInstance = new WeakSet()

export function stringifyReplacer(key: string) {
  // fix vue warn for compilerOptions passing-options-to-vuecompiler-sfc
  // @TODO: need to check if it will cause any other issues
  if (key === 'compilerOptions')
    return

  // @ts-expect-error invalid this
  const val: unknown = this[key]
  // eslint-enable
  const type = typeof val
  if (Array.isArray(val)) {
    const l = val.length
    if (l > MAX_ARRAY_SIZE) {
      return {
        _isArray: true,
        length: l,
        items: val.slice(0, MAX_ARRAY_SIZE),
      }
    }
    return val
  }
  else if (typeof val === 'string') {
    if (val.length > MAX_STRING_SIZE)
      return `${val.substring(0, MAX_STRING_SIZE)}... (${(val.length)} total length)`

    else
      return val
  }
  else if (type === 'undefined') {
    return UNDEFINED
  }
  else if (val === Number.POSITIVE_INFINITY) {
    return INFINITY
  }
  else if (val === Number.NEGATIVE_INFINITY) {
    return NEGATIVE_INFINITY
  }
  else if (typeof val === 'function') {
    return getFunctionDetails(val)
  }
  else if (type === 'symbol') {
    return `[native Symbol ${Symbol.prototype.toString.call(val)}]`
  }
  else if (typeof val === 'bigint') {
    return getBigIntDetails(val)
  }
  else if (val !== null && typeof val === 'object') {
    const proto = Object.prototype.toString.call(val)
    if (proto === '[object Map]') {
      return getMapDetails(val as Map<string, unknown>)
    }
    else if (proto === '[object Set]') {
      return getSetDetails(val as Set<unknown>)
    }
    else if (proto === '[object RegExp]') {
      // special handling of native type
      return `[native RegExp ${RegExp.prototype.toString.call(val)}]`
    }
    else if (proto === '[object Date]') {
      return getDateDetails(val as Date)
    }
    else if (proto === '[object Error]') {
      return `[native Error ${(val as Error).message}<>${(val as Error).stack}]`
    }
    // @ts-expect-error skip type check
    else if (val.state && val._vm) {
      return getStoreDetails(val)
    }
    else if (val.constructor && val.constructor.name === 'VueRouter') {
      return getRouterDetails(val)
    }
    else if (isVueInstance(val as Record<string, unknown>)) {
      const componentVal = getInstanceDetails(val)
      if (seenInstance.has(val)) {
        return `[[CircularRef]] <${componentVal._custom.displayText}>`
      }
      seenInstance.add(val)
      return componentVal
    }
    // @ts-expect-error skip type check
    else if (typeof val.render === 'function') {
      return getComponentDefinitionDetails(val)
    }
    else if (val.constructor && val.constructor.name === 'VNode') {
    // @ts-expect-error skip type check
      return `[native VNode <${val.tag}>]`
    }
    else if (typeof HTMLElement !== 'undefined' && val instanceof HTMLElement) {
      return getHTMLElementDetails(val)
    }
    // @ts-expect-error skip type check
    else if (val.constructor?.name === 'Store' && val._wrappedGetters) {
      return '[object Store]'
    }
    // @ts-expect-error skip type check
    else if (val.currentRoute) {
      return '[object Router]'
    }
    const customDetails = getObjectDetails(val)
    if (customDetails != null)
      return customDetails
  }
  else if (Number.isNaN(val)) {
    return NAN
  }
  return sanitize(val)
}
