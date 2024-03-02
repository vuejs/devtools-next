import { getViteClient } from 'vite-hot-client'
import { nanoid } from 'nanoid'
import { getViteClientHotContext, setViteClientHotContext } from './shared'

async function getViteHotContext() {
  if (import.meta.url?.includes('chrome-extension://'))
    return

  const viteCLient = await getViteClient(`${location.pathname.split('/__devtools__')[0] || ''}/`.replace(/\/\//g, '/'), false)
  return viteCLient?.createHotContext('/____')
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
        viteClient.off(uniqueEventKey, cb)
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
      viteClient.off(name, listener)
    }
  }
}
