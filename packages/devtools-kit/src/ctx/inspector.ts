import { target } from '@vue/devtools-shared'
import type { App } from 'vue'
import type { CustomInspectorOptions, PluginDescriptor } from '../types'
import { getAppRecord } from '../core/component/utils'

interface DevToolsKitInspector {
  options: CustomInspectorOptions
  descriptor: PluginDescriptor
  treeFilter: string
  selectedNodeId: string
  appRecord: unknown
}
target.__VUE_DEVTOOLS_KIT_INSPECTOR__ ??= []

export const devtoolsInspector = new Proxy<DevToolsKitInspector[]>(target.__VUE_DEVTOOLS_KIT_INSPECTOR__, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver)
  },
})

export function addInspector(inspector: CustomInspectorOptions, descriptor: PluginDescriptor) {
  devtoolsInspector.push({
    options: inspector,
    descriptor,
    treeFilter: '',
    selectedNodeId: '',
    appRecord: getAppRecord(descriptor.app),
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
