import { target } from '@vue/devtools-shared'
import type { PluginDescriptor, TimelineLayerOptions } from '../types'

interface DevToolsKitTimelineLayer extends TimelineLayerOptions {
  appRecord: unknown
}

target.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS ??= []

export const devtoolsTimelineLayers = new Proxy<DevToolsKitTimelineLayer[]>(target.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver)
  },
})

export function addTimelineLayer(options: TimelineLayerOptions, descriptor: PluginDescriptor) {
  devtoolsTimelineLayers.push({
    ...options,
    // @TODO: get app record by descriptor.app
    appRecord: null,
  })
}
