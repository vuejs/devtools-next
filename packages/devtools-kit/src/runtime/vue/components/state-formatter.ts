import { ComponentState } from '@vue-devtools-next/schema'
import { getComponentName, getInstanceName } from './util'
import { processInstanceState } from './data'

function isRef(raw): boolean {
  return !!raw.__v_isRef
}

function isComputed(raw): boolean {
  return isRef(raw) && !!raw.effect
}

function isReactive(raw): boolean {
  return !!raw.__v_isReactive
}

function isReadOnly(raw): boolean {
  return !!raw.__v_isReadonly
}

export function toRaw(value) {
  if (value?.__v_raw)
    return value.__v_raw

  return value
}
export function getSetupStateInfo(raw) {
  return {
    ref: isRef(raw),
    computed: isComputed(raw),
    reactive: isReactive(raw),
    readonly: isReadOnly(raw),
  }
}

export function getFunctionDetails(func: Function) {
  let string = ''
  let matches: RegExpMatchArray | null = null
  try {
    string = Function.prototype.toString.call(func)
    matches = String.prototype.match.call(string, /\([\s\S]*?\)/)
  }
  catch (e) {
    // Func is probably a Proxy, which can break Function.prototype.toString()
  }
  // Trim any excess whitespace from the argument string
  const match = matches && matches[0]
  const args = typeof match === 'string'
    ? match
    : '(?)'
  const name = typeof func.name === 'string' ? func.name : ''
  return {
    _custom: {
      type: 'function',
      stateTypeName: `${escape(name)}${args}`,
      detail: string.trim() ? `${string}` : null,
    },
  }
}

export function getBigIntDetails(val: BigInt | bigint) {
  const stringifiedBigInt = BigInt.prototype.toString.call(val)
  return {
    _custom: {
      type: 'bigint',
      stateTypeName: `BigInt(${stringifiedBigInt})`,
      value: stringifiedBigInt,
    },
  }
}

export function getMapDetails(val: Map<string, unknown>) {
  const list: Array<Record<string, unknown>> = []
  val.forEach(
    (value, key) => list.push({
      key,
      value,
    }),
  )
  return {
    _custom: {
      type: 'map',
      stateTypeName: 'Map',
      value: list,
      readOnly: true,
      fields: {
        abstract: true,
      },
    },
  }
}

export function getSetDetails(val: Set<unknown>) {
  const list = Array.from(val)
  return {
    _custom: {
      type: 'set',
      stateTypeName: `Set[${list.length}]`,
      value: list,
      readOnly: true,
    },
  }
}

// @TODO: refactor
function getCatchedGetters(store) {
  const getters = {}

  const origGetters = store.getters || {}
  const keys = Object.keys(origGetters)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    Object.defineProperty(getters, key, {
      enumerable: true,
      get: () => {
        try {
          return origGetters[key]
        }
        catch (e) {
          return e
        }
      },
    })
  }

  return getters
}

// @TODO: refactor
export function getStoreDetails(store) {
  return {
    _custom: {
      type: 'store',
      stateTypeName: 'Store',
      value: {
        state: store.state,
        getters: getCatchedGetters(store),
      },
      fields: {
        abstract: true,
      },
    },
  }
}

// @TODO: refactor
export function getRouterDetails(router) {
  return {
    _custom: {
      type: 'router',
      stateTypeName: 'VueRouter',
      value: {
        options: router.options,
        currentRoute: router.currentRoute,
      },
      fields: {
        abstract: true,
      },
    },
  }
}

function reduceStateList(list: ComponentState[]) {
  if (!list.length)
    return undefined

  return list.reduce((map, item) => {
    const key = (item['type'] || 'data') as string
    const obj = map[key] = map[key] || {}
    obj[item.key as string] = item.value
    return map
  }, {})
}

function namedNodeMapToObject(map: NamedNodeMap) {
  const result: Record<string, unknown> = {}
  const l = map.length
  for (let i = 0; i < l; i++) {
    const node = map.item(i)
    result[node!.name] = node!.value
  }
  return result
}

// @TODO: fix circular dependency
export function getInstanceDetails(instance) {
  if (instance._)
    instance = instance._
  const state = processInstanceState(instance)
  return {
    _custom: {
      type: 'component',
      id: instance.__VUE_DEVTOOLS_UID__,
      stateTypeName: getInstanceName(instance),
      tooltip: 'Component instance',
      value: reduceStateList(state),
      fields: {
        abstract: true,
      },
    },
  }
}

export function getComponentDefinitionDetails(definition) {
  const display = getComponentName(definition)
  return {
    _custom: {
      type: 'component-definition',
      stateTypeName: display && definition.__file && definition.name ? display + definition.__file : 'Unknown Component',
      // @TODO: refactor
      key: display && definition.__file && definition.name ? display + definition.__file : 'Unknown Component',
      value: display && definition.__file && definition.name ? display + definition.__file : 'Unknown Component',
      tooltip: 'Component definition',
      ...definition.__file
        ? {
            file: definition.__file,
          }
        : {},
    },
  }
}

export function getHTMLElementDetails(value: HTMLElement) {
  try {
    return {
      _custom: {
        type: 'HTMLElement',
        stateTypeName: value.tagName.toLowerCase(),
        value: namedNodeMapToObject(value.attributes),
      },
    }
  }
  catch (e) {
    return {
      _custom: {
        type: 'HTMLElement',
        stateTypeName: String(value),
      },
    }
  }
}

export function getObjectDetails(object: Record<string, any>) {
  const info = getSetupStateInfo(object)

  const isState = info.ref || info.computed || info.reactive
  if (isState) {
    const stateTypeName = info.computed ? 'Computed' : info.ref ? 'Ref' : info.reactive ? 'Reactive' : null
    const value = toRaw(info.reactive ? object : object._value)
    const raw = object.effect?.raw?.toString() || object.effect?.fn?.toString()
    return {
      _custom: {
        type: stateTypeName?.toLowerCase(),
        stateTypeName,
        value,
        ...raw ? { raw } : {},
      },
    }
  }

  if (typeof object.__asyncLoader === 'function') {
    return {
      _custom: {
        type: 'component-definition',
        display: 'Async component definition',
      },
    }
  }
}
