import type { VueAppInstance } from '@vue-devtools-next/schema'
import { registerComponentsDevTools } from '../plugins'
import { DevToolsPluginApi, registerPlugin } from '../../api'
import { devtoolsContext, devtoolsState } from './state'

export async function toggleAppRecord(id: string) {
  devtoolsContext.api.clear()
  devtoolsContext.clear()
  const appRecord = devtoolsState.appRecords.find(record => record.id === id)
  if (appRecord) {
    devtoolsState.pluginBuffer = devtoolsState.pluginBuffer.filter(([plugin]) => plugin.id !== 'components')
    const api = new DevToolsPluginApi()
    appRecord.api = api
    await registerComponentsDevTools(appRecord!.app as unknown as VueAppInstance)
    devtoolsState.activeAppRecord = appRecord
    devtoolsState.activeAppRecordId = `${appRecord.id}`
    registerPlugin({
      app: appRecord.app as unknown as VueAppInstance,
      api: appRecord.api,
    })

    // @TODO: find a better way to handle it
    window.postMessage({
      event: 'toggle-app-record',
      target: 'vue-devtools',
    })
  }
}
