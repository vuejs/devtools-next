import slug from 'speakingurl'
import { DevToolsPluginApi } from '../../api'
import { registerPlugin } from '../../api/plugin'
import { registerComponentDevToolsPlugin } from '../../plugins'
import { appRecordInfo, devtoolsAppRecords, devtoolsContext, devtoolsState } from '../../state'

function getAppRecordName(app: any['appContext']['app'], fallbackName: string) {
  return app?._component?.name || `App ${fallbackName}`
}

function getAppRootInstance(app: any['appContext']['app']) {
  if (app._instance)
    return app._instance

  else if (app._container?._vnode?.component)
    return app._container?._vnode?.component
}

function getAppRecordId(app: any['appContext']['app'], defaultId?: string): string {
  if (app.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__ != null)
    return app.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__

  let id = defaultId ?? (appRecordInfo.id++).toString()

  if (defaultId && appRecordInfo.appIds.has(id)) {
    let count = 1
    while (appRecordInfo.appIds.has(`${defaultId}_${count}`))
      count++
    id = `${defaultId}_${count}`
  }

  appRecordInfo.appIds.add(id)

  app.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__ = id
  return id
}

export function createAppRecord(app: any['appContext']['app']): any {
  const rootInstance = getAppRootInstance(app)
  if (rootInstance) {
    appRecordInfo.id++
    const name = getAppRecordName(app, appRecordInfo.id.toString())
    const id = getAppRecordId(app, slug(name))

    const record: any = {
      id,
      name,
      instanceMap: new Map(),
      rootInstance,
    }

    app.__VUE_DEVTOOLS_NEXT_APP_RECORD__ = record
    const rootId = `${record.id}:root`
    record.instanceMap.set(rootId, record.rootInstance)
    record.rootInstance.__VUE_DEVTOOLS_NEXT_UID__ = rootId

    return record
  }
  else {
    return {} as any
  }
}

export async function setActiveAppRecord(appRecord: any) {
  await registerComponentDevToolsPlugin(appRecord?.app as unknown as any)
  devtoolsAppRecords.active = appRecord
  devtoolsAppRecords.activeId = `${appRecord.id}`
  registerPlugin(appRecord.app!)
}

export async function toggleActiveAppRecord(id: string) {
  devtoolsContext.componentPluginHookBuffer.forEach(cleanup => cleanup())
  devtoolsContext.api.clear()
  devtoolsContext.clear()
  const appRecord = devtoolsAppRecords.value.find(record => record.id === id)
  if (appRecord) {
    devtoolsState.pluginBuffer = devtoolsState.pluginBuffer.filter(([plugin]) => plugin.id !== 'components')
    const api = new DevToolsPluginApi()
    appRecord.api = api
    setActiveAppRecord(appRecord)
  }
}
