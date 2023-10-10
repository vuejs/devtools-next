import { devtoolsState } from './global-state'
import { getComponentInstance } from './component-tree'

export function getComponentState(params: { instanceId: string }) {
  console.log('params', getComponentInstance(devtoolsState.activeAppRecord!, params.instanceId))
}
