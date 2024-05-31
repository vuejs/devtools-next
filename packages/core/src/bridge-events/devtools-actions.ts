import { stringify } from '@vue/devtools-kit'
import { defineDevToolsAction } from '../bridge'

// done
export const getInspectorTree = defineDevToolsAction('devtools:inspector-tree', async (devtools, payload) => {
  const res = await devtools.api.getInspectorTree(payload)
  return stringify(res) as string
})

// done
export const getInspectorNodeActions = defineDevToolsAction('devtools:inspector-node-actions', (devtools, payload) => {
  return devtools.api.getInspectorNodeActions(payload)
})

// done
export const callInspectorNodeAction = defineDevToolsAction('devtools:call-inspector-node-action', (devtools, inspectorId: string, actionIndex: number, nodeId: string) => {
  return devtools.api.callInspectorNodeAction(inspectorId, actionIndex, nodeId)
})

// done
export const getInspectorActions = defineDevToolsAction('devtools:inspector-actions', (devtools, payload) => {
  return devtools.api.getInspectorActions(payload)
})

// done
export const callInspectorAction = defineDevToolsAction('devtools:call-inspector-action', (devtools, inspectorId: string, actionIndex: number, nodeId: string) => {
  return devtools.api.callInspectorAction(inspectorId, actionIndex, nodeId)
})

// done
export const inspectComponentInspector = defineDevToolsAction('devtools:inspect-component-inspector', (devtools) => {
  return devtools.api.inspectComponentInspector()
})

// done
export const cancelInspectComponentInspector = defineDevToolsAction('devtools:cancel-inspect-component-inspector', (devtools) => {
  return devtools.api.cancelInspectComponentInspector()
})

// done
export const scrollToComponent = defineDevToolsAction('devtools:scroll-to-component', (devtools, payload) => {
  return devtools.api.scrollToComponent(payload)
})

// done
export const getComponentRenderCode = defineDevToolsAction('devtools:get-component-render-code', (devtools, payload) => {
  return devtools.api.getComponentRenderCode(payload)
})

// done
export const getInspectorState = defineDevToolsAction('devtools:inspector-state', async (devtools, payload) => {
  const res = await devtools.api.getInspectorState(payload)
  return stringify(res) as string
})

// done
export const getRouterInfo = defineDevToolsAction('devtools:router-info', (devtools) => {
  return JSON.stringify(devtools.context.routerInfo)
})

// done
export const navigateAction = defineDevToolsAction('devtools:router-navigate', (devtools, payload) => {
  devtools.context.router?.push(payload).catch(e => e)
})

// done
export const getMatchedRoutes = defineDevToolsAction('devtools:matched-routes', (devtools, path) => {
  const c = console.warn
  console.warn = () => {}
  const matched = devtools.context.router?.resolve({
    path: path || '/',
  }).matched ?? []
  console.warn = c
  return JSON.stringify(matched)
})

// done
export const getDevToolsState = defineDevToolsAction('devtools:get-state', (devtools) => {
  return {
    connected: devtools.state.connected,
    clientConnected: devtools.state.clientConnected,
    vueVersion: devtools.state?.activeAppRecord?.version || '',
    tabs: devtools.state.tabs,
    commands: devtools.state.commands,
    vitePluginDetected: devtools.state.vitePluginDetected,
    appRecords: devtools.state.appRecords.map(item => ({
      id: item.id,
      name: item.name,
      version: item.version,
      routerId: item.routerId,
      moduleDetectives: item.moduleDetectives,
    })),
    activeAppRecordId: devtools.state.activeAppRecordId,
  }
})
