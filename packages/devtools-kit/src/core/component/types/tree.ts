import type { VueAppInstance } from '@vue-devtools-next/schema'

export interface InspectorNodeTag {
  label: string
  textColor: number
  backgroundColor: number
  tooltip?: string
}

export interface ComponentTreeNode {
  uid: number | string
  id: string
  name: string
  renderKey: string | number
  inactive: boolean
  isFragment: boolean
  children: ComponentTreeNode[]
  domOrder?: number[]
  tags: InspectorNodeTag[]
  autoOpen: boolean
  file: string
}

export interface InspectorTreeApiPayload {
  app?: VueAppInstance
  inspectorId?: string
  filter?: string
  instanceId?: string
  rootNodes?: ComponentTreeNode[]
}
