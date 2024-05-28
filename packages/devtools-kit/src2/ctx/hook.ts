import { createHooks } from 'hookable'
import type {
  App,
  ComponentInstance,
  ComponentTreeNode,
  CustomInspectorNode,
  CustomInspectorOptions,
  CustomInspectorState,
  DevToolsPlugin,
  EditStatePayload,
  InspectedComponentData,
  TimelineEvent,
  TimelineEventOptions,
  TimelineLayerOptions,
} from '../types'
import { addInspector, getInspector } from './inspector'
import { addTimelineLayer } from './timeline'

// v6 plugin api hooks
export enum DevToolsV6PluginAPIHookKeys {
  VISIT_COMPONENT_TREE = 'visitComponentTree',
  INSPECT_COMPONENT = 'inspectComponent',
  EDIT_COMPONENT_STATE = 'editComponentState',
  GET_INSPECTOR_TREE = 'getInspectorTree',
  GET_INSPECTOR_STATE = 'getInspectorState',
  EDIT_INSPECTOR_STATE = 'editInspectorState',
  INSPECT_TIMELINE_EVENT = 'inspectTimelineEvent',
  TIMELINE_CLEARED = 'timelineCleared',
  SET_PLUGIN_SETTINGS = 'setPluginSettings',
}

export interface DevToolsV6PluginAPIHookPayloads {
  [DevToolsV6PluginAPIHookKeys.VISIT_COMPONENT_TREE]: {
    app: App
    componentInstance: ComponentInstance
    treeNode: ComponentTreeNode
    filter: string
  }
  [DevToolsV6PluginAPIHookKeys.INSPECT_COMPONENT]: {
    app: App
    componentInstance: ComponentInstance
    instanceData: InspectedComponentData
  }
  [DevToolsV6PluginAPIHookKeys.EDIT_COMPONENT_STATE]: {
    app: App
    inspectorId: string
    nodeId: string
    path: string[]
    type: string
    state: EditStatePayload
    set: (object: any, path?: string | (string[]), value?: any, cb?: (object: any, field: string, value: any) => void) => void
  }
  [DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_TREE]: {
    app: App
    inspectorId: string
    filter: string
    rootNodes: CustomInspectorNode[]
  }
  [DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_STATE]: {
    app: App
    inspectorId: string
    nodeId: string
    state: CustomInspectorState
  }
  [DevToolsV6PluginAPIHookKeys.EDIT_INSPECTOR_STATE]: {
    app: App
    inspectorId: string
    nodeId: string
    path: string[]
    type: string
    state: EditStatePayload
    set: (object: any, path?: string | (string[]), value?: any, cb?: (object: any, field: string, value: any) => void) => void
  }
  [DevToolsV6PluginAPIHookKeys.INSPECT_TIMELINE_EVENT]: {
    app: App
    layerId: string
    event: TimelineEvent
    all?: boolean
    data: any
  }
  [DevToolsV6PluginAPIHookKeys.TIMELINE_CLEARED]: Record<string, never>
  [DevToolsV6PluginAPIHookKeys.SET_PLUGIN_SETTINGS]: {
    app: App
    pluginId: string
    key: string
    newValue: any
    oldValue: any
    settings: any
  }

}

export interface DevToolsV6PluginAPIHooks {
  [DevToolsV6PluginAPIHookKeys.VISIT_COMPONENT_TREE]: (payload: DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.VISIT_COMPONENT_TREE]) => void
  [DevToolsV6PluginAPIHookKeys.INSPECT_COMPONENT]: (payload: DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.INSPECT_COMPONENT]) => void
  [DevToolsV6PluginAPIHookKeys.EDIT_COMPONENT_STATE]: (payload: DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.EDIT_COMPONENT_STATE]) => void
  [DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_TREE]: (payload: DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_TREE]) => void
  [DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_STATE]: (payload: DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_STATE]) => void
  [DevToolsV6PluginAPIHookKeys.EDIT_INSPECTOR_STATE]: (payload: DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.EDIT_INSPECTOR_STATE]) => void
  [DevToolsV6PluginAPIHookKeys.INSPECT_TIMELINE_EVENT]: (payload: DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.INSPECT_TIMELINE_EVENT]) => void
  [DevToolsV6PluginAPIHookKeys.TIMELINE_CLEARED]: (payload: DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.TIMELINE_CLEARED]) => void
  [DevToolsV6PluginAPIHookKeys.SET_PLUGIN_SETTINGS]: (payload: DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.SET_PLUGIN_SETTINGS]) => void
}

// devtools context hooks
export enum DevToolsContextHookKeys {
  ADD_INSPECTOR = 'addInspector',
  SEND_INSPECTOR_TREE = 'sendInspectorTree',
  SEND_INSPECTOR_STATE = 'sendInspectorState',
  CUSTOM_INSPECTOR_SELECT_NODE = 'customInspectorSelectNode',
  TIMELINE_LAYER_ADDED = 'timelineLayerAdded',
  TIMELINE_EVENT_ADDED = 'timelineEventAdded',
  GET_COMPONENT_INSTANCES = 'getComponentInstances',
  GET_COMPONENT_BOUNDS = 'getComponentBounds',
  GET_COMPONENT_NAME = 'getComponentName',
  COMPONENT_HIGHLIGHT = 'componentHighlight',
  COMPONENT_UNHIGHLIGHT = 'componentUnhighlight',
}

export interface DevToolsContextHookPayloads {
  [DevToolsContextHookKeys.ADD_INSPECTOR]: {
    inspector: CustomInspectorOptions
    plugin: DevToolsPlugin
  }
  [DevToolsContextHookKeys.SEND_INSPECTOR_TREE]: {
    inspectorId: string
    plugin: DevToolsPlugin
  }
  [DevToolsContextHookKeys.SEND_INSPECTOR_STATE]: {
    inspectorId: string
    plugin: DevToolsPlugin
  }
  [DevToolsContextHookKeys.CUSTOM_INSPECTOR_SELECT_NODE]: {
    inspectorId: string
    nodeId: string
    plugin: DevToolsPlugin
  }
  [DevToolsContextHookKeys.TIMELINE_LAYER_ADDED]: {
    options: TimelineLayerOptions
    plugin: DevToolsPlugin
  }
  [DevToolsContextHookKeys.TIMELINE_EVENT_ADDED]: {
    options: TimelineEventOptions
    plugin: DevToolsPlugin
  }
  [DevToolsContextHookKeys.GET_COMPONENT_INSTANCES]: {
    app: App
  }
  [DevToolsContextHookKeys.GET_COMPONENT_BOUNDS]: {
    instance: ComponentInstance
  }
  [DevToolsContextHookKeys.GET_COMPONENT_NAME]: {
    instance: ComponentInstance
  }
  [DevToolsContextHookKeys.COMPONENT_HIGHLIGHT]: {
    uid: string
  }
  [DevToolsContextHookKeys.COMPONENT_UNHIGHLIGHT]: Record<string, never>
}

// devtools client hooks
export enum DevToolsMessagingHookKeys {
  SEND_INSPECTOR_TREE_TO_CLIENT = 'sendInspectorTreeToClient',
  SEND_INSPECTOR_STATE_TO_CLIENT = 'sendInspectorStateToClient',
}

export interface DevToolsMessagingHookPayloads {
  [DevToolsMessagingHookKeys.SEND_INSPECTOR_TREE_TO_CLIENT]: {
    inspectorId: string
    rootNodes: CustomInspectorNode[]
  }
  [DevToolsMessagingHookKeys.SEND_INSPECTOR_STATE_TO_CLIENT]: {
    inspectorId: string
    nodeId: string
    state: CustomInspectorState
  }
}

export interface DevToolsMessagingHooks {
  [DevToolsMessagingHookKeys.SEND_INSPECTOR_TREE_TO_CLIENT]: (payload: DevToolsMessagingHookPayloads[DevToolsMessagingHookKeys.SEND_INSPECTOR_TREE_TO_CLIENT]) => void
  [DevToolsMessagingHookKeys.SEND_INSPECTOR_STATE_TO_CLIENT]: (payload: DevToolsMessagingHookPayloads[DevToolsMessagingHookKeys.SEND_INSPECTOR_STATE_TO_CLIENT]) => void
}

export interface DevToolsContextHooks extends DevToolsV6PluginAPIHooks {
  [DevToolsContextHookKeys.ADD_INSPECTOR]: (payload: DevToolsContextHookPayloads[DevToolsContextHookKeys.ADD_INSPECTOR]) => void
  [DevToolsContextHookKeys.SEND_INSPECTOR_TREE]: (payload: DevToolsContextHookPayloads[DevToolsContextHookKeys.SEND_INSPECTOR_TREE]) => void
  [DevToolsContextHookKeys.SEND_INSPECTOR_STATE]: (payload: DevToolsContextHookPayloads[DevToolsContextHookKeys.SEND_INSPECTOR_STATE]) => void
  [DevToolsContextHookKeys.CUSTOM_INSPECTOR_SELECT_NODE]: (payload: DevToolsContextHookPayloads[DevToolsContextHookKeys.CUSTOM_INSPECTOR_SELECT_NODE]) => void
  [DevToolsContextHookKeys.TIMELINE_LAYER_ADDED]: (payload: DevToolsContextHookPayloads[DevToolsContextHookKeys.TIMELINE_LAYER_ADDED]) => void
  [DevToolsContextHookKeys.TIMELINE_EVENT_ADDED]: (payload: DevToolsContextHookPayloads[DevToolsContextHookKeys.TIMELINE_EVENT_ADDED]) => void
  [DevToolsContextHookKeys.GET_COMPONENT_INSTANCES]: (payload: DevToolsContextHookPayloads[DevToolsContextHookKeys.GET_COMPONENT_INSTANCES]) => void
  [DevToolsContextHookKeys.GET_COMPONENT_BOUNDS]: (payload: DevToolsContextHookPayloads[DevToolsContextHookKeys.GET_COMPONENT_BOUNDS]) => void
  [DevToolsContextHookKeys.GET_COMPONENT_NAME]: (payload: DevToolsContextHookPayloads[DevToolsContextHookKeys.GET_COMPONENT_NAME]) => void
  [DevToolsContextHookKeys.COMPONENT_HIGHLIGHT]: (payload: DevToolsContextHookPayloads[DevToolsContextHookKeys.COMPONENT_HIGHLIGHT]) => void
  [DevToolsContextHookKeys.COMPONENT_UNHIGHLIGHT]: () => void
}

export function createDevToolsCtxHooks() {
  const hooks = createHooks<DevToolsContextHooks & DevToolsMessagingHooks>()
  hooks.hook(DevToolsContextHookKeys.ADD_INSPECTOR, ({ inspector, plugin }) => {
    addInspector(inspector, plugin.descriptor)
  })

  // send inspector tree
  hooks.hook(DevToolsContextHookKeys.SEND_INSPECTOR_TREE, async ({ inspectorId, plugin }) => {
    if (!inspectorId || !plugin?.descriptor?.app)
      return

    // 1. get inspector
    const inspector = getInspector(inspectorId, plugin.descriptor.app)

    // 2. get inspector tree
    const _payload = {
      app: plugin.descriptor.app,
      inspectorId,
      filter: inspector?.treeFilter || '',
      rootNodes: [],
    }
    await new Promise<void>((resolve) => {
      // @ts-expect-error hookable
      hooks.callHookWith(async (callbacks) => {
        await Promise.all(callbacks.map(cb => cb(_payload)))
        resolve()
      }, DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_TREE)
    })

    // @ts-expect-error hookable
    hooks.callHookWith(async (callbacks) => {
      await Promise.all(callbacks.map(cb => cb({
        inspectorId,
        rootNodes: _payload.rootNodes,
      })))
    }, DevToolsMessagingHookKeys.SEND_INSPECTOR_TREE_TO_CLIENT)
  })

  // send inspector state
  hooks.hook(DevToolsContextHookKeys.SEND_INSPECTOR_STATE, async ({ inspectorId, plugin }) => {
    if (!inspectorId || !plugin?.descriptor?.app)
      return

    // 1. get inspector
    const inspector = getInspector(inspectorId, plugin.descriptor.app)

    // 2. get inspector state
    const _payload = {
      app: plugin.descriptor.app,
      inspectorId,
      nodeId: inspector?.selectedNodeId || '',
      state: null,
    }
    await new Promise<void>((resolve) => {
      // @ts-expect-error hookable
      hooks.callHookWith(async (callbacks) => {
        await Promise.all(callbacks.map(cb => cb(_payload)))
        resolve()
      }, DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_STATE)
    })

    // @ts-expect-error hookable
    hooks.callHookWith(async (callbacks) => {
      await Promise.all(callbacks.map(cb => cb({
        inspectorId,
        nodeId: _payload.nodeId,
        state: _payload.state,
      })))
    }, DevToolsMessagingHookKeys.SEND_INSPECTOR_STATE_TO_CLIENT)
  })

  // select inspector node
  hooks.hook(DevToolsContextHookKeys.CUSTOM_INSPECTOR_SELECT_NODE, ({ inspectorId, nodeId, plugin }) => {
    // 1. get inspector
    const inspector = getInspector(inspectorId, plugin.descriptor.app)

    if (!inspector)
      return

    // 2. select node
    inspector.selectedNodeId = nodeId

    // 3. select node in devtools client and fetch state
  })

  // add timeline layer
  hooks.hook(DevToolsContextHookKeys.TIMELINE_LAYER_ADDED, ({ options, plugin }) => {
    // 1. update layers
    addTimelineLayer(options, plugin.descriptor)

    // 2. notify devtools client
    // console.log('x----', options)
  })

  // add timeline event
  hooks.hook(DevToolsContextHookKeys.TIMELINE_EVENT_ADDED, ({ options, plugin }) => {
    // 2. notify devtools client directly to improve performance
    // console.log('x----', options)
  })

  // get component instances
  hooks.hook(DevToolsContextHookKeys.GET_COMPONENT_INSTANCES, async ({ app }) => {
    // 1. get component instances (via getComponentInstances function)
    const instances: ComponentInstance[] = []

    // 2. notify devtools client
    // console.log('x----', instances)
  })

  // get component bounds
  hooks.hook(DevToolsContextHookKeys.GET_COMPONENT_BOUNDS, async ({ instance }) => {
    // 1. get component bounds (via getInstanceOrVnodeRect function)
    const bounds = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    }

    // 2. notify devtools client
    // console.log('x----', bounds)
  })

  // get component name
  hooks.hook(DevToolsContextHookKeys.GET_COMPONENT_NAME, ({ instance }) => {
    // 1. get component name (via getComponentName function)
    // console.log('x----', name)
  })

  // component highlight
  hooks.hook(DevToolsContextHookKeys.COMPONENT_HIGHLIGHT, ({ uid }) => {
    // 1. highlight component in devtools client
    // appRecord.instanceMap.get(uid)
    // console.log('x----', uid)
  })

  // component unhighlight
  hooks.hook(DevToolsContextHookKeys.COMPONENT_UNHIGHLIGHT, () => {
    // 1. unhighlight component in devtools client
  })

  return hooks
}
