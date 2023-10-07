import { target } from '@vue-devtools-next/shared'
import type { AppRecord, VueAppInstance } from '@vue-devtools-next/schema'
import { DevToolsHooks } from '@vue-devtools-next/schema'
import type { App } from 'vue'
import slug from 'speakingurl'
import { ComponentWalker, getAppRecord, getComponentId } from './vue'

type HookAppInstance = App & VueAppInstance

// @TODO: move to @devtools/kit

const appRecordInfo = {
  id: 0,
  appIds: new Set<string>(),
}

function getComponentInstance(appRecord: AppRecord, instanceId: string | undefined) {
  if (!instanceId)
    instanceId = `${appRecord.id}:root`

  const instance = appRecord.instanceMap.get(instanceId)

  return instance
}

export async function getComponentTree(options: { appRecord?: AppRecord; instanceId?: string ;filterText?: string;recursively?: boolean }) {
  const hook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__
  const { appRecord = hook.appRecords?.[0], instanceId, filterText = '', recursively = false } = options
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

function getAppRecordName(app: VueAppInstance['appContext']['app'], fallbackName: string) {
  if (app._component)
    return app._component.name!
  return `App ${fallbackName}`
}

function getAppRootInstance(app: VueAppInstance['appContext']['app']) {
  if (app._instance)
    return app._instance

  else if (app._container?._vnode?.component)
    return app._container?._vnode?.component
}

function getAppRecordId(app: VueAppInstance['appContext']['app'], defaultId?: string): string {
  if (app.__VUE_DEVTOOLS_APP_RECORD_ID__ != null)
    return app.__VUE_DEVTOOLS_APP_RECORD_ID__

  let id = defaultId ?? (appRecordInfo.id++).toString()

  if (defaultId && appRecordInfo.appIds.has(id)) {
    let count = 1
    while (appRecordInfo.appIds.has(`${defaultId}_${count}`))
      count++
    id = `${defaultId}_${count}`
  }

  appRecordInfo.appIds.add(id)

  app.__VUE_DEVTOOLS_APP_RECORD_ID__ = id
  return id
}

function createAppRecord(app: VueAppInstance['appContext']['app']): AppRecord {
  const rootInstance = getAppRootInstance(app)
  if (rootInstance) {
    appRecordInfo.id++
    const name = getAppRecordName(app, appRecordInfo.id.toString())
    const id = getAppRecordId(app, slug(name))

    const record: AppRecord = {
      id,
      name,
      instanceMap: new Map(),
      rootInstance,
    }

    app.__VUE_DEVTOOLS_APP_RECORD__ = record
    const rootId = `${record.id}:root`
    record.instanceMap.set(rootId, record.rootInstance)
    record.rootInstance.__VUE_DEVTOOLS_UID__ = rootId

    return record
  }
  else {
    return {} as AppRecord
  }
}

function subscribeDevToolsHook() {
  const hook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__
  const hookBuffer = target.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER__
  const collectEvents = target.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER_COLLECT_EVENT__
  // app init hook
  const appInitCleanup = hook.on(DevToolsHooks.APP_INIT, (app: VueAppInstance['appContext']['app'], version: string) => {
    if (app?._instance?.type?.devtools?.hide)
      return

    const record = createAppRecord(app)

    hook.appRecords.push({
      ...record,
      app,
      version,
    })

    hookBuffer.push([DevToolsHooks.APP_INIT, { app, version }])
  })

  // component added hook
  const componentAddedCleanup = hook.on(DevToolsHooks.COMPONENT_ADDED, async (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => {
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

    if (parentUid != null) {
      // @TODO: implement this case
    }

    hookBuffer.push([DevToolsHooks.COMPONENT_ADDED, {
      app,
    }])
  })

  // component updated hook
  const componentUpdatedCleanup = hook.on(DevToolsHooks.COMPONENT_UPDATED, (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => {
    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    hookBuffer.push([DevToolsHooks.COMPONENT_UPDATED, {
      app,
    }])
  })

  // component removed hook
  const componentRemovedCleanup = hook.on(DevToolsHooks.COMPONENT_REMOVED, async (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => {
    if (app?._instance?.type?.devtools?.hide)
      return

    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    const appRecord = await getAppRecord(app)

    if (parentUid != null) {
      // @TODO: implement this case
    }

    hookBuffer.push([DevToolsHooks.COMPONENT_REMOVED, {
      app,
    }])
  })

  // component emit hook
  const componentEmitCleanup = hook.on(DevToolsHooks.COMPONENT_EMIT, (...args) => {
    hookBuffer.push([DevToolsHooks.COMPONENT_EMIT, {
      ...args,
    }])
  })

  collectEvents.push(...[
    appInitCleanup,
    componentAddedCleanup,
    componentUpdatedCleanup,
    componentRemovedCleanup,
    componentEmitCleanup,
  ])
  // @TODO: handle dynamic router
}
