import { VueDevToolsStateSymbol } from '~/plugins'

export function useDevToolsState() {
  return inject(VueDevToolsStateSymbol)!
}
