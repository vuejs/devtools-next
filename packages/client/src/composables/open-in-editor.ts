import { useDevToolsBridgeRpc } from '@vue/devtools-core'

export const vueInspectorDetected = ref(false)
export function openInEditor(file: string) {
  const bridgeRpc = useDevToolsBridgeRpc()
  return bridgeRpc.openInEditor({
    file,
  })
}
