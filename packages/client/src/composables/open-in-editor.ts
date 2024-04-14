import { openInEditor as _openInEditor } from '@vue/devtools-core'

export const vueInspectorDetected = ref(false)

export const openInEditor = async (file: string) => {
  return _openInEditor(file)
}
