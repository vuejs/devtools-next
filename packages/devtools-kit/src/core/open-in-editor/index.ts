import { target } from '@vue/devtools-shared'
import { devtoolsState } from '../../state'

export interface OpenInEditorOptions {
  baseUrl?: string
  file?: string
  line?: number
  column?: number
}

export function openInEditor(options: OpenInEditorOptions = {}) {
  const { file, baseUrl = window.location.origin, line = 0, column = 0 } = options
  if (file) {
    if (devtoolsState.vitePluginDetected) {
      target.__VUE_INSPECTOR__.openInEditor(baseUrl, file, line, column)
    }
    else {
      // @TODO: support other
    }
  }
}
