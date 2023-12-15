import type { AppRecord } from './vue'

export interface DevToolsContext {
  appRecord: AppRecord | null
  api: unknown
  inspector: {
    id: string
    nodeId: string
    filter: string
    treeFilterPlaceholder: string
  }[]
  timelineLayer: {
    id: string
    label: string
    color: number
  }[]
  routerInfo: unknown
  router: unknown
  activeInspectorTreeId: string
  componentPluginHookBuffer: Array<() => void>
}
