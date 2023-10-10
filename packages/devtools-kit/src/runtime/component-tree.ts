import type { AppRecord } from '@vue-devtools-next/schema'
import { DevToolsEvents, api, callBuffer } from '../api'
import { ComponentWalker, getAppRecord, getComponentId } from './vue'
import { devtoolsState } from './global-state'

export function getComponentInstance(appRecord: AppRecord, instanceId: string | undefined) {
  if (!instanceId)
    instanceId = `${appRecord.id}:root`

  const instance = appRecord.instanceMap.get(instanceId)

  return instance
}

export async function getComponentTree(options: { appRecord?: AppRecord; instanceId?: string ;filterText?: string; maxDepth?: number; recursively?: boolean }) {
  const { appRecord = devtoolsState.activeAppRecord, maxDepth = 100, instanceId = undefined, filterText = '', recursively = false } = options
  const instance = getComponentInstance(appRecord!, instanceId)
  if (instance) {
    // @TODO
    const walker = new ComponentWalker({
      filterText,
      maxDepth,
      recursively,
    })
    return await walker.getComponentTree(instance)
  }
}

export function initComponentTree() {
  api.on.componentAdded(async (app, uid, parentUid, component) => {
    if (app?._instance?.type?.devtools?.hide)
      return

    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    const id = await getComponentId({
      app, uid, instance: component,
    }) as string
    const appRecord = await getAppRecord(app)

    if (component) {
      if (component.__VUE_DEVTOOLS_UID__ == null)
        component.__VUE_DEVTOOLS_UID__ = id

      if (!appRecord?.instanceMap.has(id))
        appRecord?.instanceMap.set(id, component)
    }

    if (!appRecord)
      return

    const treeNode = await getComponentTree({
      appRecord,
      recursively: false,
    })

    callBuffer(DevToolsEvents.COMPONENT_TREE_UPDATED, treeNode!)
  })

  api.on.componentUpdated(async (app, uid, parentUid, component) => {
    if (app?._instance?.type?.devtools?.hide)
      return

    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    const id = await getComponentId({
      app, uid, instance: component,
    }) as string
    const appRecord = await getAppRecord(app)

    if (component) {
      if (component.__VUE_DEVTOOLS_UID__ == null)
        component.__VUE_DEVTOOLS_UID__ = id

      if (!appRecord?.instanceMap.has(id))
        appRecord?.instanceMap.set(id, component)
    }

    if (!appRecord)
      return

    const treeNode = await getComponentTree({
      appRecord,
      recursively: false,
    })

    callBuffer(DevToolsEvents.COMPONENT_TREE_UPDATED, treeNode!)
  })

  api.on.componentRemoved(async (app, uid, parentUid, component) => {
    if (app?._instance?.type?.devtools?.hide)
      return

    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    const appRecord = await getAppRecord(app)

    if (!appRecord)
      return

    const id = await getComponentId({
      app, uid, instance: component,
    }) as string
    appRecord?.instanceMap.delete(id)

    const treeNode = await getComponentTree({
      appRecord,
      recursively: false,
    })

    callBuffer(DevToolsEvents.COMPONENT_TREE_UPDATED, treeNode!)
  })
}
