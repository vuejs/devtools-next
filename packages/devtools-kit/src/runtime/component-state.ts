import { devtoolsState } from './global-state'
import { getComponentInstance } from './component-tree'
import { getInstanceName, getUniqueComponentId } from './vue/components/util'
import { processInstanceState, stringify } from './vue/components/data'

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
  console.log('stringifyedState', stringifyedState)
  return stringifyedState
}
