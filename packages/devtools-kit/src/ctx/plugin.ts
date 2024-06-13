import { target } from '@vue/devtools-shared'
import { PluginDescriptor, PluginSetupFunction } from '../types'

type DevToolsKitPluginBuffer = [PluginDescriptor, PluginSetupFunction]
target.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__ ??= []

export const devtoolsPluginBuffer = new Proxy<DevToolsKitPluginBuffer[]>(target.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver)
  },
})
export function addDevToolsPluginToBuffer(pluginDescriptor: PluginDescriptor, setupFn: PluginSetupFunction) {
  devtoolsPluginBuffer.push([pluginDescriptor, setupFn])
}
