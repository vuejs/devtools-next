import { toggleHighPerfMode as _toggleHighPerfMode, stringify } from '@vue/devtools-kit'
import { defineDevToolsAction } from '../bridge'

export const checkVueInspectorDetected = defineDevToolsAction<boolean>('devtools:check-vue-inspector-detected', async (devtools) => {
  return !!await devtools?.api?.getVueInspector?.()
})

export const enableVueInspector = defineDevToolsAction('devtools:enable-vue-inspector', async (devtools) => {
  const inspector = await devtools?.api?.getVueInspector?.()
  if (inspector)
    await inspector.enable()
})

export const toggleApp = defineDevToolsAction('devtools:toggle-app', async (devtools, id: string) => {
  await devtools.api.toggleApp(id)
})

// done
export const editInspectorState = defineDevToolsAction('devtools:edit-inspector-state', (devtools, payload: any) => {
  devtools.api.editInspectorState(payload)
})

export const openInEditor = defineDevToolsAction('devtools:open-in-editor', (devtools, file: string, baseUrl?: string) => {
  devtools.api.openInEditor({ file, baseUrl })
})

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

export const getComponentBoundingRect = defineDevToolsAction('devtools:get-component-bounding-rect', (devtools, payload) => {
  return devtools.api.getComponentBoundingRect(payload)
})

// done
export const inspectComponentInspector = defineDevToolsAction('devtools:inspect-component-inspector', (devtools) => {
  return devtools.api.inspectComponentInspector()
})

// done
export const cancelInspectComponentInspector = defineDevToolsAction('devtools:cancel-inspect-component-inspector', (devtools) => {
  return devtools.api.cancelInspectComponentInspector()
})

export const toggleComponentInspector = defineDevToolsAction('devtools:toggle-component-inspector', (devtools, payload) => {
  return devtools.api.toggleComponentInspector(payload)
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

export const updateInspectorTreeId = defineDevToolsAction('devtools:update-inspector-tree-id', (devtools, payload) => {
  devtools.context.activeInspectorTreeId = payload
})

export const unhighlightElement = defineDevToolsAction('devtools:unhighlight-element', (devtools) => {
  return devtools.api.unhighlightElement()
})

export const getRouterInfo = defineDevToolsAction('devtools:router-info', (devtools) => {
  return JSON.stringify(devtools.context.routerInfo)
})

export const navigateAction = defineDevToolsAction('devtools:router-navigate', (devtools, payload) => {
  devtools.context.router?.push(payload).catch(e => e)
})

export const getMatchedRoutes = defineDevToolsAction('devtools:matched-routes', (devtools, path) => {
  const c = console.warn
  console.warn = () => {}
  const matched = devtools.context.router?.resolve({
    path: path || '/',
  }).matched ?? []
  console.warn = c
  return JSON.stringify(matched)
})

export const getTimelineLayer = defineDevToolsAction('devtools:get-timeline-layer', (devtools) => {
  return devtools.context.timelineLayer
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

export const toggleHighPerfMode = defineDevToolsAction('devtools:toggle-high-perf-mode', (_, payload) => {
  _toggleHighPerfMode(payload)
})
