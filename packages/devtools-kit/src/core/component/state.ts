// import { stringify } from '../../shared'
import { devtoolsContext } from '../general/state'
import { processInstanceState } from './general/data'
import { getInstanceName, getUniqueComponentId } from './general/util'
import { getComponentInstance } from './tree'

export function getInstanceState(params: { instanceId: string }) {
  const instance = getComponentInstance(devtoolsContext.appRecord, params.instanceId)

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
