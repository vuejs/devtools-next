import { target } from '@vue/devtools-shared'
import { devtools } from '../../devtools-kit/src/index'

export async function connect(host: string, port: number) {
  devtools.init()
  target.__VUE_DEVTOOLS_HOST__ = host
  target.__VUE_DEVTOOLS_PORT__ = port
  import('./user-app.js')
}
