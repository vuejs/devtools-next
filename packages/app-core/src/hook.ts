import { target } from '@vue-devtools-next/shared'
import type { AppRecord, VueAppInstance } from '@vue-devtools-next/schema'
import { DevToolsHooks } from '@vue-devtools-next/schema'
import type { App } from 'vue'
import slug from 'speakingurl'
import { ComponentWalker } from './vue'
import { createDevToolsContext } from './context'

 type HookAppInstance = App & VueAppInstance

export const HOOK = target.__VUE_DEVTOOLS_GLOBAL_HOOK__

export function createDevToolsHook() {
  // override directly
  target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = {
    appRecords: [],
    apps: {},
    events: new Map<DevToolsHooks, Function[]>(),
    on(event, fn) {
      if (!this.events.has(event))
        this.events.set(event, [])

      this.events.get(event)?.push(fn)
      // cleanup function
      return () => this.off(event, fn)
    },
    once(event, fn) {
      const onceFn = (...args) => {
        this.off(event, onceFn)
        fn(...args)
      }

      this.on(event, onceFn)
      return [event, onceFn] as const
    },
    off(event, fn) {
      if (this.events.has(event)) {
        const eventCallbacks = this.events.get(event)!
        const index = eventCallbacks.indexOf(fn)
        if (index !== -1)
          eventCallbacks.splice(index, 1)
      }
    },
    emit(event, ...payload) {
      if (this.events.has(event))
        this.events.get(event)!.forEach(fn => fn(...payload))
    },
  }
  return target.__VUE_DEVTOOLS_GLOBAL_HOOK__
}

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

async function getComponentTree(options: { appRecord: AppRecord; instanceId?: string ;filterText: string;recursively: boolean }) {
  const { appRecord, instanceId } = options
  const instance = getComponentInstance(appRecord, instanceId)
  if (instance) {
    const walker = new ComponentWalker({
      filterText: options.filterText,
      maxDepth: 2,
      recursively: options.recursively,
    })
    console.log('tree-node', await walker.getComponentTree(instance))
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

function collectHookBuffer() {
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
      // id: app._uid, // @TODO: check it
      app,
      version,
    })

    hookBuffer.push([DevToolsHooks.APP_INIT, { app, version }])

    getComponentTree({
      appRecord: record,
      filterText: '',
      recursively: false,
    })
  })

  // component added hook
  const componentAddedCleanup = hook.on(DevToolsHooks.COMPONENT_ADDED, (app: HookAppInstance) => {
    if (app?._instance?.type?.devtools?.hide)
      return

    hookBuffer.push([DevToolsHooks.COMPONENT_ADDED, {
      app,
    }])
  })

  // component updated hook
  const componentUpdatedCleanup = hook.on(DevToolsHooks.COMPONENT_UPDATED, (...args) => {
    hookBuffer.push([DevToolsHooks.COMPONENT_UPDATED, {
      ...args,
    }])
  })

  // component removed hook
  const componentRemovedCleanup = hook.on(DevToolsHooks.COMPONENT_REMOVED, (app: HookAppInstance) => {
    if (app?._instance?.type?.devtools?.hide)
      return

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

export function initDevTools() {
  createDevToolsHook()
  target.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER__ ??= []
  target.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER_COLLECT_EVENT__ ??= []
  target.__VUE_DEVTOOLS_CTX__ = createDevToolsContext()
  collectHookBuffer()
}

export function checkVueAppInitialized() {
  const hook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__
  return new Promise<AppRecord>((resolve, reject) => {
    if (hook.appRecords.length) {
      resolve(hook.appRecords[0])
    }
    else {
      const timer = setInterval(() => {
        const hook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__

        if (hook.appRecords.length) {
          clearInterval(timer)
          resolve(hook.appRecords[0])
        }
      }, 200)

      // @TODO: reject logic
    }
  })
}
