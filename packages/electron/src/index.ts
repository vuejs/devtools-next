import { target } from '@vue/devtools-shared'
import { devtools } from '../../devtools-kit/src/index'

export async function connect(host = 'http://localhost', port = 8098) {
  devtools.init()
  target.__VUE_DEVTOOLS_HOST__ = host
  target.__VUE_DEVTOOLS_PORT__ = port
  import('./user-app.js')
}
