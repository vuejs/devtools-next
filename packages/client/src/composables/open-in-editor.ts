import { useDevToolsBridgeRpc } from '@vue-devtools-next/core'

const bridgeRpc = useDevToolsBridgeRpc()

export function openInEditor(file: string) {
  return bridgeRpc.openInEditor({
    file,
  })
}
