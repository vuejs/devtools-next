import type { AppRecord, VueAppInstance } from '@vue/devtools-schema'
import { basename, classify } from '@vue/devtools-shared'
import { Fragment } from 'vue'

function getComponentTypeName(options: VueAppInstance['type']) {
  return options.name || options._componentTag || options.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ || options.__name
}

function getComponentFileName(options: VueAppInstance['type']) {
  const file = options.__file
  if (file)
    return classify(basename(file, '.vue'))
}

export function getComponentName(options: VueAppInstance['type']) {
  const name = options.displayName || options.name || options._componentTag
  if (name)
    return name

  return getComponentFileName(options)
}

function saveComponentGussedName(instance: VueAppInstance, name: string) {
  instance.type.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ = name
  return name
}

export function getAppRecord(instance: VueAppInstance) {
  if (instance.__VUE_DEVTOOLS_APP_RECORD__)
    return instance.__VUE_DEVTOOLS_APP_RECORD__
  else if (instance.root)
    return instance.appContext.app.__VUE_DEVTOOLS_APP_RECORD__
}

export async function getComponentId(options: { app: VueAppInstance, uid: number, instance: VueAppInstance }) {
  const { app, uid, instance } = options
  try {
    if (instance.__VUE_DEVTOOLS_UID__)
      return instance.__VUE_DEVTOOLS_UID__

    const appRecord = await getAppRecord(app)
    if (!appRecord)
      return null

    const isRoot = appRecord.rootInstance === instance
    return `${appRecord.id}:${isRoot ? 'root' : uid}`
  }
  catch (e) {

  }
}

export function isFragment(instance: VueAppInstance) {
  const subTreeType = instance.subTree?.type
  // TODO: resolve static type, the subTree.children of static type will be a string instead of children like Fragment
  // return subTreeType === Fragment || (
  //   subTreeType === Static
  //     // @ts-expect-error vue internal type
  //     ? instance.subTree.staticCount > 1
  //     : false
  // )
  return subTreeType === Fragment
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
  const appId = instance?.appContext?.app?.__VUE_DEVTOOLS_APP_RECORD_ID__ ?? 0
  const instanceId = instance === instance.root ? 'root' : instance.uid
  return `${appId}:${instanceId}`
}

export function getRenderKey(value: symbol | number | string | unknown[] | symbol | object | null): string | number {
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

export function returnError(cb: () => unknown): number | string {
  try {
    return cb() as number | string
  }
  catch (e) {
    return e as string
  }
}

export function getComponentInstance(appRecord: AppRecord, instanceId: string | undefined) {
  instanceId = instanceId || `${appRecord.id}:root`

  const instance = appRecord.instanceMap.get(instanceId)

  // @TODO: find a better way to handle it
  return instance || appRecord.instanceMap.get(':root')
}
