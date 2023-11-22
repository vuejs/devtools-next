import vueDevToolsOptions from 'virtual:vue-devtools-options'
import { setDevToolsClientUrl } from '@vue-devtools-next/core'
import { devtools } from 'vue-devtools-kit'

const overlayDir = '/@id/virtual:vue-devtools-path:overlay'
const body = document.getElementsByTagName('body')[0]
const head = document.getElementsByTagName('head')[0]

const devtoolsClientUrl = `${vueDevToolsOptions.base || '/'}__devtools__/`
setDevToolsClientUrl(devtoolsClientUrl)

devtools.init()

// create link stylesheet
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = `${overlayDir}/devtools-overlay.css`

// create script
const script = document.createElement('script')
script.src = `${overlayDir}/devtools-overlay.js`

// append to head
head.appendChild(link)

// append to body
body.appendChild(script)

// Used in the browser extension
window.__VUE_DEVTOOLS_VITE_PLUGIN_DETECTED__ = true
window.__VUE_DEVTOOLS_VITE_PLUGIN_CLIENT_URL__ = `${window.location.origin}${devtoolsClientUrl}`
