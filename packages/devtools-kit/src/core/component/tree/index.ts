import { activeAppRecord } from '../../../ctx'
import { getComponentInstance } from '../utils'
import { ComponentWalker } from './walker'
import type { AppRecord } from '../../../types'

export async function getComponentTree(options: { appRecord?: AppRecord, instanceId?: string, filterText?: string, maxDepth?: number, recursively?: boolean }) {
  const { appRecord = activeAppRecord.value, maxDepth = 100, instanceId = undefined, filterText = '', recursively = false } = options
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
