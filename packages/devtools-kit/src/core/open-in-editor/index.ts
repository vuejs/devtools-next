import { target } from '@vue/devtools-shared'
import { devtoolsState } from '../../ctx/state'

export interface OpenInEditorOptions {
  baseUrl?: string
  file?: string
  line?: number
  column?: number
}

export function setOpenInEditorBaseUrl(url: string) {
  target.__VUE_DEVTOOLS_OPEN_IN_EDITOR_BASE_URL__ = url
}

export function openInEditor(options: OpenInEditorOptions = {}) {
  const { file, baseUrl = window.location.origin, line = 0, column = 0 } = options
  if (file) {
    if (devtoolsState.vitePluginDetected) {
      const _baseUrl = target.__VUE_DEVTOOLS_OPEN_IN_EDITOR_BASE_URL__ ?? baseUrl
      target.__VUE_INSPECTOR__.openInEditor(_baseUrl, file, line, column)
    }
    else {
      // @TODO: support other
    }
  }
}
