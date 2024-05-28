import type { HookKeys, Hookable } from 'hookable'
import type { CustomInspectorState } from '../types'
import { StateEditor } from '../core/component/state/editor'
import { cancelInspectComponentHighLighter, inspectComponentHighLighter } from '../core/component-highlighter'
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

    inspectComponentInspector() {
      return inspectComponentHighLighter()
    },

    cancelInspectComponentInspector() {
      return cancelInspectComponentHighLighter()
    },
  }
}

export type DevToolsApiType = ReturnType<typeof createDevToolsApi>
