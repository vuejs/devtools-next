import { isBrowser, target } from '@vue/devtools-next-shared'
import { devtools } from '../../devtools-kit/src/index'

export async function connect(host: string, port: number) {
  devtools.init()
  target.__VUE_DEVTOOLS_HOST__ = host
  target.__VUE_DEVTOOLS_PORT__ = port
  if (isBrowser)
    import('./user-app.js')

  else
  // @ts-expect-error skip
    import('./user-app.mjs')
}
