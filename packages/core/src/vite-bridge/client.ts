import { getViteClient } from 'vite-hot-client'
import { nanoid } from 'nanoid/non-secure'
import { getViteClientHotContext, setViteClientHotContext } from './shared'

async function getViteHotContext() {
  if (import.meta.url?.includes('chrome-extension://'))
    return

  const viteClient = await getViteClient(`${location.pathname.split('/__devtools__')[0] || ''}/`.replace(/\/\//g, '/'), false)
  return viteClient?.createHotContext('/____')
}

export async function initViteClientHotContext() {
  const context = await getViteHotContext()
  context && setViteClientHotContext(context)
}

export function callViteServerAction<T>(name: string) {
  return async (...args: any[]) => {
    const viteClient = getViteClientHotContext()
    const uniqueEventKey = nanoid()
    return new Promise<T>((resolve) => {
      const cb = (e: T) => {
        if (viteClient.off)
          viteClient.off(uniqueEventKey, cb)

        else
          // compatible with vite 4.x
          viteClient.dispose?.(cb)

        resolve(e)
      }
      viteClient.on(uniqueEventKey, cb)
      viteClient.send(name, {
        key: uniqueEventKey,
        payload: args,
      })
    })
  }
}

export function defineViteClientListener(name: string) {
  return (listener: (...args: any[]) => void) => {
    const viteClient = getViteClientHotContext()
    viteClient.on(name, listener)
    return () => {
      if (viteClient.off)
        viteClient.off(name, listener)

      else
        // compatible with vite 4.x
        viteClient.dispose?.(listener)
    }
  }
}
