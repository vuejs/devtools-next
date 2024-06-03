import { ref } from 'vue'
import { DevToolsMessagingEvents, onDevToolsConnected, onRpcConnected, rpc, useDevToolsState } from '@vue/devtools-core'

export interface CustomInspectorType {
  id: string
  label: string
  logo: string
  packageName: string | undefined
  homepage: string | undefined
}

export function useCustomInspector() {
  const resiteredInspector = ref<CustomInspectorType[]>([])
  const inspectors = ref<CustomInspectorType[]>([])
  onRpcConnected(() => {
    rpc.value.getCustomeInspector().then((inspector) => {
      inspectors.value = inspector
      inspectors.value.forEach((inspector) => {
        register(inspector)
      })
    })
    rpc.functions.on(DevToolsMessagingEvents.INSPECTOR_UPDATED, (inspector: CustomInspectorType[]) => {
      inspectors.value = inspector
      if (inspector.length < resiteredInspector.value.length) {
        resiteredInspector.value = []
      }
      inspectors.value.forEach((inspector) => {
        register(inspector)
      })
    })
  })

  function register(inspector: CustomInspectorType) {
    if (resiteredInspector.value.some(i => i.id === inspector.id)) {
      return
    }

    resiteredInspector.value.push(inspector)
  }

  return {
    resiteredInspector,
    register,
  }
}
