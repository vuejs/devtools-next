import type { DevToolsPluginApi } from '../api'
import type { Inspector } from '../core/inspector'
import type { Router, RouterInfo } from '../../src2/types/router'
import type { AppRecord } from './app'

export interface DevToolsContext {
  appRecord: AppRecord | null
  api: DevToolsPluginApi
  inspector: Inspector[]
  timelineLayer: any[]
  routerInfo: RouterInfo
  router: Router | null
  activeInspectorTreeId: string
  componentPluginHookBuffer: (() => void)[]
  clear: () => void
}
