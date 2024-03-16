import type { InspectorStateEditorPayload } from '@vue/devtools-kit'
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

export const editInspectorState = defineDevToolsAction('devtools:edit-inspector-state', (devtools, payload: InspectorStateEditorPayload) => {
  devtools.api.editInspectorState(payload)
})

export const openInEditor = defineDevToolsAction('devtools:open-in-editor', (devtools, file: string, baseUrl?: string) => {
  devtools.api.openInEditor({ file, baseUrl })
})

export const getInspectorTree = defineDevToolsAction('devtools:inspector-tree', async (devtools, payload) => {
  const res = await devtools.api.getInspectorTree(payload)
  return stringify(res) as string
})

export const getComponentBoundingRect = defineDevToolsAction('devtools:get-component-bounding-rect', (devtools, payload) => {
  return devtools.api.getComponentBoundingRect(payload)
})

export const inspectComponentInspector = defineDevToolsAction('devtools:inspect-component-inspector', (devtools) => {
  return devtools.api.inspectComponentInspector()
})

export const toggleComponentInspector = defineDevToolsAction('devtools:toggle-component-inspector', (devtools, payload) => {
  return devtools.api.toggleComponentInspector(payload)
})

export const scrollToComponent = defineDevToolsAction('devtools:scroll-to-component', (devtools, payload) => {
  return devtools.api.scrollToComponent(payload)
})

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
