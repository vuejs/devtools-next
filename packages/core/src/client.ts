import { isBrowser, target } from '@vue/devtools-shared'

export function setDevToolsClientUrl(url: string) {
  target.__VUE_DEVTOOLS_CLIENT_URL__ = url
}

export function getDevToolsClientUrl() {
  return target.__VUE_DEVTOOLS_CLIENT_URL__ ?? (() => {
    if (isBrowser) {
      const devtoolsMeta = document.querySelector('meta[name=__VUE_DEVTOOLS_CLIENT_URL__]')
      if (devtoolsMeta)
        return devtoolsMeta.getAttribute('content')
    }
    return ''
  })()
}
