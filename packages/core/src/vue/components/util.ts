import type { VueAppInstance } from '@vue-devtools-next/schema'
import { basename, classify } from '@vue-devtools-next/shared'

function getComponentTypeName(options: VueAppInstance['type']) {
  return options.name || options._componentTag || options.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ || options.__name
}

function getComponentFileName(options: VueAppInstance['type']) {
  const file = options.__file
  if (file)
    return classify(basename(file, '.vue'))
}

function saveComponentGussedName(instance: VueAppInstance, name: string) {
  instance.type.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ = name
  return name
}

export function getAppRecord(instance: VueAppInstance) {
  if (instance.root)
    return instance.appContext.app.__VUE_DEVTOOLS_APP_RECORD__
}

export function isFragment(instance: VueAppInstance) {
  const appRecord = getAppRecord(instance)
  // @TODO
  return false
  // if (appRecord)
  // return appRecord.options.types.Fragment === instance.subTree?.type
}

export function isBeingDestroyed(instance: VueAppInstance) {
  return instance._isBeingDestroyed || instance.isUnmounted
}

/**
 * Get the appropriate display name for an instance.
 *
 * @param {Vue} instance
 * @return {string}
 */
export function getInstanceName(instance: VueAppInstance) {
  const name = getComponentTypeName(instance.type || {})
  if (name)
    return name
  if (instance.root === instance)
    return 'Root'
  for (const key in instance.parent?.type?.components) {
    if (instance.parent.type.components[key] === instance.type)
      return saveComponentGussedName(instance, key)
  }

  for (const key in instance.appContext?.components) {
    if (instance.appContext.components[key] === instance.type)
      return saveComponentGussedName(instance, key)
  }

  const fileName = getComponentFileName(instance.type || {})
  if (fileName)
    return fileName

  return 'Anonymous Component'
}

/**
 * Returns a devtools unique id for instance.
 * @param {Vue} instance
 */
export function getUniqueComponentId(instance: VueAppInstance) {
  // @TODO
  const appId = instance.appContext.app.__VUE_DEVTOOLS_APP_RECORD_ID__ ?? 0
  const instanceId = instance === instance.root ? 'root' : instance.uid
  return `${appId}:${instanceId}`
}

export function getRenderKey(value: number | string | any[] | Object): string | number {
  if (value == null)
    return ''
  if (typeof value === 'number')
    return value

  else if (typeof value === 'string')
    return `'${value}'`

  else if (Array.isArray(value))
    return 'Array'

  else
    return 'Object'
}
