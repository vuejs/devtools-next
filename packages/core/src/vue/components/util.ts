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
