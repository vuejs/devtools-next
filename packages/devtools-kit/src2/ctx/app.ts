import { target } from '@vue/devtools-shared'

import type { AppRecord } from '../types'

export interface DevToolsAppRecords extends AppRecord {}

target.__VUE_DEVTOOLS_KIT_APP_RECORDS__ ??= []
target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ ??= {}
target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ ??= ''

export const devtoolsAppRecords = new Proxy<DevToolsAppRecords[] & { value: DevToolsAppRecords[] }>(target.__VUE_DEVTOOLS_KIT_APP_RECORDS__, {
  get(_target, prop, receiver) {
    if (prop === 'value')
      return target.__VUE_DEVTOOLS_KIT_APP_RECORDS__

    return target.__VUE_DEVTOOLS_KIT_APP_RECORDS__[prop]
  },
})

export const addDevToolsAppRecord = (app: AppRecord) => {
  target.__VUE_DEVTOOLS_KIT_APP_RECORDS__ = [
    ...target.__VUE_DEVTOOLS_KIT_APP_RECORDS__,
    app,
  ]
}

export const removeDevToolsAppRecord = (id: string) => {
  target.__VUE_DEVTOOLS_KIT_APP_RECORDS__ = devtoolsAppRecords.filter(app => app.id !== id)
}

export const activeAppRecord = new Proxy<AppRecord & { value: AppRecord }>(target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__, {
  get(_target, prop, receiver) {
    if (prop === 'value')
      return target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__

    return target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__[prop]
  },
})

export function setActiveAppRecord(app: AppRecord) {
  target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ = app
}

export function setActiveAppRecordId(id: string) {
  target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = id
}
