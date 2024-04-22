import { instanceHooks } from './hook'

export function remove() {
  instanceHooks.forEach(unregister => unregister())
}
