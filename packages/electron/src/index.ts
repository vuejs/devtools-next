import { isBrowser, target } from '@vue-devtools-next/shared'

export async function connect(host: string, port: number) {
  target.__VUE_DEVTOOLS_HOST__ = host
  target.__VUE_DEVTOOLS_PORT__ = port
  if (isBrowser)
    import('./user-app.js')

  else
  // @ts-expect-error skip
    import('./user-app.mjs')
}
