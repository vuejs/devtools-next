import { rpc } from '@vue/devtools-core'
import { isInChromePanel } from '@vue/devtools-shared'

export const vueInspectorDetected = ref(false)

export const openInEditor = async (file: string) => {
  if (isInChromePanel) {
    const fileName = file.replace(/\\/g, '\\\\')
    // @TODO: support custom host
    const src = `fetch('/__open-in-editor?file=${encodeURI(file)}').then(response => {
      if (response.ok) {
        console.log('File ${fileName} opened in editor')
      } else {
        const msg = 'Opening component ${fileName} failed'
        console.log('%c' + msg, 'color:red')
      }
    })`
    // @ts-expect-error skip type check
    chrome.devtools.inspectedWindow.eval(src)

    return
  }
  return rpc.value.openInEditor({ file })
}
