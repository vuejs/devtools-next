import { target } from '@vue-devtools-next/shared'

export interface OpenInEditorOptions {
  file?: string
  line?: number
  column?: number
}

export function openInEditor(options: OpenInEditorOptions = {}) {
  const { file, line = 0, column = 0 } = options
  if (file) {
    const baseUrl = window.location.origin
    if (target.__VUE_DEVTOOLS_VITE_PLUGIN_DETECTED__) {
      target.__VUE_INSPECTOR__.openInEditor(baseUrl, file, line, column)
    }
    else {
      // @TODO: support other
    }
  }
}
