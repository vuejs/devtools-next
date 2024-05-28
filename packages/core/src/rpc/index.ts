import { DevToolsMessagingHookKeys, devtools, getInspector, getRpc, stringify } from '@vue/devtools-kit'
import { createHooks } from 'hookable'
import type { DevToolsV6PluginAPIHookKeys, DevToolsV6PluginAPIHookPayloads } from '@vue/devtools-kit'
import { cancelInspectComponentInspector, editInspectorState } from '../bridge-events/devtools-actions'

const hooks = createHooks()
const apiHooks = createHooks()

export enum DevToolsMessagingEvents {
  INSPECTOR_TREE_UPDATED = 'inspector-tree-updated',
  INSPECTOR_STATE_UPDATED = 'inspector-state-updated',
}

export const functions = {
  on: (event: string, handler: Function) => {
    hooks.hook(event, handler)
  },
  off: (event: string, handler: Function) => {
    hooks.removeHook(event, handler)
  },
  once: (event: string, handler: Function) => {
    hooks.hookOnce(event, handler)
  },
  emit: (event: string, ...args: any[]) => {
    hooks.callHook(event, ...args)
  },
  heartbeat: () => ({}),
  devtoolsState: () => {
    const state = devtools.ctx.state
    console.log({
      connected: state.connected,
      clientConnected: true,
      vueVersion: state?.activeAppRecord?.version || '',
      tabs: devtools.state.tabs,
      commands: devtools.state.commands,
      vitePluginDetected: true,
      appRecords: devtools.state.appRecords.map(item => ({
        id: item.id,
        name: item.name,
        version: item.version,
        routerId: item.routerId,
        moduleDetectives: item.moduleDetectives,
      })),
      activeAppRecordId: state.activeAppRecordId,
    })
    return {
      connected: state.connected,
      clientConnected: true,
      vueVersion: state?.activeAppRecord?.version || '',
      tabs: devtools.state.tabs,
      commands: devtools.state.commands,
      vitePluginDetected: true,
      appRecords: devtools.state.appRecords.map(item => ({
        id: item.id,
        name: item.name,
        version: item.version,
        routerId: item.routerId,
        moduleDetectives: item.moduleDetectives,
      })),
      activeAppRecordId: state.activeAppRecordId,
    }
  },
  async getInspectorTree(payload: Pick<DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_TREE], 'inspectorId' | 'filter'>) {
    const res = await devtools.ctx.api.getInspectorTree(payload)
    return stringify(res) as string
  },
  async getInspectorState(payload: Pick<DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.GET_INSPECTOR_STATE], 'inspectorId' | 'nodeId'>) {
    // @TODO: refactor this to use the new API
    const inspector = getInspector(payload.inspectorId)
    if (inspector)
      inspector.selectedNodeId = payload.nodeId

    const res = await devtools.ctx.api.getInspectorState(payload)
    return stringify(res) as string
  },
  async editInspectorState(payload: DevToolsV6PluginAPIHookPayloads[DevToolsV6PluginAPIHookKeys.EDIT_INSPECTOR_STATE]) {
    return await devtools.ctx.api.editInspectorState(payload)
  },
  inspectComponentInspector() {
    return devtools.ctx.api.inspectComponentInspector()
  },
  cancelInspectComponentInspector() {
    return devtools.ctx.api.cancelInspectComponentInspector()
  },
  getComponentRenderCode(id: string) {
    return devtools.ctx.api.getComponentRenderCode(id)
  },
  scrollToComponent(id: string) {
    return devtools.ctx.api.scrollToComponent(id)
  },
  initDevToolsServerListener() {
    devtools.ctx.hooks.hook(DevToolsMessagingHookKeys.SEND_INSPECTOR_TREE_TO_CLIENT, (payload) => {
      this.emit(DevToolsMessagingEvents.INSPECTOR_TREE_UPDATED, stringify(payload))
    })
    devtools.ctx.hooks.hook(DevToolsMessagingHookKeys.SEND_INSPECTOR_STATE_TO_CLIENT, (payload) => {
      this.emit(DevToolsMessagingEvents.INSPECTOR_STATE_UPDATED, stringify(payload))
    })
  },
}

export type RPCFunctions = typeof functions

export const rpc = new Proxy<{
  value: ReturnType<typeof getRpc<RPCFunctions>>['broadcast']
  functions: ReturnType<typeof getRpc<RPCFunctions>>['functions']
}>({
  value: {} as ReturnType<typeof getRpc<RPCFunctions>>['broadcast'],
  functions: {} as ReturnType<typeof getRpc<RPCFunctions>>['functions'],
}, {
  get(target, property) {
    const _rpc = getRpc<RPCFunctions>()
    if (property === 'value')
      return _rpc.broadcast
    else if (property === 'functions')
      return _rpc.functions
  },
})
