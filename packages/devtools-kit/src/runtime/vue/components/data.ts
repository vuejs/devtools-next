import { ComponentState, VueAppInstance } from '@vue-devtools-next/schema'
import { camelize } from '@vue-devtools-next/shared'
import { returnError } from './util'
import { stringifyCircularAutoChunks } from './transfer'
import {
  getBigIntDetails,
  getComponentDefinitionDetails,
  getFunctionDetails,
  getHTMLElementDetails,
  getInstanceDetails,
  getMapDetails,
  getObjectDetails,
  getRouterDetails,
  getSetDetails,
  getSetupStateInfo,
  getStoreDetails,
  toRaw,
} from './state-formatter'

const vueBuiltins = [
  'nextTick',
  'defineComponent',
  'defineAsyncComponent',
  'defineCustomElement',
  'ref',
  'computed',
  'reactive',
  'readonly',
  'watchEffect',
  'watchPostEffect',
  'watchSyncEffect',
  'watch',
  'isRef',
  'unref',
  'toRef',
  'toRefs',
  'isProxy',
  'isReactive',
  'isReadonly',
  'shallowRef',
  'triggerRef',
  'customRef',
  'shallowReactive',
  'shallowReadonly',
  'toRaw',
  'markRaw',
  'effectScope',
  'getCurrentScope',
  'onScopeDispose',
  'onMounted',
  'onUpdated',
  'onUnmounted',
  'onBeforeMount',
  'onBeforeUpdate',
  'onBeforeUnmount',
  'onErrorCaptured',
  'onRenderTracked',
  'onRenderTriggered',
  'onActivated',
  'onDeactivated',
  'onServerPrefetch',
  'provide',
  'inject',
  'h',
  'mergeProps',
  'cloneVNode',
  'isVNode',
  'resolveComponent',
  'resolveDirective',
  'withDirectives',
  'withModifiers',
]

const rawTypeRE = /^\[object (\w+)]$/
const specialTypeRE = /^\[native (\w+) (.*?)(<>((.|\s)*))?\]$/
const fnTypeRE = /^(?:function|class) (\w+)/
const MAX_STRING_SIZE = 10000
const MAX_ARRAY_SIZE = 5000
export const UNDEFINED = '__vue_devtool_undefined__'
export const INFINITY = '__vue_devtool_infinity__'
export const NEGATIVE_INFINITY = '__vue_devtool_negative_infinity__'
export const NAN = '__vue_devtool_nan__'

function specialTokenToString(value) {
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

function isVueInstance(value) {
  return value._ && Object.keys(value._).includes('vnode')
}

export function isPlainObject(obj: unknown) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function isPrimitive(data: unknown) {
  if (data == null)
    return true

  const type = typeof data
  return (
    type === 'string'
    || type === 'number'
    || type === 'boolean'
  )
}

/**
 * Convert prop type constructor to string.
 */
function getPropType(type: Array<string | null | Function | number> | string | null | Function | number) {
  if (Array.isArray(type))
    return type.map(t => getPropType(t)).join(' or ')

  if (type == null)
    return 'null'

  const match = type.toString().match(fnTypeRE)
  return typeof type === 'function'
    ? (match && match[1]) || 'any'
    : 'any'
}

function mergeOptions(
  to: any,
  from: any,
  instance: VueAppInstance,
) {
  if (typeof from === 'function')
    from = from.options

  if (!from)
    return to

  const { mixins, extends: extendsOptions } = from

  extendsOptions && mergeOptions(to, extendsOptions, instance)
  mixins
    && mixins.forEach(m =>
      mergeOptions(to, m, instance),
    )

  for (const key of ['computed', 'inject']) {
    if (Object.prototype.hasOwnProperty.call(from, key)) {
      if (!to[key])
        to[key] = from[key]

      else
        Object.assign(to[key], from[key])
    }
  }
  return to
}

// @TODO: maybe should be exported from vue core?
function resolveMergedOptions(
  instance: VueAppInstance,
) {
  const raw = instance.type
  const { mixins, extends: extendsOptions } = raw
  const globalMixins = instance.appContext.mixins
  if (!globalMixins.length && !mixins && !extendsOptions)
    return raw
  const options = {}
  globalMixins.forEach(m => mergeOptions(options, m, instance))
  mergeOptions(options, raw, instance)
  return options
}

/**
 * Process the props of an instance.
 * Make sure return a plain object because window.postMessage()
 * will throw an Error if the passed object contains Functions.
 *
 */
function processProps(instance: VueAppInstance) {
  const props: ComponentState[] = []
  const propDefinitions = instance.type.props

  for (const key in instance.props) {
    const propDefinition = propDefinitions ? propDefinitions[key] : null
    const camelizeKey = camelize(key)
    props.push({
      type: 'props',
      key: camelizeKey,
      value: returnError(() => instance.props[key]),
      meta: propDefinition
        ? {
            type: propDefinition.type ? getPropType(propDefinition.type) : 'any',
            required: !!propDefinition.required,
            ...propDefinition.default
              ? {
                  default: propDefinition.default.toString(),
                }
              : {},
          }
        : { type: 'invalid' },
    })
  }

  return props
}

/**
 * Process state, filtering out props and "clean" the result
 * with a JSON dance. This removes functions which can cause
 * errors during structured clone used by window.postMessage.
 *
 */
function processState(instance: VueAppInstance) {
  const type = instance.type
  const props = type.props
  const getters
    = type.vuex
    && type.vuex.getters
  const computedDefs = type.computed

  const data = {
    ...instance.data,
    ...instance.renderContext,
  }

  return Object.keys(data)
    .filter(key => (
      !(props && key in props)
      && !(getters && key in getters)
      && !(computedDefs && key in computedDefs)
    ))
    .map(key => ({
      key,
      type: 'data',
      value: returnError(() => data[key]),
      editable: true,
    }))
}

function processSetupState(instance: VueAppInstance) {
  const raw = instance.devtoolsRawSetupState || {}
  return Object.keys(instance.setupState)
    .filter(key => !vueBuiltins.includes(key) && key.split(/(?=[A-Z])/)[0] !== 'use')
    .map((key) => {
      const value = returnError(() => toRaw(instance.setupState[key])) as unknown as {
        render: Function
        __asyncLoader: Function

      }

      const rawData = raw[key] as {
        effect: {
          raw: Function
          fn: Function
        }
      }

      let result: Partial<ComponentState>

      // @TODO: need to re-design this?
      let isOtherType = typeof value === 'function'
        || typeof value?.render === 'function'
        || typeof value?.__asyncLoader === 'function'

      if (rawData) {
        const info = getSetupStateInfo(rawData)

        const stateTypeName = info.computed ? 'Computed' : info.ref ? 'Ref' : info.reactive ? 'Reactive' : null
        const isState = info.ref || info.computed || info.reactive
        const raw = rawData.effect?.raw?.toString() || rawData.effect?.fn?.toString()

        if (stateTypeName)
          isOtherType = false

        result = {
          ...stateTypeName ? { stateTypeName } : {},
          ...raw ? { raw } : {},
          editable: isState && !info.readonly,
        }
      }

      const type = isOtherType ? 'setup (other)' : 'setup'

      return {
        key,
        value,
        type,
        // @ts-expect-error ignore
        ...result,
      } as ComponentState
    })
}

/**
 * Process the computed properties of an instance.
 */
function processComputed(instance: VueAppInstance, mergedType: Record<string, unknown>) {
  const type = mergedType
  const computed: ComponentState[] = []
  const defs = type.computed || {}
  // use for...in here because if 'computed' is not defined
  // on component, computed properties will be placed in prototype
  // and Object.keys does not include
  // properties from object's prototype
  for (const key in defs) {
    const def = defs[key]
    const type = typeof def === 'function' && def.vuex
      ? 'vuex bindings'
      : 'computed'
    computed.push({
      type,
      key,
      value: returnError(() => instance?.proxy?.[key]),
      editable: typeof def.set === 'function',
    })
  }

  return computed
}

function processAttrs(instance: VueAppInstance) {
  return Object.keys(instance.attrs)
    .map(key => ({
      type: 'attrs',
      key,
      value: returnError(() => instance.attrs[key]),
    }))
}

function processProvide(instance: VueAppInstance) {
  return Reflect.ownKeys(instance.provides)
    .map(key => ({
      type: 'provided',
      key: key.toString(),
      value: returnError(() => instance.provides[key]),
    }))
}

function processInject(instance: VueAppInstance, mergedType: Record<string, unknown>) {
  if (!mergedType?.inject)
    return []
  let keys: any[] = []
  let defaultValue
  if (Array.isArray(mergedType.inject)) {
    keys = mergedType.inject.map(key => ({
      key,
      originalKey: key,
    }))
  }
  else {
    keys = Reflect.ownKeys(mergedType.inject).map((key) => {
      const value = (mergedType.inject as Record<symbol, unknown>)[key]
      let originalKey
      if (typeof value === 'string' || typeof value === 'symbol') {
        originalKey = value
      }
      else {
        originalKey = value.from
        defaultValue = value.default
      }
      return {
        key,
        originalKey,
      }
    })
  }
  return keys.map(({ key, originalKey }) => ({
    type: 'injected',
    key: originalKey && key !== originalKey ? `${originalKey.toString()} ➞ ${key.toString()}` : key.toString(),
    // eslint-disable-next-line no-prototype-builtins
    value: returnError(() => instance.ctx.hasOwnProperty(key) ? instance.ctx[key] : instance.provides.hasOwnProperty(originalKey) ? instance.provides[originalKey] : defaultValue),
  }))
}

function processRefs(instance: VueAppInstance) {
  return Object.keys(instance.refs)
    .map(key => ({
      type: 'refs',
      key,
      value: returnError(() => instance.refs[key]),
    }))
}

function processEventListeners(instance: VueAppInstance) {
  const emitsDefinition = instance.type.emits
  const declaredEmits = Array.isArray(emitsDefinition) ? emitsDefinition : Object.keys(emitsDefinition ?? {})
  const keys = Object.keys(instance.vnode.props ?? {})
  const result: ComponentState[] = []
  for (const key of keys) {
    const [prefix, ...eventNameParts] = key.split(/(?=[A-Z])/)
    if (prefix === 'on') {
      const eventName = eventNameParts.join('-').toLowerCase()
      const isDeclared = declaredEmits.includes(eventName)
      result.push({
        type: 'event listeners',
        key: eventName,
        value: {
          _custom: {
            display: isDeclared ? '✅ Declared' : '⚠️ Not declared',
            tooltip: !isDeclared ? `The event <code>${eventName}</code> is not declared in the <code>emits</code> option. It will leak into the component's attributes (<code>$attrs</code>).` : null,
          },
        },
      })
    }
  }
  return result
}

/**
 * Sanitize data to be posted to the other side.
 * Since the message posted is sent with structured clone,
 * we need to filter out any types that might cause an error.
 */
function sanitize(data: unknown) {
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

export function processInstanceState(instance: VueAppInstance) {
  const mergedType = resolveMergedOptions(instance)
  return processProps(instance).concat(
    processState(instance),
    processSetupState(instance),
    processComputed(instance, mergedType),
    processAttrs(instance),
    processProvide(instance),
    processInject(instance, mergedType),
    processRefs(instance),
    processEventListeners(instance),
  )
}

function replacerForInternal(key: string) {
  // @ts-expect-error this
  // eslint-disable-next-line @typescript-eslint/no-invalid-this
  const val: unknown = this[key]
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
      return `[native Date ${Date.prototype.toString.call(val)}]`
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
    else if (isVueInstance(val)) {
      return getInstanceDetails(val)
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

export function stringify<T extends Object = Record<string, unknown>>(data: T) {
  return stringifyCircularAutoChunks(data as Record<string, unknown>, replacerForInternal)
}

// @TODO: move to ?

export function valueType(value: string | number | Record<string, any> | Array<unknown>, raw = true) {
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
  else if (typeof value === 'object' && !Array.isArray(value)) {
    if (value?._custom) {
      if ((raw || value._custom.display != null))
        return 'custom'

      else
        return valueType(value._custom.value)
    }
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
  // @ts-expect-error skip
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

export function formattedValue(value, quotes = true) {
  let result
  const type = valueType(value, false)
  if (type !== 'custom' && value?._custom)
    value = value._custom.value

  // eslint-disable-next-line no-cond-assign
  if ((result = specialTokenToString(value))) {
    return result
  }
  else if (type === 'custom') {
    return value._custom.display
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
