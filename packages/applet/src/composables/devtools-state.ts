import { getDevToolsState, onDevToolsStateUpdated } from '@vue/devtools-core'
import type { InjectionKey, Ref } from 'vue'
import { inject, provide, ref } from 'vue'

import type { AppRecord } from '@vue/devtools-kit'

export type DevtoolsBridgeAppRecord = Pick<AppRecord, 'name' | 'id' | 'version' | 'routerId' | 'moduleDetectives'>

const VueDevToolsStateSymbol: InjectionKey<{
  appRecords: Ref<Array<DevtoolsBridgeAppRecord>>
  activeAppRecordId: Ref<string>
}> = Symbol('VueDevToolsStateSymbol')

export function createDevToolsStateContext() {
  const appRecords = ref<Array<DevtoolsBridgeAppRecord>>([])
  const activeAppRecordId = ref('')

  getDevToolsState().then((data) => {
    appRecords.value = data!.appRecords
    activeAppRecordId.value = data!.activeAppRecordId!
  })

  onDevToolsStateUpdated((data) => {
    appRecords.value = data.appRecords
    activeAppRecordId.value = data.activeAppRecordId!
  })

  provide(VueDevToolsStateSymbol, {
    appRecords,
    activeAppRecordId,
  })

  return {
    appRecords,
    activeAppRecordId,
  }
}

export function useDevToolsState() {
  return inject(VueDevToolsStateSymbol, {
    appRecords: ref([]),
    activeAppRecordId: ref(''),
  })
}
