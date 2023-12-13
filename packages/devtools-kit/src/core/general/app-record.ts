import type { VueAppInstance } from '@vue-devtools-next/schema'
import { registerComponentsDevTools } from '../plugins'
import { registerPlugin } from '../../api'
import { devtoolsContext, devtoolsState } from './state'

export async function toggleAppRecord(id: string) {
  devtoolsContext.clear()
  const appRecord = devtoolsState.appRecords.find(record => record.id === id)
  if (appRecord) {
    await registerComponentsDevTools(appRecord!.app as unknown as VueAppInstance)
    devtoolsState.activeAppRecord = appRecord
    registerPlugin({
      app: appRecord.app as unknown as VueAppInstance,
      api: appRecord.api,
    })
  }
}
