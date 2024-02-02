import { devtoolsContext } from '../../../state'
import { getComponentInstance, getInstanceName, getUniqueComponentId } from '../utils'
import { processInstanceState } from './process'

export function getInstanceState(params: { instanceId: string }) {
  const instance = getComponentInstance(devtoolsContext.appRecord!, params.instanceId)
  const id = getUniqueComponentId(instance!)
  const name = getInstanceName(instance!)
  const file = instance?.type?.__file

  const state = processInstanceState(instance!)
  return {
    id,
    name,
    file,
    state,
    instance,
  }
}
