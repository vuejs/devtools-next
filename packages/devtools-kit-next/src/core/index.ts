import { target } from '@vue/devtools-shared'
import { createDevToolsHook, hook, subscribeDevToolsHook } from '../hook'

import { createAppRecord, devtoolsAppRecords } from '../state'

export function initDevTools() {
  target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = createDevToolsHook()
  subscribeDevToolsHook()

  // create app record
  hook.on.vueAppInit(async (app, version) => {
    const record = createAppRecord(app)
    devtoolsAppRecords.value = [
      ...devtoolsAppRecords.value,
      {
        ...record,
        app,
        version,
      },
    ]
    console.log(devtoolsAppRecords.value.length)
  })
}
