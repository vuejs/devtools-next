import slug from 'speakingurl'
import { AppRecord, VueAppInstance } from '../../types'
import { DevToolsPluginApi } from '../../api'
import { registerPlugin } from '../../api/plugin'
import { registerComponentDevToolsPlugin } from '../../plugins'
import { appRecordInfo, devtoolsAppRecords, devtoolsContext, devtoolsState } from '../../state'

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
  await registerComponentDevToolsPlugin(appRecord?.app as unknown as VueAppInstance)
  devtoolsAppRecords.active = appRecord
  devtoolsAppRecords.activeId = `${appRecord.id}`
  registerPlugin(appRecord.app!, appRecord.api!)
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

    // @TODO: find a better way to handle it
    window.postMessage({
      event: 'toggle-app-record',
      target: 'vue-devtools',
    })
  }
}
