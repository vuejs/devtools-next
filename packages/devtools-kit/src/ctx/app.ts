import { target } from '@vue/devtools-shared'

import type { AppRecord } from '../types-next'

export interface DevToolsAppRecords extends AppRecord {}

target.__VUE_DEVTOOLS_KIT_APP_RECORDS__ ??= []
target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ ??= {}
target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ ??= ''

export const devtoolsAppRecords = new Proxy< DevToolsAppRecords[]>(target.__VUE_DEVTOOLS_KIT_APP_RECORDS__, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver)
  },
  set(target, prop, value, receiver) {
    return Reflect.set(target, prop, value, receiver)
  },
})

export const addDevToolsAppRecord = (app: AppRecord) => {
  target.__VUE_DEVTOOLS_KIT_APP_RECORDS__ = [
    ...devtoolsAppRecords,
    app,
  ]
}

export const removeDevToolsAppRecord = (id: string) => {
  target.__VUE_DEVTOOLS_KIT_APP_RECORDS__ = devtoolsAppRecords.filter(app => app.id !== id)
}

export const activeAppRecord = new Proxy<AppRecord>(target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__, {
  get(_target, prop, receiver) {
    return Reflect.get(_target, prop, receiver)
  },
})

export function setActiveAppRecord(app: AppRecord) {
  target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ = app
}

export function setActiveAppRecordId(id: string) {
  target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = id
}
