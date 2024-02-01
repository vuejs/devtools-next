import { useDevToolsBridgeRpc } from '@vue/devtools-core'

export function openInEditor(file: string) {
  const bridgeRpc = useDevToolsBridgeRpc()
  return bridgeRpc.openInEditor({
    file,
  })
}
