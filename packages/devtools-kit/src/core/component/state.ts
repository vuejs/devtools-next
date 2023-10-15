import { stringify } from '../../shared'
import { devtoolsState } from '../general/state'
import { processInstanceState } from './general/data'
import { getInstanceName, getUniqueComponentId } from './general/util'
import { getComponentInstance } from './tree'

export function getInstanceState(params: { instanceId: string }) {
  const instance = getComponentInstance(devtoolsState.activeAppRecord!, params.instanceId)

  const id = getUniqueComponentId(instance!)
  const name = getInstanceName(instance!)
  const file = instance?.type?.__file

  const state = processInstanceState(instance!)
  const stringifyedState = stringify<{
    id: string
    name: string
    file: string | undefined
    state: typeof state
  }>({
    id,
    name,
    file,
    state,
  }) as string
  return stringifyedState
}
