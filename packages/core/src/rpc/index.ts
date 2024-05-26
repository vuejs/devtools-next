import { devtools, getRpc, stringify } from '@vue/devtools-kit'
import { createHooks } from 'hookable'
import type { CustomInspectorNode, DevToolsV6PluginAPIHookKeys, DevToolsV6PluginAPIHookPayloads } from '@vue/devtools-kit'

const hooks = createHooks()
const apiHooks = createHooks()

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
  api: {
    on: (event: string, handler: Function) => {
      apiHooks.hook(event, handler)
    },
    off: (event: string, handler: Function) => {
      apiHooks.removeHook(event, handler)
    },
    once: (event: string, handler: Function) => {
      apiHooks.hookOnce(event, handler)
    },
    emit: (event: string, ...args: any[]) => {
      apiHooks.callHook(event, ...args)
    },
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
    const res = await devtools.ctx.api.getInspectorState(payload)
    return stringify(res) as string
  },
  onInspectorTreeUpdated(handler: (data: CustomInspectorNode[]) => void) {
    // devtools.ctx.hooks.hook(DevToolsMessagingHookKeys.SEND_INSPECTOR_TREE_TO_CLIENT, (nodes) => {
    //   handler(nodes)
    // })
  },
}

export type RPCFunctions = typeof functions

export const rpc = new Proxy<{
  value: ReturnType<typeof getRpc<RPCFunctions>>['broadcast']
}>({
  value: {} as ReturnType<typeof getRpc<RPCFunctions>>['broadcast'],
}, {
  get(target, property) {
    if (property === 'value') {
      const _rpc = getRpc<RPCFunctions>()
      return _rpc.broadcast
    }
  },
})
