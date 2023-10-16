import type { AppRecord } from './vue'

export interface DevToolsContext {
  appRecord: AppRecord | null
  api: unknown
}
