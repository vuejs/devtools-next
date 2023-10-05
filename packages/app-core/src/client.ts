import { isBrowser, target } from '@vue-devtools-next/shared'

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

// @TODO: move to @devtools/kit

export interface VueDevToolsClient {

}

const fns = [] as (() => void)[]

export function onDevToolsClientConnected(fn: () => void) {
  fns.push(fn)

  if (target.__VUE_DEVTOOLS_CLIENT_CONNECTED__)
    fns.forEach(fn => fn())

  Object.defineProperty(target, '__VUE_DEVTOOLS_CLIENT_CONNECTED__', {
    set(value) {
      if (value)
        fns.forEach(fn => fn())
    },
    get() {
    },
    configurable: true,
  })

  return () => {
    fns.splice(fns.indexOf(fn), 1)
  }
}
