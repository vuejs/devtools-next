import { target } from '@vue/devtools-shared'
import { AppRecord } from '../types'
import { normalizeRouterInfo } from '../core/router'
import { callConnectedUpdatedHook, callStateUpdatedHook, devtoolsState } from './state'
import { devtoolsRouterInfo } from './router'
import { devtoolsContext } from './context'

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
    const oldState = { ...devtoolsState }

    if (property === 'value') {
      devtoolsState.appRecords = value
    }

    else if (property === 'active') {
      const _value = value as AppRecord

      // sync to context
      devtoolsState.activeAppRecord = _value
      devtoolsContext.appRecord = _value
      devtoolsContext.api = _value.api!
      // @ts-expect-error expected type
      devtoolsContext.inspector = _value.inspector ?? []
      normalizeRouterInfo(value, devtoolsState)
      devtoolsContext.routerInfo = devtoolsRouterInfo
    }

    else if (property === 'activeId') {
      devtoolsState.activeAppRecordId = value
    }

    callStateUpdatedHook(devtoolsState, oldState)
    if (['connected', 'clientConnected'].includes(property.toString()) && oldState[property] !== value)
      callConnectedUpdatedHook(devtoolsState, oldState)

    return true
  },
})

export const appRecordInfo = target.__VUE_DEVTOOLS_NEXT_APP_RECROD_INFO__ ??= {
  id: 0,
  appIds: new Set<string>(),
}
