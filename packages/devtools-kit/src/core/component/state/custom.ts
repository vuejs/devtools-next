import type { InspectorState } from '@vue-devtools-next/schema'
import { getComponentName, getInstanceName } from '../general/util'
import { processInstanceState } from './process'
import { escape, getSetupStateType, toRaw } from './util'

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
      displayText: `<span style="opacity:.5;">function</span> ${escape(name)}${args}`,
      tooltipText: string.trim() ? `<pre>${string}</pre>` : null,
    },
  }
}

export function getBigIntDetails(val: bigint | bigint) {
  const stringifiedBigInt = BigInt.prototype.toString.call(val)
  return {
    _custom: {
      type: 'bigint',
      displayText: `BigInt(${stringifiedBigInt})`,
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
      displayText: 'Map',
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
      displayText: `Set[${list.length}]`,
      value: list,
      readOnly: true,
    },
  }
}

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

function reduceStateList(list: InspectorState[]) {
  if (!list.length)
    return undefined

  return list.reduce((map, item) => {
    const key = (item.type || 'data') as string
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

export function getStoreDetails(store) {
  return {
    _custom: {
      type: 'store',
      displayText: 'Store',
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

export function getRouterDetails(router) {
  return {
    _custom: {
      type: 'router',
      displayText: 'VueRouter',
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

// @TODO: fix circular dependency
export function getInstanceDetails(instance) {
  if (instance._)
    instance = instance._
  const state = processInstanceState(instance)
  return {
    _custom: {
      type: 'component',
      id: instance.__VUE_DEVTOOLS_UID__,
      displayText: getInstanceName(instance),
      tooltipText: 'Component instance',
      value: reduceStateList(state),
      fields: {
        abstract: true,
      },
    },
  }
}

export function getComponentDefinitionDetails(definition) {
  let display = getComponentName(definition)
  if (display) {
    if (definition.name && definition.__file)
      display += ` <span>(${definition.__file})</span>`
  }
  else {
    display = '<i>Unknown Component</i>'
  }
  return {
    _custom: {
      type: 'component-definition',
      displayText: display,
      tooltipText: 'Component definition',
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
        displayText: `<span class="opacity-30">&lt;</span><span class="text-blue-500">${value.tagName.toLowerCase()}</span><span class="opacity-30">&gt;</span>`,
        value: namedNodeMapToObject(value.attributes),
      },
    }
  }
  catch (e) {
    return {
      _custom: {
        type: 'HTMLElement',
        displayText: `<span class="text-blue-500">${String(value)}</span>`,
      },
    }
  }
}

export function getObjectDetails(object: Record<string, any>) {
  const info = getSetupStateType(object)

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
        ...raw ? { tooltipText: `<span class="font-mono">${raw}</span>` } : {},
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
