import { isBrowser, target } from '@vue-devtools-next/shared'
import type { Ref } from 'vue'
import { shallowRef } from 'vue'

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

interface VueDevToolsClient {

}

const fns = [] as ((client: VueDevToolsClient) => void)[]

let clientRef: Ref<VueDevToolsClient | undefined> | undefined
export function onDevToolsClientConnected(fn: (client: VueDevToolsClient) => void) {
  fns.push(fn)

  if (target.__VUE_DEVTOOLS_CLIENT_CONNECTED__)
    fns.forEach(fn => fn(target.__VUE_DEVTOOLS_CLIENT_CONNECTED__))

  // @TODO: use vue devtools client instance or context instead.
  Object.defineProperty(target, '__VUE_DEVTOOLS_CLIENT_CONNECTED__', {
    set(value) {
      if (value)
        fns.forEach(fn => fn(value))
    },
    get() {
    },
    configurable: true,
  })

  return () => {
    fns.splice(fns.indexOf(fn), 1)
  }
}

export function useDevToolsClient() {
  if (!clientRef) {
    clientRef = shallowRef<VueDevToolsClient | undefined>()

    onDevToolsClientConnected(setup)
  }

  function setup(client: VueDevToolsClient) {
    clientRef!.value = client
  }

  return clientRef
}
