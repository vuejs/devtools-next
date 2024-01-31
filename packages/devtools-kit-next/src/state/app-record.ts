import { target } from '@vue/devtools-shared'
import slug from 'speakingurl'
import { AppRecord, VueAppInstance } from '../types'
import { devtoolsState } from './global'

interface DevToolsAppRecords {
  value: AppRecord[]
  active: AppRecord
  activeId: string
}

export const devtoolsAppRecords = new Proxy<DevToolsAppRecords>(devtoolsState.appRecords as unknown as DevToolsAppRecords, {
  get(_, property) {
    if (property === 'value')
      return devtoolsState.appRecords
    else if (property === 'active')
      return devtoolsState.activeAppRecord
    else if (property === 'activeId')
      return devtoolsState.activeAppRecordId
  },
  set(target, property, value) {
    if (property === 'value')
      devtoolsState.appRecords = value

    else if (property === 'active')
      devtoolsState.activeAppRecord = value

    else if (property === 'activeId')
      devtoolsState.activeAppRecordId = value

    return true
  },
})

const appRecordInfo = target.__VUE_DEVTOOLS_APP_RECROD_INFO__ ??= {
  id: 0,
  appIds: new Set<string>(),
}

function getAppRecordName(app: VueAppInstance['appContext']['app'], fallbackName: string) {
  return app?._component?.name || `App ${fallbackName}`
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

export function createAppRecord(app: VueAppInstance['appContext']['app']): AppRecord {
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

export async function setActiveAppRecord(appRecord: AppRecord) {
  // @TODO
  devtoolsAppRecords.active = appRecord
  devtoolsAppRecords.activeId = `${appRecord.id}`
}

export async function toggleActiveAppRecord(id: string) {
  // @TODO
  const appRecord = devtoolsAppRecords.value.find(record => record.id === id)
  if (appRecord)
    setActiveAppRecord(appRecord)
}
