import { on } from './on'
import { emit } from './emit'

export { callBuffer, DevToolsEvents } from './on'
export const api = {
  on,
  ...emit,
}
