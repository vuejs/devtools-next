import { DevToolsMessagingHookKeys, devtools, devtoolsRouter, devtoolsRouterInfo, getInspector, getInspectorActions, getInspectorNodeActions, getRpc, makeAsClientConnected, stringify } from '@vue/devtools-kit'
import { createHooks } from 'hookable'
import type { DevToolsV6PluginAPIHookKeys, DevToolsV6PluginAPIHookPayloads, OpenInEditorOptions } from '@vue/devtools-kit'

const hooks = createHooks()

export enum DevToolsMessagingEvents {
  INSPECTOR_TREE_UPDATED = 'inspector-tree-updated',
  INSPECTOR_STATE_UPDATED = 'inspector-state-updated',
  DEVTOOLS_STATE_UPDATED = 'devtools-state-updated',
  ROUTER_INFO_UPDATED = 'router-info-updated',
  TIMELINE_EVENT_UPDATED = 'timeline-event-updated',
}

function getDevToolsState() {
  const state = devtools.ctx.state
  return {
    connected: state.connected,
    clientConnected: true,
    vueVersion: state?.activeAppRecord?.version || '',
    tabs: state.tabs,
    commands: state.commands,
    vitePluginDetected: state.vitePluginDetected,
    appRecords: state.appRecords.map(item => ({
      id: item.id,
      name: item.name,
      version: item.version,
      routerId: item.routerId,
      moduleDetectives: item.moduleDetectives,
    })),
    activeAppRecordId: state.activeAppRecordId,
  }
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
  heartbeat: () => {
    makeAsClientConnected()
    return true
  },
  devtoolsState: () => {
    return getDevToolsState()
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
  getInspectorNodeActions(id: string) {
    return getInspectorNodeActions(id)
  },
  getInspectorActions(id: string) {
    return getInspectorActions(id)
  },
  callInspectorNodeAction(inspectorId: string, actionIndex: number, nodeId: string) {
    const nodeActions = getInspectorNodeActions(inspectorId)
    if (nodeActions?.length) {
      const item = nodeActions[actionIndex]
      item.action?.(nodeId)
    }
  },
  callInspectorAction(inspectorId: string, actionIndex: number) {
    const actions = getInspectorActions(inspectorId)
    if (actions?.length) {
      const item = actions[actionIndex]
      item.action?.()
    }
  },
  openInEditor(options: OpenInEditorOptions) {
    return devtools.ctx.api.openInEditor(options)
  },
  async checkVueInspectorDetected() {
    return !!await devtools.ctx.api.getVueInspector()
  },
  async enableVueInspector() {
    const inspector = await devtools?.api?.getVueInspector?.()
    if (inspector)
      await inspector.enable()
  },
  async toggleApp(id: string) {
    return devtools.ctx.api.toggleApp(id)
  },
  getRouterInfo() {
    return devtoolsRouterInfo
  },
  navigate(path: string) {
    return devtoolsRouter.value?.push(path).catch(() => ({}))
  },
  getMatchedRoutes(path: string) {
    const c = console.warn
    console.warn = () => {}
    const matched = devtoolsRouter.value?.resolve({
      path: path || '/',
    }).matched ?? []
    console.warn = c
    return matched
  },
  // listen to devtools server events
  initDevToolsServerListener() {
    devtools.ctx.hooks.hook(DevToolsMessagingHookKeys.SEND_INSPECTOR_TREE_TO_CLIENT, (payload) => {
      this.emit(DevToolsMessagingEvents.INSPECTOR_TREE_UPDATED, stringify(payload))
    })
    devtools.ctx.hooks.hook(DevToolsMessagingHookKeys.SEND_INSPECTOR_STATE_TO_CLIENT, (payload) => {
      this.emit(DevToolsMessagingEvents.INSPECTOR_STATE_UPDATED, stringify(payload))
    })
    devtools.ctx.hooks.hook(DevToolsMessagingHookKeys.DEVTOOLS_STATE_UPDATED, () => {
      this.emit(DevToolsMessagingEvents.DEVTOOLS_STATE_UPDATED, getDevToolsState())
    })
    devtools.ctx.hooks.hook(DevToolsMessagingHookKeys.ROUTER_INFO_UPDATED, ({ state }) => {
      this.emit(DevToolsMessagingEvents.ROUTER_INFO_UPDATED, state)
    })
    devtools.ctx.hooks.hook(DevToolsMessagingHookKeys.SEND_TIMELINE_EVENT_TO_CLIENT, (payload) => {
      this.emit(DevToolsMessagingEvents.TIMELINE_EVENT_UPDATED, payload)
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
