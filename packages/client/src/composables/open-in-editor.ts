import { rpc } from '@vue/devtools-core'

export const vueInspectorDetected = ref(false)

export const openInEditor = async (file: string) => {
  return rpc.value.openInEditor({ file })
}
