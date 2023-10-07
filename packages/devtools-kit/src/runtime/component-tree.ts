import type { AppRecord } from '@vue-devtools-next/schema'
import { ComponentWalker } from './vue'
import { devtoolsState } from './global-state'

function getComponentInstance(appRecord: AppRecord, instanceId: string | undefined) {
  if (!instanceId)
    instanceId = `${appRecord.id}:root`

  const instance = appRecord.instanceMap.get(instanceId)

  return instance
}

export async function getComponentTree(options: { appRecord?: AppRecord; instanceId?: string ;filterText?: string;recursively?: boolean }) {
  const { appRecord = devtoolsState.appRecords?.[0], instanceId, filterText = '', recursively = false } = options
  const instance = getComponentInstance(appRecord, instanceId)
  if (instance) {
    // @TODO
    const walker = new ComponentWalker({
      filterText,
      maxDepth: 500,
      recursively,
    })
    return await walker.getComponentTree(instance)
  }
}
