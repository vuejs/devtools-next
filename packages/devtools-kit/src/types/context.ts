import type { TimelineLayerItem } from '../core/timeline'
import type { DevToolsPluginApi } from '../api'
import type { Inspector } from '../core/inspector'
import type { AppRecord } from './app'
import type { Router, RouterInfo } from './router'

export interface DevToolsContext {
  appRecord: AppRecord | null
  api: DevToolsPluginApi
  inspector: Inspector[]
  timelineLayer: TimelineLayerItem[]
  routerInfo: RouterInfo
  router: Router | null
  activeInspectorTreeId: string
  componentPluginHookBuffer: (() => void)[]
  clear: () => void
}
