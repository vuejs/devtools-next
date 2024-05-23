import { target } from '@vue/devtools-shared'
import type { App } from 'vue'
import type { CustomInspectorOptions, PluginDescriptor } from '../types-next'

interface DevToolsKitInspector {
  options: CustomInspectorOptions
  descriptor: PluginDescriptor
  treeFilter: string
  selectedNodeId: string
  appRecord: unknown
}
target.__VUE_DEVTOOLS_KIT_INSPECTOR__ ??= []

export const devtoolsInspector = new Proxy(target.__VUE_DEVTOOLS_KIT_INSPECTOR__, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver)
  },
}) as DevToolsKitInspector[]

export function addInspector(inspector: CustomInspectorOptions, descriptor: PluginDescriptor) {
  devtoolsInspector.push({
    options: inspector,
    descriptor,
    treeFilter: '',
    selectedNodeId: '',
    // @TODO: get app record by descriptor.app
    appRecord: null,
  })
}

export function getInspector(id: string, app?: App) {
  return devtoolsInspector.find(inspector => inspector.options.id === id && (app ? inspector.descriptor.app === app : true))
}
export function getInspectorActions(id: string) {
  const inspector = getInspector(id)
  return inspector?.options.actions
}

export function getInspectorNodeActions(id: string) {
  const inspector = getInspector(id)
  return inspector?.options.nodeActions
}
