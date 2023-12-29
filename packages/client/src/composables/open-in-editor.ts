import { useDevToolsBridgeRpc } from '@vue/devtools-core'

const bridgeRpc = useDevToolsBridgeRpc()

export function openInEditor(file: string) {
  return bridgeRpc.openInEditor({
    file,
  })
}
