import type { HookKeys, Hookable } from 'hookable'
import type { CustomInspectorState } from '../types'
import { StateEditor } from '../core/component/state/editor'
import { cancelInspectComponentHighLighter, inspectComponentHighLighter, scrollToComponent } from '../core/component-highlighter'
import { getComponentInstance } from '../core/component/utils'
import { openInEditor } from '../core/open-in-editor'
import type { DevToolsContextHooks, DevToolsMessagingHooks, DevToolsV6PluginAPIHookPayloads } from './hook'
import { DevToolsV6PluginAPIHookKeys } from './hook'
import { activeAppRecord } from './app'

export function createDevToolsApi(hooks: Hookable<DevToolsContextHooks & DevToolsMessagingHooks, HookKeys<DevToolsContextHooks & DevToolsMessagingHooks>>) {
  return {
    // get inspector tree
    async getInspectorTree(payload: Pick<DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_TREE], 'inspectorId' | 'filter'>) {
      const _payload = {
        ...payload,
        app: activeAppRecord.value.app,
        rootNodes: [],
      }
      await new Promise<void>((resolve) => {
        // @ts-expect-error hookable
        hooks.callHookWith(async (callbacks) => {
          await Promise.all(callbacks.map(cb => cb(_payload)))
          resolve()
        }, DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_TREE)
      })
      return _payload.rootNodes
    },
    // get inspector state
    async getInspectorState(payload: Pick<DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_STATE], 'inspectorId' | 'nodeId'>) {
      const _payload = {
        ...payload,
        app: activeAppRecord.value.app,
        state: null as CustomInspectorState | null,
      }
      await new Promise<void>((resolve) => {
        // @ts-expect-error hookable
        hooks.callHookWith(async (callbacks) => {
          await Promise.all(callbacks.map(cb => cb(_payload)))
          resolve()
        }, DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_STATE)
      })
      return _payload.state!
    },
    // edit inspector state
    editInspectorState(payload: DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.EDIT_INSPECTOR_STATE]) {
      const stateEditor = new StateEditor()
      const _payload = {
        ...payload,
        app: activeAppRecord.value.app,
        set: (obj, path = payload.path, value = payload.state.value, cb) => {
          stateEditor.set(obj, path, value, cb || stateEditor.createDefaultSetCallback(payload.state))
        },
      }
      // @ts-expect-error hookable
      hooks.callHookWith((callbacks) => {
        callbacks.forEach(cb => cb(_payload))
      }, DevToolsV6PluginAPIHookKeys.EDIT_INSPECTOR_STATE)
    },
    // inspect component inspector
    inspectComponentInspector() {
      return inspectComponentHighLighter()
    },
    // cancel inspect component inspector
    cancelInspectComponentInspector() {
      return cancelInspectComponentHighLighter()
    },
    // get component render code
    getComponentRenderCode(id: string) {
      const instance = getComponentInstance(activeAppRecord.value, id)

      if (instance)
        return !(instance?.type instanceof Function) ? instance.render.toString() : instance.type.toString()
    },
    // scroll to component
    scrollToComponent(id: string) {
      return scrollToComponent({ id })
    },
    // open in editor
    openInEditor,
  }
}

export type DevToolsApiType = ReturnType<typeof createDevToolsApi>
