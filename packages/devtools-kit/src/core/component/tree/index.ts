import type { AppRecord } from '@vue-devtools-next/schema'
import { devtoolsContext } from '../../general/state'
import { getComponentInstance } from '../general'
import { ComponentWalker } from './walker'

export async function getComponentTree(options: { appRecord?: AppRecord; instanceId?: string; filterText?: string; maxDepth?: number; recursively?: boolean }) {
  const { appRecord = devtoolsContext.appRecord, maxDepth = 100, instanceId = undefined, filterText = '', recursively = false } = options
  const instance = getComponentInstance(appRecord!, instanceId)
  if (instance) {
    const walker = new ComponentWalker({
      filterText,
      maxDepth,
      recursively,
    })
    return await walker.getComponentTree(instance)
  }
}
