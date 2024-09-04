import { target } from '@vue/devtools-shared'
import type { App } from 'vue'
import { debounce } from 'perfect-debounce'
import type { CustomInspectorOptions, PluginDescriptor } from '../types'
import { getAppRecord } from '../core/component/utils'
import { activeAppRecord } from './state'
import { DevToolsMessagingHookKeys } from './hook'
import { devtoolsTimelineLayers } from './timeline'
import { devtoolsContext } from '.'

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

export const callInspectorUpdatedHook = debounce(() => {
  devtoolsContext.hooks.callHook(DevToolsMessagingHookKeys.SEND_INSPECTOR_TO_CLIENT, getActiveInspectors())
})

export function addInspector(inspector: CustomInspectorOptions, descriptor: PluginDescriptor) {
  devtoolsInspector.push({
    options: inspector,
    descriptor,
    treeFilter: '',
    selectedNodeId: '',
    appRecord: getAppRecord(descriptor.app),
  })

  callInspectorUpdatedHook()
}

export function getActiveInspectors() {
  return devtoolsInspector
    .filter(inspector => inspector.descriptor.app === activeAppRecord.value.app)
    .filter(inspector => inspector.descriptor.id !== 'components')
    .map((inspector) => {
      const descriptor = inspector.descriptor
      const options = inspector.options
      return {
        id: options.id,
        label: options.label,
        logo: descriptor.logo!,
        icon: `custom-ic-baseline-${options?.icon?.replace(/_/g, '-')}`,
        packageName: descriptor.packageName,
        homepage: descriptor.homepage,
      }
    })
}

export function getInspectorInfo(id: string) {
  const inspector = getInspector(id, activeAppRecord.value.app)
  if (!inspector)
    return
  const descriptor = inspector.descriptor
  const options = inspector.options
  const timelineLayers = devtoolsTimelineLayers.filter(layer => layer.descriptorId === descriptor.id).map(item => ({
    id: item.id,
    label: item.label,
    color: item.color,
  }))
  return {
    id: options.id,
    label: options.label,
    logo: descriptor.logo,
    packageName: descriptor.packageName,
    homepage: descriptor.homepage,
    timelineLayers,
  }
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
