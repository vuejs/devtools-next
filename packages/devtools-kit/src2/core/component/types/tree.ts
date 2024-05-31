import type { ComponentTreeNode, InspectorNodeTag, VueAppInstance } from '../../../types'

export interface InspectorTreeApiPayload {
  app?: VueAppInstance
  inspectorId?: string
  filter?: string
  instanceId?: string
  rootNodes?: ComponentTreeNode[]
}

export interface InspectorTree {
  id: string
  label: string
  tags?: InspectorNodeTag[]
  children?: InspectorTree[]
}
