import { openInEditor as _openInEditor, callViteServerAction } from '@vue/devtools-core'

const getOpenInEditorHost = callViteServerAction<string>('get-open-in-editor-host')
export const vueInspectorDetected = ref(false)

export const openInEditor = async (file: string) => {
  const openInEditorHost = await getOpenInEditorHost()
  return openInEditorHost ? _openInEditor(file, openInEditorHost) : _openInEditor(file)
}
