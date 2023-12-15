import { apiHooks } from './on'

export function clear() {
  apiHooks.removeAllHooks()
}
