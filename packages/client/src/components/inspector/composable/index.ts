import { Bridge, BridgeEvents } from '@vue-devtools-next/core'
import type { EditStatePayload } from 'vue-devtools-kit'
import { useContext } from '~/utils/use'

export function useFiledError() {
  const fieldErrors = {}
}

export function useContextMenu() {

}

export function useStateIdContext() {
  return useContext<string>('stateId')
}

export function useEditState(instanceId: string) {
  return {
    sendEdit(dotPath: string, payload: EditStatePayload, type?: string) {
      Bridge.value.emit(BridgeEvents.COMPONENT_EDIT_STATE, {
        dotPath,
        instanceId,
        payload,
        type,
      })
    },
  }
}
