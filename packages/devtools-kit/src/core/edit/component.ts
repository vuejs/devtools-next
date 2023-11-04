import type { PluginApi } from '@vue-devtools-next/schema'
import type { StateEditor } from '../../shared/edit'
import { getComponentInstance, nodeIdToInstanceId } from '../component/general'
import { devtoolsContext } from '../general'
import type { EditStateComponentPayload } from './types'

export async function editComponentState(payload: EditStateComponentPayload, stateEditor: StateEditor, api: PluginApi) {
  const { dotPath, data } = payload
  const instanceId = nodeIdToInstanceId(devtoolsContext.appRecord.id, data.nodeId)
  // assert data types, currently no...
  // if (!['data', 'props', 'computed', 'setup'].includes(dataType))
  const instance = getComponentInstance(devtoolsContext.appRecord, instanceId)
  if (!instance)
    return

  const paths = dotPath.split('.')
  const targetPath = paths.slice()

  let target: Record<string, unknown> | undefined

  // TODO: props
  if (instance.devtoolsRawSetupState && Object.keys(instance.devtoolsRawSetupState).includes(paths[0])) {
    // Setup
    target = instance.devtoolsRawSetupState
  }

  if (target && targetPath)
    stateEditor.set(target, targetPath, data.value, stateEditor.createDefaultSetCallback(data))

  await api.sendInspectorState('components')
}
