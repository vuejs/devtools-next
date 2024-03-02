import { defineDevToolsAction } from '@vue/devtools-core'

export const vueInspectorDetected = ref(false)
export const openInEditor = defineDevToolsAction('devtools:open-in-editor', (devtools, file: string) => {
  devtools.api.openInEditor({ file })
})
